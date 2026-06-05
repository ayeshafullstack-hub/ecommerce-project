export const saveToken = (token) => {
    localStorage.setItem(
        "access_token",
        token.access
    );

    localStorage.setItem(
        "refresh_token",
        token.refresh
    );
};

export const clearTokens = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
};

export const getAccessToken = () => {
    return localStorage.getItem("access_token");
};

export const getRefreshToken = () => {
    return localStorage.getItem("refresh_token");
};

// Refresh Access Token
export const refreshAccessToken = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        clearTokens();
        return null;
    }

    try {
        const response = await fetch(
            "http://127.0.0.1:8000/api/token/refresh/",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify({
                    refresh: refreshToken,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem(
                "access_token",
                data.access
            );

            return data.access;
        }

        clearTokens();
        return null;

    } catch (error) {
        console.error(
            "Token refresh failed:",
            error
        );

        clearTokens();
        return null;
    }
};

// Auth Fetch with Auto Refresh
export const authFetch = async (
    url,
    options = {}
) => {

    let token = getAccessToken();

    const headers = options.headers
        ? { ...options.headers }
        : {};

    if (token) {
        headers["Authorization"] =
            `Bearer ${token}`;
    }

    headers["Content-Type"] =
        "application/json";

    let response = await fetch(url, {
        ...options,
        headers,
    });

    // Token expired
    if (response.status === 401) {

        const newToken =
            await refreshAccessToken();

        if (!newToken) {
            window.location.href = "/login";
            return response;
        }

        headers["Authorization"] =
            `Bearer ${newToken}`;

        response = await fetch(url, {
            ...options,
            headers,
        });
    }

    return response;
};