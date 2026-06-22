import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/mine').then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      {orders.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="bg-white rounded-lg shadow divide-y">
          {orders.map((o) => (
            <Link
              key={o._id}
              to={`/orders/${o._id}`}
              className="flex justify-between items-center p-4 hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-800">#{o.orderNumber}</p>
                <p className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{o.total.toFixed(2)}</p>
                <p className="text-xs uppercase text-indigo-600">{o.status.replace('_', ' ')}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
