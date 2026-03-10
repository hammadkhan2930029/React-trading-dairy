// In ExtraChargesList.js

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import './extraChargesList.css';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import AddIcon from '@mui/icons-material/Add';
import { setOneTime, setmonthly, fetchExtraCharges, updateExtraCharge } from "../../../Redux/extrachargesSlice";
import EditIcon from '@mui/icons-material/Edit';
import * as Yup from 'yup';
import SearchIcon from '@mui/icons-material/Search';
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
    transaction_date: Yup.date()
        .required('Date is required')
        .nullable()
        .typeError('Invalid date format'),

    custodyCharges: Yup.number()
        .typeError('Custody Charges must be a number')
        .required('Custody Charges are required')
        .min(0.01, 'Amount must be greater than 0'),
});

const ExtraChargesList = () => {
    const navigate = useNavigate()
    const { chargesList, loading, error } = useSelector((state) => state.extraCharges);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        transaction_date: '',
        custodyCharges: 0,
        description: ''
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
            custodyCharges: item.custodyCharges,
            description: item.description,
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
                    custodyCharges: parseFloat(formData.custodyCharges),
                    description: formData.description,
                    //registrationCharges: null,
                    //nccplCharges: null,
                    //cgtCharges: null,
                }
            };
            dispatch(updateExtraCharge(updatePayload));
            handleClose();

        } catch (err) {
            if (err instanceof Yup.ValidationError) {
                
            }
        }
    };

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    useEffect(() => {
        dispatch(fetchExtraCharges());
    }, [dispatch]);

    const filteredChargesList = chargesList
        .filter(item => item.custodyCharges !== null && item.custodyCharges !== undefined)
        .filter(item =>
            item.description &&
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
                    <button className="ex_charges_top_btn_buy" onClick={() => navigate('/extra-charges/onetime')}>
                        <AddIcon /> One Time
                    </button>
                    <button className="ex_charges_top_btn_buy" onClick={() => navigate('/extra-charges/monthly')}>
                        <AddIcon /> Monthly
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
                                <StyledTableCell align="center">Description</StyledTableCell>
                                <StyledTableCell align="center">Amount </StyledTableCell>
                                <StyledTableCell align="center">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <tbody className='ex_charges_t_body'>
                            {/* Use filteredChargesList for mapping */}
                            {filteredChargesList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item,index) => (
                                <TableRow key={index}>
                                    <StyledTableCell align="center">{formatDate(item.transaction_date)}</StyledTableCell>
                                    <StyledTableCell align="center">{item.description}</StyledTableCell>
                                    <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.custodyCharges)}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <button className="ex_charges_editebtn" onClick={() => handleOpen(item)}>
                                            <EditIcon style={{ fontSize: '16px' }} /> Edit
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
                    rowsPerPageOptions={[5, 10, 20]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

                <Modal open={open} onClose={handleClose}>
                    <Box sx={style}>
                        <Typography variant="h6">Edit Extra Charge</Typography>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
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
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Amount"
                                        name="custodyCharges"
                                        value={formData.custodyCharges || ''}
                                        onChange={handleChange}
                                        required
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
        </motion.div>
    );
};

export default ExtraChargesList;