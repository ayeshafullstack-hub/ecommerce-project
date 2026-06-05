import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${BASEURL}/api/products/${id}/`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch product");
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, [id, BASEURL]);

    const handleBuyNow = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            navigate("/login", {
                state: { from: "/checkout" }
            });
            return;
        }

        try {
            await addToCart(product);

            navigate("/checkout",{state:{buyNow:true}});

        } catch (error) {
            console.error("Buy Now Error:", error);
        }
    };

    const handleAddToCart = async () => {
        try {
            await addToCart(product);
        } catch (error) {
            console.error("Add To Cart Error:", error);
        }
    };

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error: {error}</h2>;
    if (!product) return <h2>Product Not Found</h2>;

    const originalPrice = Math.round(product.price * 1.25);

    return (
        <div className="product-details-container">

            <div className="product-details-card">

                {/* LEFT SIDE */}

                <div className="image-section">

                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-details-image"
                    />

                    <div className="button-group">

                        <button
                            className="cart-btn"
                            onClick={() => addToCart(product)}
                        >
                            🛒 ADD TO CART
                        </button>

                        <button
                            className="buy-btn"
                            onClick={handleBuyNow}
                        >
                            ⚡ BUY NOW
                        </button>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="product-info">

                    <h1 className="product-title">
                        {product.name}
                    </h1>

                    <div className="rating">
                        ⭐ 4.3 ★
                    </div>

                    <div className="price-section">

                        <span className="current-price">
                            ₹{product.price}
                        </span>

                        <span className="old-price">
                            ₹{originalPrice}
                        </span>

                        <span className="discount">
                            20% OFF
                        </span>

                    </div>

                    <p className="delivery">
                        🚚 Free Delivery
                    </p>

                    <h3>Description</h3>

                    <p className="product-description">
                        {product.description}
                    </p>

                    <Link
                        to="/"
                        className="back-home-link"
                    >
                        ← Back to Home
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ProductDetails;