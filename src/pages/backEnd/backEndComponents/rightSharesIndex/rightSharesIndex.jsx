import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import './rightSharesIndex.css';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { fetchrightShare, selectAllrightShares, updaterightShare } from "../../Redux/rightShareSlice";
import { fetchStocks, selectAllStocks } from "../../Redux/stockSlice";
import SearchIcon from '@mui/icons-material/Search';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
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

const RightSharesIndex = () => {

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
    const rightShareData = useSelector(selectAllrightShares);
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
        cur_shares: 0,
        right_shares_percent: 0,
        right_shares: 0,
        right_shares_rate: 0,
        total_amount: 0,
        rs_status: '',
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
            cur_shares: item.cur_shares,
            right_shares_percent: item.right_shares_percent,
            right_shares: item.right_shares,
            right_shares_rate: item.right_share_rate,
            total_amount: item.total_amount,
            rs_status: item.rs_status,
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
                cur_shares: parseFloat(formData.cur_shares),
                right_shares_percent: parseFloat(formData.right_shares_percent),
                right_shares: parseFloat(formData.right_shares),
                right_shares_rate: parseFloat(formData.right_shares_rate),
                total_amount: parseFloat(formData.total_amount),
                rs_status: formData.rs_status,
            }
        };

        try {
            await dispatch(updaterightShare(payloadForThunk)).unwrap();
            
            setSnackbarMessage('Right Shares updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            dispatch(fetchrightShare()); 
        } catch (error) {
            
            setSnackbarMessage(`Something went wrong`);
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
        const percent = parseFloat(formData.right_shares_percent) || 0;
        const rate = parseFloat(formData.right_shares_rate) || 0;

        const rightShares = shares / 100 * percent;
        const total = rightShares * rate;

        setFormData(prev => ({
            ...prev,
            right_shares: rightShares,
            total_amount: total.toFixed(2),
        }));

    }, [
        formData.cur_shares,
        formData.right_shares_percent,
        formData.right_shares_rate,
    ]);


    useEffect(() => {
        dispatch(fetchrightShare());
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

    const filteredsplits = rightShareData.filter(item =>
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
                        <button className="top_btn_buy" type="button" onClick={() => navigate('/right-shares/add')}><AddIcon/>Add </button>
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
                                    <StyledTableCell>Cur. Shares</StyledTableCell>
                                    <StyledTableCell>Right Share %</StyledTableCell>
                                    <StyledTableCell>Right Shares</StyledTableCell>
                                    <StyledTableCell>Rate</StyledTableCell>
                                    <StyledTableCell>Total</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
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
                                            <StyledTableCell>{item.cur_shares}</StyledTableCell>
                                            <StyledTableCell>{item.right_shares_percent === 0 || item.right_shares_percent ? `${item.right_shares_percent}%` : ''}</StyledTableCell>
                                            <StyledTableCell>{item.right_shares}</StyledTableCell>
                                            <StyledTableCell>{intlNumFormatTwoDecimal.format(item.right_share_rate)}</StyledTableCell>
                                            <StyledTableCell>{intlNumFormatTwoDecimal.format(item.total_amount)}</StyledTableCell>
                                            <StyledTableCell>{item.rs_status}</StyledTableCell>
                                            <StyledTableCell>
                                                <button className="editebtn" type="button" onClick={() => handleOpen(item)}>
                                                    Edit
                                                </button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}

                                {rightShareData.length === 0 && (
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
                    count={rightShareData.length}
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
                                    <TextField fullWidth label="Right Shares (%)" name="right_shares_percent" type="number" value={formData.right_shares_percent} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Right Shares" name="right_shares" type="number" value={formData.right_shares} InputProps={{ readOnly: true }} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Rate" name="right_shares_rate" type="number" value={formData.right_shares_rate} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Total" name="total_amount" type="number" value={formData.total_amount} InputProps={{ readOnly: true }} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                            select
                                            id="rs-status"
                                            label="Status"
                                            name="rs_status"
                                            value={formData.rs_status}  
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            required
                                        >
                                            <MenuItem value={'Receive'}>Receive</MenuItem>
                                            <MenuItem value={'Buy'}>Buy</MenuItem>
                                            <MenuItem value={'Sell'}>Sell</MenuItem>
                                        </TextField>   
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

export default RightSharesIndex;