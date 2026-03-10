import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, useFormikContext } from 'formik';
import "./dividen.css";
import "react-datepicker/dist/react-datepicker.css";// Corrected import path for react-datepicker css
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks, selectAllStocks, selectStockLoading } from "../../Redux/stockSlice";
import { createdividend } from "../../Redux/dividendSlice";
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { Autocomplete} from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { fetchHoldings } from '../../Redux/holdingSlice.js';

const dividendSchema = Yup.object().shape({
    stock: Yup.number() // Changed from stock_id to stock
        .required('Please select a stock')
        .typeError('Please select a stock'),
    date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid date'),
    credit_date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid credit date'),
    amount_percent: Yup.number()
        .typeError('Please enter a valid amount %')
        .min(0.01, 'Amount % must be greater than 0')
        .required('Please put an amount here'),
    amount_per_share: Yup.number()
        .typeError('Please enter a valid amount')
        .min(0.01, 'Amount  must be greater than 0')
        .required('Please put an amount here'),
    quantity: Yup.number()
        .typeError('Please enter a valid quantity')
        .min(0.01, 'Quantity must be greater than 0')
        .required('Please put quantity here'),
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
        const amountPerShare = parseFloat(values.amount_per_share) || 0;
        const quantity = parseFloat(values.quantity) || 0;
        const totalAmount = parseFloat(values.total_amount) || amountPerShare * quantity;
        const taxAmount = parseFloat(values.tax) || 0;
        const totAmount = amountPerShare * quantity;
        const netAmount = totalAmount - taxAmount;

        if (parseFloat(values.total_amount).toFixed(2) !== totAmount.toFixed(2)) {
            setFieldValue("total_amount", totAmount.toFixed(2));
        }

        if (parseFloat(values.net_amount).toFixed(2) !== netAmount.toFixed(2)) {
            setFieldValue("net_amount", netAmount.toFixed(2));
        }

    }, [values.total_amount, values.tax, values.net_amount, values.quantity, values.amount_per_share, setFieldValue]);

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
    const { items: holdingsRawData, loading, error } = useSelector((state) => state.holdings);

    useEffect(() => {
        const fetchData = async () => {
            if (stocks.length === 0) { // Only fetch if stocks are not already in Redux
                try {
                    await dispatch(fetchStocks()).unwrap(); // Use unwrap() to handle errors directly
                } catch (error) {
                    
                    // Optionally show a user-friendly error message
                }
            }
            if (!holdingsRawData?.length) {
                await dispatch(fetchHoldings()).unwrap();
            }
        };
        fetchData();
        console.log(holdingsRawData);

        // Handle window resize for mobile view
        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch, stocks.length]);

    const handlecreatedividend = async (values, { setSubmitting, resetForm }) => {
        try {
            const submissionValues = {
                stock: values.stock, 
                date: values.date,
                credit_date: values.credit_date,
                quantity: values.quantity,
                total_amount: parseFloat(values.total_amount),
                tax: parseFloat(values.tax),
                net_amount: parseFloat(values.net_amount),
                amount_percent: parseFloat(values.amount_percent),
                amount_per_share: parseFloat(values.amount_per_share),
            };

            await dispatch(createdividend(submissionValues)).unwrap();
            setSnackbarMessage("Dividend added successfully");
            setSnackbarSeverity("success"); // Set success severity
            setSnackbarOpen(true);
            resetForm();
        } catch (error) {
            setSnackbarMessage(`Something went wrong`);
            // setSnackbarMessage(`Dividend creation failed: ${error.message || JSON.stringify(error.data || error)}`);
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
                    amount_percent: '',
                    credit_date: '',
                    quantity: '',
                    amount_per_share: '',
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
                                <button className='switchBtn_list' type="button" onClick={() => navigate(-1)}>
                                    <NavigateBeforeIcon /> Back
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
                                        <Autocomplete
                                            options={stocks}
                                            autoHighlight
                                            autoSelect
                                            getOptionLabel={(option) =>
                                                `${option.symbol}`
                                            }
                                            value={
                                                stocks.find(stock => stock.id === values.stock) || null
                                            }
                                            onChange={(event, newValue) => {
                                                const stockId = newValue?.id ?? "";

                                                setFieldValue("stock", stockId);

                                                if (!stockId) {
                                                    setFieldValue("quantity", 0);
                                                    return;
                                                }

                                                const holding = holdingsRawData?.find(
                                                    h => Number(h.stock?.id) === Number(stockId)
                                                );

                                                setFieldValue("quantity", holding?.holding_quantity ?? 0);
                                            }}
                                            isOptionEqualToValue={(option, value) =>
                                                option.id === value.id
                                            }
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Stock Name"
                                                    name="stock"
                                                    required
                                                    error={touched.stock && Boolean(errors.stock)}
                                                    helperText={touched.stock && errors.stock}
                                                    sx={{ m: 2, width: isMobile ? '32ch' : '60ch' }}
                                                />
                                            )}
                                        />

                                        {/* Date Field */}
                                        <TextField
                                            type='date'
                                            id="dividend-date"
                                            label="Annoucne Date"
                                            name="date"
                                            value={values.date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            error={touched.date && Boolean(errors.date)}
                                            helperText={touched.date && errors.date}
                                        />
                                        
                                        {/* Date Field */}
                                        <TextField
                                            type='date'
                                            id="credit-date"
                                            label="Credit Date"
                                            name="credit_date"
                                            value={values.credit_date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            error={touched.credit_date && Boolean(errors.credit_date)}
                                            helperText={touched.credit_date && errors.credit_date}
                                        />

                                        {/* Amount Percent Field */}
                                        <TextField
                                            id="amount-percent"
                                            label="Percent (%)"
                                            type="number"
                                            placeholder="Percent (%)..."
                                            name='amount_percent'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.amount_percent}
                                            error={touched.amount_percent && Boolean(errors.amount_percent)}
                                            helperText={touched.amount_percent && errors.amount_percent}
                                        />

                                        {/* Amount Per Share Field */}
                                        <TextField
                                            id="amount-per-share"
                                            label="Rs. Per Share"
                                            type="number"
                                            placeholder="Rs. Per Share..."
                                            name='amount_per_share'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.amount_per_share}
                                            error={touched.amount_per_share && Boolean(errors.amount_per_share)}
                                            helperText={touched.amount_per_share && errors.amount_per_share}
                                        />

                                        {/* Quantity Field */}
                                        <TextField
                                            id="quantity"
                                            label="Quantity"
                                            type="number"
                                            placeholder="Quantity..."
                                            name='quantity'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.quantity}
                                            error={touched.quantity && Boolean(errors.quantity)}
                                            helperText={touched.quantity && errors.quantity}
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
                                            label="Tax (Rs.)"
                                            type="number"
                                            placeholder="Tax (Rs.)..."
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
                                            InputProps={{ readOnly: true }}
                                            onBlur={handleBlur}
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
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
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