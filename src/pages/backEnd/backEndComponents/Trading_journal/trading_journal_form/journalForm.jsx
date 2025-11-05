import { Formik } from "formik";
import React, { useEffect, useState, useMemo } from 'react';
import './journalForm.css';
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { setJournal_from } from '../../../Redux/tradingJournalSlice';
import { fetchStocks, createTrade, selectAllStocks, selectStockLoading } from "../../../Redux/stockSlice";
import { useDispatch, useSelector } from 'react-redux';
import MenuItem from '@mui/material/MenuItem';
import { selectAllTradingJournal, createTradingJournal } from "../../../Redux/tradingJournalSlice";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";


export const JournalForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const stocks = useSelector(selectAllStocks)
    const [selectedStock, setSelectedStock] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        dispatch(fetchStocks());
    }, [dispatch]);



    // ... rest of your component code (handleSubmitForm, return JSX)
    const handleSubmitForm = (values, { setSubmitting, resetForm }) => {
        if (!selectedStock || !selectedStock.id) {
            //alert('Please select a stock from the dropdown.');
            setSnackbarMessage("Please select a stock from the dropdown");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setSubmitting(false);
            return;
        }

        const payload = {
            stock: selectedStock.id,
            entry_date: values.entry_date || null,
            entry_price: parseFloat(values.entry_price).toFixed(2) || 0,
            trade_type: values.trade_type || 'Longterm Investment',
            no_of_shares: parseInt(values.no_of_shares) || 0,
            exit_date: values.exit_date && values.exit_date !== "" ? values.exit_date : null,

            exit_price: parseFloat(values.exit_price).toFixed(2) || 0,
            market_conditions: values.market_conditions,
            entry_reasons: values.entry_reasons,
            source_of_trade: values.source_of_trade,
            scrip_behaviour: values.scrip_behaviour,
            reasons_of_exit: values.reasons_of_exit,
            lesson_learnt: values.lesson_learnt,
            iff: values.iff,
            status: values.status || 'Open',
            average_price: parseFloat(values.average_price) || 0,
            profit_loss: parseFloat(values.profit_loss) || 0,
            total_duration: values.total_duration ? parseInt(values.total_duration, 10) : 0,


        };
        console.log('Payload being sent:', payload);
        dispatch(createTradingJournal(payload))
            .unwrap()
            .then(() => {
                // alert('Journal entry created successfully! 🎉');
                setSnackbarMessage("✅ Trading Journal updated successfully!🎉");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                resetForm();
                setSelectedStock(null);
            })
            .catch((error) => {
                console.error("Failed to create journal entry:", error);
                onsole.log("📤 Raw Formik values:", values);
                console.log("📤 Final payload:", payload);
                setSnackbarMessage("❌ Failed to update Trading Journal. Please try again.");
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
                //alert(`Failed to create journal entry: ${error.detail || error.message || JSON.stringify(error)}`);
            })
            .finally(() => {
                setSubmitting(false);
            });

        onsole.log("📤 Raw Formik values:", values);
        console.log("📤 Final payload:", payload);
    };

    return (
        <div className="journal_form_main">
            <div className="journal_heading_div">
                <span className="journal_heading">Trading Journal Form</span>
            </div>
            <div className='back_btn' onClick={() => navigate(-1)}>
                <NavigateBeforeIcon />
                <span>Back</span>
            </div>

            <div className="journal_form">
                <Formik
                    initialValues={{
                        script: null,
                        entry_date: '',
                        market_conditions: '',
                        entry_reasons: '',
                        source_of_trade: '',
                        trade_type: '',
                        entry_price: 0,
                        no_of_shares: 0,
                        average_price: 0,
                        exit_date: null,
                        exit_price: 0,
                        profit_loss: 0,
                        total_duration: 0,
                        scrip_behaviour: '',
                        reasons_of_exit: '',
                        lesson_learnt: '',
                        iff: '',
                        status: ''
                    }}
                    onSubmit={handleSubmitForm}
                >
                    {({ values, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="journal_form_div">

                                    <TextField
                                        select
                                        label="Stock Name"
                                        name="stock_id"
                                        InputLabelProps={{ shrink: true }}
                                        value={values.stock_id || ''}
                                        className="journal_inputField"
                                        sx={{ margin: '5px' }}
                                        disabled
                                        onChange={(e) => {
                                            const selectedId = parseInt(e.target.value);
                                            const foundStock = stocks.find(stock => stock.id === selectedId);
                                            // 1. Update Formik's internal state
                                            setFieldValue("stock_id", selectedId);
                                            setFieldValue("name", foundStock?.name || "");
                                            setSelectedStock(foundStock);
                                        }}

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
                                        id="entry-date-required"
                                        label="Entry Date"
                                        value={values.entry_date}
                                        type="date"
                                        name="entry_date"
                                        InputLabelProps={{ shrink: true }}
                                        className="journal_inputField"
                                        disabled
                                    sx={{ margin: '5px' }}
                                    />
                                    <TextField
                                        id="trade-type-required"
                                        label="Trade Type"
                                        type="text"
                                        placeholder="Trade Type (Longterm Investment/Longterm Swing)..."
                                        name='trade_type'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.trade_type}
                                        className="journal_inputField"
                                    sx={{ margin: '5px' }}

                                    />
                                    <TextField
                                        id="entry-price-required"
                                        label="Entry Price"
                                        type="number"
                                        placeholder="Entry Price ..."
                                        name='entry_price'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.entry_price}
                                        className="journal_inputField"
                                        sx={{ margin: '5px' }}
                                        inputProps={{ step: "0.01" }}
                                        disabled
                                    />
                                    <TextField
                                        id="no-of-shares-required"
                                        label="No Of Shares"
                                        type="number"
                                        placeholder="No Of Shares..."
                                        name='no_of_shares'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.no_of_shares}
                                        className="journal_inputField"
                                        sx={{ margin: '5px' }}
                                        disabled

                                    />
                                    <TextField
                                        id="avg-price-field"
                                        label="Average Price"
                                        type="number"
                                        placeholder="Average Price..."
                                        name='average_price'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.average_price}
                                        className="journal_inputField"
                                        sx={{ margin: '5px' }}
                                        inputProps={{ step: "0.01" }}

                                    />
                                    <TextField
                                        id="exit-date-field"
                                        label="Exit Date"
                                        type="date"
                                        name="exit_date"
                                        value={values.exit_date ?? ""}
                                        onChange={(event) => setFieldValue("exit_date", event.target.value || null)}
                                        onBlur={handleBlur}
                                        InputLabelProps={{ shrink: true }}
                                        className="journal_inputField"
                                    sx={{ margin: '5px' }}

                                    />

                                    <TextField
                                        id="exit-price-field"
                                        label="Exit Price"
                                        type="number"
                                        placeholder="Exit Price..."
                                        name="exit_price"
                                        onChange={(event) => {
                                            const value = event.target.value === "" ? null : event.target.value;
                                            handleChange({ target: { name: "exit_price", value } });
                                        }}
                                        onBlur={handleBlur}
                                        value={values.exit_price || ""}
                                        className="journal_inputField"
                                        sx={{ margin: '5px' }}
                                        inputProps={{ step: "0.01" }}
                                    />

                                    <TextField
                                        id="profit-loss-field"
                                        label="Profit / Loss"
                                        type="number"
                                        placeholder="Profit / Loss..."
                                        name='profit_loss'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.profit_loss}
                                        className="journal_inputField"
                                        sx={{ margin: '5px' }}
                                        inputProps={{ step: "0.01" }}
                                    // disabled
                                    //helperText="This field is usually calculated by the backend (Realized P/L)."
                                    />
                                    <TextField
                                        id="total-duration-field"
                                        label="Total Duration (Days)"
                                        type="number"
                                        placeholder="Total Duration..."
                                        name='total_duration'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.total_duration}
                                        className="journal_inputField"
                                    sx={{ margin: '5px' }}
                                    //disabled
                                    //helperText="This field is calculated by the backend."
                                    />
                                    <TextField
                                        id="market-conditions-field"
                                        label="Market Conditions"
                                        type="text"
                                        placeholder="Market Conditions..."
                                        name='market_conditions'
                                        onChange={handleChange}
                                        value={values.market_conditions}
                                        className="journal_inputField"
                                        multiline
                                    sx={{ margin: '5px' }}
                                    />
                                    <TextField
                                        id="entry-reasons-field"
                                        label="Entry Reasons"
                                        type="text"
                                        placeholder="Entry Reasons..."
                                        name='entry_reasons'
                                        onChange={handleChange}
                                        value={values.entry_reasons}
                                        className="journal_inputField"
                                        multiline
                                    sx={{ margin: '5px' }}
                                    />
                                    <TextField
                                        id="source-of-trade-field"
                                        label="Source Of Trade"
                                        type="text"
                                        placeholder="Source Of Trade..."
                                        name='source_of_trade'
                                        onChange={handleChange}
                                        value={values.source_of_trade}
                                        className="journal_inputField"
                                        multiline
                                    sx={{ margin: '5px' }}
                                    />
                                    <TextField
                                        id="scrip-behaviour-field"
                                        label="Scrip Behaviour"
                                        type="text"
                                        placeholder="Scrip Behaviour..."
                                        name='scrip_behaviour'
                                        onChange={handleChange}
                                        value={values.scrip_behaviour}
                                        className="journal_inputField"
                                        multiline
                                    sx={{ margin: '5px' }}
                                    />
                                    <TextField
                                        id="reasons-of-exit-field"
                                        label="Reasons Of Exit"
                                        type="text"
                                        placeholder="Reasons Of Exit..."
                                        name='reasons_of_exit'
                                        onChange={handleChange}
                                        value={values.reasons_of_exit}
                                        className="journal_inputField"
                                        multiline
                                    sx={{ margin: '5px' }}
                                    />
                                    <TextField
                                        id="lesson-learnt-field"
                                        label="Lesson Learnt"
                                        type="text"
                                        placeholder="Lesson Learnt..."
                                        name='lesson_learnt'
                                        onChange={handleChange}
                                        value={values.lesson_learnt}
                                        className="journal_inputField"
                                        multiline
                                    sx={{ margin: '5px' }}
                                    />
                                    <TextField
                                        id="if-field"
                                        label="If ?"
                                        type="text"
                                        placeholder="If ?..."
                                        name='iff'
                                        onChange={handleChange}
                                        value={values.iff}
                                        className="journal_inputField"
                                        multiline
                                    sx={{ margin: '5px' }}
                                    />
                               

                                    <TextField
                                        id="status-field"
                                        label="Status"
                                        type="text"
                                        placeholder="Open/Closed..."
                                        name='status'
                                        onChange={handleChange}
                                        value={values.status}
                                        // className="status_inputField"
                                         className="journal_inputField"
                                    sx={{ margin: '5px' }}
                                    //disabled
                                    //helperText="This field is managed by the backend based on Exit Date."
                                    />

                            </div>
                            <div className="submit_btn_din">
                                <Fab variant="extended" color="primary" type="submit" sx={{ borderRadius: '10px' }}>
                                    <SendIcon sx={{ mr: 1.5 }} />
                                    Submit
                                </Fab>
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
                                        backgroundColor: 'rgba(56, 116, 166, 1)',
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
            </div>
        </div>
    );
};