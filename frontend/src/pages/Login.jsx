import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { useCart } from "../context/CartContext";
import "./Login.css";

function Login() {
    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();
    const { syncGuestCart } = useCart();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const location = useLocation();

    const redirectTo =
        location.state?.from || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMsg("");
        setLoading(true);

        try {
            const response = await fetch(
                `${BASE}/api/token/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (response.ok) {
                saveToken(data);

                await syncGuestCart();

                setMsg(
                    "Login successful! Redirecting..."
                );

                setTimeout(() => {
                    navigate(redirectTo);
                }, 1000);

            } else {
                setMsg(
                    data.detail ||
                    "Invalid username or password"
                );
            }
        } catch (error) {
            console.error(error);

            setMsg(
                "An error occurred. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">

                <h2 className="login-title">
                    Welcome Back
                </h2>
                <p className="login-subtitle">
                    Sign in to continue shopping
                </p>

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="login-input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="login-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging In..."
                            : "Login"}
                    </button>
                </form>

                {msg && (
                    <p className="login-message">
                        {msg}
                    </p>
                )}

                <div className="signup-link">
                    Don't have an account?{" "}
                    <Link to="/signup">
                        Create Account
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Login;