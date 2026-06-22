import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-3xl font-bold text-gray-800 tracking-tight">
        BabboonsCART
      </Link>
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium">
          Shop
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin" className="text-gray-600 hover:text-indigo-600 font-medium">
            Admin
          </Link>
        )}
        {user && (
          <Link to="/orders" className="text-gray-600 hover:text-indigo-600 font-medium">
            My Orders
          </Link>
        )}
      </nav>
      <div className="flex items-center space-x-4">
        <Link
          to="/cart"
          className="relative p-2 rounded-full bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
        >
          🛒
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            {itemCount}
          </span>
        </Link>
        {user ? (
          <button onClick={logout} className="text-sm font-medium text-gray-600 hover:text-red-600">
            Logout ({user.name})
          </button>
        ) : (
          <Link to="/login" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
