import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "./oneTime.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";

import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Typography, Modal, Grid, TablePagination, Alert } from '@mui/material'; // Added Alert
// Import updateExtraCharge along with your other actions
import { setChargesList, fetchExtraCharges, addExtraCharge, updateExtraCharge } from "../../../Redux/extrachargesSlice"; // Removed setOneTime, setmonthly as they are not used directly here
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

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

// Define the Yup validation schema for the main form
const validationSchema = Yup.object({
    transaction_date: Yup.date()
        .required('Date is required')
        .typeError('Invalid date format'),

    registrationCharges: Yup.number()
        .typeError('Registration Charges must be a number')
        .required('Registration Charges are required')
        .min(0.01, 'Amount must be greater than 0'),

    nccplCharges: Yup.number()
        .typeError('NCCPL Charges must be a number')
        .required('NCCPL Charges are required')
        .min(0.01, 'Amount must be greater than 0'),
});

export const OneTime = () => {
    const dispatch = useDispatch();
    const { chargesList, loading, error } = useSelector((state) => state.extraCharges);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');     
    const [editRuleId, setEditRuleId] = useState(null);  // used for dis
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: null,
        transactionDate: '',
        registrationCharges: '',
        nccplCharges: '',
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // Determines if a charge already exists.
    // This assumes that if `chargesList` has any items, a "one-time" charge already exists.
    // If `chargesList` contains multiple types (e.g., one-time and monthly),
    // you'd need to filter it first to check for existing one-time charges specifically.
    const chargeExists = chargesList.length > 0;
    const existingCharge = chargesList.length > 0 ? chargesList[0] : null; 
    const oneTimeChargesFiltered = chargesList.filter(item =>item.registrationCharges !== null && item.registrationCharges !== undefined)
    const existingOneTimeCharge = oneTimeChargesFiltered.length > 0 ? oneTimeChargesFiltered[0] : null;
    const handleOpen = (item) => {
        const dateString = item.transaction_date ? new Date(item.transaction_date).toISOString().split('T')[0] : '';
        setFormData({
            id: item.id,
            transactionDate: dateString,
            registrationCharges: item.registrationCharges,
            nccplCharges: item.nccplCharges
        });
        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();

        if (!formData.registrationCharges || !formData.nccplCharges || !formData.transactionDate) {
            alert('Please fill in all fields.');
            return;
        }
        if (parseFloat(formData.registrationCharges) <= 0 || parseFloat(formData.nccplCharges) <= 0) {
            alert('Charges must be greater than 0.');
            return;
        }

        const updatePayload = {
            id: formData.id,
            updatedData: {
                transaction_date: formData.transactionDate,
                registrationCharges: parseFloat(formData.registrationCharges),
                nccplCharges: parseFloat(formData.nccplCharges),
                //cgtCharges: 0,
                //custodyCharges: 0,
            }
        };

        console.log("Dispatching Update Extra Charge:", updatePayload);
        try {
            await dispatch(updateExtraCharge(updatePayload)).unwrap();
            //alert("Charges updated successfully!");
            setSnackbarMessage('Charges updated successfully!!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
            dispatch(fetchExtraCharges()); // Re-fetch data to ensure the table is updated
        } catch (err) {
            console.error("Failed to update charges:", err);
          //  alert(`Failed to update charges: ${err.message || JSON.stringify(err)}`);
            setSnackbarMessage('`Failed to update charges: ${err.message || JSON.stringify(err)}');
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

    const addData = async (values, { resetForm }) => { // Added resetForm to argument
      // if (chargeExists) { // Double check if a charge already exists before adding
       //     alert("A one-time charge already exists. Please edit the existing one.");
       //     return;
       // }

        const submissionData = {
            registrationCharges: parseFloat(values.registrationCharges),
            nccplCharges: parseFloat(values.nccplCharges),
            cgtCharges: null,
            custodyCharges: null,
            transaction_date: values.transaction_date,
        };
        console.log("OneTime form submitting (add):", submissionData);
        try {
            await dispatch(addExtraCharge(submissionData)).unwrap();
           // alert("One-Time charges added successfully!");
            setSnackbarMessage('One-Time charges added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
           dispatch(fetchExtraCharges()); // Re-fetch to update the list and trigger conditional rendering
            resetForm(); // Reset form after successful submission
        } catch (err) {
            console.error("Failed to add charges:", err);
            alert(`Failed to add charges: ${err.message || JSON.stringify(err)}`);
             etSnackbarMessage('`Failed to update charges: ${err.message || JSON.stringify(err)}');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        dispatch(fetchExtraCharges());
    }, [dispatch]);

    return (
        <motion.div
            ref={refOne}
            initial={{ opacity: 0, y: 100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}
        >
            <div className='form-main-oneTime'>
                <div>
                    <span className='heading-oneTime'>One Time Charges</span>
                </div>
                <div style={{ width: '100%' }}>
                    <button className='list_btn' type='button' onClick={() => dispatch(setChargesList())}><NavigateBeforeIcon />Back</button>
                </div>

               {/*
                {chargeExists && (
                    <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                        A one-time charge already exists. Please use the "Edit" button below to modify it.
                    </Alert>
                )}
                */}

                {/* Main Form using Formik - conditionally rendered */}
                
                    <Formik
                        initialValues={{
                            registrationCharges: 0,
                            nccplCharges: 0,
                            transaction_date: '',
                        }}
                        validationSchema={validationSchema}
                        onSubmit={(values, { resetForm, setSubmitting }) => {
                            addData(values, { resetForm }); // Pass resetForm
                            setSubmitting(false);
                        }}
                    >
                        {({ handleBlur, handleChange, values, errors, touched, setFieldValue, submitForm }) => (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                submitForm().then(() => {
                                    if (Object.keys(errors).length > 0) {
                                        // You might want to display a generic error message here
                                        // or rely on field-specific error messages.
                                    }
                                });
                            }}>
                                <div>
                                    <Box component="div"
                                        sx={{ '& .MuiTextField-root': { m: 2, width: isMobile ? '32ch' : '40ch' } }}
                                        noValidate
                                        autoComplete="off"
                                        className='form-oneTime'
                                    >
                                        <div>
                                            <TextField
                                                type='date'
                                                id="transaction-date-input"
                                                label="Date"
                                                name="transaction_date"
                                                value={values.transaction_date}
                                                onChange={(e) => setFieldValue("transaction_date", e.target.value)}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}
                                                error={touched.transaction_date && Boolean(errors.transaction_date)}
                                                helperText={touched.transaction_date && errors.transaction_date}
                                            />
                                            <TextField
                                                id="registration-charges"
                                                label="Registration Charges"
                                                type="number"
                                                placeholder="Registration charges..."
                                                name='registrationCharges'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.registrationCharges}
                                                error={touched.registrationCharges && Boolean(errors.registrationCharges)}
                                                helperText={touched.registrationCharges && errors.registrationCharges}
                                            />
                                            <TextField
                                                id="nccpl-charges"
                                                label="NCCPL Charges"
                                                type="number"
                                                placeholder="NCCLP Charges..."
                                                name='nccplCharges'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.nccplCharges}
                                                error={touched.nccplCharges && Boolean(errors.nccplCharges)}
                                                helperText={touched.nccplCharges && errors.nccplCharges}
                                            />
                                        </div>
                                    </Box>
                                </div>

                                <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                    <Fab variant="extended" color="primary" type="submit" >
                                        <SendIcon sx={{ mr: 1.5 }} />
                                        Submit
                                    </Fab>
                                </Box>
                            </form>
                        )}
                    </Formik>
              

            </div>

            {/* ============================================================================================== */}
            {/* Table Display */}
            <motion.div className="ex_charges_crud_onetime"
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>
                <div className="ex_charges_crud_main_onetime">
                    {loading === 'pending' && <Typography>Loading charges...</Typography>}
                    {error && <Typography color="error">Error: {error}</Typography>}

                    <table className="ex_charges_table_onetime">
                        <thead className='ex_charges_t_head_onetime'>
                            <tr className='ex_charges_t_head_row_onetime'>
                                <th>Date</th>
                                <th>Registration Charges</th>
                                <th>NCCPL Charges</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='ex_charges_t_body_onetime'>
                            {/* Display only the first (and supposedly only) one-time charge */}
                           {oneTimeChargesFiltered.length > 0 ? (
                            oneTimeChargesFiltered.map((item) => (
                                <tr key={item.id} className='ex_charges_t_body_row_onetime'>
                                <td>{item.transaction_date ? new Date(item.transaction_date).toLocaleDateString() : 'N/A'}</td>
                                <td>{item.registrationCharges}</td>
                                <td>{item.nccplCharges}</td>
                                <td>
                                    <button className="ex_charges_editebtn_onetime" onClick={() => handleOpen(item)}>
                                    <EditIcon style={{ fontSize: '16px' }} /> Edit
                                    </button>
                                </td>
                                </tr>
                            ))
                            ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                No one-time charges found yet.
                                </td>
                            </tr>
                            )}

                        </tbody>
                    </table>

                    {/* Table Pagination is not needed if only one item is displayed */}
                    {/* If `chargesList` could contain multiple types and you only show one-time, you might need it for filtering: */}
                    {/*
                    <TablePagination
                        component="div"
                        count={chargesList.length} // Or oneTimeCharges.length if you filter
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 20]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    */}

                    {/* Edit Modal (now dispatches update action) */}
                    <Modal open={open} onClose={handleClose}>
                        <Box sx={style}>
                            <Typography variant="h6">Edit</Typography>
                            <form onSubmit={handleModalSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Date"
                                            name="transactionDate"
                                            type="date"
                                            value={formData.transactionDate}
                                            onChange={handleChange}
                                            required
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                            fullWidth 
                                            type="number" 
                                            label="Registration Charges" 
                                            name="registrationCharges" 
                                            value={formData.registrationCharges} 
                                            onChange={handleChange} 
                                            required
                                         />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField 
                                            fullWidth 
                                            label="NCCPL Charges" 
                                            name="nccplCharges" 
                                            type="number" value={formData.nccplCharges} 
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
                                        backgroundColor: snackbarSeverity === 'error' ? '#e91612ff' : '#5e3df1ff'
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