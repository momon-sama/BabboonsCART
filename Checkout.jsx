import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';

const SHIPPING_THRESHOLD = 999;

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');

  const shippingFee = subtotal > SHIPPING_THRESHOLD ? 0 : 49;
  const total = subtotal + shippingFee;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');
    setPlacing(true);
    try {
      const res = await api.post('/orders', {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: {
          fullName: form.fullName,
          line1: form.line1,
          city: form.city,
          state: form.state,
          postalCode: form.postalCode,
          country: form.country,
          phone: form.phone
        },
        paymentMethod: 'mock_card'
      });
      clearCart();
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return <div className="container mx-auto px-4 py-16 text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Checkout</h1>
      <p className="text-sm text-gray-500 mb-6">
        Demo checkout — no real payment is processed and no card data is stored.
      </p>

      <form onSubmit={handlePlaceOrder} className="bg-white rounded-lg shadow p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Shipping Address</h2>
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Full name" className="border rounded-md p-2 col-span-2"
            value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
          <input required placeholder="Address line" className="border rounded-md p-2 col-span-2"
            value={form.line1} onChange={(e) => update('line1', e.target.value)} />
          <input required placeholder="City" className="border rounded-md p-2"
            value={form.city} onChange={(e) => update('city', e.target.value)} />
          <input required placeholder="State" className="border rounded-md p-2"
            value={form.state} onChange={(e) => update('state', e.target.value)} />
          <input required placeholder="Postal code" className="border rounded-md p-2"
            value={form.postalCode} onChange={(e) => update('postalCode', e.target.value)} />
          <input required placeholder="Phone" className="border rounded-md p-2"
            value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        </div>

        <h2 className="text-lg font-semibold text-gray-800 pt-4">Payment (mock)</h2>
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Card number (any digits)" className="border rounded-md p-2 col-span-2"
            value={form.cardNumber} onChange={(e) => update('cardNumber', e.target.value)} />
          <input required placeholder="MM/YY" className="border rounded-md p-2"
            value={form.expiry} onChange={(e) => update('expiry', e.target.value)} />
          <input required placeholder="CVC" className="border rounded-md p-2"
            value={form.cvc} onChange={(e) => update('cvc', e.target.value)} />
        </div>

        <div className="border-t pt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span>{shippingFee === 0 ? 'Free' : `₹${shippingFee.toFixed(2)}`}</span></div>
          <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={placing}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50"
        >
          {placing ? 'Placing order...' : `Place Order — ₹${total.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
}
