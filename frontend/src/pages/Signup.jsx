import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Signup.css";

function Signup() {
    const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        password2: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMsg("");

        if (form.password !== form.password2) {
            setMsg("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${BASE}/api/register/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();

            if (res.ok) {
                setMsg(
                    "Account created successfully. Redirecting to login..."
                );

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                const errorMessage =
                    data.username?.[0] ||
                    data.email?.[0] ||
                    data.password?.[0] ||
                    data.password2?.[0] ||
                    data.detail ||
                    "Signup failed";

                setMsg(errorMessage);
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
        <div className="signup-page">
            <div className="signup-card">

                <h2 className="signup-title">
                    Create Account
                </h2>

                <form
                    className="signup-form"
                    onSubmit={handleSubmit}
                >
                    <input
                        className="signup-input"
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="signup-input"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="signup-input"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <input
                        className="signup-input"
                        type="password"
                        name="password2"
                        placeholder="Confirm Password"
                        value={form.password2}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="signup-btn"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>

                {msg && (
                    <p className="signup-message">
                        {msg}
                    </p>
                )}

                <div className="login-link">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default Signup;