// Cryptocurrencies.js
import React, {useState, useEffect} from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    TablePagination,
    Container,
    CircularProgress
} from '@mui/material';
import {useNavigate} from "react-router-dom";
import CustomAppBar from "./CryptoAppBar";
import {useAuth} from "../AuthContext";


function Cryptocurrencies() {
    const navigate = useNavigate();
    const [cryptos, setCryptos] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0); // Для управления общим количеством строк
    const { isAuthenticated, handleLogout } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/crypto/all?page=${page}&size=${rowsPerPage}&sortBy=id`);
                if (response.ok) {
                    const data = await response.json();
                    setCryptos(data.content);
                    setTotalRows(data.totalElements);
                    setTotalPages(data.totalPages);
                }
            } catch (error) {
                console.error('Error fetching cryptocurrencies:', error);
            }
        };

        fetchData();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const darkBlueTheme = {
        primary: '#ffffff', // White for headers, ensures good readability
        secondary: '#e0e6ed', // A lighter shade for subheaders and other texts
        text: '#ffffff', // White for main text to stand out
        tableBackground: '#1e2740', // An even darker shade for the table background
        buttonBackground: '#6277a8', // Button background
        appBarBackground: '#0B1629', // Very dark blue, as in the AppBar
        containerBackground: 'rgba(26, 32, 53, 0.8)', // Semi-transparent background for containers
        textShadow: '0px 0px 8px rgba(0, 0, 0, 0.7)', // Text shadow for better legibility
    };
    if (!cryptos) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh' // This will take the full height of the viewport
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>

            <Container maxWidth="xl">
                <Box sx={{my: 4}}>
                    <Typography variant="h4" gutterBottom align={'center'}>
                        Cryptocurrencies
                    </Typography>
                    <TableContainer component={Paper}
                                    sx={{mb: 4, mt: 2, bgcolor: darkBlueTheme.tableBackground, borderRadius: 5}}>
                        <Table aria-label="cryptocurrency table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{color: 'white'}}>Logo</TableCell>
                                    <TableCell sx={{color: 'white'}}>Name (Symbol)</TableCell>
                                    <TableCell align="right" sx={{color: 'white'}}>Price</TableCell>
                                    <TableCell align="right" sx={{color: 'white'}}>Market Cap</TableCell>
                                    <TableCell align="right" sx={{color: 'white'}}>24h High</TableCell>
                                    <TableCell align="right" sx={{color: 'white'}}>24h Low</TableCell>
                                    <TableCell align="right" sx={{color: 'white'}}>24h Change</TableCell>
                                    <TableCell align="right" sx={{color: 'white'}}>Volume</TableCell>
                                    <TableCell align="right" sx={{color: 'white'}}>Market Cap Change 24h</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cryptos.map((crypto) => (
                                    <TableRow
                                        key={crypto.id}
                                        onClick={() => navigate(`/crypto/details/${crypto.id}`)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <TableCell>
                                            <img src={crypto.image} alt={crypto.name} style={{width: 30, height: 30}}/>
                                        </TableCell>
                                        <TableCell sx={{color: 'white'}}>{crypto.name} ({crypto.symbol})</TableCell>
                                        <TableCell align="right"
                                                   sx={{color: '#a8c0ff'}}>${crypto.current_price.toFixed(2)}</TableCell>
                                        <TableCell align="right"
                                                   sx={{color: '#a8c0ff'}}>${crypto.market_cap.toFixed(2)}</TableCell>
                                        <TableCell align="right"
                                                   sx={{color: '#a8c0ff'}}>${crypto.high_24h.toFixed(2)}</TableCell>
                                        <TableCell align="right"
                                                   sx={{color: '#a8c0ff'}}>${crypto.low_24h.toFixed(2)}</TableCell>
                                        <TableCell align="right"
                                                   sx={{color: '#a8c0ff'}}>${crypto.price_change_24h.toFixed(2)}</TableCell>
                                        <TableCell align="right"
                                                   sx={{color: '#a8c0ff'}}>${crypto.total_volume.toFixed(2)}</TableCell>
                                        <TableCell align="right"
                                                   sx={{color: '#a8c0ff'}}>${crypto.market_cap_change_24h.toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <TablePagination
                            component="div"
                            count={totalRows}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Rows per page:"
                            labelDisplayedRows={({from, to, count}) => `${from}-${to} of ${count}`}
                            rowsPerPageOptions={[10, 15, 20]}
                            nextIconButtonProps={{disabled: page >= totalPages - 1}}
                            backIconButtonProps={{disabled: page === 0}}
                            sx={{
                                bgcolor: "#1e2740", // Set the background color
                                color: darkBlueTheme.text, // Set the text color
                                borderRadius: 10, // Add some border radius
                            }}
                        />
                    </div>

                </Box>
            </Container>
        </>
    );
}

export default Cryptocurrencies;
