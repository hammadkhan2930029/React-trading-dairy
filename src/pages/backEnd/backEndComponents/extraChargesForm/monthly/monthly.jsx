import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, ErrorMessage } from 'formik';
import "./monthly.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch } from 'react-redux';
import { setChargesList, addExtraCharge } from '../../../Redux/extrachargesSlice';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const MonthlySchema = Yup.object().shape({
    date: Yup.string()
        .required("Date is required"),

    description: Yup.string()
        .required("Description is required")
        .min(3, "Description must be at least 3 characters"),

    custodyCharges: Yup.number()
        .typeError("Amount must be a number")
        .required("Amount is required")
        .positive("Amount must be greater than 0"),
});

export const Monthly = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    const [value, setValue] = React.useState(null);
    const [selectedDate, setSelectedDate] = useState(null);

    // Function to send data at backen
    const addData = (values) => {
        const submissionData = {
            description: values.description,
            custodyCharges: values.custodyCharges === '' ? null : parseFloat(values.custodyCharges),

            // Fields not collected by this form, explicitly set to null
            //cgtCharges: null, 
            //registrationCharges: null,
            //nccplCharges: null
        };
        
        dispatch(addExtraCharge(submissionData));
        
        setSnackbarMessage('Monthly Charges added Successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
    };

    return (

        <motion.div
            ref={refOne}
            initial={{ opacity: 0, y: 100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>

            <Formik
                initialValues={{

                    custodyCharges: 0,
                    date: '',
                    description: ''

                }}
                onSubmit={(values, { resetForm }) => {
                    addData(values)
                    resetForm();
                }}
                validationSchema={MonthlySchema}
            >

                {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit} className='main-monthly'>

                        <div className='form-main-monthly'>
                            <div >

                                <span className='heading-monthly'>Monthly Charges</span>
                            </div>

                            <div style={{ width: '100%' }}>
                                <button className='list_btn' type="button" onClick={() => navigate(-1)}> <NavigateBeforeIcon />Back</button>
                            </div>


                            <div className='form-monthly'>
                                <TextField
                                    id="outlined-required"
                                    type="date"
                                    label="Date"
                                    name="date"
                                    value={values.date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    error={touched.date && Boolean(errors.date)}
                                    helperText={touched.date && errors.date}
                                    className="monthly_inputField"
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    id="outlined-required"
                                    type="text"
                                    label="Description"
                                    placeholder="Description..."
                                    name="description"
                                    value={values.description}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    multiline
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                    className="monthly_inputField"
                                    sx={{ margin: 1 }}
                                />
                                <TextField
                                    id="outlined-required"
                                    type="number"
                                    label="Amount"
                                    placeholder="Amount..."
                                    name="custodyCharges"
                                    value={values.custodyCharges}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.custodyCharges && Boolean(errors.custodyCharges)}
                                    helperText={touched.custodyCharges && errors.custodyCharges}
                                    className="monthly_inputField"
                                    sx={{ margin: 1 }}
                                />

                            </div>

                            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                <Fab variant="extended" color="primary" type="submit" sx={{ borderRadius: 2 }}>
                                    <SendIcon sx={{ mr: 1.5 }} />
                                    Submit
                                </Fab>
                            </Box>

                        </div>
                    </form>
                )}

            </Formik>
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

    )
}