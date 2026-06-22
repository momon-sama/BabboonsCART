import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

const STEPS = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
const LABELS = {
  placed: 'Order Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled'
};

const POLL_INTERVAL_MS = 5000;

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order');
      }
    }

    fetchOrder();
    intervalRef.current = setInterval(fetchOrder, POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [id]);

  // Stop polling once the order reaches a final state
  useEffect(() => {
    if (order && (order.status === 'delivered' || order.status === 'cancelled')) {
      clearInterval(intervalRef.current);
    }
  }, [order]);

  if (error) return <div className="container mx-auto px-4 py-16 text-center text-red-600">{error}</div>;
  if (!order) return <div className="container mx-auto px-4 py-16 text-center">Loading order...</div>;

  const currentStepIndex = STEPS.indexOf(order.status);

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Order #{order.orderNumber}</h1>
      <p className="text-gray-500 text-sm mb-6">
        Status refreshes automatically every {POLL_INTERVAL_MS / 1000}s.
      </p>

      {order.status === 'cancelled' ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 font-medium">This order was cancelled.</div>
      ) : (
        <div className="flex items-center mb-8">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex-1 flex flex-col items-center relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold z-10 ${
                  idx <= currentStepIndex ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              >
                {idx + 1}
              </div>
              <span className="text-xs mt-2 text-center text-gray-600">{LABELS[step]}</span>
              {idx < STEPS.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${
                    idx < currentStepIndex ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="font-semibold mb-3">Items</h2>
        {order.items.map((item) => (
          <div key={item.product} className="flex justify-between text-sm py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-3 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{order.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="font-semibold mb-3">Status History</h2>
        <ul className="space-y-2 text-sm">
          {order.statusHistory.slice().reverse().map((h, i) => (
            <li key={i} className="flex justify-between text-gray-600">
              <span>{LABELS[h.status] || h.status} {h.note ? `— ${h.note}` : ''}</span>
              <span>{new Date(h.at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
