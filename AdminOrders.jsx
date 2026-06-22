import { useEffect, useState } from 'react';
import api from '../api/client';

const STATUSES = ['placed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .get('/orders', { params: filter ? { status: filter } : {} })
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function updateStatus(orderId, status) {
    await api.put(`/orders/${orderId}/status`, { status });
    load();
  }

  return (
    <div>
      <div className="mb-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-md p-2">
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="p-3 font-medium">{o.orderNumber}</td>
                  <td className="p-3">{o.user?.name} <br /><span className="text-gray-400">{o.user?.email}</span></td>
                  <td className="p-3">₹{o.total.toFixed(2)}</td>
                  <td className="p-3 capitalize">{o.status.replace('_', ' ')}</td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className="border rounded-md p-1"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
