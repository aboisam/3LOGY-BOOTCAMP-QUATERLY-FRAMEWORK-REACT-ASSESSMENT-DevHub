/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => authService.getCurrentUser());
    const [isLoading, setIsLoading] = useState(false);

    const login = async (email, password) => {
        setIsLoading(true);
        const user = await authService.login(email, password);
        setUser(user);
        setIsLoading(false);
        return user;
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const register = async (userData) => {
        setIsLoading(true);
        const result = await authService.register(userData);
        setIsLoading(false);
        return result;
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}