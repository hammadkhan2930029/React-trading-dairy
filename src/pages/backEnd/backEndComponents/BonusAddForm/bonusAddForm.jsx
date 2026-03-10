import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, useFormikContext } from 'formik';
import "./bonusAddForm.css";
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks, selectAllStocks, selectStockLoading } from "../../Redux/stockSlice";
import { createbonus } from "../../Redux/bonusSlice";
import * as Yup from 'yup';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { Autocomplete} from "@mui/material";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { fetchHoldings } from '../../Redux/holdingSlice.js';

const bonusSchema = Yup.object().shape({
    
    stock: Yup.number() 
        .required('Please select a stock')
        .typeError('Please select a stock'),
    date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid date'),
    credit_date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid date'),
    percent: Yup.number()
        .typeError('Please enter a valid bonus %')
        .min(0.01, 'Bonus % must be greater than 0')
        .required('Please put an bonus % here'),
    holding_shares: Yup.number()
        .typeError('Please enter a valid number')
        .min(0.01, 'No of shares must be greater than 0')
        .required('Please put no of shares'),
    tax: Yup.number()
        .typeError('Please enter a valid tax %')
        .min(0, 'Tax cannot be negative')
        .required('Please put a tax % here'),
        
});

const NetProfitCalculator = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        const shares = Number(values.holding_shares) || 0;
        const bonusPercent = Number(values.percent) || 0;
        const taxPercent = Number(values.tax) || 0;

        const newShares = (shares * bonusPercent) / 100;

        const taxAmount = (newShares * taxPercent) / 100;

        const netShares = newShares - taxAmount;

        const newFormatted = newShares;
        const netFormatted = netShares;

        if (values.new_shares !== newFormatted) {
            setFieldValue("new_shares", newFormatted);
        }

        if (values.net_shares !== netFormatted) {
            setFieldValue("net_shares", netFormatted);
        }

    }, [values.holding_shares, values.percent, values.tax, setFieldValue]);

    return null;
};


export const BonusAddForm = () => {

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
            const num = (v) => Number(v) || 0;

            const submissionValues = {
                stock: values.stock,
                date: values.date,
                credit_date: values.credit_date,
                holding_shares: num(values.holding_shares),
                tax: num(values.tax),
                net_shares: num(values.net_shares),
                percent: num(values.percent),
                new_shares: num(values.new_shares),
            };

            await dispatch(createbonus(submissionValues)).unwrap();
            setSnackbarMessage("Bonus added successfully");
            setSnackbarSeverity("success"); // Set success severity
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
                    tax: '',
                    net_shares: '',
                    percent: '',
                    holding_shares: '',
                    new_shares: '',
                }}
                validationSchema={bonusSchema}
                onSubmit={handlecreatebonus} 
            >
                {({ handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <NetProfitCalculator />

                        <div className='form-main-dividen'>
                            <div>
                                <span className='heading_dividen'>Bonus</span>
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
                                            autoSelect
                                            autoHighlight
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
                                                    setFieldValue("holding_shares", 0);
                                                    return;
                                                }

                                                const holding = holdingsRawData?.find(
                                                    h => Number(h.stock?.id) === Number(stockId)
                                                );

                                                setFieldValue("holding_shares", holding?.holding_quantity ?? 0);
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
                                            id="bonus-date"
                                            label="Announce Date"
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
                                            id="bonus-credit-date"
                                            label="Credit Date"
                                            name="credit_date"
                                            value={values.credit_date}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            error={touched.credit_date && Boolean(errors.credit_date)}
                                            helperText={touched.credit_date && errors.credit_date}
                                        />

                                        {/* Holding Shares Field */}
                                        <TextField
                                            id="no-of-shares"
                                            label="Holding Shares"
                                            type="number"
                                            placeholder="Holding Shares..."
                                            name='holding_shares'
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            value={values.holding_shares}
                                            error={touched.holding_shares && Boolean(errors.holding_shares)}
                                            helperText={touched.holding_shares && errors.holding_shares}
                                        />

                                        {/* Amount Percent Field */}
                                        <TextField
                                            id="amount-percent"
                                            label="Bonus (%)"
                                            type="number"
                                            placeholder="Bonus (%)..."
                                            name='percent'
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            value={values.percent}
                                            error={touched.percent && Boolean(errors.percent)}
                                            helperText={touched.percent && errors.percent}
                                        />

                                        {/* New Shares Field */}
                                        <TextField
                                            id="new-shares"
                                            label="New Shares"
                                            type="number"
                                            placeholder="ewf Shares..."
                                            name='new_shares'
                                            onChange={handleChange} 
                                            onBlur={handleBlur}
                                            value={values.new_shares}
                                            InputProps={{ readOnly: true }} 
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