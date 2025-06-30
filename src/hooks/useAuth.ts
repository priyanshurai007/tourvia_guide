import { useState, useEffect, useCallback } from "react";
import { getCookie, deleteCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    id: string;
    exp: number;
    iat: number;
    role: string;
    name: string;
}

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);

    const checkAuthStatus = useCallback(() => {
        const token = getCookie("token");
        if (token) {
            try {
                if (typeof token === "string" && token.split(".").length === 3) {
                    const decoded = jwtDecode<DecodedToken>(token);
                    if (decoded.exp * 1000 > Date.now()) {
                        setIsLoggedIn(true);
                        setUserRole(decoded.role);
                        setUserName(decoded.name);
                        return;
                    }
                }
            } catch {
                deleteCookie("token");
            }
        }
        const isLoggedInLS = localStorage.getItem("isLoggedIn") === "true";
        if (isLoggedInLS) {
            setIsLoggedIn(true);
            setUserRole(localStorage.getItem("userRole"));
            setUserName(localStorage.getItem("userName"));
        } else {
            setIsLoggedIn(false);
            setUserRole(null);
            setUserName(null);
        }
    }, []);

    useEffect(() => {
        checkAuthStatus();
        const handleLoginEvent = () => checkAuthStatus();
        const handleStorageEvent = () => checkAuthStatus();
        window.addEventListener("userLoggedIn", handleLoginEvent);
        window.addEventListener("storage", handleStorageEvent);
        return () => {
            window.removeEventListener("userLoggedIn", handleLoginEvent);
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, [checkAuthStatus]);

    return { isLoggedIn, userRole, userName, checkAuthStatus };
}
