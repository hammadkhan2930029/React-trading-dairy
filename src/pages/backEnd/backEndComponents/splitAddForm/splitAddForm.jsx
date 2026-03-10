import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, useFormikContext } from 'formik';
import "./splitAddForm.css";
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks, selectAllStocks, selectStockLoading } from "../../Redux/stockSlice";
import { createsplit } from "../../Redux/splitSlice";
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { Autocomplete} from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { fetchHoldings } from '../../Redux/holdingSlice.js';

const bonusSchema = Yup.object().shape({
    stock: Yup.number() // Changed from stock_id to stock
        .required('Please select a stock')
        .typeError('Please select a stock'),
    date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid date'),
    credit_date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid date'),
    ratio_from: Yup.number()
        .typeError('Please enter a valid number')
        .min(0, 'Ratio from must be greater than 0')
        .required('Please put ratio from'),
    ratio_to: Yup.number()
        .typeError('Please enter a valid number')
        .min(0, 'Ratio to must be greater than 0')
        .required('Please put ratio to'),
    cur_shares: Yup.number()
        .typeError('Please enter a valid number')
        .min(0, 'Current shares must be greater than 0')
        .required('Please put current shares'),
    total_investment: Yup.number()
        .typeError('Please enter a valid amount')
        .min(0, 'Total Investment must be greater than 0')
        .required('Please put total investment'),
    tax: Yup.number()
        .typeError('Please enter a valid tax %')
        .min(0, 'Tax cannot be negative')
        .required('Please put a tax % here'),
});

const NetProfitCalculator = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        const shares = parseFloat(values.cur_shares) || 0;
        const investment = parseFloat(values.total_investment) || 0;
        const from = parseFloat(values.ratio_from) || 0;
        const to = parseFloat(values.ratio_to) || 0;
        const tax = parseFloat(values.tax) || 0;

        const curRate = shares ? investment / shares : 0;

        const newShares = from ? (shares * to) / from : 0;

        const newRate = newShares ? investment / newShares : 0;

        const netShares = newShares - (newShares * tax) / 100;

        setFieldValue("cur_rate", curRate.toFixed(2));
        setFieldValue("new_shares", newShares.toFixed(2));
        setFieldValue("new_rate", newRate.toFixed(2));
        setFieldValue("net_shares", netShares.toFixed(2));

    }, [
        values.cur_shares,
        values.total_investment,
        values.ratio_from,
        values.ratio_to,
        values.tax
    ]);

    return null;
};


export const SplitAddForm = () => {

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
            if (stocks.length === 0) { 
                try {
                    await dispatch(fetchStocks()).unwrap(); 
                } catch (error) {
                    
                }
            }
            if (!holdingsRawData?.length) {
                await dispatch(fetchHoldings()).unwrap();
            }
        };
        fetchData();

        const handleResize = () => setIsMobile(window.innerWidth < 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [dispatch, stocks.length]);

    const handlecreatebonus = async (values, { setSubmitting, resetForm }) => {
        try {
            const submissionValues = {
                stock: values.stock, 
                date: values.date,
                credit_date: values.credit_date,
                ratio_from: parseFloat(values.ratio_from),
                ratio_to: parseFloat(values.ratio_to),
                cur_shares: parseFloat(values.cur_shares),
                cur_rate: parseFloat(values.cur_rate),
                total_investment: parseFloat(values.total_investment),
                new_shares: parseFloat(values.new_shares),
                new_rate: parseFloat(values.new_rate),
                tax: parseFloat(values.tax),
                net_shares: parseFloat(values.net_shares),
            };

            await dispatch(createsplit(submissionValues)).unwrap();
            setSnackbarMessage("Split added successfully");
            setSnackbarSeverity("success"); 
            setSnackbarOpen(true);
            resetForm();
        } catch (error) {
            setSnackbarMessage(`Something went wrong`);
            // setSnackbarMessage(`bonus creation failed: ${error.message || JSON.stringify(error.data || error)}`);
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
                    stock: '', 
                    date: '',
                    credit_date: '',
                    ratio_from: '',
                    ratio_to: '',
                    cur_shares: '',
                    cur_rate: '',
                    total_investment: '',
                    new_shares: '',
                    new_rate: '',
                    tax: '',
                    net_shares: '',
                }}
                validationSchema={bonusSchema}
                onSubmit={handlecreatebonus} 
            >
                {({ handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <NetProfitCalculator />

                        <div className='form-main-split'>
                            <div>
                                <span className='heading_dividen'>Split</span>
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
                                    <div className='split_form'>
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
                                                    setFieldValue("cur_shares", 0);
                                                    return;
                                                }

                                                const holding = holdingsRawData?.find(
                                                    h => Number(h.stock?.id) === Number(stockId)
                                                );

                                                setFieldValue("cur_shares", holding?.holding_quantity ?? 0);
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
                                            id="split-date"
                                            label="Annouince Date"
                                            name="date"
                                            value={values.date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            error={touched.date && Boolean(errors.date)}
                                            helperText={touched.date && errors.date}
                                        />

                                        {/* Credit Date Field */}
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

                                        {/* Current Shares Field */}
                                        <TextField
                                            id="cur_shares"
                                            label="Current Shares"
                                            type="number"
                                            placeholder="Current Shares..."
                                            name='cur_shares'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.cur_shares}
                                            error={touched.cur_shares && Boolean(errors.cur_shares)}
                                            helperText={touched.cur_shares && errors.cur_shares}
                                        />

                                        {/* Total Investment Field */}
                                        <TextField
                                            id="total_investment"
                                            label="Total Investment"
                                            type="number"
                                            placeholder="Total Investment..."
                                            name='total_investment'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.total_investment}
                                            error={touched.total_investment && Boolean(errors.total_investment)}
                                            helperText={touched.total_investment && errors.total_investment}
                                        />

                                        {/* Current Rate Field (Read-only) */}
                                        <TextField
                                            id="cur_rate"
                                            label="Current rate"
                                            type="number"
                                            placeholder="Current rate..."
                                            name='cur_rate'
                                            value={values.cur_rate}
                                            InputProps={{ readOnly: true }}
                                            onBlur={handleBlur} 
                                        />

                                        {/* Ratio From Field */}
                                        <TextField
                                            id="ratio_from"
                                            label="Ratio From"
                                            type="number"
                                            placeholder="Ratio From..."
                                            name='ratio_from'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.ratio_from}
                                            error={touched.ratio_from && Boolean(errors.ratio_from)}
                                            helperText={touched.ratio_from && errors.ratio_from}
                                        />

                                        {/* Ratio From Field */}
                                        <TextField
                                            id="ratio_to"
                                            label="Ratio To"
                                            type="number"
                                            placeholder="Ratio To..."
                                            name='ratio_to'
                                            onChange={handleChange} // Use Formik's handleChange
                                            onBlur={handleBlur}
                                            value={values.ratio_to}
                                            error={touched.ratio_to && Boolean(errors.ratio_to)}
                                            helperText={touched.ratio_to && errors.ratio_to}
                                        />

                                        {/* New Shares Field (Read-only) */}
                                        <TextField
                                            id="new_shares"
                                            label="New Shares"
                                            type="number"
                                            placeholder="New Shares..."
                                            name='new_shares'
                                            value={values.new_shares}
                                            InputProps={{ readOnly: true }}
                                            onBlur={handleBlur} 
                                        />

                                        {/* New Rate Field (Read-only) */}
                                        <TextField
                                            id="new_rate"
                                            label="New rate"
                                            type="number"
                                            placeholder="New rate..."
                                            name='new_rate'
                                            value={values.new_rate}
                                            InputProps={{ readOnly: true }}
                                            onBlur={handleBlur} 
                                        />

                                        {/* Tax Field */}
                                        <TextField
                                            id="tax"
                                            label="Tax (%)"
                                            type="number"
                                            placeholder="Tax (%)..."
                                            name='tax'
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            value={values.tax}
                                            error={touched.tax && Boolean(errors.tax)}
                                            helperText={touched.tax && errors.tax}
                                        />

                                        {/* Net Amount Field (Read-only) */}
                                        <TextField
                                            id="net-shares"
                                            label="Net Shares"
                                            type="number"
                                            placeholder="Net Shares..."
                                            name='net_shares'
                                            value={values.net_shares}
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