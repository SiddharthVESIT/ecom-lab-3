import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import * as api from '../services/api';

const API_URL = 'http://localhost:4000/api/v1';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem('amai_token');
            if (token) {
                try {
                    const response = await axios.get(`${API_URL}/auth/session`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data.user);
                } catch (error) {
                    localStorage.removeItem('amai_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkSession();
    }, []);

    const loginUser = async (email, password) => {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        localStorage.setItem('amai_token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const registerUser = async (fullName, email, password) => {
        const response = await axios.post(`${API_URL}/auth/register`, { fullName, email, password });
        localStorage.setItem('amai_token', response.data.token);
        setUser(response.data.user);
        return response.data;
    };

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const idToken = await result.user.getIdToken();
        const response = await api.loginWithGoogle(idToken);
        setUser(response.user);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('amai_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, registerUser, loginWithGoogle, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
