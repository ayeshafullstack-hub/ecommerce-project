import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { authFetch } from "../utils/auth";
import "./CheckoutPage.css";

function CheckoutPage() {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const navigate = useNavigate();

    const { clearCart } = useCart();

    const [form, setForm] = useState({
        name: "",
        address: "",
        phone: "",
        payment_method: "COD",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
            const res = await authFetch(
                `${BASEURL}/api/orders/create/`,
                {
                    method: "POST",
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            console.log("Status:", res.status);
            console.log("Response:", data);

            if (res.ok) {
                setMessage("Order placed successfully!");

                clearCart();

                setTimeout(() => {
                    navigate("/");
                }, 3000);
            } else {
                setMessage(
                    data.detail ||
                    data.error ||
                    "Failed to place order. Please try again."
                );
            }
        } catch (error) {
            console.error(error);

            setMessage(
                "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">

                <h1 className="checkout-title">
                    Checkout
                </h1>

                <form
                    onSubmit={handleSubmit}
                    className="checkout-form"
                >

                    <input
                        className="form-input"
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        className="form-textarea"
                        name="address"
                        placeholder="Full Address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="form-input"
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />

                    <select
                        className="form-select"
                        name="payment_method"
                        value={form.payment_method}
                        onChange={handleChange}
                    >
                        <option value="COD">
                            Cash on Delivery
                        </option>

                        <option value="ONLINE">
                            Online Payment
                        </option>
                    </select>

                    <button
                        type="submit"
                        disabled={loading}
                        className="place-order-btn"
                    >
                        {loading
                            ? "Processing..."
                            : "Place Order"}
                    </button>

                    {message && (
                        <p className="checkout-message">
                            {message}
                        </p>
                    )}

                </form>

            </div>
        </div>
    );
}

export default CheckoutPage;
