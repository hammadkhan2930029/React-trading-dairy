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
    const { chargesList, loading, error } = useSelector((state) => state.extraCharges);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        transaction_date: '',
        custodyCharges: 0,
        description:''
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
                alert(err.errors.join('\n'));
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


    

    

    return (
        <motion.div className="ex_charges_crud"
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>
            <div className="ex_charges_crud_main">
                <div className="ex_charges_top_btn">
                    <button className="ex_charges_top_btn_buy" onClick={() => dispatch(setOneTime())}>
                        <AddIcon /> One Time
                    </button>
                    <button className="ex_charges_top_btn_buy" onClick={() => dispatch(setmonthly())}>
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

                <table className="ex_charges_table">
                    <thead className='ex_charges_t_head'>
                        <tr className='ex_charges_t_head_row'>
                            <th>Date</th>
                            <th>Description</th>
                             <th>Amount </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='ex_charges_t_body'>
                        {/* Use filteredChargesList for mapping */}
                        {filteredChargesList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item) => (
                            <tr key={item.id} className='ex_charges_t_body_row'>
                                <td>{item.transaction_date}</td>
                                 <td>{item.description}</td>
                                <td>{item.custodyCharges}</td>
                                <td>
                                    <button className="ex_charges_editebtn" onClick={() => handleOpen(item)}>
                                        <EditIcon style={{ fontSize: '16px' }} /> Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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
                                        value={formData.description|| ''}
                                        onChange={handleChange}
                                        multiline
                                        InputLabelProps={{ shrink: true }}
                                    />
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