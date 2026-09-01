import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("token");
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const createUser = async (name, email, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/register`, { name, email, password });
            const { token, ...userData } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setLoading(false);
            return res.data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, ...userData } = res.data;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setLoading(false);
            return res.data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const googleSignIn = async (token) => {
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/auth/google`, { token });
            const { token: jwtToken, ...userData } = res.data;
            localStorage.setItem("token", jwtToken);
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData);
            setLoading(false);
            return res.data;
        } catch (error) {
            setLoading(false);
            throw error;
        }
    };

    const logOut = () => {
        setLoading(true);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setLoading(false);
        return Promise.resolve();
    };

    const authInfo = {
        user,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
