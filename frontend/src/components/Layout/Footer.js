import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';  // Import specific CSS for footer

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-4 mt-auto footer">
            <div className="container">
                <p className="mb-1">&copy; 2024 News Aggregator. All rights reserved.</p>
                <p className="mb-0">
                    <Link to="/" className="text-white mx-2">Home</Link>
                    <Link to="/about" className="text-white mx-2">About</Link>
                    <Link to="/contact" className="text-white mx-2">Contact</Link>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
