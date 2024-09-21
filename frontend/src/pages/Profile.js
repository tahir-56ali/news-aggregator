import React from 'react';
import useAuth from '../hooks/useAuth';
import Preferences from '../components/Profile/Preferences';

const Profile = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="container">
            <h2>Profile</h2>
            {user ? (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>

                    <hr />
                    <Preferences />
                </div>
            ) : (
                <p>Please log in.</p>
            )}
        </div>
    );
};

export default Profile;
