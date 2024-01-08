import React, { useState, useEffect } from 'react';
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
import { useNavigate } from "react-router-dom";
import CustomAppBar from "./CryptoAppBar";
import { useAuth } from "../AuthContext";
import darkBackground from "../images/back_green.png"; // Import the green background image

function Cryptocurrencies() {
    const navigate = useNavigate();
    const [cryptos, setCryptos] = useState(null);
    const [isLoading, setIsLoading] = useState(true);  // Loading state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRows, setTotalRows] = useState(0);
    const { isAuthenticated, handleLogout } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);  // Start loading
                const response = await fetch(`https://cryptodashweb.azurewebsites.net/api/v1/crypto/all?page=${page}&size=${rowsPerPage}&sortBy=id`);
                if (response.ok) {
                    const data = await response.json();
                    setCryptos(data.content);
                    setTotalRows(data.totalElements);
                    setTotalPages(data.totalPages);
                }
                setIsLoading(false);  // Stop loading after data is fetched
            } catch (error) {
                console.error('Error fetching cryptocurrencies:', error);
                setIsLoading(false);  // Stop loading even if there's an error
            }
        };

        fetchData();
    }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Loading indicator centered in the page
    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <CustomAppBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />

            <Container maxWidth="xl" sx={{
                mt: 2,
                mb: 2,
                bgcolor: 'rgba(18, 32, 47, 0.9)', // Slightly transparent dark background
                borderRadius: 5,
                backgroundImage: `url(${darkBackground})`, // Green gradient background image
                backgroundSize: 'cover',
                backgroundPosition: 'center center',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
                overflow: 'hidden',
                padding: 3,
            }}>
                <Box sx={{ my: 4 }}>
                    <Typography variant="h4" gutterBottom align={'center'}>
                        Cryptocurrencies
                    </Typography>
                    <TableContainer component={Paper}
                                    sx={{ mb: 4, mt: 2, bgcolor: '#263238', borderRadius: 5 }}>
                        <Table aria-label="cryptocurrency table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ color: 'white' }}>Logo</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Name (Symbol)</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', textAlign: 'right' }}>Price</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', textAlign: 'right' }}>Market Cap</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', textAlign: 'right', whiteSpace: 'nowrap' }}>24h Change</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', textAlign: 'right' }}>24h High</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', textAlign: 'right' }}>24h Low</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', textAlign: 'right' }}>Volume</TableCell>
                                    <TableCell align="right" sx={{ color: 'white', textAlign: 'right' }}>Market Cap Change 24h</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {cryptos && cryptos.map((crypto) => (
                                    <TableRow
                                        key={crypto.id}
                                        onClick={() => navigate(`/crypto/details/${crypto.id}`)}
                                        sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#37474F' } }}>
                                        <TableCell>
                                            <img src={crypto.image} alt={crypto.name} style={{ width: 30, height: 30 }}/>
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>{crypto.name} ({crypto.symbol})</TableCell>
                                        <TableCell align="right" sx={{ color: '#a8c0ff' }}>
                                            ${crypto.current_price.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#a8c0ff' }}>
                                            ${crypto.market_cap.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: crypto.price_change_percentage_24h > 0 ? '#4caf50' : '#f44336' }}>
                                            {crypto.price_change_percentage_24h.toFixed(2)}%
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#a8c0ff' }}>
                                            ${crypto.high_24h.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#a8c0ff' }}>
                                            ${crypto.low_24h.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#a8c0ff' }}>
                                            ${crypto.total_volume.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="right" sx={{ color: '#a8c0ff' }}>
                                            ${crypto.market_cap_change_24h.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <TablePagination
                            component="div"
                            count={totalRows}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Rows per page:"
                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
                            rowsPerPageOptions={[10, 15, 20]}
                            nextIconButtonProps={{ disabled: page >= totalPages - 1 }}
                            backIconButtonProps={{ disabled: page === 0 }}
                            sx={{
                                bgcolor: '#263238',
                                color: 'white',
                                borderRadius: 10,
                            }}
                        />
                    </div>
                </Box>
            </Container>
        </>
    );
}

export default Cryptocurrencies;
