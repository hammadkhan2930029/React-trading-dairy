import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./buyForm.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { motion, useInView } from "framer-motion";
import { Form, Field } from "formik";
import { fetchUserBrokers, selectAllUserBrokers } from "../../Redux/userBrokerSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks, createTrade, selectAllStocks, selectStockLoading } from "../../Redux/stockSlice";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';

export const BuyForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const stocks = useSelector(selectAllStocks)
    const stocksLoading = useSelector(selectStockLoading);
    const brokers = useSelector(selectAllUserBrokers)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    const [value, setValue] = React.useState(null);


    const roundToTwo = (num) => {
        const parsed = parseFloat(num);
        return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
    };




    // Backend par trade data send into Db  ka function
    const handlecreateTrade = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(createTrade(values)).unwrap();

            // ✅ Success path
            setSnackbarMessage("Trade Created Succcessfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            resetForm();

        } catch (error) {
            console.error("Trade creation failed:", error);

            // --- 🧠 Smarter error classification ---
            let errorMessage = "Trade creation failed.";

            if (!error) {
                errorMessage = "Unknown error occurred (no details available).";
            }
            else if (error?.response) {
                // Backend responded with an error (4xx, 5xx)
                const status = error.response.status;
                const data = error.response.data;

                if (status === 400) {
                    errorMessage = `Validation Error: ${JSON.stringify(data)}`;
                } else if (status === 401) {
                    errorMessage = "Unauthorized — please log in again.";
                } else if (status === 403) {
                    errorMessage = "Forbidden — you don’t have permission for this action.";
                } else if (status >= 500) {
                    errorMessage = "Server error — please try again later.";
                } else {
                    errorMessage = `Unexpected response (${status}): ${JSON.stringify(data)}`;
                }
            }
            else if (error?.request) {
                // Request sent, but no valid response — likely CORS or network issue
                errorMessage =
                    "Trade may have been created, but the server response was blocked (possible CORS/network issue).";
            }
            else if (error?.message) {
                // General JavaScript or Axios message
                errorMessage = error.message;
            }

            // Show better feedback
            setSnackbarMessage(errorMessage);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);

        } finally {
            setSubmitting(false);
        }
    };


    // Fetch stock data from Backend 
    useEffect(() => {
        const fetchData = async () => {
            if (stocks.length === 0) {
                try {
                    await dispatch(fetchStocks());
                } catch (error) {
                    console.error("Failed to fetch stocks:", error);
                }
            }
        };
        fetchData();
    }, [dispatch, stocks.length]);

    // Fetch broker list from Backend 
    useEffect(() => {
        const fetchData = async () => {
            if (brokers.length === 0) {
                try {
                    await dispatch(fetchUserBrokers());
                } catch (error) {
                    console.error("Failed to fetch stocks:", error);
                }
            }
        };
        fetchData();
    }, [dispatch, brokers.length]);

    const BuyFormValidationSchema = Yup.object().shape({
        stock_id: Yup.number()
            .typeError("Stock Name is required")
            .required("Please select Stock Name"),

        trade_date: Yup.string()
            .required("Please select Trade Date"),

        buy_QTY: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Please enter Quantity"),

        buy_rate: Yup.number()
            .min(0.01, "Rate must be greater than 0")
            .required("Please enter Rate"),


    });


    return (
        <motion.div
            ref={refOne}
            initial={{ opacity: 0, x: -100 }}
            animate={inViewOne ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .8 }}>
            <Formik
                initialValues={{
                    user_id: '',
                    stock_id: '',
                    broker_id: '',
                    trade_type: "BUY",
                    stockName: '',
                    sett_date: '',
                    trade_date: '',
                    broker_name: '',
                    buy_QTY: 0,
                    buy_rate: 0,
                    buy_amount: 0,
                    buy_broker_amount: 0,
                    buy_cdc_amount: 0,
                    buy_sst_amount: 0,
                    buy_net_amount: 0,
                    avg_buying: 0,
                }}
                validationSchema={BuyFormValidationSchema}
                onSubmit={(values, actions) => {
                    const roundedValues = {
                        ...values,
                        buy_amount: roundToTwo(values.buy_amount),
                        buy_rate: roundToTwo(values.buy_rate),
                        buy_broker_amount: roundToTwo(values.buy_broker_amount),
                        buy_cdc_amount: roundToTwo(values.buy_cdc_amount),
                        buy_sst_amount: roundToTwo(values.buy_sst_amount),
                        buy_net_amount: roundToTwo(values.buy_net_amount),
                        avg_buying: roundToTwo(values.avg_buying),
                    };

                    handlecreateTrade(roundedValues, actions);
                }}
            >

                {(formik) => {
                    const { handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue } = formik;

                    useEffect(() => {
                        if (brokers.length > 0 && !values.broker_id) {
                            const activeBrokers = brokers.filter(broker => broker.status === "Active");
                            if (activeBrokers.length > 0) {
                                setFieldValue("broker_id", activeBrokers[0].id);
                                setFieldValue("broker_name", activeBrokers[0].broker_name);
                            }
                        }
                    }, [brokers, values.broker_id, setFieldValue]);

                    useEffect(() => {
                        const qty = parseFloat(values.buy_QTY) || 0;
                        const rate = parseFloat(values.buy_rate) || 0;
                        const calculatedAmount = qty * rate;
                        if (values.buy_amount !== calculatedAmount) {
                            setFieldValue("buy_amount", calculatedAmount);
                        }
                    }, [values.buy_QTY, values.buy_rate, setFieldValue]);

                    useEffect(() => {
                        let buyAmount = parseFloat(values.buy_amount) || 0;
                        let brokerAmount = parseFloat(values.buy_broker_amount) || 0;
                        let cdcAmount = parseFloat(values.buy_cdc_amount) || 0;
                        let sstAmount = parseFloat(values.buy_sst_amount) || 0;

                        // Correct calculation including all three components
                        let net = buyAmount + brokerAmount + cdcAmount + sstAmount;
                        let avgBuying = net / values.buy_QTY || 0;
                        avgBuying = parseFloat(avgBuying.toFixed(2));
                        net = parseFloat(net.toFixed(2));
                        setFieldValue("avg_buying", avgBuying);
                        parseFloat(values.avg_buying) || 0;
                        if (values.buy_net_amount !== net) {
                            setFieldValue("buy_net_amount", net);
                        }
                    }, [values.avg_buying, values.buy_amount, values.buy_broker_amount, values.buy_cdc_amount, values.buy_sst_amount, setFieldValue]);

                    return (
                        <form onSubmit={handleSubmit} className='form_div'>

                            <div className='form-main-buy'>
                                <div className='heading_div_buy'>
                                    <span className='heading'>BUY FORM</span>
                                </div>
                                <div className='btn_div_buy'>

                                    <div className='switchBtn_div_buy'>

                                        <button className='switchBtn_buy' onClick={() => navigate(-1)}> <NavigateBeforeIcon /> Back</button>
                                    </div>
                                    <div className='switchBtn_div_buy'>

                                        <button className='switchBtn_buy' onClick={() => navigate('/sellForm')}>Sell</button>
                                    </div>
                                </div>


                                <div >
                                    <Box component="form"
                                        sx={{ '& .MuiTextField-root': { m: 2, width: '38ch' } }}

                                    >
                                        <div className='form_buy'>

                                            <TextField
                                                required
                                                select
                                                label="Stock Name"
                                                name="stock_id"
                                                value={formik.values.stock_id || ''}
                                                error={touched.stock_id && Boolean(errors.stock_id)}

                                                onChange={(e) => {
                                                    const selectedId = parseInt(e.target.value);
                                                    const selectedStock = stocks.find(stock => stock.id === selectedId);
                                                    setFieldValue("stock_id", selectedId);
                                                    required
                                                }}
                                                //onBlur={handleBlur}
                                                fullWidth
                                            >
                                                <MenuItem value="">
                                                    <em>Select a Stock</em>
                                                </MenuItem>
                                                {stocks.map((stock) => (
                                                    <MenuItem key={stock.id} value={stock.id}>
                                                        {stock.name}
                                                    </MenuItem>
                                                ))}

                                            </TextField>


                                            <TextField
                                                id="outlined-required"
                                                label="Trade Date"
                                                type="date"
                                                name="trade_date"
                                                value={values.trade_date}
                                                error={touched.trade_date && Boolean(errors.trade_date)}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}
                                                required
                                            />


                                            <TextField
                                                type='date'
                                                id="outlined-required"
                                                label="Settlement Date"
                                                name="sett_date"
                                                value={values.sett_date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}

                                            />

                                            <TextField
                                                id="outlined-required"
                                                label="QTY"
                                                type="number"
                                                placeholder="buy QTY..."
                                                name='buy_QTY'
                                                error={touched.buy_QTY && Boolean(errors.buy_QTY)}
                                                onBlur={handleBlur}
                                                value={values.buy_QTY === 0 ? "" : values.buy_QTY}
                                                inputProps={{ inputMode: "decimal", min: 0, step: 1 }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleChange({
                                                        target: {
                                                            name: e.target.name,
                                                            value: val === "" ? 0 : parseFloat(val),
                                                        },
                                                    });
                                                }}
                                                required
                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="Rate"
                                                placeholder="buy rate..."
                                                type="number"
                                                name='buy_rate'
                                                error={touched.buy_rate && Boolean(errors.buy_rate)}
                                                onBlur={handleBlur}

                                                inputProps={{ inputMode: "decimal", min: 0 }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleChange({
                                                        target: {
                                                            name: e.target.name,
                                                            value: val === "" ? 0 : parseFloat(val),
                                                        },
                                                    });
                                                }}
                                                value={values.buy_rate === 0 ? "" : values.buy_rate} // show empty string if zero
                                                required
                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="Amount"
                                                type="number"
                                                placeholder="buy amount..."
                                                name="buy_amount"
                                                value={Number(values.buy_amount).toFixed(2)} // auto-calculated
                                                InputProps={{ readOnly: true }}

                                            />

                                            <TextField
                                                select
                                                label="Broker Name"
                                                name="broker_id"
                                                value={formik.values.broker_id || ''}
                                                onChange={(e) => {
                                                    const selectedId = parseInt(e.target.value);
                                                    const selectedBroker = brokers.find(broker => broker.id === selectedId);
                                                    setFieldValue("broker_id", selectedId);

                                                }}
                                                //onBlur={handleBlur}
                                                fullWidth
                                            >
                                                <MenuItem value="">
                                                    <em>Select a Broker</em>
                                                </MenuItem>

                                                {brokers
                                                    .filter(broker => broker.status === "Active")
                                                    .map((broker) => (
                                                        <MenuItem key={broker.id} value={broker.id}>
                                                            {broker.broker_name}
                                                        </MenuItem>
                                                    ))}
                                            </TextField>

                                            <TextField
                                                id="outlined-required"
                                                label="Broker Amount"
                                                type="number"
                                                placeholder="Broker Amount ..."
                                                name="buy_broker_amount"
                                                onBlur={handleBlur}
                                                value={values.buy_broker_amount === 0 ? "" : values.buy_broker_amount}
                                                inputProps={{ inputMode: "decimal", min: 0 }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleChange({
                                                        target: {
                                                            name: e.target.name,
                                                            value: val === "" ? 0 : parseFloat(val),
                                                        },
                                                    });
                                                }}

                                            />
                                            <TextField
                                                name='buy_cdc_amount'
                                                id="outlined-required"
                                                label="CDC Amount"
                                                type="number"
                                                placeholder="cdc amount ..."
                                                onBlur={handleBlur}
                                                value={values.buy_cdc_amount === 0 ? "" : values.buy_cdc_amount}
                                                inputProps={{ inputMode: "decimal", min: 0 }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleChange({
                                                        target: {
                                                            name: e.target.name,
                                                            value: val === "" ? 0 : parseFloat(val),
                                                        },
                                                    });
                                                }}

                                            />
                                            <TextField
                                                name='buy_sst_amount'
                                                id="outlined-required"
                                                label="SST Amount"
                                                type="number"
                                                placeholder="SST Amount ..."
                                                onBlur={handleBlur}
                                                value={values.buy_sst_amount === 0 ? "" : values.buy_sst_amount}
                                                inputProps={{ inputMode: "decimal", min: 0 }}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    handleChange({
                                                        target: {
                                                            name: e.target.name,
                                                            value: val === "" ? 0 : parseFloat(val),
                                                        },
                                                    });

                                                }}


                                            />

                                            <TextField

                                                id="outlined-required"
                                                label="net amount"
                                                type="number"
                                                placeholder="net amount..."
                                                onBlur={handleBlur}
                                                name="buy_net_amount"
                                                value={Number(values.buy_net_amount).toFixed(2)} // auto-calculated
                                                InputProps={{ readOnly: true }}
                                            />

                                            <TextField

                                                id="outlined-required"
                                                label="Avg Buying"
                                                type="number"
                                                placeholder="Avg Buying..."
                                                onBlur={handleBlur}
                                                name="avg_buying"
                                                value={Number(values.avg_buying).toFixed(2)} // auto-calculated
                                                InputProps={{ readOnly: true }}
                                            />



                                        </div>


                                    </Box>

                                </div>
                                <div className='submit_btn_div_buy'>
                                    <button className='submit_btn_buy' type='submit'>
                                        <SendIcon sx={{ mr: 1.5,color:'#fff' }} />
                                        <span> Submit</span>

                                    </button>
                                </div>

                               

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
                                        backgroundColor: 'rgba(15, 134, 231, 0.94)',
                                        color: '#fff',

                                    }}
                                    elevation={6}
                                    variant="filled"
                                >
                                    {snackbarMessage}
                                </MuiAlert>
                            </Snackbar>
                        </form>
                    )
                }}


            </Formik>
        </motion.div>

    )
}
