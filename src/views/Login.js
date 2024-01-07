import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginImg from '../images/login.png';
import { Typography, TextField, Button, Container, Box } from '@mui/material';
import CustomAppBar from "./CryptoAppBar";
import { useAuth } from "../AuthContext";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuthenticated, handleLogout } = useAuth();
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://accounts.google.com/gsi/client?hl=en";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            setIsGoogleScriptLoaded(true);
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (isGoogleScriptLoaded) {
            window.google.accounts.id.initialize({
                client_id: "696132791550-ral8gkn00orccirt8g5ar2mp66ul4ovk.apps.googleusercontent.com", // Replace with your client ID
                callback: handleCredentialResponse
            });

            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInDiv"),
                {
                    theme: "outline",
                    size: "large",
                    text: "signin_with", // Ensure English text
                    shape: "pill", // A more modern, rounded shape
                    logo_alignment: "left" // Align the logo to the left
                }
            );

            window.google.accounts.id.prompt();
        }
    }, [isGoogleScriptLoaded]);

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
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Authentication failed');
            }
        } catch (error) {
            setError('Authentication failed: Check your email and password and try again!');
        }
    };

    const handleCredentialResponse = async (response) => {
        console.log("Encoded JWT ID token: " + response.credential);
        try {
            const googleResponse = await fetch('http://localhost:8080/api/v1/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: response.credential }),
            });

            if (googleResponse.ok) {
                const data = await googleResponse.json();
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError('Google authentication failed');
            }
        } catch (error) {
            setError('Google authentication failed:' + error.message);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        authenticateUser({ email, password });
    };

    const inputStyle = {
        input: {
            color: 'white',
            borderColor: '#75F9ED',
            '&:before': { borderBottomColor: 'white' },
            '&:after': { borderBottomColor: 'white' },
            '&:hover:not(.Mui-disabled):before': { borderBottomColor: 'white' }
        },
        label: { color: 'white' }
    };

    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
            <Box
                sx={{
                    height: '100vh',
                    width: '100vw',
                    backgroundImage: `url(${loginImg})`,
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
                               backgroundColor: 'rgba(0, 0, 0, 0.8)', // Slightly darker background for better contrast
                               p: 4,
                               borderRadius: 3, // More pronounced rounding
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
                            sx={inputStyle}
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
                            sx={inputStyle}
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
                    <div id="googleSignInDiv" style={{ marginTop: '10px' }}></div> {/* Google Sign-In button container */}
                </Container>
            </Box>
        </>
    );
}

export default Login;
