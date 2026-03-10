import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import './splitIndex.css';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { fetchsplit, selectAllsplits, updatesplit } from "../../Redux/splitSlice";
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
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

// ==============================================================

const SplitIndex = () => {

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
    const splitata = useSelector(selectAllsplits);
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
        ratio_from: 0,
        ratio_to: 0,
        cur_shares: 0,
        cur_rate: 0,
        total_investment: 0,
        new_shares: 0,
        new_rate: 0,
        tax: 0,
        net_shares: 0,
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
            ratio_from: item.ratio_from,
            ratio_to: item.ratio_to,
            cur_shares: item.cur_shares,
            cur_rate: item.cur_rate,
            total_investment: item.total_investment,
            new_shares: item.new_shares,
            new_rate: item.new_rate,
            tax: item.tax,
            net_shares: item.net_shares,
        });

        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payloadForThunk = {
            id: formData.id,
            updatedData: { 
                stock: formData.stock, 
                date: formData.date,
                credit_date: formData.credit_date,
                ratio_from: parseFloat(formData.ratio_from),
                ratio_to: parseFloat(formData.ratio_to),
                cur_shares: parseFloat(formData.cur_shares),
                cur_rate: parseFloat(formData.cur_rate),
                total_investment: parseFloat(formData.total_investment),
                new_shares: parseFloat(formData.new_shares),
                new_rate: parseFloat(formData.new_rate),
                tax: parseFloat(formData.tax),
                net_shares: parseFloat(formData.net_shares),
            }
        };

        try {
            await dispatch(updatesplit(payloadForThunk)).unwrap();
            
            setSnackbarMessage('Split updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            dispatch(fetchsplit()); 
        } catch (error) {
            
            setSnackbarMessage(`Something went wrong`);
            console.log("UPDATE ERROR:", error);
            // setSnackbarMessage(`Failed to update split: ${error.message || JSON.stringify(error.data || error.response?.data || error)}`);
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
        const shares = parseFloat(formData.cur_shares) || 0;
        const investment = parseFloat(formData.total_investment) || 0;
        const from = parseFloat(formData.ratio_from) || 0;
        const to = parseFloat(formData.ratio_to) || 0;
        const tax = parseFloat(formData.tax) || 0;

        if (!shares || !investment) return;

        const curRate = investment / shares;

        const newShares = from ? (shares * to) / from : 0;

        const newRate = newShares ? investment / newShares : 0;

        const netShares = newShares - (newShares * tax) / 100;

        setFormData(prev => ({
            ...prev,
            cur_rate: curRate.toFixed(2),
            new_shares: newShares.toFixed(2),
            new_rate: newRate.toFixed(2),
            net_shares: netShares.toFixed(2)
        }));

    }, [
        formData.cur_shares,
        formData.total_investment,
        formData.ratio_from,
        formData.ratio_to,
        formData.tax
    ]);


    useEffect(() => {
        dispatch(fetchsplit());
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

    const filteredsplits = splitata.filter(item =>
        item.stock_info?.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedsplits = filteredsplits.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

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
                    {/* <button className='split_backBtn' onClick={() => navigate(-1)}>
                        Back
                    </button> */}
                    <div className="top_btn">
                        <button className="top_btn_buy" type="button" onClick={() => navigate('/split/add')}><AddIcon/>Add </button>
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
                        <Table sx={{ minWidth: 700 }} aria-label="split table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Stock</StyledTableCell>
                                    <StyledTableCell>Announce</StyledTableCell>
                                    <StyledTableCell>Credit Date</StyledTableCell>
                                    <StyledTableCell>Before</StyledTableCell>
                                    <StyledTableCell>Split Ratio</StyledTableCell>
                                    <StyledTableCell>After</StyledTableCell>
                                    <StyledTableCell>Tax</StyledTableCell>
                                    <StyledTableCell>Net Shares</StyledTableCell>
                                    <StyledTableCell>Investment</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedsplits.map((item) => {
                                    const stockName = item.stock_info?.symbol || "N/A";
                                    return (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell>{stockName}</StyledTableCell>
                                            <StyledTableCell>{formatDate(item.date)}</StyledTableCell>
                                            <StyledTableCell>{formatDate(item.credit_date)}</StyledTableCell>
                                            <StyledTableCell>
                                                <Typography variant="body2">
                                                    Qty: {item.cur_shares}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Rate: {item.cur_rate}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>{item.ratio_from}:{item.ratio_to}</StyledTableCell>
                                            <StyledTableCell>
                                                <Typography variant="body2">
                                                    Qty: {item.new_shares}
                                                </Typography>
                                                <Typography variant="body2">
                                                    Rate: {item.new_rate}
                                                </Typography>
                                            </StyledTableCell>
                                            <StyledTableCell>{item.tax === 0.00 || item.tax ? `${item.tax}%` : ''}</StyledTableCell>
                                            <StyledTableCell>{item.net_shares}</StyledTableCell>
                                            <StyledTableCell>{intlNumFormatTwoDecimal.format(item.total_investment)}</StyledTableCell>
                                            <StyledTableCell>
                                                <button className="editebtn" type="button" onClick={() => handleOpen(item)}>
                                                    Edit
                                                </button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}

                                {splitata.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={10} align="center" style={{ padding: "20px" }}>
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
                    count={splitata.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography variant="h6">Edit Split Details</Typography>
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
                                                cur_shares: holding?.holding_quantity ?? 0 
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
                                    <TextField fullWidth label="Current Shares" name="cur_shares" type="number" value={formData.cur_shares} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Investment" name="total_investment" type="number" value={formData.total_investment} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Current Rate" name="cur_rate" type="number" onChange={handleChange} value={Number(formData.cur_rate).toFixed(2)} InputProps={{ readOnly: true }} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Ratio From" name="ratio_from" type="number" value={formData.ratio_from} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Ratio To" name="ratio_to" type="number" value={formData.ratio_to} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="New Shares" name="new_shares" type="number" onChange={handleChange} value={Number(formData.new_shares)} InputProps={{ readOnly: true }} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="New Rate" name="new_rate" type="number" onChange={handleChange} value={Number(formData.new_rate).toFixed(2)} InputProps={{ readOnly: true }} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Tax (%)" name="tax" type="number" value={formData.tax} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Net Shares" name="net_shares" type="number" value={Number(formData.net_shares)} InputProps={{ readOnly: true }} />
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

export default SplitIndex;