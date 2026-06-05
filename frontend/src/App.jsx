import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import PrivateRouter from "./components/PrivateRouter";

import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
    return (
        <Router>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<ProductList />}
                />

                <Route
                    path="/product/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/cart"
                    element={<CartPage />}
                />

                {/* Protected Routes */}
                <Route element={<PrivateRouter />}>
                    <Route
                        path="/checkout"
                        element={<CheckoutPage />}
                    />
                </Route>

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />
            </Routes>
        </Router>
    );
}

export default App;