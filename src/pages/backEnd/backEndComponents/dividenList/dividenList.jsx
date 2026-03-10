import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import './dividenList.css';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { fetchdividend, selectAllDividends, updateDividend } from "../../Redux/dividendSlice";
import { fetchStocks, selectAllStocks } from "../../Redux/stockSlice";
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import Autocomplete from '@mui/material/Autocomplete';
import { fetchHoldings } from '../../Redux/holdingSlice.js';
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
        fontWeight: 'bold',
        fontSize: 16

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

const DividenList = () => {

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const stocks = useSelector(selectAllStocks);
    const dividenData = useSelector(selectAllDividends);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formData, setFormData] = useState({
        id: null,
        stock: '', // This will hold the stock ID
        stockName: '', // For display only
        date: '',
        net_amount: 0,
        tax: 0,
        total_amount: 0,
        credit_date: '',
        amount_per_share: 0,
        quantity: 0,
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const { items: holdingsRawData, loading, error } = useSelector((state) => state.holdings);

    const intlNumFormatNoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    });

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const handleOpen = (item) => {

        const stockName = item.stock_info?.name || 'N/A (Stock Not Found)';
        const stockId = item.stock_info?.id || '';

        let formattedDate = '';
        if (item.date) {
            try {
                const dateObj = new Date(item.date);
                if (!isNaN(dateObj.getTime())) {
                    formattedDate = dateObj.toISOString().split('T')[0];
                } else {
                    formattedDate = item.date;
                }
            } catch (e) {
                formattedDate = item.date;
            }
        }

        let formattedCreditDate = '';
        if (item.credit_date) {
            try {
                const dateObj = new Date(item.credit_date);
                if (!isNaN(dateObj.getTime())) {
                    formattedCreditDate = dateObj.toISOString().split('T')[0];
                } else {
                    formattedCreditDate = item.credit_date;
                }
            } catch (e) {
                formattedCreditDate = item.credit_date;
            }
        }

        setFormData({
            id: item.id, // Store the dividend's ID
            stock: stockId, // Store the related stock's ID
            stockName: stockName,
            date: formattedDate,
            net_amount: item.net_amount,
            tax: item.tax,
            total_amount: item.total_amount,
            amount_percent: item.amount_percent,
            credit_date: formattedCreditDate,
            amount_per_share: item.amount_per_share,
            quantity: item.quantity,
        });

        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === 'total_amount' || name === 'tax' || name === 'amount_per_share' || name === 'quantity') {
            const amountPerShare = parseFloat(newFormData.amount_per_share) || 0;
            const quantity = parseFloat(newFormData.quantity) || 0;
            const taxAmount = parseFloat(newFormData.tax) || 0;
            const totalAmount = parseFloat(newFormData.total_amount) || amountPerShare * quantity;

            newFormData.total_amount = amountPerShare * quantity;
            const netAmount = totalAmount - taxAmount;
            newFormData.net_amount = (Math.trunc(netAmount * 100) / 100).toFixed(2)

        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payloadForThunk = {
            id: formData.id, 
            updatedData: { 
                stock: formData.stock, 
                date: formData.date,
                credit_date: formData.credit_date,
                amount_percent: parseFloat(formData.amount_percent),
                total_amount: parseFloat(formData.total_amount),
                tax: parseFloat(formData.tax),
                net_amount: parseFloat(formData.net_amount),
                amount_per_share: parseFloat(formData.amount_per_share),
                quantity: parseFloat(formData.quantity),
            }
        };


        try {
            await dispatch(updateDividend(payloadForThunk)).unwrap();
            
            setSnackbarMessage('Dividend updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            dispatch(fetchdividend()); // Refresh the list
        } catch (error) {
            
            setSnackbarMessage(`Something went wrong`);
            // setSnackbarMessage(`Failed to update dividend: ${error.message || JSON.stringify(error.data || error.response?.data || error)}`);
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    useEffect(() => {
        dispatch(fetchdividend());
    }, [dispatch]);

    useEffect(() => {
        const fetchData = async () => {
            if (stocks.length === 0) {
                try {
                    await dispatch(fetchStocks()).unwrap();
                } catch (error) {
                    
                }
            }
            if (!holdingsRawData?.length) {
                await dispatch(fetchHoldings()).unwrap();
            }
        };
        fetchData();
    }, [dispatch, stocks.length]);

    const filteredDividends = dividenData.filter(item =>
        item.stock_info?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedDividends = filteredDividends.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    return (

        <motion.div className="dividen_crud"
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>
            <div className="dividen_crud_main">
                <div className="listBTN">
                    {/* <button className='dividend_backBtn' onClick={() => navigate(-1)}>
                        Back
                    </button> */}
                    <div className="top_btn">
                        <button className="top_btn_buy" type="button" onClick={() => navigate('/dividend/add')}><AddIcon/>Add </button>
                    </div>
                </div>

                <div className="ex_charges_search_div">
                    <TextField
                        placeholder="Search..."
                        label='Search Stock'
                        className="searchInput"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0); // reset to first page when searching
                        }} />
                    <div className="ex_charges_search_icon">
                        <span> Search</span>
                        <SearchIcon sx={{ fontSize: '32px', color: '#fff' }} />
                    </div>
                </div>
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="dividend table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Stock</StyledTableCell>
                                    <StyledTableCell>Announce</StyledTableCell>
                                    <StyledTableCell>Credit Date</StyledTableCell>
                                    <StyledTableCell>Percent (%)</StyledTableCell>
                                    <StyledTableCell>Rs. Per Share</StyledTableCell>
                                    <StyledTableCell>Quantity</StyledTableCell>
                                    <StyledTableCell>Total</StyledTableCell>
                                    <StyledTableCell>Tax (Rs.)</StyledTableCell>
                                    <StyledTableCell>Net Amount</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedDividends.map((item) => {
                                    const stockName = item.stock_info?.symbol || "N/A";
                                    return (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell>{stockName}</StyledTableCell>
                                            <StyledTableCell>{formatDate(item.date)}</StyledTableCell>
                                            <StyledTableCell>{formatDate(item.credit_date)}</StyledTableCell>
                                            <StyledTableCell>{item.amount_percent === 0.00 || item.amount_percent ? `${intlNumFormatTwoDecimal.format(item.amount_percent)}%` : ''}</StyledTableCell>
                                            <StyledTableCell>{intlNumFormatTwoDecimal.format(item.amount_per_share)}</StyledTableCell>
                                            <StyledTableCell>{item.quantity}</StyledTableCell>
                                            <StyledTableCell>{intlNumFormatTwoDecimal.format(item.total_amount)}</StyledTableCell>
                                            <StyledTableCell>{intlNumFormatTwoDecimal.format(item.tax)}</StyledTableCell>
                                            <StyledTableCell>{intlNumFormatTwoDecimal.format(item.net_amount)}</StyledTableCell>
                                            <StyledTableCell>
                                                <button className="editebtn" type="button" onClick={() => handleOpen(item)}>
                                                    Edit
                                                </button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}

                                {dividenData.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={10} align="center" style={{ padding: "20px" }}>
                                            No dividend data available.
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <TablePagination
                    component="div"
                    count={dividenData.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography variant="h6">Edit Dividend Details</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Autocomplete
                                        options={stocks}
                                        getOptionLabel={(option) => option.symbol || ''}
                                        value={stocks.find(s => s.id === formData.stock) || null}
                                        onChange={(event, newValue) => {
                                            const stockId = newValue?.id ?? "";

                                            const holding = holdingsRawData?.find(
                                                h => Number(h.stock?.id || h.stock_id || h.stock) === Number(stockId)
                                            );

                                            setFormData(prev => ({
                                                ...prev,
                                                stock: stockId,
                                                stockName: newValue?.symbol || "",
                                                quantity: holding?.holding_quantity ?? 0 
                                            }));
                                        }}
                                        renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Stock"
                                            required
                                        />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Announce Date" name="date" type="date" value={formData.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Credit Date" name="credit_date" type="date" value={formData.credit_date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Percent (%)" name="amount_percent" type="number" value={Number(formData.amount_percent)} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Rs. Per Share" name="amount_per_share" type="number" value={Number(formData.amount_per_share).toFixed(2)} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Quantity" name="quantity" type="number" value={Number(formData.quantity)} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Total Amount" name="total_amount" type="number" value={Number(formData.total_amount).toFixed(2)} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Tax (Rs.)" name="tax" type="number" value={formData.tax} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Net Amount" name="net_amount" type="number" value={Number(formData.net_amount).toFixed(2)} InputProps={{ readOnly: true }} />
                                </Grid>
                            </Grid>
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button type="submit" variant="contained" color="primary">Update</Button>
                                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
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
            </div>
        </motion.div>
    );
};

export default DividenList;