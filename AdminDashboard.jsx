import { useState } from 'react';
import AdminStats from './AdminStats';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';

const TABS = [
  { key: 'stats', label: 'Overview' },
  { key: 'orders', label: 'Orders' },
  { key: 'products', label: 'Products' }
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('stats');

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="flex space-x-2 mb-6 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 font-medium border-b-2 -mb-px ${
              tab === t.key ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'stats' && <AdminStats />}
      {tab === 'orders' && <AdminOrders />}
      {tab === 'products' && <AdminProducts />}
    </div>
  );
}
