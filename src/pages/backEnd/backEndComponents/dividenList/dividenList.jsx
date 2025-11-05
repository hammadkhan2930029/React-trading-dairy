import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import './dividenList.css';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { setDividen } from "../../Redux/profileSlice";
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { fetchdividend, selectAllDividends, updateDividend } from "../../Redux/dividendSlice";
import { fetchStocks, selectAllStocks } from "../../Redux/stockSlice";
import SearchIcon from '@mui/icons-material/Search';
import { setDashboardView } from '../../Redux/formTypeSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
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
        width: 400,
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
        total_amount: 0
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleOpen = (item) => {
        console.log('Item to edit (dividend):', item);

        const stockName = item.stock_info?.name || 'N/A (Stock Not Found)';
        const stockId = item.stock_info?.id || '';

        console.log('Resolved Stock Name for edit:', stockName);
        console.log('Resolved Stock ID for edit:', stockId);

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
                console.error("Error parsing date for modal:", item.date, e);
                formattedDate = item.date;
            }
        }

        setFormData({
            id: item.id, // Store the dividend's ID
            stock: stockId, // Store the related stock's ID
            stockName: stockName,
            date: formattedDate,
            net_amount: item.net_amount,
            tax: item.tax,
            total_amount: item.total_amount
        });

        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        if (name === 'total_amount' || name === 'tax') {
            const totalAmount = parseFloat(newFormData.total_amount) || 0;
            const taxAmount = parseFloat(newFormData.tax) || 0;
            const netAmount = totalAmount - taxAmount;
            newFormData.net_amount = (Math.trunc(netAmount * 100) / 100).toFixed(2)

        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // THIS IS THE CRITICAL CHANGE:
        // Create the payload exactly as the thunk expects it:
        // an object with 'id' and 'updatedData' properties.
        const payloadForThunk = {
            id: formData.id, // The ID of the dividend being updated
            updatedData: { // This object contains the actual data to send to the backend
                stock: formData.stock, // Ensure this is the stock ID
                date: formData.date,
                total_amount: parseFloat(formData.total_amount),
                tax: parseFloat(formData.tax),
                net_amount: parseFloat(formData.net_amount),
            }
        };

        console.log("Dispatching update with payload:", payloadForThunk);

        try {
            await dispatch(updateDividend(payloadForThunk)).unwrap();
            //alert("Dividend updated successfully!");
            setSnackbarMessage('Dividend updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            dispatch(fetchdividend()); // Refresh the list
        } catch (error) {
            console.error("Failed to update dividend:", error);
            //alert(`Failed to update dividend: ${error.message || JSON.stringify(error.data || error.response?.data || error)}`);
            setSnackbarMessage(`Failed to update dividend: ${error.message || JSON.stringify(error.data || error.response?.data || error)}`);
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
                    console.error("Failed to fetch stocks:", error);
                }
            }
        };
        fetchData();
    }, [dispatch, stocks.length]);

    const filteredDividends = dividenData.filter(item =>
        item.stock_info?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedDividends = filteredDividends.slice(page * rowsPerPage, (page + 1) * rowsPerPage);


    return (
        <motion.div className="dividen_crud"
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>
            <div className="dividen_crud_main">
                <div className="listBTN">
                    <button className='dividend_backBtn' onClick={() => navigate(-1)}>
                        Back
                    </button>
                    <div className="top_btn">
                        <button className="top_btn_buy" type="button" onClick={() => navigate('/Dividend')}><AddIcon/>Add </button>
                    </div>
                </div>

                <div className="ex_charges_search_div">
                    <TextField
                        placeholder="Search..."
                        label='Search Stock Name'
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
                                    <StyledTableCell>Stock Name</StyledTableCell>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Total Amount</StyledTableCell>
                                    <StyledTableCell>Tax</StyledTableCell>
                                    <StyledTableCell>Net Amount</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedDividends.map((item) => {
                                    const stockName = item.stock_info?.name || "N/A";
                                    return (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell>{stockName}</StyledTableCell>
                                            <StyledTableCell>{item.date}</StyledTableCell>
                                            <StyledTableCell>{Number(item.total_amount).toFixed(2)}</StyledTableCell>
                                            <StyledTableCell>{Number(item.tax).toFixed(2)}</StyledTableCell>
                                            <StyledTableCell>{Number(item.net_amount).toFixed(2)}</StyledTableCell>
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
                                        <StyledTableCell colSpan={6} align="center" style={{ padding: "20px" }}>
                                            No dividend data available.
                                        </StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>

                {/* <table className="dividend_index_table">
                    <thead className='t_head'>
                        <tr className='t_head_row'>
                            <th>Stock Name</th>
                            <th>Date</th>
                            <th>Total Amount</th>
                            <th>Tax</th>
                            <th>Net Amount</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='t_body'>
                        {paginatedDividends.map((item) => {
                            const stockName = item.stock_info?.name || 'N/A';
                            return (
                                <tr key={item.id} className='t_body_row'>
                                    <td>{stockName}</td>
                                    <td>{item.date}</td>
                                    <td>{Number(item.total_amount).toFixed(2)}</td>
                                    <td>{Number(item.tax).toFixed(2)}</td>
                                    <td>{Number(item.net_amount).toFixed(2)}</td>
                                    <td>
                                        <button className="editebtn" type="button" onClick={() => handleOpen(item)}> <EditIcon style={{ fontSize: '15px' }} /> Edit</button>
                                    </td>
                                </tr>
                            );
                        })}
                        {dividenData.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No dividend data available.</td>
                            </tr>
                        )}
                    </tbody>
                </table> */}

                <TablePagination
                    component="div"
                    count={dividenData.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 20]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography variant="h6">Edit Dividend Details</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField fullWidth label="Stock Name" name="stockName" value={formData.stockName} InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Date"
                                        name="date"
                                        type="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Total Amount" name="total_amount" type="number" value={Number(formData.total_amount).toFixed(2)} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField fullWidth label="Tax" name="tax" type="number" value={formData.tax} onChange={handleChange} required />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Net Amount"
                                        name="net_amount"
                                        type="number"
                                        value={Number(formData.net_amount).toFixed(2)}
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
                    anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
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