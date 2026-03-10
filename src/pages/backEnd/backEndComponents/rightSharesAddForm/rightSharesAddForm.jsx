import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage, useFormikContext } from 'formik';
import "./rightSharesAddForm.css";
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks, selectAllStocks, selectStockLoading } from "../../Redux/stockSlice";
import { createrightShare } from "../../Redux/rightShareSlice";
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
    cur_shares: Yup.number()
        .typeError('Please enter a valid number')
        .min(0, 'Current shares must be greater than 0')
        .required('Please put current shares'),
    right_shares_percent: Yup.number()
        .typeError('Please enter a valid number')
        .min(0, 'Ratio from must be greater than 0')
        .required('Please put right share %'),
    right_shares_rate: Yup.number()
        .typeError('Please enter a valid number')
        .min(0, 'Ratio to must be greater than 0')
        .required('Please put right share rate'),
    rs_status: Yup.string()
        .required('Please select a status'),
});

const RightSharesCalculator = () => {
    const { values, setFieldValue } = useFormikContext();

    useEffect(() => {
        const shares = parseFloat(values.cur_shares) || 0;
        const percent = parseFloat(values.right_shares_percent) || 0;
        const rate = parseFloat(values.right_shares_rate) || 0;

        const rightShares = shares / 100 * percent;
        const total = rightShares * rate;

        setFieldValue("right_shares", rightShares);
        setFieldValue("total_amount", total.toFixed(2));

    }, [
        values.cur_shares,
        values.right_shares_percent,
        values.right_shares_rate,
    ]);

    return null;
};


export const RightSharesAddForm = () => {

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
                cur_shares: parseFloat(values.cur_shares),
                right_shares_percent: parseFloat(values.right_shares_percent),
                right_shares: parseFloat(values.right_shares),
                right_shares_rate: parseFloat(values.right_shares_rate),
                total_amount: parseFloat(values.total_amount),
                status: parseFloat(values.status),
                rs_status: values.rs_status,
            };

            await dispatch(createrightShare(submissionValues)).unwrap();
            setSnackbarMessage("Right Shares added successfully");
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
                    cur_shares: '',
                    right_shares_percent: '',
                    right_shares: '',
                    right_shares_rate: '',
                    total_amount: '',
                    status: 1,
                    rs_status: 'Receive',
                }}
                validationSchema={bonusSchema}
                onSubmit={handlecreatebonus} 
            >
                {({ handleBlur, handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <RightSharesCalculator />

                        <div className='form-main-split'>
                            <div>
                                <span className='heading_dividen'>Right Shares</span>
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
                                            id="right-share-date"
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

                                        {/* Right Shares percent Field  */}
                                        <TextField
                                            id="right_shares_percent"
                                            label="Right Share %"
                                            type="number"
                                            placeholder="Right Share %..."
                                            name='right_shares_percent'
                                            value={values.right_shares_percent}
                                            error={touched.right_shares_percent && Boolean(errors.right_shares_percent)}
                                            helperText={touched.right_shares_percent && errors.right_shares_percent}
                                            onBlur={handleBlur} 
                                            onChange={handleChange} // Use Formik's handleChange
                                        />

                                        {/* Right Shares Field */}
                                        <TextField
                                            id="right_shares"
                                            label="Right Shares"
                                            type="number"
                                            placeholder="Right Shares..."
                                            name='right_shares'
                                            onBlur={handleBlur}
                                            value={values.right_shares}
                                            InputProps={{ readOnly: true }}
                                        />

                                        {/* Right Shares Rate Field  */}
                                        <TextField
                                            id="right_shares_rate"
                                            label="Right Share rate"
                                            type="number"
                                            placeholder="Right Share rate..."
                                            name='right_shares_rate'
                                            value={values.right_shares_rate}
                                            error={touched.right_shares_rate && Boolean(errors.right_shares_rate)}
                                            helperText={touched.right_shares_rate && errors.right_shares_rate}
                                            onBlur={handleBlur} 
                                            onChange={handleChange} // Use Formik's handleChange
                                        />

                                        {/* Total amount Field */}
                                        <TextField
                                            id="total_amount"
                                            label="Total Amount"
                                            type="number"
                                            placeholder="Total Amount..."
                                            name='total_amount'
                                            onBlur={handleBlur}
                                            value={values.total_amount}
                                            InputProps={{ readOnly: true }}
                                        />     

                                        <TextField
                                            select
                                            id="rs-status"
                                            label="Status"
                                            name="rs_status"
                                            value={values.rs_status}  
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            InputLabelProps={{ shrink: true }}
                                            fullWidth
                                            required
                                        >
                                            <MenuItem value={'Receive'}>Receive</MenuItem>
                                            <MenuItem value={'Buy'}>Buy</MenuItem>
                                            <MenuItem value={'Sell'}>Sell</MenuItem>
                                        </TextField>                                   

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