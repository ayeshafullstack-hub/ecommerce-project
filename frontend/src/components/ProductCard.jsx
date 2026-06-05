import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
    return (
        <Link to={`/product/${product.id}`} className="product-link">
            <div className="product-card">

                <img
                    src={`${product.image}`}
                    alt={product.name}
                    className="product-image"
                />

                <h2 className="product-name">
                    {product.name}
                </h2>

                <p className="product-description">
                    {product.description}
                </p>

                <p className="product-price">
                    ₹ {product.price}
                </p>

                <div className="price-row">
                    <span className="old-price">
                        ₹ {Math.round(product.price * 1.25)}
                    </span>

                    <span className="product-discount">
                        20% Off
                    </span>
                </div>

            </div>
        </Link>
    );
}

export default ProductCard;