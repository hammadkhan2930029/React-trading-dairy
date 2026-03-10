// In ExtraChargesList.js

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import './extraChargesList.css';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { fetchChargesTypes, fetchExtraCharges, updateExtraCharge, deleteExtraCharges } from "../../Redux/extrachargesSlice";
import { fetchUserBrokers, selectAllUserBrokers } from "../../Redux/userBrokerSlice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as Yup from 'yup';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Swal from 'sweetalert2';
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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const validationSchema = Yup.object({
    transaction_date: Yup.string()
            .required("Date is required"),
    broker_id: Yup.number()
            .required('Please select a broker')
            .typeError('Please select a broker'),
    type_id: Yup.number()
            .required('Please select a type')
            .typeError('Please select a type'),
    charges: Yup.number()
        .typeError("Charges must be a number")
        .required("Charges is required")
        .positive("Charges must be greater than 0"),
});

const ExtraChargesList = () => {
    const navigate = useNavigate()
    const brokers = useSelector(selectAllUserBrokers);
    const chargesTypes = useSelector(state => state.extraCharges.chargesTypes);
    const { chargesList, loading, error } = useSelector((state) => state.extraCharges);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        transaction_date: '',
        charges: '',
        description: '',
        broker_id : '',
        type_id : '',
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleOpen = (item) => {
        // Correctly format the date to YYYY-MM-DD for the date input
        let formattedDate = '';
        if (item.transaction_date) {
            const date = new Date(item.transaction_date.split('/').reverse().join('-'));
            if (!isNaN(date)) {
                formattedDate = date.toISOString().split('T')[0];
            }
        }

         setFormData({
            id: item.id,
            transaction_date: formattedDate,
            charges: item.charges,
            description: item.description,
            broker_id: Number(item.broker),
            type_id: item.type,
        });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await validationSchema.validate(formData, { abortEarly: false });
            const updatePayload = {
                id: formData.id,
                updatedData: {
                    transaction_date: formData.transaction_date,
                    charges: parseFloat(formData.charges),
                    description: formData.description,
                    broker: formData.broker_id,
                    type: formData.type_id,
                }
            };
            dispatch(updateExtraCharge(updatePayload));
            handleClose();

            setSnackbarMessage('Extra Charges updated Successfully!');
            setSnackbarSeverity('success');

        } catch (err) {
            setSnackbarMessage('Failed to add charges');
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
    };

    const handleDeleteExtraCharge = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteExtraCharges(id)).unwrap(); 

                setSnackbarMessage("Extra Charges deleted successfully");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

            } catch (error) {
                setSnackbarMessage(`Deletion failed: ${error.message || JSON.stringify(error.data || error)}`);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        }
    };

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    useEffect(() => {
        dispatch(fetchExtraCharges());
        dispatch(fetchUserBrokers()); 
        dispatch(fetchChargesTypes());
    }, [dispatch]);

    const filteredChargesList = React.useMemo(() => {
        const search = searchTerm.toLowerCase();

        return chargesList.filter(item =>
            Object.values(item).some(val =>
                val?.toString().toLowerCase().includes(search)
            )
        );
    }, [chargesList, searchTerm]);

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    return (
        <motion.div className="ex_charges_crud"
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>
            <div className="ex_charges_list_main">
                <div className="ex_charges_top_btn">
                    <button className="ex_charges_top_btn_buy" onClick={() => navigate('/extra-charges/add')}>
                        <AddIcon /> Add
                    </button>
                </div>
                <div className="ex_charges_search_div">
                    <TextField
                        placeholder="Search.."
                        label='Search description'
                        className="searchInput"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}

                    />
                    <div className="ex_charges_search_icon">
                        <span> Search</span>
                        <SearchIcon sx={{ fontSize: '32px', color: '#fff' }} />
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
                        <TableHead >
                            <TableRow>
                                <StyledTableCell align="center">Date</StyledTableCell>
                                <StyledTableCell align="center">Broker </StyledTableCell>
                                <StyledTableCell align="center">Type </StyledTableCell>
                                <StyledTableCell align="center">Amount </StyledTableCell>
                                <StyledTableCell align="center">Description</StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <tbody className='ex_charges_t_body'>
                            {/* Use filteredChargesList for mapping */}
                            {filteredChargesList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item,index) => (
                                <TableRow key={item.id}>
                                    <StyledTableCell align="center">{formatDate(item.transaction_date)}</StyledTableCell>
                                    <StyledTableCell align="center">{item.broker_name}</StyledTableCell>
                                    <StyledTableCell align="center">{item.type_name}</StyledTableCell>
                                    <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.charges)}</StyledTableCell>
                                    <StyledTableCell align="center">{item.description}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <button className="ex_charges_editebtn" onClick={() => handleOpen(item)}>
                                            <EditIcon style={{ fontSize: '16px' }} /> Edit
                                        </button>
                                        <button
                                            className="ex_charges_editebtn"
                                            type="button"
                                            onClick={() => handleDeleteExtraCharge(item.id)}
                                        >
                                            <DeleteIcon style={{ fontSize: '16px' }} /> Delete
                                        </button>
                                    </StyledTableCell>
                                </TableRow>

                            ))}
                        </tbody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    // Use filteredChargesList.length for the count
                    count={filteredChargesList.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography variant="h6">Edit Extra Charge</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Date"
                                        name="transaction_date"
                                        type="date"
                                        value={formData.transaction_date || ''}
                                        onChange={handleChange}
                                        required
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                               <Grid item xs={6}>
                                    <TextField
                                        select
                                        label="Broker Name"
                                        name="broker_id"
                                        value={formData.broker_id}
                                        onChange={(e) => setFormData({ ...formData, broker_id: Number(e.target.value) })}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select a Broker</em>
                                        </MenuItem>
                                        {brokers
                                            .filter(broker => broker.status === "Active")
                                            .map((broker) => (
                                                <MenuItem key={broker.id} value={broker.broker}>
                                                    {broker.broker_name}
                                                </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        select
                                        label="Charge Type"
                                        name="type_id"
                                        value={formData.type_id}
                                        onChange={(e) => setFormData({ ...formData, type_id: Number(e.target.value) })}
                                        fullWidth
                                    >
                                        <MenuItem value="">
                                            <em>Select Type</em>
                                        </MenuItem>

                                        {chargesTypes.map((type) => (
                                            <MenuItem key={type.id} value={type.id}>
                                                {type.type}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Amount"
                                        name="charges"
                                        value={formData.charges || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        placeholder="Description..."
                                        value={formData.description || ''}
                                        onChange={handleChange}
                                        multiline
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                            </Grid>
                            <Box mt={2} display="flex" justifyContent="space-between">
                                <Button type="submit" variant="contained" color="primary">Submit</Button>
                                <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                            </Box>
                        </form>
                    </Box>
                </Modal>
            </div>
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
                        backgroundColor: snackbarSeverity === 'error' ? '#e91612ff' : 'rgba(15, 134, 231, 0.94)'
                        //backgroundColor: 'rgba(8, 143, 30, 0.94)',
                        // color: '#fff',

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

export default ExtraChargesList;