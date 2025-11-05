import { Formik } from "formik";
import React, { useEffect, useState, useMemo } from 'react'; 
import './editJournalForm.css'
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { setJournal_from } from '../../../Redux/tradingJournalSlice';
import { useDispatch, useSelector } from "react-redux";
import { setTradingJournal_EditForm, selectJournalById,selectCurrentJournalEntry } from '../../../Redux/tradingJournalSlice'; // Adjust path if needed
import { selectAllTradingJournal, updateTradingJournal, getTradingJournalById,
       setSelectedJournalId } from "../../../Redux/tradingJournalSlice";
import { fetchStocks, selectAllStocks } from "../../../Redux/stockSlice"; // ⭐ Import stock actions/selectors ⭐
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom'; 




export const Edit_JournalForm = () => {
    const dispatch = useDispatch();
    const stockName = []; 
    const journal = useSelector(selectCurrentJournalEntry); 
    const formType = useSelector(state => state.tradingJournal.formType);
    const currentJournal = useSelector(selectCurrentJournalEntry);
    const allStocks = useSelector(selectAllStocks);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' | 'error'
    const navigate = useNavigate();
    const stockIdToNameMap = useMemo(() => {
    
            const map = {};
            allStocks.forEach(stock => {
                map[stock.id] = stock.name;
            });
            return map;
        }, [allStocks]); 
    
       const getStockName = (stockId) => {
        return stockIdToNameMap[stockId] || `ID: ${stockId} (Unknown)`;
       };
   
    const initialValues = useMemo(() => ({
            _id: currentJournal?._id || currentJournal?.id || '',
            stock: currentJournal?.stock || '',
            entry_date: currentJournal?.entry_date || '',
            market_conditions: currentJournal?.market_conditions || '',
            entry_reasons: currentJournal?.entry_reasons || '',
            source_of_trade: currentJournal?.source_of_trade || '',
            trade_type: currentJournal?.trade_type || '',
            entry_price: currentJournal?.entry_price || 0,
            no_of_shares: currentJournal?.no_of_shares || 0,
            average_price: currentJournal?.average_price || 0,
            exit_date: currentJournal?.exit_date || '',
            exit_price: currentJournal?.exit_price || 0,
            profit_loss: currentJournal?.profit_loss || 0,
            total_duration: currentJournal?.total_duration || 0,
            scrip_behaviour: currentJournal?.scrip_behaviour || '',
            reasons_of_exit: currentJournal?.reasons_of_exit || '',
            lesson_learnt: currentJournal?.lesson_learnt || '',
            iff: currentJournal?.iff || '',
            status: currentJournal?.status || 'Open'
        }), [currentJournal]);

    
    

    return (
        <div className="Edit_journal_form_main">
            <div className="Edit_journal_heading_div">
                <span className="Edit_journal_heading">Edit</span>
            </div>
             <div className='back_btn' onClick={() => navigate(-1)}>
                                <NavigateBeforeIcon />
                                <span>Back</span>
                            </div>
            <div className="Edit_journal_form">
                <Formik
                        enableReinitialize                       
                        initialValues={initialValues}
                        onSubmit={(values) => {                            
                        const id = values._id || values.id;
                        if (!id) {
                            setSnackbarMessage("Journal ID is missing. Cannot update.");
                            setSnackbarSeverity("error");
                            setSnackbarOpen(true); 
                            return;
                        }

                    const updatedValues = {
                        id,
                        stock: values.stock, // Make sure this is an ID, not name
                        entry_date: values.entry_date,
                        entry_price: parseFloat(values.entry_price),
                        trade_type: values.trade_type, 
                        entry_reasons: values.entry_reasons,
                        source_of_trade: values.source_of_trade,
                        market_conditions: values.market_conditions,
                        no_of_shares: values.no_of_shares,
                        average_price: parseFloat(values.average_price),
                        exit_date: values.exit_date,
                        exit_price: parseFloat(values.exit_price),
                        profit_loss: parseFloat(values.profit_loss),
                        total_duration: values.total_duration,
                        scrip_behaviour: values.scrip_behaviour,
                        reason_of_exit: values.reasons_of_exit, 
                        lesson_learnt: values.lesson_learnt,
                        iff: values.iff,                         
                        status: values.status,
                    };
                     try {
                            dispatch(updateTradingJournal(updatedValues)).unwrap();
                            setSnackbarMessage("✅ Trading Journal updated successfully!");
                            setSnackbarSeverity("success");
                            setSnackbarOpen(true);
                            //dispatch(setJournal_from());
                            //dispatch(setProfileComponent(5));
                            
                        } catch (error) {
                            console.error("Update failed:", error);
                            setSnackbarMessage("❌ Failed to update Trading Journal. Please try again.");
                            setSnackbarSeverity("error");
                            setSnackbarOpen(true);
                        }

                    
                    }}

                        
                        >                   

                    {({ values, handleBlur, handleChange, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="Edit_journal_form_div">
                                <TextField
                                    label="Stock Name"
                                    name="stock"
                                    placeholder="Stock Name"
                                    value={getStockName(values.stock)}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="Edit_journal_inputField"
                                    sx={{ margin: '5px' }}
                                    />
                                <TextField
                                    label="Entry Date"
                                    type="date"
                                    name="entry_date"
                                    value={values.entry_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    className="Edit_journal_inputField"
                                    sx={{ margin: '5px' }}


                                />
                                <TextField
                                    id="outlined-required"
                                    label="Trade Type"
                                    type="text"
                                    placeholder="Trade Type..."
                                    name='trade_type'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.trade_type}
                                    className="Edit_journal_inputField"
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Entry Price"
                                    type="text"
                                    placeholder="Entry Price ..."
                                    name='entry_price'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={parseFloat(values.entry_price).toFixed(2)}
                                    className="Edit_journal_inputField"
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="No Of Shares"
                                    type="number"
                                    placeholder="No Of Shares..."
                                    name='no_of_shares'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.no_of_shares}
                                    className="Edit_journal_inputField"
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Average Price"
                                    type="number"
                                    placeholder="Average Price..."
                                    name='average_price'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={parseFloat(values.average_price).toFixed(2)}
                                    className="Edit_journal_inputField"
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                   label="Exit Date"
                                    type="date"
                                    name="exit_date"
                                    value={values.exit_date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    InputLabelProps={{ shrink: true }}
                                    className="Edit_journal_inputField"
                                    sx={{ margin: '5px' }}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Exit Price"
                                    type="number"
                                    placeholder="Exit Price..."
                                    name='exit_price'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={parseFloat(values.exit_price).toFixed(2)}
                                    className="Edit_journal_inputField"
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Profite / Loss"
                                    type="number"
                                    placeholder="Profite / Loss..."
                                    name='profit_loss'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={parseFloat(values.profit_loss).toFixed(2)}
                                    className="Edit_journal_inputField"
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
                                    id="outlined-required"
                                    label="Market Conditions"
                                    type="number"
                                    placeholder="Market Conditions..."
                                    name='market_conditions'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.market_conditions}
                                    className="Edit_journal_inputField"
                                    multiline
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Entry Reasons"
                                    type="text"
                                    placeholder="Entry Reasons..."
                                    name='entry_reasons'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.entry_reasons}
                                    className="Edit_journal_inputField"
                                    multiline
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Source Of Trade"
                                    type="text"
                                    placeholder="Source Of Trade..."
                                    name='source_of_trade'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.source_of_trade}
                                    className="Edit_journal_inputField"
                                    multiline
                                    sx={{margin: '5px'}}

                                />

                                <TextField
                                    id="outlined-required"
                                    label="Scrip Behaviour"
                                    type="text"
                                    placeholder="Scrip Behaviour..."
                                    name='scrip_behaviour'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.scrip_behaviour}
                                    className="Edit_journal_inputField"
                                    multiline
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Reasons Of Exit"
                                    type="text"
                                    placeholder="Reasons Of Exit..."
                                    name='reasons_of_exit'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.reasons_of_exit}
                                    className="Edit_journal_inputField"
                                    multiline
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="Lesson Learnt"
                                    type="text"
                                    placeholder="Lesson Learnt..."
                                    name='lesson_learnt'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.lesson_learnt}
                                    className="Edit_journal_inputField"
                                    multiline
                                    sx={{margin: '5px'}}

                                />
                                <TextField
                                    id="outlined-required"
                                    label="If ?"
                                    type="text"
                                    placeholder="If ?..."
                                    name='iff'
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.iff}
                                    className="Edit_journal_inputField"
                                    multiline
                                    sx={{margin: '5px'}}

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
                                className="Edit_journal_inputField"
                                multiline
                                sx={{ margin: '5px' }}
                              
                            />


                            </div>
                            <div className="Edit_submit_btn_din">

                                <Fab variant="extended" color="primary" type="submit" sx={{borderRadius:'10px'}}>
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
    )
}