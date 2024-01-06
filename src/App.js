import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './views/Login';
import Register from './views/Register';
import CoinDetail from './views/CoinDetail';
import Home from "./views/Home";
import './style.css';
import Cryptocurrencies from "./views/Cryptocurrencies";
import ProfilePage from "./views/ProfilePage";
import {AuthProvider} from "./AuthContext";


function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<ProfilePage/>}/>
                    <Route path="/cryptocurrencies" element={<Cryptocurrencies/>}/>
                    <Route path="/crypto/details/:coinId" element={<CoinDetail/>}/>

                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
