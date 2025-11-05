import React, { useEffect, useState } from 'react';
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


export const Monthly = () => {
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
                description:values.description,
                custodyCharges: values.custodyCharges === '' ? null : parseFloat(values.custodyCharges),      
                         
                // Fields not collected by this form, explicitly set to null
                //cgtCharges: null, 
                //registrationCharges: null,
                //nccplCharges: null
            };
            //alert("OneTime form submitted Successfully")
            console.log("Monthle Charges  form submitting:", submissionData);
            dispatch(addExtraCharge(submissionData)); 
            //alert("Monthle Charges form submitted Successfully")
            setSnackbarMessage('Monthly Charges form submitted Successfully!');
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
                    date:'',
                    description:''

                }}
                onSubmit={(values, { resetForm }) => {
                    addData(values)
                    resetForm();
                }}

            >

                {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        <div className='form-main-monthly'>
                            <div >

                                <span className='heading-monthly'>Monthly Charges</span>
                            </div>

                            <div style={{ width: '100%' }}>
                                <button className='list_btn' type="button" onClick={() => dispatch(setChargesList())}> <NavigateBeforeIcon />Back</button>
                            </div>

                            <div >
                                <Box component="form"
                                    sx={{ '& .MuiTextField-root': { m: 2, width: isMobile ? '32ch' : '40ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    className='form-monthly'>
                                    <div>
                                        <TextField
                                            type='date'
                                            id="outlined-required"
                                            label="Date"
                                            name="date" 
                                            value={values.date} 
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}

                                        />
                                        <TextField
                                            type="text"
                                            id="outlined-required"
                                            label="Description"
                                            placeholder="Description..."
                                            name='description'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.description}
                                            multiline

                                        />

                                        <TextField
                                            type="number"
                                            id="outlined-required"
                                            label="Amount"
                                            placeholder="Amount..."
                                            name='custodyCharges'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.custodyCharges}

                                        />
                                    </div>

                                </Box>

                            </div>

                            <Box sx={{ '& > :not(style)': { m: 1 } }}>

                                <Fab variant="extended" color="primary" type="submit">
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

    )
}