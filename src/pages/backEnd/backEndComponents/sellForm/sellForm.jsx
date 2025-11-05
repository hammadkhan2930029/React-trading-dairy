import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./sellForm.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { motion, useInView } from "framer-motion";
import { setBuyForm, setBuy_sell_list } from "../../Redux/formTypeSlice";
import { fetchUserBrokers, selectAllUserBrokers } from "../../Redux/userBrokerSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchStocks, createTrade_sell, selectAllStocks, selectStockLoading } from "../../Redux/stockSlice";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { fetchUserHoldings } from '../../Redux/userHoldingSlice';
import * as Yup from "yup";
import { useNavigate } from 'react-router-dom';



const currencies = [];
const stockName = [];

export const SellForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const stocks = useSelector(selectAllStocks)
    const stocksLoading = useSelector(selectStockLoading);
    const { holdings, loading } = useSelector((state) => state.userHolding);
    const brokers = useSelector(selectAllUserBrokers)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    const [value, setValue] = React.useState(null);


    // Backend par trade data send into Db  ka function
    const handlecreateTrade_sell = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(createTrade_sell(values)).unwrap();
            setSnackbarMessage("Trade Created successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            resetForm();
        } catch (error) {
            console.error("trade creation failed:", error);
            setSnackbarMessage(`Trade creation failed: ${error.message || JSON.stringify(error.data || error)}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };
    const roundToTwo = (num) => {
        const parsed = parseFloat(num);
        return isNaN(parsed) ? 0 : Math.round(parsed * 100) / 100;
    };

    const handleDecimalChange = (formik, e) => {
        const { name, value } = e.target;

        // Allow empty value while typing
        if (value === "") {
            formik.setFieldValue(name, "");
            return;
        }

        // Accept raw input (including decimals)
        formik.setFieldValue(name, value);
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

    useEffect(() => {
        dispatch(fetchUserHoldings());
    }, [dispatch]);

    const SellFormValidationSchema = Yup.object().shape({
        stock_id: Yup.number()
            .typeError("Please select Stock Name")
            .required("Please select Stock Name"),

        trade_date: Yup.string()
            .required("Please select Trade Date"),


        sell_QTY: Yup.number()
            .min(1, "Quantity must be at least 1")
            .required("Please enter Quantity"),

        sell_rate: Yup.number()
            .min(0.01, "Rate must be greater than 0")
            .required("Please enter Rate"),


    });


    return (

            <motion.div ref={refTwo}
                initial={{ opacity: 0, x: 100 }}
                animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}
                className='sell_form_main_div'
                >
                <Formik
                    initialValues={{
                        user_id: '',
                        stock_id: '',
                        broker_id: '',
                        trade_type: "SELL",
                        stockName: '',
                        sett_date: '',
                        trade_date: '',
                        broker_name: '',
                        // --------------------
                        sell_QTY: 0,
                        sell_rate: 0,
                        sell_amount: 0,
                        sell_broker_amount: 0,
                        sell_cdc_amount: 0,
                        sell_sst_amount: 0,
                        net_amount: 0,
                        avg_buying: '',
                    }}
                    validationSchema={SellFormValidationSchema}
                    onSubmit={(values, actions) => {
                        const roundedValues = {
                            ...values,
                            sell_amount: roundToTwo(values.sell_amount),
                            sell_rate: roundToTwo(values.sell_rate),
                            sell_broker_amount: roundToTwo(values.sell_broker_amount),
                            sell_cdc_amount: roundToTwo(values.sell_cdc_amount),
                            sell_sst_amount: roundToTwo(values.sell_sst_amount),
                            net_amount: roundToTwo(values.net_amount),
                            avg_buying: roundToTwo(values.avg_buying),
                        };
                        handlecreateTrade_sell(roundedValues, actions);
                    }}

                >


                    {(formik) => {
                        const { handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue } = formik;

                        useEffect(() => {
                            if (brokers.length > 0 && !values.broker_id) {
                                const activeBrokers = brokers.filter(broker => broker.status === "Active");
                                if (activeBrokers.length > 0) {
                                    setFieldValue("broker_id", activeBrokers[0].id);

                                }
                            }
                        }, [brokers, values.broker_id, setFieldValue]);

                        useEffect(() => {
                            let qty = parseFloat(values.sell_QTY) || 0;
                            let rate = parseFloat(values.sell_rate) || 0;
                            let calculatedAmount = qty * rate;
                            if (values.sell_amount !== calculatedAmount) {
                                setFieldValue("sell_amount", calculatedAmount);
                            }
                        }, [values.sell_QTY, values.sell_rate, setFieldValue]);

                        useEffect(() => {
                            let sellAmount = parseFloat(values.sell_amount) || 0;
                            let brokerAmount = parseFloat(values.sell_broker_amount) || 0;
                            let cdcAmount = parseFloat(values.sell_cdc_amount) || 0;
                            let sstAmount = parseFloat(values.sell_sst_amount) || 0;

                            // Correct calculation including all three components
                            let net = sellAmount - brokerAmount - cdcAmount - sstAmount;

                            if (values.net_amount !== net) {
                                setFieldValue("net_amount", net);
                            }
                        }, [values.sell_amount, values.sell_broker_amount, values.sell_cdc_amount, values.sell_sst_amount, setFieldValue]);


                        return (

                            <form onSubmit={handleSubmit} className='form_div_sell'>

                                <div className='form-main-sell'>
                                    <div className='heading_div_sell'>
                                        <span className='heading'>SELL FORM</span>
                                    </div>
                                    <div className='btn_div'>

                                        <div className='switchBtn_div_sell'>

                                            <button className='switchBtn_sell' onClick={() => navigate(-1)}> <NavigateBeforeIcon /> Back </button>
                                        </div>
                                        <div className='switchBtn_div_sell'>

                                            <button className='switchBtn_sell' onClick={() => navigate('/buyForm')}>Buy </button>
                                        </div>
                                    </div>



                                    <div >
                                        <Box component="form"
                                            sx={{ '& .MuiTextField-root': { m: 2, width: '38ch' } }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <div className='form_sell'>

                                                <TextField
                                                    select
                                                    label="Stock Name"
                                                    name="stock_id"
                                                    value={values.stock_id}
                                                    error={touched.stock_id && Boolean(errors.stock_id)}
                                                    required
                                                    onChange={(e) => {
                                                        const selectedId = e.target.value;
                                                        const selectedStock = holdings.find(stock => stock.stock_id === selectedId);
                                                        setFieldValue("stock_id", selectedId);
                                                        setFieldValue("stockName", selectedStock?.stock_name || "");
                                                        setFieldValue("holding_quantity", selectedStock?.holding_quantity || 0);
                                                    }}
                                                    fullWidth
                                                >
                                                    <MenuItem value="">
                                                        <em>Select a Stock</em>
                                                    </MenuItem>
                                                    {loading ? (
                                                        <MenuItem disabled>Loading...</MenuItem>
                                                    ) : (
                                                        holdings.map((holding) => (
                                                            <MenuItem value={holding.stock_id} key={holding.stock_name}>
                                                                {holding.stock_name}
                                                            </MenuItem>



                                                        ))
                                                    )}

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
                                                    label={`QTY (Max: ${values.holding_quantity || 0})`}
                                                    type="number"
                                                    placeholder="Sell QTY..."
                                                    name="sell_QTY"
                                                    error={touched.sell_QTY && Boolean(errors.sell_QTY)}
                                                    onBlur={handleBlur}
                                                    value={values.sell_QTY === 0 ? "" : values.sell_QTY}
                                                    inputProps={{ inputMode: "decimal", min: 0, step: 1 }}
                                                    onChange={(e) => {
                                                        const inputVal = parseFloat(e.target.value);
                                                        const maxQuantity = values.holding_quantity || 0;
                                                        let finalVal;

                                                        if (isNaN(inputVal) || e.target.value === "") {
                                                            finalVal = "";
                                                        } else if (inputVal > maxQuantity) {
                                                            finalVal = maxQuantity;
                                                        } else {
                                                            finalVal = inputVal;
                                                        }
                                                        // Update the Formik field value
                                                        setFieldValue("sell_QTY", finalVal);
                                                        // Use the new capped value for the internal change handler
                                                        handleChange({
                                                            target: {
                                                                name: e.target.name,
                                                                value: finalVal === "" ? 0 : parseFloat(finalVal), // Always pass a number to the reducer/effects
                                                            },
                                                        });
                                                    }}
                                                    required
                                                />
                                                <TextField
                                                    id="outlined-required"
                                                    label="Rate"
                                                    placeholder="buy rate..."
                                                    name='sell_rate'
                                                    type="number"
                                                    error={touched.sell_rate && Boolean(errors.sell_rate)}
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
                                                    value={values.sell_rate === 0 ? "" : values.sell_rate}


                                                    required
                                                />
                                                <TextField

                                                    id="outlined-required"
                                                    label="Amount"
                                                    placeholder="sell amount..."
                                                    name='sell_amount'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={Number(values.sell_amount).toFixed(2)}
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
                                                    placeholder="Broker Amount ..."
                                                    name='sell_broker_amount'
                                                    type="number"
                                                    onBlur={handleBlur}
                                                    value={values.sell_broker_amount === 0 ? "" : values.sell_broker_amount}
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
                                                    label="CDC Amount"
                                                    placeholder="cdc amount ..."
                                                    name='sell_cdc_amount'
                                                    type="number"
                                                    onBlur={handleBlur}
                                                    value={values.sell_cdc_amount === 0 ? "" : values.sell_cdc_amount}
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
                                                    label="SST Amount"
                                                    placeholder="sst amount ..."
                                                    name='sell_sst_amount'
                                                    type="number"
                                                    onBlur={handleBlur}
                                                    value={values.sell_sst_amount === 0 ? "" : values.sell_sst_amount}
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
                                                    label="Net Amount"
                                                    placeholder="net amount..."
                                                    name='net_amount'
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    value={Number(values.net_amount).toFixed(2)}
                                                    slotProps={{
                                                        input: {
                                                            readOnly: true,
                                                        },
                                                    }}
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
