import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import register_img from '../images/register.png'
import {
    Typography, Button, TextField, Container, Box
} from '@mui/material';
import CustomAppBar from "./CryptoAppBar";
import {useAuth} from "../AuthContext";

function Register() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const { isAuthenticated, handleLogout } = useAuth();

    const navigate = useNavigate();

    const registerUser = async (registerRequest) => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerRequest),
            });

            if (response.ok) {
                navigate('/login'); // Redirect to the login page
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Registration failed');
            }
        } catch (error) {
            setError('Network error: Could not register');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== repeatPassword) {
            setError('Passwords do not match.');
            return;
        }
        setError(''); // Clear any existing errors
        const registerRequest = {firstName, lastName, email, password};
        registerUser(registerRequest);
    };
    const inputStyle = {
        color: 'white',
        borderColor: '#75F9ED',
        borderWidth: '1px',
        borderStyle: 'solid',
        '&:before': { // underline color when textfield is not focused
            borderBottomColor: 'white',
        },
        '&:after': { // underline color when textfield is focused
            borderBottomColor: 'white',
        },
        '&:hover:not(.Mui-disabled):before': { // underline color when hovered
            borderBottomColor: 'white',
        },
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
                               backgroundColor: 'rgba(0, 0, 0, 0.7)', // Adjusted to a darker, semi-transparent background
                               p: 4,
                               borderRadius: 2,
                               boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
                           }}>
                    <Typography component="h1" variant="h5" align="center" sx={{color: 'white', mb: 2}}>
                        Register
                    </Typography>
                    {error && <Box className="alert alert-danger" sx={{mb: 2}}>{error}</Box>}
                    <form onSubmit={handleSubmit}>
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
                            InputProps={{
                                style: inputStyle
                            }}
                            InputLabelProps={{
                                style: {color: 'white'} // Light color for the label text
                            }}
                        />
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
                            InputProps={{
                                style: inputStyle
                            }}
                            InputLabelProps={{
                                style: {color: 'white'} // Light color for the label text
                            }}
                        />
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
                            InputProps={{
                                style: inputStyle
                            }}
                            InputLabelProps={{
                                style: {color: 'white'} // Light color for the label text
                            }}
                        />
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
                            InputProps={{
                                style: inputStyle
                            }}
                            InputLabelProps={{
                                style: {color: 'white'} // Light color for the label text
                            }}
                        />
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
                            InputProps={{
                                style: inputStyle
                            }}
                            InputLabelProps={{
                                style: {color: 'white'} // Light color for the label text
                            }}
                        />
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


        </>

    );
}

export default Register;
