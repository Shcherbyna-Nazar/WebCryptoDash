import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
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
import {useAuth} from "../AuthContext";

function CoinDetail() {
    const {coinId} = useParams();
    const [coinDetail, setCoinDetail] = useState(null);
    const { isAuthenticated, handleLogout } = useAuth();



    const darkBlueTheme = {
        primary: '#ffffff', // White for headers, ensures good readability
        secondary: '#e0e6ed', // A lighter shade for subheaders and other texts
        text: '#ffffff', // White for main text to stand out
        tableBackground: '#1e2740', // An even darker shade for the table background
        buttonBackground: '#6277a8', // Button background
        appBarBackground: '#0B1629', // Very dark blue, as in the AppBar
        containerBackground: 'rgba(26, 32, 53, 0.8)', // Semi-transparent background for containers
        textShadow: '0px 0px 8px rgba(0, 0, 0, 0.7)', // Text shadow for better legibility
        positiveSentiment: '#4CAF50',
        negativeSentiment: '#F44336',
        textColor: '#71FCFD'

    };

    useEffect(() => {
        const fetchCoinDetail = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/crypto/details/${coinId}`);
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
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
            <CircularProgress/>
        </Box>
    );
    if (!coinDetail) {
        return <CenteredProgress/>;
    }


    const renderSentiment = (up, down) => (
        <>
            <Typography variant="body1" sx={{color: darkBlueTheme.positiveSentiment}}>
                Sentiment Votes Up: {up}%
            </Typography>
            <Typography variant="body1" sx={{color: darkBlueTheme.negativeSentiment}}>
                Sentiment Votes Down: {down}%
            </Typography>
        </>
    );
    const createMarkup = (htmlContent) => {
        return {__html: htmlContent};
    };

    const renderCategoryCards = (categories) => {
        return categories.map((category, index) => (
            <Card
                key={index}
                sx={{
                    backgroundColor: '#6277a8',
                    margin: '10px',
                    padding: '6px 10px', // Reduced vertical padding
                    height: '40px', // for fixed height
                    //minHeight: '40px', // for minimum height
                    display: 'flex', // Ensures content is centered if card is larger than content
                    alignItems: 'center', // Vertical alignment if card is larger than content
                    justifyContent: 'center', // Horizontal alignment if card is larger than content
                }}
            >
                <CardContent sx={{
                    "&:last-child": {
                        paddingBottom: '15px' // Removes additional padding applied by MUI CardContent
                    }
                }}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#ffffff',
                            // Remove if you've set a fixed height for the card
                            lineHeight: '1.3', // Reduces the line height to fit smaller card height
                            fontSize: '0.875rem', // Smaller font size if needed
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
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>

            <Container sx={{marginTop: 2, color: darkBlueTheme.primary}}>
                <Card sx={{backgroundColor: darkBlueTheme.containerBackground}}>
                    <CardContent>
                        <Box sx={{display: 'flex', flexDirection: {xs: 'column', md: 'row'}}}>
                            <CardMedia
                                component="img"
                                sx={{width: '200px', padding: '10px', objectFit: 'contain'}}
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
                                            sx={{color: "#33CAF0"}}>
                                    {coinDetail.name} ({coinDetail.symbol.toUpperCase()})
                                </Typography>
                                <Typography variant="body2" sx={{color: darkBlueTheme.secondary}}
                                            dangerouslySetInnerHTML={createMarkup(coinDetail.description.en)}>
                                    {/* This will render the description HTML content directly */}
                                </Typography>
                            </Box>
                        </Box>
                        <CardActions>
                            {renderSentiment(coinDetail.sentimentVotesUpPercentage, coinDetail.sentimentVotesDownPercentage)}
                        </CardActions>
                    </CardContent>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{color: darkBlueTheme.primary}}>
                            Categories
                        </Typography>
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            {renderCategoryCards(coinDetail.categories)}
                        </Box>
                        <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                            Developer Score:
                            <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>
                            {coinDetail.developerScore}
                            </span>
                        </Typography>
                        <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                            Community Score:
                            <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>
                            {coinDetail.communityScore}
                            </span>
                        </Typography>
                    </CardContent>
                    <Paper elevation={4}
                           sx={{backgroundColor: darkBlueTheme.containerBackground, padding: 2, marginTop: 4}}>
                        <Typography variant="h6" gutterBottom sx={{color: darkBlueTheme.primary}}>
                            Market Data
                        </Typography>
                        <Grid container spacing={2}>
                            {/* Current Price */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                                    Current Price:
                                    <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>
                                    ${marketData.current_price.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* Market Cap */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                                    Market Cap:
                                    <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>
                                    ${marketData.market_cap.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* 24h High */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                                    24h High:
                                    <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>
                                    ${marketData.high_24h.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* 24h Low */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                                    24h Low:
                                    <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>
                                    ${marketData.low_24h.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* Trading Volume */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                                    Trading Volume:
                                    <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>
                                    ${marketData.total_volume.usd.toLocaleString()}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* Market Cap Rank */}
                            <Grid item xs={12} md={4}>
                                <Typography variant="body1" sx={{color: darkBlueTheme.secondary}}>
                                    Market Cap Rank:
                                    <span style={{color: darkBlueTheme.textColor, paddingLeft: '10px'}}>

                                    {marketData.market_cap_rank}
                                    </span>
                                </Typography>
                            </Grid>
                            {/* Add more Grid items for other data as needed */}
                        </Grid>
                    </Paper>
                    <CardContent>
                        <Typography variant="h6" gutterBottom sx={{color: darkBlueTheme.primary}}>
                            Links
                        </Typography>
                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                            {coinDetail.links.map((link, index) => (
                                <Button
                                    key={index}
                                    href={link.linkValue}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{color: darkBlueTheme.secondary, borderColor: darkBlueTheme.secondary}}
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
