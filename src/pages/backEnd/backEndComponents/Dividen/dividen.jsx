import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, useFormikContext } from 'formik';
import "./dividen.css";
import "react-datepicker/dist/react-datepicker.css";// Corrected import path for react-datepicker css
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl'; // Import FormControl
import InputLabel from '@mui/material/InputLabel'; // Import InputLabel
import Select from '@mui/material/Select'; // Import Select
import Grid from '@mui/material/Grid'; // Import Grid for better layout management
import { motion, useInView } from "framer-motion";
import { setDividen_list } from "../../Redux/profileSlice";
import { useDispatch, useSelector } from "react-redux";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { fetchStocks, selectAllStocks, selectStockLoading } from "../../Redux/stockSlice";
import { createdividend } from "../../Redux/dividendSlice";
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';


const dividendSchema = Yup.object().shape({
    // IMPORTANT: The validation schema field name MUST match the name attribute in the form's input
    // We will now use 'stock' as the field name in Formik state and Yup schema for the ID
    stock: Yup.number() // Changed from stock_id to stock
        .required('Please select a stock')
        .typeError('Please select a stock'),
    date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid date'),
    total_amount: Yup.number()
        .typeError('Please enter a valid amount')
        .min(0.01, 'Amount must be greater than 0')
        .required('Please put an amount here'),
    tax: Yup.number()
        .typeError('Please enter a valid tax amount')
        .min(0, 'Tax cannot be negative')
        .required('Please put a tax amount here'),
    // net_amount is derived, no direct validation needed as it's read-only
});

const NetProfitCalculator = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        const totalAmount = parseFloat(values.total_amount) || 0;
        const taxAmount = parseFloat(values.tax) || 0;
        const netAmount = totalAmount - taxAmount;

        // Ensure update only if actual value changes to prevent unnecessary re-renders
        // Using toFixed(2) for comparison as net_amount is formatted as such
        if (parseFloat(values.net_amount).toFixed(2) !== netAmount.toFixed(2)) {
            setFieldValue("net_amount", netAmount.toFixed(2));
        }
    }, [values.total_amount, values.tax, values.net_amount, setFieldValue]);

    return null;
};

export const Dividend = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const stocks = useSelector(selectAllStocks);
    const stocksLoading = useSelector(selectStockLoading);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    useEffect(() => {
        const fetchData = async () => {
            if (stocks.length === 0) { // Only fetch if stocks are not already in Redux
                try {
                    await dispatch(fetchStocks()).unwrap(); // Use unwrap() to handle errors directly
                } catch (error) {
                    console.error("Failed to fetch stocks:", error);
                    // Optionally show a user-friendly error message
                }
            }
        };
        fetchData();

        // Handle window resize for mobile view
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch, stocks.length]);

    const handlecreatedividend = async (values, { setSubmitting, resetForm }) => {
        try {
            // values.stock already contains the numeric ID from the Formik state
            // net_amount is already calculated and formatted by NetProfitCalculator
            const submissionValues = {
                stock: values.stock, // Backend expects 'stock' with the ID
                date: values.date,
                total_amount: parseFloat(values.total_amount),
                tax: parseFloat(values.tax),
                net_amount: parseFloat(values.net_amount),
                // No need for 'stoock_info' here, it's for read-only display on GET
            };

            console.log("Payload sent to backend:", submissionValues); // Crucial log

            await dispatch(createdividend(submissionValues)).unwrap();
            setSnackbarMessage("Dividend data successfully added to DB");
            setSnackbarSeverity("success"); // Set success severity
            setSnackbarOpen(true);
            resetForm();
        } catch (error) {
            console.error("Dividend creation failed:", error); // Use console.error for better visibility
            setSnackbarMessage(`Dividend creation failed: ${error.message || JSON.stringify(error.data || error)}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <motion.div
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}
        >
            <Formik
                initialValues={{
                    stock: '', // Initialize as empty string for the Select component
                    date: '',
                    total_amount: '',
                    tax: '',
                    net_amount: '',
                }}
                validationSchema={dividendSchema}
                onSubmit={handlecreatedividend} // Directly pass the handler
            >
                {({ handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <NetProfitCalculator />

                        <div className='form-main-dividen'>
                            <div>
                                <span className='heading_dividen'>Dividend</span>
                            </div>

                            <div className='switchBtn_div'>
                                <button className='switchBtn_list' type="button" onClick={() => navigate('/DividenList')}>
                                    <FormatListBulletedIcon /> List
                                </button>
                            </div>
                            <div>
                                <Box component="div"
                                    sx={{ '& .MuiTextField-root': { m: 2, width: isMobile ? '32ch' : '60ch' } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <div className='dividen_form'>
                                        {/* Stock Name Select Component */}
                                        <FormControl fullWidth sx={{ m: 2, width: isMobile ? '32ch' : '60ch' }} required>
                                            <InputLabel id="stock-select-label">Stock Name</InputLabel>
                                            <Select
                                                labelId="stock-select-label"
                                                id="stock-select"
                                                name="stock" // CRITICAL: Match Formik's initialValues and Yup schema field name
                                                value={values.stock || ''} // Bound to values.stock
                                                onChange={handleChange} // Formik's handleChange is sufficient
                                                onBlur={handleBlur}
                                                label="Stock Name"
                                                error={touched.stock && Boolean(errors.stock)}
                                            >
                                                <MenuItem value="">
                                                    <em>Select a Stock</em>
                                                </MenuItem>
                                                {stocks.map((stock) => (
                                                    <MenuItem key={stock.id} value={stock.id}>
                                                        {stock.name} ({stock.symbol}) {/* More informative display */}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <ErrorMessage name="stock" component="div" className="error-message" />
                                        </FormControl>

                                        {/* Date Field */}
                                        <TextField
                                            type='date'
                                            id="dividend-date"
                                            label="Date"
                                            name="date"
                                            value={values.date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            error={touched.date && Boolean(errors.date)}
                                            helperText={touched.date && errors.date}
                                        />

                                        {/* Total Amount Field */}
                                        <TextField
                                            id="total-amount"
                                            label="Total Amount"
                                            type="number"
                                            placeholder="Total Amount..."
                                            name='total_amount'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.total_amount}
                                            error={touched.total_amount && Boolean(errors.total_amount)}
                                            helperText={touched.total_amount && errors.total_amount}
                                        />

                                        {/* Tax Field */}
                                        <TextField
                                            id="tax"
                                            label="Tax"
                                            type="number"
                                            placeholder="Tax..."
                                            name='tax'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.tax}
                                            error={touched.tax && Boolean(errors.tax)}
                                            helperText={touched.tax && errors.tax}
                                        />

                                        {/* Net Amount Field (Read-only) */}
                                        <TextField
                                            id="net-amount"
                                            label="Net Amount"
                                            type="number"
                                            placeholder="Net Amount..."
                                            name='net_amount'
                                            value={values.net_amount}
                                            InputProps={{ readOnly: true }} // Make it truly read-only
                                            onBlur={handleBlur} // Keep onBlur for Formik to track touched state
                                        // No error/helperText for net_amount as it's calculated
                                        />
                                    </div>
                                </Box>
                            </div>

                            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                <Fab variant="extended" color="primary" type="submit" sx={{ borderRadius: '10px', backgroundColor: '#1976d2' }}>
                                    <SendIcon sx={{ mr: 1.5 }} />
                                    Submit
                                </Fab>
                            </Box>
                        </div>
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
                                    backgroundColor: 'hsla(216, 91%, 48%, 0.94)',
                                    color: '#fff',

                                }}
                                elevation={6}
                                variant="filled"
                            >
                                {snackbarMessage}
                            </MuiAlert>
                        </Snackbar>
                    </form>
                )}
            </Formik>
        </motion.div>
    );
};