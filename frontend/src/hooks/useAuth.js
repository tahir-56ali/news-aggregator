import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Create the AuthContext
const AuthContext = createContext(null);

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider component to wrap around the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Automatically fetch user data if stored in localStorage (for page refreshes)
    useEffect(() => {
        //return false;
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));  // Restore user from localStorage
        }
    }, []);


    const login = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            // Step 1: Call CSRF cookie endpoint
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sanctum/csrf-cookie`, {
                withCredentials: true,
            });
            axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');

            // Step 2: Send login request
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
                email,
                password,
            }, {
                withCredentials: true,  // Send credentials (cookies) with the request
                maxRedirects: 0,  // Prevent Axios from following redirects
            });

            // Step 3: Fetch the authenticated user
            const userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user`, {
                withCredentials: true,
            });

            const loggedInUser = userResponse.data;
            setUser(loggedInUser);  // Set the logged-in user in state
            localStorage.setItem('user', JSON.stringify(loggedInUser));  // Persist the user in localStorage

            setLoading(false);
            return { success: true, user: loggedInUser };
        } catch (err) {
            //setError('Login failed. Please check your credentials.');
            setError(err.response?.data?.message || 'An error occurred during login.');
            setLoading(false);
            return { success: false };
        }
    };

    const register = async (name, email, password, password_confirmation) => {
        setLoading(true);
        setError(null);

        try {
            // Step 1: Get CSRF token and Set the token in Axios headers
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sanctum/csrf-cookie`);
            axios.defaults.withCredentials = true;
            axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');

            // Step 2: Make the registration request
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
                name,
                email,
                password,
                password_confirmation,
            });

            // Step 3: Fetch the authenticated user (with retry logic)
            let userResponse;
            try {
                // Add a small delay (e.g., 500ms) before fetching the authenticated user
                await new Promise((resolve) => setTimeout(resolve, 500));
                userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user`, {
                    withCredentials: true,
                });
            } catch (err) {
                if (err.response?.status === 401) {
                    // Add a small delay (e.g., 500ms) before fetching the authenticated user
                    await new Promise((resolve) => setTimeout(resolve, 500));
                    // Retry the request if Unauthorized
                    userResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/user`, {
                        withCredentials: true,
                    });
                } else {
                    throw err;
                }
            }

            console.log(userResponse);
            setUser(userResponse.data);  // Set the user in React state
            localStorage.setItem('user', JSON.stringify(userResponse.data));

            setLoading(false);

            return { success: true };
        } catch (err) {
            //setError('Registration failed. Please try again.');
            setError(err.response?.data?.message || 'An error occurred');
            setLoading(false);
            return { success: false };
        }
    };

    // const logout = async () => {
    //     axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
    //     await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {}, { withCredentials: true });
    //     setUser(null);
    //     localStorage.removeItem('user');  // Clear user from localStorage
    // };

    const logout = async () => {
        try {
            // Set CSRF token if needed
            axios.defaults.headers.common['X-XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');

            // Send logout request to the backend
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`, {}, {
                withCredentials: true,  // Ensure cookies are sent
            });

            // Clear user data from local state and localStorage
            setUser(null);
            localStorage.removeItem('user');

            return { success: true };
        } catch (err) {
            console.error('Error during logout:', err.response?.data?.message || err.message);
            return { success: false };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
    //return { user, loading, error, login, register, logout };
};

export default useAuth;
