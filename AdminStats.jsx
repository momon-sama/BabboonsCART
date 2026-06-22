import { useEffect, useState } from 'react';
import api from '../api/client';

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/orders/stats/summary').then((res) => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading stats...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      <StatCard label="Total Orders" value={stats.orderCount} />
      <StatCard label="Total Revenue" value={`₹${stats.revenue.toFixed(2)}`} />
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500 text-sm mb-2">Orders by Status</p>
        <ul className="space-y-1 text-sm">
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <li key={status} className="flex justify-between">
              <span className="capitalize">{status.replace('_', ' ')}</span>
              <span className="font-semibold">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-500 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}
