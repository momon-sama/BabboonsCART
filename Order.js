const mongoose = require('mongoose');

const STATUS_FLOW = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: String,
  price: Number,
  quantity: { type: Number, required: true, min: 1 },
  image: String
});

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: [...STATUS_FLOW, 'cancelled'], required: true },
    note: { type: String, default: '' },
    at: { type: Date, default: Date.now }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      line1: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      phone: String
    },
    paymentMethod: { type: String, default: 'mock_card' },
    paymentResult: {
      success: { type: Boolean, default: true },
      transactionId: String,
      paidAt: Date
    },
    itemsTotal: Number,
    shippingFee: { type: Number, default: 0 },
    total: Number,
    status: {
      type: String,
      enum: [...STATUS_FLOW, 'cancelled'],
      default: 'placed'
    },
    statusHistory: [statusHistorySchema]
  },
  { timestamps: true }
);

orderSchema.statics.STATUS_FLOW = STATUS_FLOW;

module.exports = mongoose.model('Order', orderSchema);
