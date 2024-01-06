import React, { useState } from 'react';
import {useNavigate } from 'react-router-dom';
import login from '../images/login.png'
import {
    Typography, Button, TextField, Container, Box
} from '@mui/material';
import CustomAppBar from "./CryptoAppBar";
import {useAuth} from "../AuthContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuthenticated, handleLogout } = useAuth();

    const navigate = useNavigate();

    const authenticateUser = async (credentials) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/authenticate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (response.ok) {
                const data = await response.json();
                // Store the JWT token in local storage or context
                localStorage.setItem('token', data.token);
                // Redirect to a protected route or home page
                navigate('/'); // Adjust the route as needed
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Authentication failed');
            }
        } catch (error) {
            setError('Authentication failed: Check your email and password and try again!');
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear any existing errors
        authenticateUser({ email, password });
    };
    const inputStyle = {
        color: 'white',
        borderColor: '#75F9ED',
        borderWidth: '1px',
        borderStyle: 'solid',
        '&:before': { borderBottomColor: 'white' },
        '&:after': { borderBottomColor: 'white' },
        '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' },
    };

    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    backgroundImage: `url(${login})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingBottom: '50px'
                }}
            >
                <Container component="main" maxWidth="xs"
                           sx={{
                               backgroundColor: 'rgba(0, 0, 0, 0.7)',
                               p: 4,
                               borderRadius: 2,
                               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                           }}
                >
                    <Typography component="h1" variant="h5" align="center" sx={{ color: 'white', mb: 2 }}>
                        Login
                    </Typography>
                    {error && <Box className="alert alert-danger" sx={{ mb: 2 }}>{error}</Box>}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{ style: inputStyle }}
                            InputLabelProps={{ style: { color: 'white' } }}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{ style: inputStyle }}
                            InputLabelProps={{ style: { color: 'white' } }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, backgroundColor: '#6277a8', '&:hover': { backgroundColor: '#495a88' } }}
                        >
                            Login
                        </Button>
                    </form>
                </Container>
            </Box>
        </>
    );
}

export default Login;
