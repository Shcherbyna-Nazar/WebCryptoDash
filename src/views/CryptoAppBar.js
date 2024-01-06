import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo_crypto from "../images/img.png";

function CustomAppBar({ isAuthenticated, handleLogout }) {
    return (
        <AppBar position="static" sx={{
            bgcolor: '#0B1629', // You might want to consider moving these color values to a shared theme or config file
            color: '#ffffff',
            width: '100%',
            borderRadius: 0
        }}>
            <Toolbar sx={{justifyContent: 'space-between'}}>
                <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <img src={logo_crypto} alt="CryptoDash Logo" style={{height: '70px', marginRight: '10px'}}/>
                    <Typography variant="h6">CryptoDash</Typography>
                    <Button color="inherit" component={Link} to="/" sx={{'&:hover': {bgcolor: '#177CC7'}, marginLeft: '70px'}}>Home</Button>
                    <Button color="inherit" component={Link} to="/cryptocurrencies" sx={{'&:hover': {bgcolor: '#177CC7'}, marginLeft: '70px'}}>Cryptocurrencies</Button>
                </Box>
                <Box sx={{display: 'flex', alignItems: 'center', marginRight: '50px'}}>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/profile" sx={{'&:hover': {bgcolor: '#177CC7'}, marginRight: '60px'}}>Profile</Button>
                            <Button color="inherit" onClick={handleLogout} sx={{'&:hover': {bgcolor: '#177CC7'}, marginRight: '60px'}}>Logout</Button>
                        </>
                    ) : (
                        <>
                            <Button variant="inherit" component={Link} to="/login" sx={{'&:hover': {bgcolor: '#177CC7'}, marginRight: '60px'}}>Login</Button>
                            <Button color="inherit" component={Link} to="/register" sx={{'&:hover': {bgcolor: '#177CC7'}}}>Register</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default CustomAppBar;
