import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg mb-4">Your cart is empty.</p>
        <Link to="/" className="text-indigo-600 font-medium hover:underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="bg-white rounded-lg shadow divide-y">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
              <div>
                <h4 className="font-medium text-gray-800">{item.name}</h4>
                <p className="text-gray-500 text-sm">₹{item.price.toFixed(2)} each</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                className="w-16 p-2 border border-gray-300 rounded-md text-center"
              />
              <button
                onClick={() => removeFromCart(item.productId)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center">
        <span className="text-xl font-semibold">Subtotal: ₹{subtotal.toFixed(2)}</span>
        <button
          onClick={() => navigate('/checkout')}
          className="bg-indigo-600 text-white py-3 px-8 rounded-lg shadow hover:bg-indigo-700 font-semibold"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
