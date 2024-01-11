import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Container,
    Card,
    CardContent,
    CardMedia,
    CardActions,
    Grid,
    Paper
} from "@mui/material";
import CustomAppBar from "./CryptoAppBar";
import { useAuth } from "../AuthContext";
import backgroundImage from "../images/back_green.png"; // Import your background image here

function CoinDetail() {
    const { coinId } = useParams();
    const [coinDetail, setCoinDetail] = useState(null);
    const { isAuthenticated, handleLogout } = useAuth();

    const backgroundStyle = {
        backgroundImage: `url(${backgroundImage})`, // Apply the background image
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        padding: '10px',
        boxSizing: 'border-box',
        borderRadius: 5,
        overflow: 'hidden',
        position: 'relative', // for absolute positioning of elements within the container

    };

    useEffect(() => {
        const fetchCoinDetail = async () => {
            try {
                const response = await fetch(`https://cryptodashweb.azurewebsites.net/api/v1/crypto/details/${coinId}`);
                if (response.ok) {
                    const data = await response.json();
                    setCoinDetail(data);
                }
            } catch (error) {
                console.error('Error fetching coin detail:', error);
            }
        };
        fetchCoinDetail();
    }, [coinId]);

    const CenteredProgress = () => (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    if (!coinDetail) {
        return <CenteredProgress />;
    }

    const renderSentiment = (up, down) => (
        <>
            <Typography variant="body1" sx={{ color: '#4CAF50' }}>
                Sentiment Votes Up: {up}%
            </Typography>
            <Typography variant="body1" sx={{ color: '#F44336' }}>
                Sentiment Votes Down: {down}%
            </Typography>
        </>
    );

    const createMarkup = (htmlContent) => {
        return { __html: htmlContent };
    };

    const renderCategoryCards = (categories) => {
        return categories.map((category, index) => (
            <Card
                key={index}
                sx={{
                    backgroundColor: '#6277a8',
                    margin: '10px',
                    padding: '6px 10px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CardContent sx={{
                    "&:last-child": {
                        paddingBottom: '15px'
                    }
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#ffffff',
                            lineHeight: '1.3',
                            fontSize: '0.875rem',
                        }}
                    >
                        {category}
                    </Typography>
                </CardContent>
            </Card>
        ));
    };

    const marketData = JSON.parse(coinDetail.marketData);

    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

            <Container sx={{ marginTop: 2, color: '#ffffff', ...backgroundStyle }}>
                <Card sx={{ backgroundColor: 'rgba(26, 32, 53, 0.8)' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                            <CardMedia
                                component="img"
                                sx={{ width: '200px', padding: '10px', objectFit: 'contain' }}
                                image={coinDetail.image.large}
                                alt={`${coinDetail.name} logo`}
                            />
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                padding: '10px'
                            }}>
                                <Typography gutterBottom variant="h5" component="div"
                                            sx={{ color: "#33CAF0" }}>
                                    {coinDetail.name} ({coinDetail.symbol.toUpperCase()})
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#e0e6ed' }}
                                            dangerouslySetInnerHTML={createMarkup(coinDetail.description.en)}>
                                </Typography>
                            </Box>
                        </Box>
                        <CardActions>
                            {renderSentiment(coinDetail.sentimentVotesUpPercentage, coinDetail.sentimentVotesDownPercentage)}
                        </CardActions>
                    </CardContent>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                            Categories
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {renderCategoryCards(coinDetail.categories)}
                        </Box>
                        <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                            Developer Score:
                            <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                {coinDetail.developerScore}
                            </span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                            Community Score:
                            <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                {coinDetail.communityScore}
                            </span>
                        </Typography>
                    </CardContent>
                    <Paper elevation={4}
                           sx={{ backgroundColor: 'rgba(26, 32, 53, 0.8)', padding: 2, marginTop: 4 }}>
                        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                            Market Data
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Current Price */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                                    Current Price:
                                    <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                        ${marketData.current_price.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* Market Cap */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                                    Market Cap:
                                    <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                        ${marketData.market_cap.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* 24h High */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                                    24h High:
                                    <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                        ${marketData.high_24h.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* 24h Low */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                                    24h Low:
                                    <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                        ${marketData.low_24h.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* Trading Volume */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                                    Trading Volume:
                                    <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                        ${marketData.total_volume.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* Market Cap Rank */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{ color: '#e0e6ed' }}>
                                    Market Cap Rank:
                                    <span style={{ color: '#71FCFD', paddingLeft: '10px' }}>
                                        {marketData.market_cap_rank}
                                    </span>
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{ color: '#ffffff' }}>
                            Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {coinDetail.links.map((link, index) => (
                                <Button
                                    key={index}
                                    href={link.linkValue}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: '#e0e6ed', borderColor: '#e0e6ed' }}
                                    variant="outlined"
                                >
                                    {link.linkType.replace('_', ' ').toUpperCase()}
                                </Button>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </>
    );
}

export default CoinDetail;
