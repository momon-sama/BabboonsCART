const express = require('express');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

function generateOrderNumber() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `BC-${ts}-${rand}`;
}

// Create order = "secure checkout" (mock payment, never touches real money)
router.post('/', protect, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Re-price items from DB so the client can't tamper with prices
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const orderItems = items.map((i) => {
      const product = productMap.get(i.productId);
      if (!product) throw new Error(`Product ${i.productId} not found`);
      if (i.quantity < 1) throw new Error('Invalid quantity');
      return {
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: i.quantity,
        image: product.image
      };
    });

    const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = itemsTotal > 999 ? 0 : 49;
    const total = itemsTotal + shippingFee;

    // --- MOCK PAYMENT GATEWAY ---
    // No real card data is ever collected or stored; this simulates a
    // payment processor's response for demo purposes only.
    const paymentResult = {
      success: true,
      transactionId: `MOCK-${crypto.randomBytes(8).toString('hex')}`,
      paidAt: new Date()
    };

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'mock_card',
      paymentResult,
      itemsTotal,
      shippingFee,
      total,
      status: 'placed',
      statusHistory: [{ status: 'placed', note: 'Order placed and payment confirmed (mock)' }]
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: 'Checkout failed', error: err.message });
  }
});

// Current user's orders
router.get('/mine', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// Single order — for the order-tracking page (polled by the client)
router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to view this order' });
  }
  res.json(order);
});

// ---- Admin ----

router.get('/', protect, adminOnly, async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const orders = await Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 });
  res.json(orders);
});

router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, note } = req.body;
    const allowed = [...Order.STATUS_FLOW, 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = status;
    order.statusHistory.push({ status, note: note || '' });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update status', error: err.message });
  }
});

router.get('/stats/summary', protect, adminOnly, async (req, res) => {
  const [orderCount, revenueAgg, statusCounts] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }])
  ]);
  res.json({
    orderCount,
    revenue: revenueAgg[0]?.total || 0,
    statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
  });
});

module.exports = router;
