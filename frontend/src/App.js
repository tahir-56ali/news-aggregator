import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Content from './components/Layout/Content';
import Home from './pages/Home';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Profile from './pages/Profile';
import {AuthProvider} from './hooks/useAuth';
import './styles/App.css';

const App = () => {
    return (
        <AuthProvider>
            <div className="d-flex flex-column min-vh-100">
                <Router>
                    <Header/>
                    <Content>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/login" element={<Login/>}/>
                            <Route path="/register" element={<Register/>}/>
                            <Route path="/profile" element={<Profile/>}/>
                        </Routes>
                    </Content>
                    <Footer/>
                </Router>
            </div>
        </AuthProvider>
    );
};

export default App;
