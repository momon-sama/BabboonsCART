import { useEffect, useState } from 'react';
import api from '../api/client';

const EMPTY_FORM = { name: '', price: '', category: '', image: '', description: '', stock: 100 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  function load() {
    api.get('/products').then((res) => setProducts(res.data));
  }

  useEffect(load, []);

  function startEdit(p) {
    setEditingId(p._id);
    setForm({ name: p.name, price: p.price, category: p.category, image: p.image, description: p.description, stock: p.stock });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editingId) {
      await api.put(`/products/${editingId}`, payload);
    } else {
      await api.post('/products', payload);
    }
    resetForm();
    load();
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    load();
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-3 md:col-span-1">
        <h2 className="font-semibold">{editingId ? 'Edit Product' : 'Add Product'}</h2>
        <input required placeholder="Name" className="w-full border rounded-md p-2"
          value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="number" step="0.01" placeholder="Price" className="w-full border rounded-md p-2"
          value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Category" className="w-full border rounded-md p-2"
          value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Image URL" className="w-full border rounded-md p-2"
          value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <textarea placeholder="Description" className="w-full border rounded-md p-2"
          value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input type="number" placeholder="Stock" className="w-full border rounded-md p-2"
          value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <div className="flex space-x-2">
          <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700">
            {editingId ? 'Save Changes' : 'Add Product'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="px-4 border rounded-lg">Cancel</button>
          )}
        </div>
      </form>

      <div className="md:col-span-2 bg-white rounded-lg shadow divide-y">
        {products.map((p) => (
          <div key={p._id} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <img src={p.image} alt={p.name} className="w-12 h-12 rounded object-cover" />
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-gray-500">₹{p.price.toFixed(2)} · stock: {p.stock}</p>
              </div>
            </div>
            <div className="space-x-3 text-sm">
              <button onClick={() => startEdit(p)} className="text-indigo-600 font-medium">Edit</button>
              <button onClick={() => handleDelete(p._id)} className="text-red-600 font-medium">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
