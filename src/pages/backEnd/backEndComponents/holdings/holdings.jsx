
import React, { useState, useEffect } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './holdings.css';
import { motion, useInView } from "framer-motion";
import { Box, Typography, TablePagination, CircularProgress, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHoldings, addToJournal } from '../../Redux/holdingSlice.js';
import Snackbar from '@mui/material/Snackbar';
import { fetchTradingJournal } from '../../Redux/tradingJournalSlice.js';
import { useNavigate } from 'react-router-dom';
import withSkeleton from "../../../component/Skeletons/withSkeleton.jsx";
// =========================================================
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: 'bold'

    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd) td, &:nth-of-type(odd) th': {
    backgroundColor: '#F1F5F9',
  },
  // last border remove etc
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


// ==============================================================
export const Holdings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: holdingsRawData, loading, error } = useSelector((state) => state.holdings);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [holdingsData, setHoldingsData] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        dispatch(fetchHoldings());
    }, [dispatch]);

    useEffect(() => {
        if (loading === 'succeeded' && holdingsRawData?.length > 0) {
            const processed = holdingsRawData.map((holding) => ({
                ...holding,
                scrip: holding.stock?.symbol,
                quantity: holding.holding_quantity,
                avg_buying: holding.weighted_avg_buying,
                total_investment: holding.total_investment,
                current_price: holding.current,
                changeinrs: holding.changeinrs,
                changeinpercent: holding.changeinpercent,
                unrealizedpl: holding.unrealized_pl,
            }));
            setHoldingsData(processed);
        } else if (loading === 'succeeded') {
            setHoldingsData([]);
        }
    }, [holdingsRawData, loading]);

    const handleChangePage = (e, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (e) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    const handleAddToJournal = async (id) => {
        try {
            await dispatch(addToJournal(id)).unwrap();
            await dispatch(fetchTradingJournal());
            setSnackbarMessage("Added to Journal successfully!");
        } catch {
            setSnackbarMessage("Error adding to journal.");
        } finally {
            setSnackbarOpen(true);
        }
    };

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    return (
        <motion.div
            className='holdings_container'
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
        >
            <button className='backBtn' onClick={() => navigate(-1)}>Back</button>

            <div className='holdings_header'>
                <ShowChartIcon className='holdings_chart_icon' />
                <span className='holdings_title'>Holdings Details</span>
            </div>

            {loading === 'pending' && (
                <Box className="loadingBox">
                    <CircularProgress />
                    <Typography ml={2}>Loading Holdings...</Typography>
                </Box>
            )}

            {loading === 'failed' && error && (
                <Alert severity="error" className="errorAlert">
                    Error fetching data: {typeof error === 'string' ? error : JSON.stringify(error)}
                </Alert>
            )}

            {loading === 'succeeded' && holdingsData.length === 0 && (
                <Box className="emptyBox">
                    <Typography variant="h6" color="textSecondary">
                        No holdings found for your account. Start by making some BUY trades!
                    </Typography>
                </Box>
            )}

            {loading === 'succeeded' && holdingsData.length > 0 && (
                <div className="holdings_table_wrapper">
                    <div className="scrollable_table">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Scrip</StyledTableCell>
                                        <StyledTableCell align="center">Quantity</StyledTableCell>
                                        <StyledTableCell align="center">Avg buying</StyledTableCell>
                                        <StyledTableCell align="center">Total invest</StyledTableCell>
                                        <StyledTableCell align="center">Current price</StyledTableCell>
                                        <StyledTableCell align="center">Change in Rs.</StyledTableCell>
                                        <StyledTableCell align="center">Change in %</StyledTableCell>
                                        <StyledTableCell align="center">Unrealized P/L</StyledTableCell>
                                        <StyledTableCell align="center">Add to journal</StyledTableCell>

                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {holdingsData
                                        .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                        .map((item) => (
                                            <StyledTableRow key={item.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {item.scrip}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{item.quantity}</StyledTableCell>
                                                <StyledTableCell align="center">{item.avg_buying}</StyledTableCell>
                                                <StyledTableCell align="center">{item.total_investment}</StyledTableCell>
                                                <StyledTableCell align="center">{item.current_price}</StyledTableCell>
                                                <StyledTableCell align="center">{item.changeinrs}</StyledTableCell>
                                                <StyledTableCell align="center">{item.changeinpercent}%</StyledTableCell>
                                                <StyledTableCell align="center">{item.unrealizedpl}</StyledTableCell>
                                                <StyledTableCell align="center"> <input
                                                    type="checkbox"
                                                    checked={item.in_journal}
                                                    disabled={item.in_journal}
                                                    onChange={() => handleAddToJournal(item.id)}
                                                /></StyledTableCell>
                                            </StyledTableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>


                    </div>

                    <div className='pagination'>
                        <TablePagination
                            component="div"
                            count={holdingsData.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 25]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </div>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
            />
        </motion.div>
    );
};

export default withSkeleton(Holdings, 'holding');

