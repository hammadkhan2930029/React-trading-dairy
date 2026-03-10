import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik, ErrorMessage } from 'formik';
import "./extraChargesForm.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchChargesTypes, addExtraCharge } from '../../Redux/extrachargesSlice';
import { fetchUserBrokers, selectAllUserBrokers } from "../../Redux/userBrokerSlice";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const MonthlySchema = Yup.object().shape({
    date: Yup.string()
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

export const ExtraChargesForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const brokers = useSelector(selectAllUserBrokers);
    const chargesTypes = useSelector(state => state.extraCharges.chargesTypes);
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

    // Fetch broker list from Backend 
    useEffect(() => {
        const fetchData = async () => {
            if (brokers.length === 0) {
                try {
                    await dispatch(fetchUserBrokers());
                } catch (error) {
                }
            }
        };
        fetchData();
        dispatch(fetchChargesTypes());
    }, [dispatch, brokers.length]);

    // Function to send data at backen
    const addData = (values) => {
        const submissionData = {
            transaction_date: values.date,
            broker: values.broker_id,
            type: values.type_id,
            description: values.description,
            charges: values.charges === '' ? null : parseFloat(values.charges),
        };

        try {
            dispatch(addExtraCharge(submissionData)).unwrap();

            setSnackbarMessage('Extra Charges added Successfully!');
            setSnackbarSeverity('success');
        } catch (err) {
            setSnackbarMessage('Failed to add charges');
            setSnackbarSeverity('error');
        }
        
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
                    broker_id: '',
                    charges: '',
                    date: '',
                    description: '',
                    type_id: '',
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

                                <span className='heading-monthly'>Extra Charges</span>
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
                                />
                                <TextField
                                    select
                                    label="Broker Name"
                                    name="broker_id"
                                    value={values.broker_id}
                                    onChange={(e) => {
                                        setFieldValue("broker_id", Number(e.target.value));
                                    }}
                                    onBlur={handleBlur}
                                    fullWidth
                                    error={touched.broker_id && Boolean(errors.broker_id)}
                                    helperText={touched.broker_id && errors.broker_id}
                                >
                                    <MenuItem value="">
                                        <em>Select a Broker</em>
                                    </MenuItem>

                                    {brokers
                                        .filter(broker => broker.status === "Active")
                                        .map((broker) => (
                                            <MenuItem key={broker.broker} value={broker.broker}>
                                                {broker.broker_name}
                                            </MenuItem>
                                        ))}
                                </TextField>

                                <TextField
                                    select
                                    label="Charge Type"
                                    name="type_id"
                                    value={values.type_id}
                                    onChange={(e) => setFieldValue("type_id", Number(e.target.value))}
                                    onBlur={handleBlur}
                                    fullWidth
                                    error={touched.type_id && Boolean(errors.type_id)}
                                    helperText={touched.type_id && errors.type_id}
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

                                <TextField
                                    id="outlined-required"
                                    type="number"
                                    label="Charges"
                                    placeholder="Charges..."
                                    name="charges"
                                    value={values.charges}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.charges && Boolean(errors.charges)}
                                    helperText={touched.charges && errors.charges}
                                    className="monthly_inputField"
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
                                    className="monthly_inputField"
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

    )
}