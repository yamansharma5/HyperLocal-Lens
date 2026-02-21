import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // On mount, verify token and load user
    useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem('token');
            if (savedToken) {
                try {
                    const res = await api.get('/auth/me');
                    setUser(res.data.user);
                    setToken(savedToken);
                } catch (err) {
                    // Token invalid — clear it
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                    setUser(null);
                    setToken(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', userData.role);
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const register = async (name, email, password, role) => {
        const res = await api.post('/auth/register', { name, email, password, role });
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', userData.role);
        setToken(newToken);
        setUser(userData);
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isBusiness: user?.role === 'business',
        isUser: user?.role === 'user',
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
