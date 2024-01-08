import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import img_2 from "../images/img_2.png";
import darkBackground from "../images/back_green.png"; // assume you have a dark-themed background image
import CustomAppBar from "./CryptoAppBar";
import {useAuth} from "../AuthContext";
import {useNavigate} from "react-router-dom";

function HomePage() {
    const {isAuthenticated, handleLogout} = useAuth();
    const [topCryptos, setTopCryptos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTopCryptos = async () => {
            try {
                setIsLoading(true);  // Start loading
                const response = await fetch("https://cryptodashweb.azurewebsites.net/api/v1/crypto/all?page=0&size=10&sortBy=id");
                const data = await response.json();
                const topTenData = data.content;
                setTopCryptos(topTenData);
                setIsLoading(false);  // Stop loading after data is fetched
            } catch (error) {
                console.error('Error fetching top cryptocurrencies:', error);
                setIsLoading(false);  // Stop loading even if there's an error
            }
        };
        fetchTopCryptos();
    }, []);

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>

            <Container maxWidth="xl" sx={{
                mt: 2,
                mb: 2,
                bgcolor: 'rgba(18, 32, 47, 0.9)', // slightly transparent dark background
                borderRadius: 5,
                backgroundImage: `url(${darkBackground})`, // dark-themed background image
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                position: 'relative', // for absolute positioning of elements within the container
                overflow: 'hidden', // to ensure that absolutely positioned elements do not overflow
                padding: 3, // padding around the container
            }}>
                <Box sx={{position: 'absolute', top: 5, right: 20}}>
                    <img src={img_2} alt="CryptoDash Logo" style={{height: '170px', borderRadius: 20}}/>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} md={5}>
                        <TableContainer component={Paper}
                                        sx={{mb: 4, mt: 2, bgcolor: '#263238', borderRadius: 5}}>
                            <Table aria-label="cryptocurrency table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{color: 'white'}}>Logo</TableCell>
                                        <TableCell sx={{color: 'white'}}>Name (Symbol)</TableCell>
                                        <TableCell sx={{color: 'white', textAlign: 'right'}}>Price</TableCell>
                                        <TableCell sx={{color: 'white', textAlign: 'right'}}>Market Cap</TableCell>
                                        <TableCell sx={{color: 'white', textAlign: 'right', whiteSpace: 'nowrap'}}>24h
                                            Change</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topCryptos.map((crypto) => (
                                        <TableRow
                                            key={crypto.id}
                                            onClick={() => navigate(`/crypto/details/${crypto.id}`)}
                                            sx={{cursor: 'pointer', '&:hover': {bgcolor: '#37474F'}}}>
                                            <TableCell>
                                                <img src={crypto.image} alt={crypto.name}
                                                     style={{width: 30, height: 30}}/>
                                            </TableCell>
                                            <TableCell sx={{color: 'white'}}>{crypto.name} ({crypto.symbol})</TableCell>
                                            <TableCell align="right" sx={{color: '#a8c0ff'}}>
                                                ${crypto.current_price.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right" sx={{color: '#a8c0ff'}}>
                                                ${crypto.market_cap.toFixed(2)}
                                            </TableCell>
                                            <TableCell align="right"
                                                       sx={{color: crypto.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336'}}>
                                                {crypto.price_change_percentage_24h.toFixed(2)}%
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Box sx={{textAlign: 'left', pl: 2, pt: 5}}>
                            <Typography variant="h4" gutterBottom
                                        sx={{color: '#ECEFF1', mb: 5, textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9)'}}>
                                Explore the World of Cryptocurrencies
                            </Typography>

                            <Typography variant="h6"
                                        sx={{color: '#B0BEC5', mt: 2, textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9)'}}>
                                Your Gateway to Digital Assets
                            </Typography>
                            <Typography variant="body1" paragraph
                                        sx={{color: '#ECEFF1', textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9)'}}>
                                Dive into the heart of blockchain technology, a revolution that is redefining how we
                                exchange value and information. CryptoDash provides you with real-time data, insightful
                                analysis, and the tools you need to make informed decisions in the dynamic world of
                                digital currencies.
                            </Typography>
                            <Typography variant="body2" paragraph
                                        sx={{color: '#ECEFF1', textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9)'}}>
                                Whether you're a seasoned investor or just starting out, our platform is designed to
                                demystify the complexities of cryptocurrency markets. Track the performance of your
                                favorite coins, learn about the latest ICOs, and stay ahead of market trends.
                            </Typography>
                            <Typography variant="body2" paragraph
                                        sx={{color: '#ECEFF1', textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9)'}}>
                                Join our community and connect with fellow enthusiasts to share tips, strategies, and
                                the excitement of crypto trading. Welcome to the future of finance—welcome to
                                CryptoDash.
                            </Typography>
                            <Button variant="contained" sx={{
                                mt: 2,
                                bgcolor: '#37474F',
                                '&:hover': {bgcolor: '#455a64'},
                                color: '#ECEFF1',
                                textShadow: '0px 0px 3px rgba(0, 0, 0, 0.9)'
                            }}>
                                Learn More
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </>
    );

}

export default HomePage;
