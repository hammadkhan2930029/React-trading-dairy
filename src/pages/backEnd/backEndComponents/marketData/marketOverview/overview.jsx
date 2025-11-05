import React, { useEffect, useState, useRef } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./overview.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector} from "react-redux";
import { OverviewIndex } from '../marketOverviewList/overviewIndex';
import { fetchOverview, selectAllOverview } from "../../../Redux/overviewSlice.js"; // Import fetchOverview and selectAllOverview
import { CircularProgress, Alert, Typography } from '@mui/material'; // Material-UI components for loading/error
import { useAdminStatus } from '../../../../hooks/useAdminStatus'; // <--- Import the custom hook
import api from '../../../../../api/axios'; 
import withSkeleton from "../../../../component/Skeletons/withSkeleton.jsx";


export const OverView = () => {
    const dispatch = useDispatch();
    const { isAdmin, checked } = useAdminStatus();
    const overviewData = useSelector(selectAllOverview);
    const loading = useSelector(state => state.overview.loading);
    const error = useSelector(state => state.overview.error);
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    const [value, setValue] = React.useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');


      // Fetch overview data for the "Current Daily Overview" section
    useEffect(() => {
        const today = new Date().toISOString().slice(0, 10);
        dispatch(fetchOverview(today));
    }, [dispatch]);

    // Function to show messages in a custom box
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('Data saved successfully!');
            setMessageType('');
        }, 5000);
    };

    // Function to handle data submission to Django backend
    const addData = async (values, resetForm) => {
        if (!isAdmin) {
            showMessage('Access Denied: You are not authorized to add data.', 'error');
            return;
        }

        // Map frontend camelCase to Django snake_case for API payload
        const marketDataToSave = {
            date: values.date || new Date().toISOString().slice(0, 10),
            market_status: values.marketStatus,
            current_index: parseFloat(values.currentIndex) || null,
            index_change: parseFloat(values.change) || null,
            index_percent_change: parseFloat(values.percentChange) || null,
            index_high: parseFloat(values.high) || null,
            index_low: parseFloat(values.low) || null,
            volume: parseInt(values.volume) || null,
            previous_close: parseFloat(values.previousClose) || null,
            value: parseFloat(values.value) || null,
        };

        try {
            const response = await api.post('marketoverview/marketoverview/', marketDataToSave);

            showMessage(response.data.message || `Market data for ${marketDataToSave.date} saved successfully!`, 'success');
            dispatch(fetchOverview(marketDataToSave.date));
            alert('Market data saved successfully!');
            resetForm();

        } catch (error) {
            console.error("Error saving market overview data: ", error.response?.data || error.message);
            showMessage(`Failed to save market overview data: ${error.response?.data?.detail || error.message}`, 'error');
        }
    };

    const currentOverview = overviewData.length > 0 ? overviewData[0] : null;

    // Helper function to render a single market info row for the admin display
    const renderAdminOverviewRow = (label, value) => {
        if (value === null || value === undefined || value === '') {
            return null;
        }

        let formattedValue = value;
        if (typeof value === 'string') {
            if (label === "Percent Change") {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    formattedValue = `${numValue.toFixed(2)}%`;
                }
            } else if (label === "Volume" || label === "Value") {
                const numValue = parseInt(value.replace(/,/g, ''), 10);
                if (!isNaN(numValue)) {
                    formattedValue = numValue.toLocaleString();
                }
            } else if (label !== "Market Status") {
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    formattedValue = numValue.toFixed(2);
                }
            }
        } else if (typeof value === 'number') {
             if (label === "Percent Change") {
                formattedValue = `${value.toFixed(2)}%`;
            } else if (label === "Volume" || label === "Value") {
                formattedValue = value.toLocaleString();
            } else {
                formattedValue = value.toFixed(2);
            }
        }

        let valueColorClass = '';
        if (label === "Change" || label === "Percent Change") {
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
                if (numValue > 0) {
                    valueColorClass = 'text-green-600';
                } else if (numValue < 0) {
                    valueColorClass = 'text-red-600';
                }
            }
        }

        return (
            <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0" key={label}>
                <span className="text-sm font-medium text-gray-600">{label}:</span>
                <span className={`text-sm font-semibold ${valueColorClass}`}>{formattedValue}</span>
            </div>
        );
    };

    const adminDisplayFields = [ ];
    

    return (
        <div>
            <motion.div
                ref={refOne}
                initial={{ opacity: 0, x: -100 }}
                animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}>

                 {/* Conditional Admin Form Section */}
            {!checked ? (
                <div className="flex items-center justify-center min-h-[200px] bg-gray-100 p-6 rounded-lg shadow-md max-w-xl mx-auto mt-8">
                    <CircularProgress size={24} className="mr-3" />
                    <Typography variant="h6" className="text-gray-700">Checking admin access...</Typography>
                </div>
            ) : isAdmin ? (
                <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl mb-8">
                   
                    {/* Display Current Market Overview for Admin */}
                    <div className="mb-8 p-4 bg-blue-50 rounded-md border border-blue-200">
                         {loading === 'pending' && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                                <CircularProgress size={20} />
                                <Typography ml={1} className="text-blue-700 text-sm">Loading current data...</Typography>
                            </Box>
                        )}
                        {loading === 'failed' && error && (
                            <Alert severity="error" sx={{ my: 2 }}>
                                Error current data: {typeof error === 'string' ? error : JSON.stringify(error)}
                            </Alert>
                        )}
                        {loading === 'succeeded' && !currentOverview && (
                            <Typography variant="body2" color="textSecondary" className="text-center text-blue-600">
                                No data.
                            </Typography>
                        )}
                        {loading === 'succeeded' && currentOverview && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                {adminDisplayFields.map(field =>
                                    renderAdminOverviewRow(field.label, currentOverview[field.key])
                                )}
                            </div>
                        )}
                    </div>

                    {/* Market Overview Data Entry Form */}
                    <Formik
                        initialValues={{
                            marketStatus: '',
                            currentIndex: 0,
                            change: 0,
                            percentChange: 0,
                            high: 0,
                            low: 0,
                            volume: 0,
                            previousClose: 0,
                            value: 0,
                            date: new Date().toISOString().slice(0, 10)
                        }}
                        onSubmit={(values, { resetForm }) => {
                            addData(values, resetForm);
                        }}
                    >
                 
               
                    {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className='highlights_form_div'>

                            <div className='form_highlights'>
                                <div>
                                    <span className='highlights_heading'>Market Overview</span>
                                </div>
                               

                                <div >

                                    <Box component="form"
                                        sx={{ '& .MuiTextField-root': { m: 2, width: '38ch' } }}
                                        noValidate
                                        autoComplete="off"
                                    >
                                        <div className='highlights_form_main'>

                                            <TextField
                                                id="outlined-required"
                                                label="Date"
                                                selected={values.date}
                                                onChange={(date) => handleChange({ target: { name: "trade_date", value: date } })} // Handle date change
                                                onBlur={handleBlur}
                                                type="date"
                                                name="date"
                                                InputLabelProps={{ shrink: true }}
                                                required

                                            />

                                            <TextField
                                                id="outlined-required"
                                                label="Market Status"
                                                type="text"
                                                placeholder="Market status..."
                                                name='marketStatus'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.marketStatus}
                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="Current Index"
                                                placeholder="current index..."
                                                name='currentIndex'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.currentIndex}
                                                type="number"

                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="change"
                                                placeholder="change..."
                                                name='change'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.change}
                                                type="number"

                                            />

                                            <TextField
                                                id="outlined-required"
                                                label="Percent Change"
                                                placeholder="percent change..."
                                                name='percentChange'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.percentChange}
                                                type="number"

                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="High"
                                                placeholder="High ..."
                                                name='high'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.high}
                                                type="number"

                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="Low"
                                                placeholder="Low ..."
                                                name='low'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.low}
                                                type="number"

                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="Volume"
                                                placeholder="Volume..."
                                                name='volume'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.volume}
                                                type="number"


                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="Previous Close"
                                                placeholder="previous close..."
                                                name='previousClose'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.previousClose}
                                                type="number"


                                            />
                                            <TextField
                                                id="outlined-required"
                                                label="value"
                                                placeholder="value..."
                                                name='value'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.value}
                                                type="number"


                                            />



                                        </div>


                                    </Box>

                                </div>
                                <div>

                                    <Box sx={{ '& > :not(style)': { m: 1, ml: -10 } }}>

                                        <Fab variant="extended" color="primary" type="submit">
                                            <SendIcon sx={{ mr: 1.5 }} />
                                            Submit
                                        </Fab>
                                    </Box>
                                </div>


                            </div>
                        </form>
                    )}


                </Formik></div>
            ) : (
                <div className="flex items-center justify-center min-h-[200px] bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow-md max-w-xl mx-auto mt-8">
                    <Typography variant="h6" className="text-center font-semibold">
                        Access Denied:
                    </Typography>
                </div>
            )}

            {/* Always visible Overview Index - Moved outside the isAdmin conditional block */}
            <div className='index mt-8'>
              <OverviewIndex/>
            </div>
        </motion.div>
        </div>


    )
}
export default withSkeleton(OverView, 'overview');