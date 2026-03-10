import React, { useState, useEffect } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './holdings.css';
import { motion, useInView } from "framer-motion";
import { Box, Typography, TablePagination, CircularProgress, Alert, TextField } from '@mui/material';
import { Button, Modal, Checkbox, FormControlLabel, List, ListItem, ListItemText } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchHoldings, addToJournal } from '../../Redux/holdingSlice.js';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { fetchTradingJournal } from '../../Redux/tradingJournalSlice.js';
import { useNavigate } from 'react-router-dom';
import withSkeleton from "../../../component/Skeletons/withSkeleton.jsx";
import { fetchRules, applyTradeRules} from '../../Redux/rulesSlice';   
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
    const rulesData = useSelector((state) => state.rules.rules);
    // Modal state
    const [showRulesModal, setShowRulesModal] = useState(false);
    const [holdingID, setholdingID] = useState(null);
    // Rules selection state
    const [selectedRules, setSelectedRules] = useState([]);
    
    const [searchTerm, setSearchTerm] = useState('');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [holdingsData, setHoldingsData] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        dispatch(fetchHoldings());
        dispatch(fetchRules());
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
            }))
            .sort((a, b) =>
                (a.scrip || '').localeCompare(b.scrip || '')
            );
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

            if(rulesData?.length > 0){
                // console.log(id);
                setholdingID(id);          // store trade ID
                setSelectedRules([]);            // reset rules selection
                setShowRulesModal(true);  
            }
            setSnackbarMessage("Added to Journal successfully!");
        } catch {
            setSnackbarMessage("Error adding to journal.");
        } finally {
            setSnackbarOpen(true);
        }
    };

    const submitSelectedRules = async () => {
        if (!holdingID) return;

        try {
            const payload = {
                rules_followed: selectedRules,
            };

            // const response = await fetch(`/api/trades/${holdingID}/apply-rules/`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(payload),
            // });
            const response = await dispatch(applyTradeRules({
                holdingId: holdingID,
                rules: selectedRules
            }));

            setSnackbarMessage("Rules saved successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setShowRulesModal(false);

        } catch (error) {
            setSnackbarMessage(error.message || "Failed to save rules");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    const intlNumFormatNoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    });

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const filteredHoldings = holdingsData.filter((item) => {
        const term = searchTerm.toLowerCase();

        return (
            item.scrip?.toLowerCase().includes(term)
        );
    });

    const paginatedHoldings = filteredHoldings.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
                <span className='holdings_title'>Holdings</span>
            </div>

            <div className="ex_charges_search_div">
                <TextField
                    placeholder="Search Scrip..."
                    label='Search Scrip'
                    className="searchInput"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(0); // reset to first page when searching
                    }} 
                />
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
                                    {paginatedHoldings.map((item) => (
                                            <StyledTableRow key={item.id}>
                                                <StyledTableCell component="th" scope="row">
                                                    {item.scrip}
                                                </StyledTableCell>
                                                <StyledTableCell align="center">{intlNumFormatNoDecimal.format(item.quantity)}</StyledTableCell>
                                                <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.avg_buying)}</StyledTableCell>
                                                <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.total_investment)}</StyledTableCell>
                                                <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.current_price)}</StyledTableCell>
                                                <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.changeinrs)}</StyledTableCell>
                                                <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.changeinpercent)}%</StyledTableCell>
                                                <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.unrealizedpl)}</StyledTableCell>
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
                            rowsPerPageOptions={[25, 50, 100]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>

                    <Modal open={showRulesModal} onClose={() => setShowRulesModal(false)}>
                        <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '70%',
                                bgcolor: 'background.paper',
                                border: '2px solid #000',
                                boxShadow: 24,
                                p: 4,
                            }}
                        >
                            <Typography variant="h6" gutterBottom>
                                Select Rules for this Trade
                            </Typography>

                            {rulesData?.length === 0 ? (
                                <Typography>No rules available.</Typography>
                            ) : (
                                <List sx={{ maxHeight: 300, overflowY: "auto" }}>
                                    {rulesData.map((rule) => (
                                        <ListItem key={rule.id} dense>
                                            <Checkbox
                                                checked={selectedRules.includes(rule.id)}
                                                onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedRules([...selectedRules, rule.id]);
                                                } else {
                                                    setSelectedRules(selectedRules.filter(id => id !== rule.id));
                                                }
                                                }}
                                            />
                                            <ListItemText primary={rule.rule_text} />
                                        </ListItem>
                                    ))}
                                </List>
                            )}

                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => setShowRulesModal(false)}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={submitSelectedRules}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Modal>
                </div>
            )}

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        backgroundColor: 'rgba(15, 134, 231, 0.94)',
                        color: '#fff',

                    }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </motion.div>
    );
};

export default withSkeleton(Holdings, 'holding');

