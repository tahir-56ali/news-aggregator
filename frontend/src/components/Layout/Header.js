import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';
import './Header.css';  // Import specific CSS for header

const Header = () => {
    const { user } = useAuth();
    const handleLogout = useLogout();

    return (
        <header className="navbar navbar-expand-lg vibrant-header shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
                <Link className="navbar-brand vibrant-title" to="/">News Aggregator</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        {!user ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link vibrant-link" to="/login">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link vibrant-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link vibrant-link" to="/profile">Profile</Link>
                                </li>
                                <li className="nav-item">
                                    <span className="nav-link vibrant-link" role="button" onClick={handleLogout}>Logout</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;
