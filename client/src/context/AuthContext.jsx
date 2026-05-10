/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    // isLoading starts true so ProtectedRoute waits before checking auth
    const [isLoading, setIsLoading] = useState(true);

    // Derived from user — true only when user object has an id from the API
    const isAuthenticated = !!(user && user.id);

    // On mount, restore session from localStorage token so refresh keeps user logged in
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const token = authService.getToken();
                if (token) {
                    const profile = await authService.getProfile();
                    setUser(profile);
                } else {
                    setUser(null);
                }
            } catch {
                // Token expired or invalid — clear everything
                authService.logout();
                setUser(null);
            } finally {
                // Always set isLoading false so ProtectedRoute stops spinning
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    // After login, fetch full profile so user.id is guaranteed to be set
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            await authService.login(email, password);
            const profile = await authService.getProfile();
            setUser(profile);
            return profile;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Register only creates the account — user must log in separately after
    const register = async (userName, email, password) => {
        return await authService.register(userName, email, password);
    };

    const value = { user, isLoading, isAuthenticated, login, logout, register };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}