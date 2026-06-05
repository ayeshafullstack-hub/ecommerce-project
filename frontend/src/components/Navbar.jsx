import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { clearTokens, getAccessToken } from '../utils/auth.js';
import "./Navbar.css";

function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const isLoggedIn = !!getAccessToken();

  const handleLogout = () => {
    clearTokens();
    navigate('/login');
  };

  return (
    <nav className="navbar">

      <div className="nav-left">
        <Link to="/" className="logo">
          AJKart
        </Link>
      </div>

      <div className="auth-links">
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="auth-btn">Login</Link>
            <Link to="/signup" className="auth-btn">Signup</Link>
          </>
        ) : (
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      <div className="nav-center">
        <input
          type="text"
          placeholder="Search for products, brands and more"
          className="search-box"
        />
      </div>

      <div className="nav-right">

        <Link to="/" className="nav-link">
          Home
        </Link>

        <Link to="/cart" className="cart-link">
          🛒 Cart

          {cartCount > 0 && (
            <span className="cart-badge">
              {cartCount}
            </span>
          )}
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;