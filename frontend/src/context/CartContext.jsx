import { createContext, useContext, useState, useEffect } from "react";
import { authFetch, getAccessToken } from "../utils/auth";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

    const [cartItems, setCartItems] = useState([]);

    // -----------------------------
    // Load Guest Cart
    // -----------------------------
    const loadGuestCart = () => {
        const guestCart =
            JSON.parse(localStorage.getItem("guest_cart")) || [];

        setCartItems(guestCart);
    };


    // -----------------------------
    // Fetch Backend Cart
    // -----------------------------
    const fetchCart = async () => {
        const token = getAccessToken();

        // Guest user
        if (!token) {
            loadGuestCart();
            return;
        }

        try {
            const res = await authFetch(`${BASEURL}/api/cart/`);

            if (!res.ok) {
                throw new Error("Failed to fetch cart");
            }

            const data = await res.json();

            setCartItems(data.items || []);
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // ADD HERE 👇
    const syncGuestCart = async () => {
        const token = getAccessToken();

        if (!token) return;

        const guestCart =
            JSON.parse(localStorage.getItem("guest_cart")) || [];

        if (guestCart.length === 0) return;

        try {
            for (const item of guestCart) {
                await authFetch(`${BASEURL}/api/cart/add/`, {
                    method: "POST",
                    body: JSON.stringify({
                        product_id: item.id,
                        quantity: item.quantity,
                    }),
                });
            }

            localStorage.removeItem("guest_cart");

            await fetchCart();

        } catch (error) {
            console.error("Error syncing guest cart:", error);
        }
    };

    // -----------------------------
    // Add To Cart
    // -----------------------------
    const addToCart = async (product) => {
        const token = getAccessToken();

        // Guest Cart
        if (!token) {
            const guestCart =
                JSON.parse(localStorage.getItem("guest_cart")) || [];

            const existing = guestCart.find(
                (item) => item.id === product.id
            );

            let updatedCart;

            if (existing) {
                updatedCart = guestCart.map((item) =>
                    item.id === product.id
                        ? {
                            ...item,
                            quantity: item.quantity + 1,
                        }
                        : item
                );
            } else {
                updatedCart = [
                    ...guestCart,
                    {
                        ...product,
                        quantity: 1,
                    },
                ];
            }

            localStorage.setItem(
                "guest_cart",
                JSON.stringify(updatedCart)
            );

            setCartItems(updatedCart);

            return;
        }

        // Logged In User
        try {
            const res = await authFetch(
                `${BASEURL}/api/cart/add/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        product_id: product.id,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to add product");
            }

            await fetchCart();
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // -----------------------------
    // Remove From Cart
    // -----------------------------
    const removeFromCart = async (itemId) => {
        const token = getAccessToken();

        // Guest Cart
        if (!token) {
            const guestCart =
                JSON.parse(localStorage.getItem("guest_cart")) || [];

            const updatedCart = guestCart.filter(
                (item) => item.id !== itemId
            );

            localStorage.setItem(
                "guest_cart",
                JSON.stringify(updatedCart)
            );

            setCartItems(updatedCart);

            return;
        }

        // Logged In User
        try {
            const res = await authFetch(
                `${BASEURL}/api/cart/remove/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        item_id: itemId,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to remove item");
            }

            await fetchCart();
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    // -----------------------------
    // Update Quantity
    // -----------------------------
    const updateQuantity = async (itemId, quantity) => {
        const token = getAccessToken();

        if (quantity < 1) {
            await removeFromCart(itemId);
            return;
        }

        // Guest Cart
        if (!token) {
            const guestCart =
                JSON.parse(localStorage.getItem("guest_cart")) || [];

            const updatedCart = guestCart.map((item) =>
                item.id === itemId
                    ? { ...item, quantity }
                    : item
            );

            localStorage.setItem(
                "guest_cart",
                JSON.stringify(updatedCart)
            );

            setCartItems(updatedCart);

            return;
        }

        // Logged In User
        try {
            const res = await authFetch(
                `${BASEURL}/api/cart/update/`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        item_id: itemId,
                        quantity,
                    }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to update quantity");
            }

            await fetchCart();
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    // -----------------------------
    // Clear Cart
    // -----------------------------
    const clearCart = () => {
        localStorage.removeItem("guest_cart");
        setCartItems([]);
    };

    // -----------------------------
    // Cart Count
    // -----------------------------
    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    // -----------------------------
    // Cart Total
    // -----------------------------
    const cartTotal = cartItems.reduce(
        (total, item) =>
            total +
            ((item.product_price || item.price || 0) *
                item.quantity),
        0
    );

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                fetchCart,
                syncGuestCart,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    return useContext(CartContext);
};