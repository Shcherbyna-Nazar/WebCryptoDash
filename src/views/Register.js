import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import register_img from '../images/register.png';
import {
    Typography, Button, TextField, Container, Box, Snackbar, Alert
} from '@mui/material';
import CustomAppBar from "./CryptoAppBar";
import { useAuth } from "../AuthContext";

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const { isAuthenticated, handleLogout } = useAuth();
    const navigate = useNavigate();

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const displaySnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setOpenSnackbar(true);
    };

    const registerUser = async (registerRequest) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerRequest),
            });

            // Check if the response is in JSON format
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                const errorData = await response.json();
                if (response.ok) {
                    displaySnackbar('Registered successfully! Please log in.', 'success');
                    navigate('/login');
                } else {
                    setError(errorData.message || 'Registration failed');
                    displaySnackbar(errorData.message || 'Registration failed', 'error');
                }
            } else {
                // Handle non-JSON responses here
                const textResponse = await response.text();
                setError(textResponse || 'An unknown error occurred');
                displaySnackbar(textResponse || 'An unknown error occurred', 'error');
            }
        } catch (error) {
            setError(error.message);
            displaySnackbar(error.message, 'error');
        }
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setError('Passwords do not match.');
            displaySnackbar('Passwords do not match.', 'error');
            return;
        }
        setError(''); // Clear any existing errors
        const registerRequest = { firstName, lastName, email, password };
        registerUser(registerRequest);
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
                    width: '98.9vw',
                    backgroundImage: `url(${register_img})`,
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
                           }}>
                    <Typography component="h1" variant="h5" align="center" sx={{color: 'white', mb: 2}}>
                        Register
                    </Typography>
                    {error && <Box className="alert alert-danger" sx={{mb: 2}}>{error}</Box>}
                    <form onSubmit={handleSubmit}>
                        {/* First Name Field */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="firstName"
                            label="First Name"
                            name="firstName"
                            autoComplete="fname"
                            autoFocus
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            InputProps={{ style: inputStyle }}
                            InputLabelProps={{ style: {color: 'white'} }}
                        />
                        {/* Last Name Field */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="lastName"
                            label="Last Name"
                            name="lastName"
                            autoComplete="lname"
                            autoFocus
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            InputProps={{ style: inputStyle }}
                            InputLabelProps={{ style: {color: 'white'} }}
                        />
                        {/* Email Field */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{ style: inputStyle }}
                            InputLabelProps={{ style: {color: 'white'} }}
                        />
                        {/* Password Field */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            name="password"
                            type="password"
                            autoComplete="password"
                            autoFocus
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{ style: inputStyle }}
                            InputLabelProps={{ style: {color: 'white'} }}
                        />
                        {/* Repeat Password Field */}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="repeat_password"
                            label="Repeat password"
                            name="repeat_password"
                            type="password"
                            autoComplete="repeat password"
                            autoFocus
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            InputProps={{ style: inputStyle }}
                            InputLabelProps={{ style: {color: 'white'} }}
                        />
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{mt: 3, mb: 2, backgroundColor: '#6277a8', '&:hover': {backgroundColor: '#495a88'}}}
                        >
                            Register
                        </Button>
                    </form>
                </Container>
            </Box>

            {/* Snackbar for Notifications */}
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{width: '100%'}}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Register;
