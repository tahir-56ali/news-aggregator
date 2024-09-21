import { useState } from 'react';
import axios from 'axios';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/api/login', {
                email,
                password,
            });

            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            setLoading(false);
        } catch (err) {
            setError('Login failed. Please check your credentials.');
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:8080/api/register', {
                name,
                email,
                password,
            });

            setUser(response.data.user);
            localStorage.setItem('token', response.data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            setLoading(false);
        } catch (err) {
            setError('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return { user, loading, error, login, register, logout };
};

export default useAuth;
