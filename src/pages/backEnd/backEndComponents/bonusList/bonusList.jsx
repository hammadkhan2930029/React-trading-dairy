import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import './bonusList.css';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { fetchbonus, selectAllbonuss, updatebonus } from "../../Redux/bonusSlice";
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

const BonusList = () => {

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
    const bonusata = useSelector(selectAllbonuss);
    const [searchTerm, setSearchTerm] = useState('');
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [formData, setFormData] = useState({
        id: null,
        stock: '',
        stockName: '', 
        date: '',
        credit_date: '',
        net_shares: 0,
        tax: 0,
        holding_shares: '',
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
            id: item.id, 
            stock: stockId, 
            stockName: stockName,
            date: formattedDate,
            credit_date: formattedCreditDate,
            percent: item.percent,
            tax: item.tax,
            holding_shares: item.holding_shares,
            net_shares: item.net_shares,
            new_shares: item.new_shares,
        });

        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        const shares = parseFloat(newFormData.holding_shares) || 0;
        const bonusPercent = parseFloat(newFormData.percent) || 0;
        const taxPercent = parseFloat(newFormData.tax) || 0;

        const newShares = (shares * bonusPercent) / 100;

        const taxAmount = (newShares * taxPercent) / 100;

        const netShares = newShares - taxAmount;

        // Round to 2 decimals
        newFormData.new_shares = Number(newShares.toFixed(2));
        newFormData.net_shares = Number(netShares.toFixed(2));

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
                holding_shares: parseFloat(formData.holding_shares),
                percent: parseFloat(formData.percent),
                tax: parseFloat(formData.tax),
                net_shares: parseFloat(formData.net_shares),
                new_shares: parseFloat(formData.new_shares),
            }
        };

        try {
            await dispatch(updatebonus(payloadForThunk)).unwrap();
            
            setSnackbarMessage('Bonus updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            dispatch(fetchbonus());
        } catch (error) {
            
            // setSnackbarMessage(`Something went wrong`);
            setSnackbarMessage(`Failed to update bonus: ${error.message || JSON.stringify(error.data || error.response?.data || error)}`);
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
        dispatch(fetchbonus());
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

    const filteredbonuss = bonusata.filter(item =>
        item.stock_info?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedbonuss = filteredbonuss.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
                    {/* <button className='bonus_backBtn' onClick={() => navigate(-1)}>
                        Back
                    </button> */}
                    <div className="top_btn">
                        <button className="top_btn_buy" type="button" onClick={() => navigate('/bonus/add')}><AddIcon/>Add </button>
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
                            setPage(0); 
                        }} />
                    <div className="ex_charges_search_icon">
                        <span> Search</span>
                        <SearchIcon sx={{ fontSize: '32px', color: '#fff' }} />
                    </div>
                </div>
                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="bonus table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Stock</StyledTableCell>
                                    <StyledTableCell>Announce</StyledTableCell>
                                    <StyledTableCell>Credit Date</StyledTableCell>
                                    <StyledTableCell>Holding Shares</StyledTableCell>
                                    <StyledTableCell>Bonus (%)</StyledTableCell>
                                    <StyledTableCell>New Shares</StyledTableCell>
                                    <StyledTableCell>Tax (%)</StyledTableCell>
                                    <StyledTableCell>Net Shares</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedbonuss.map((item) => {
                                    const stockName = item.stock_info?.symbol || "N/A";
                                    return (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell>{stockName}</StyledTableCell>
                                            <StyledTableCell>{formatDate(item.date)}</StyledTableCell>
                                            <StyledTableCell>{formatDate(item.credit_date)}</StyledTableCell>
                                            <StyledTableCell>{item.holding_shares}</StyledTableCell>
                                            <StyledTableCell>{item.percent === 0.00 || item.percent ? `${item.percent}%` : ''}</StyledTableCell>
                                            <StyledTableCell>{item.new_shares}</StyledTableCell>
                                            <StyledTableCell>{item.tax === 0.00 || item.tax ? `${item.tax}%` : ''}</StyledTableCell>
                                            <StyledTableCell>{item.net_shares}</StyledTableCell>
                                            <StyledTableCell>
                                                <button className="editebtn" type="button" onClick={() => handleOpen(item)}>
                                                    Edit
                                                </button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}

                                {bonusata.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={9} align="center" style={{ padding: "20px" }}>
                                            No data available.
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                <TablePagination
                    component="div"
                    count={bonusata.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography variant="h6">Edit Bonus Details</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
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
                                                holding_shares: holding?.holding_quantity ?? 0 
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
                                    <TextField fullWidth label="Anncoune Date" name="date" type="date" value={formData.date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Credit Date" name="credit_date" type="date" value={formData.credit_date} onChange={handleChange} required InputLabelProps={{ shrink: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Holding Shares" name="holding_shares" type="number" value={formData.holding_shares} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Bonus (%)" name="percent" type="number" value={Number(formData.percent)} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="New Shares" name="new_shares" type="number" value={formData.new_shares} onChange={handleChange} required InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Tax (%)" name="tax" type="number" value={formData.tax} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Net Shares"
                                        name="net_shares"
                                        type="number"
                                        value={Number(formData.net_shares)}
                                        InputProps={{ readOnly: true }}
                                    />
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

export default BonusList;