import React, {useState, useEffect} from 'react';
import {
    Typography,
    Button,
    Container,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box
} from '@mui/material';

import img_1 from "../images/crpytodash.png"
import bitok from "../images/bitok.png"
import CustomAppBar from "./CryptoAppBar";
import {useAuth} from "../AuthContext";
import {useNavigate} from "react-router-dom";

function HomePage() {
    const {isAuthenticated, handleLogout} = useAuth();
    const [topCryptos, setTopCryptos] = useState([]);
    const navigate = useNavigate();
    const colorBasedOnValue = (value) => value > 0 ? 'green' : 'red';

    useEffect(() => {
        const fetchTopCryptos = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/crypto/all?page=0&size=10&sortBy=id");
                const data = await response.json();
                const topTenData = data.content
                setTopCryptos(topTenData);
            } catch (error) {
                console.error('Error fetching top cryptocurrencies:', error);
            }
        };
        fetchTopCryptos();
    }, []);


    const darkBlueTheme = {
        primary: '#ffffff', // White for headers, ensures good readability
        secondary: '#e0e6ed', // A lighter shade for subheaders and other texts
        text: '#ffffff', // White for main text to stand out
        tableBackground: '#1e2740', // An even darker shade for the table background
        buttonBackground: '#6277a8', // Button background
        appBarBackground: '#0B1629', // Very dark blue, as in the AppBar
        containerBackground: 'rgba(26, 32, 53, 0.8)', // Semi-transparent background for containers
        textShadow: '0px 0px 8px rgba(0, 0, 0, 0.7)', // Text shadow for better legibility,
    };
    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>

            <Container maxWidth="xl" sx={{
                mt: 2,
                mb: 2,
                bgcolor: darkBlueTheme.containerBackground,
                borderRadius: 5,
                backgroundImage: `url(${bitok})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat'
            }}>
                <Box sx={{position: 'absolute', top: 90, right: 20}}>
                    <img src={img_1} alt="Description" style={{height: '170px', borderRadius: 20}}/>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <TableContainer component={Paper}
                                        sx={{mb: 4, mt: 2, bgcolor: darkBlueTheme.tableBackground, borderRadius: 5}}>
                            <Table aria-label="cryptocurrency table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{color: 'white'}}>Logo</TableCell>
                                        <TableCell sx={{color: 'white'}}>Name (Symbol)</TableCell>
                                        <TableCell sx={{
                                            color: 'white',
                                            textAlign: 'left'
                                        }}>Price</TableCell> {/* Adjusted alignment */}
                                        <TableCell sx={{color: 'white', textAlign: 'left'}}>Market
                                            Cap</TableCell> {/* Adjusted alignment */}
                                        <TableCell sx={{color: 'white', textAlign: 'left', whiteSpace: 'nowrap'}}>24h
                                            Change</TableCell> {/* Adjusted alignment and nowrap */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topCryptos.map((crypto) => (
                                        <TableRow
                                            key={crypto.id}
                                            onClick={() => navigate(`/crypto/details/${crypto.id}`)}
                                            style={{cursor: 'pointer'}}>
                                            <TableCell>
                                                <img src={crypto.image} alt={crypto.name}
                                                     style={{width: 30, height: 30}}/>
                                            </TableCell>
                                            <TableCell sx={{color: 'white'}}>{crypto.name} ({crypto.symbol})</TableCell>
                                            <TableCell align="right"
                                                       sx={{color: '#a8c0ff'}}>${crypto.current_price.toFixed(2)}</TableCell>
                                            <TableCell align="right"
                                                       sx={{color: '#a8c0ff'}}>${crypto.market_cap.toFixed(2)}</TableCell>
                                            <TableCell align="right"
                                                       style={{color: colorBasedOnValue(crypto.price_change_percentage_24h)}}>
                                                {crypto.price_change_percentage_24h.toFixed(2)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={7}>
                        <Box sx={{textAlign: 'left', pl: 2, mt: 5}}>
                            <Typography variant="h4" gutterBottom sx={{color: darkBlueTheme.primary, ml: 5}}>
                                Explore the World of Cryptocurrencies
                            </Typography>

                            <Typography variant="h6" sx={{color: '#ccd6f6', mt: 30}}>
                                Your Gateway to Digital Assets
                            </Typography>
                            <Typography variant="body1" paragraph
                                        sx={{color: '#e6e6e6'}}>
                                Dive into the heart of blockchain technology, a revolution that is redefining how we
                                exchange value and information. CryptoDash provides you with real-time data, insightful
                                analysis, and the tools you need to make informed decisions in the dynamic world of
                                digital currencies.
                            </Typography>
                            <Typography variant="body2" paragraph sx={{color: '#e6e6e6'}}>
                                Whether you're a seasoned investor or just starting out, our platform is designed to
                                demystify the complexities of cryptocurrency markets. Track the performance of your
                                favorite coins, learn about the latest ICOs, and stay ahead of market trends.
                            </Typography>
                            <Typography variant="body2" paragraph sx={{color: '#e6e6e6'}}>
                                Join our community and connect with fellow enthusiasts to share tips, strategies, and
                                the excitement of crypto trading. Welcome to the future of finance—welcome to
                                CryptoDash.
                            </Typography>
                            <Button variant="contained" sx={{
                                mt: 2,
                                bgcolor: darkBlueTheme.buttonBackground,
                                '&:hover': {bgcolor: '#3b4a68'}
                            }}> {/* Adjusted button style */}
                                Learn More
                            </Button>
                        </Box>
                    </Grid>

                </Grid>
            </Container>
        </>
    )
        ;
}

export default HomePage;
