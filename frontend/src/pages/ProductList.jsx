import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "./ProductList.css";

function ProductList() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    useEffect(() => {

        fetch(`${BASEURL}/api/products/`)
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to fetch products");
                }

                return response.json();
            })

            .then((data) => {
                setProducts(data);
                setLoading(false);
            })

            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });

    }, [BASEURL]);

    if (loading) {
        return (
            <div className="loading">
                Loading Products...
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="product-page">

            <div className="products-section">

                <div className="section-header">
                    <h2>Featured Products</h2>
                </div>

                <div className="product-grid">

                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))
                    ) : (
                        <p className="no-products">
                            No products available.
                        </p>
                    )}

                </div>

            </div>

        </div>
    );
}

export default ProductList;