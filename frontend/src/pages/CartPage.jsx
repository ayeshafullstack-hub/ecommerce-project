import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { getAccessToken } from "../utils/auth";
import "./CartPage.css";


function CartPage() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    console.log("Cart Items:", cartItems);

    const discount = Math.round(cartTotal * 0.1);
    const finalAmount = cartTotal - discount;

    const navigate = useNavigate();

    const handlePlaceOrder = () => {
        const token = getAccessToken();

        if (!token) {
            navigate("/login", {
                state: {from:"/checkout"}
            });
            return;
        }

        navigate("/checkout");
    };

    return (
        <div className="cart-page">

            <h1 className="cart-title">
                My Cart ({cartItems.length})
            </h1>

            {cartItems.length === 0 ? (
                <p className="empty-cart">
                    Your cart is empty
                </p>
            ) : (
                <div className="cart-layout">

                    {/* Left Side - Products */}
                    <div className="cart-items">

                        {cartItems.map((item) => (
                            <div
                                className="cart-item"
                                key={item.id}
                            >

                                <div className="product-section">

                                    <img
                                        src={`${item.product_image}`}
                                        alt={item.product_name}
                                        className="cart-image"
                                    />

                                    <div className="item-info">

                                        <h2>
                                            {item.product_name}
                                        </h2>

                                        <p className="price">
                                            ₹{item.product_price}
                                        </p>

                                    </div>

                                </div>

                                <div className="item-actions">

                                    <button
                                        className="qty-btn"
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity - 1
                                            )
                                        }
                                    >
                                        -
                                    </button>

                                    <span className="qty">
                                        {item.quantity}
                                    </span>

                                    <button
                                        className="qty-btn"
                                        onClick={() =>
                                            updateQuantity(
                                                item.id,
                                                item.quantity + 1
                                            )
                                        }
                                    >
                                        +
                                    </button>

                                    <button
                                        className="remove-btn"
                                        onClick={() =>
                                            removeFromCart(item.id)
                                        }
                                    >
                                        REMOVE
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>

                    {/* Right Side - Price Details */}

                    <div className="cart-total">

                        <h2>PRICE DETAILS</h2>

                        <div className="summary-row">
                            <span>
                                Price ({cartItems.length} item)
                            </span>

                            <span>
                                ₹{cartTotal.toFixed(2)}
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>
                                Delivery Charges
                            </span>

                            <span className="free">
                                FREE
                            </span>
                        </div>

                        <div className="summary-row">
                            <span>
                                Discount
                            </span>

                            <span className="free">
                                - ₹{discount}
                            </span>
                        </div>

                        <div className="summary-row total-row">
                            <span>
                                Total Amount
                            </span>

                            <span>
                                ₹{finalAmount.toFixed(2)}
                            </span>
                        </div>
                        <Link to="/checkout">Proceed to Checkout</Link>

                        <button className="checkout-btn" onClick={handlePlaceOrder}>
                            PLACE ORDER
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default CartPage;