import React, { useEffect, useState, useRef } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./summary.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from '@mui/material/MenuItem';
import { SummaryIndex } from '../marketSummaryIndex/summaryIndex';
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { CircularProgress, Alert, Typography } from '@mui/material';
import { useAdminStatus } from '../../../../hooks/useAdminStatus'; 
import api from '../../../../../api/axios'; 
import { fetchSummary, selectAllsummary } from "../../../Redux/summarySlice.js"; 
import withSkeleton from "../../../../component/Skeletons/withSkeleton.jsx";



const stockName = [];
export const Summary = () => {
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    // -----------------------------------------------------
    const fileInputRef = useRef(null);
    const dispatch = useDispatch();
    const summary = useSelector(selectAllsummary);
    const error = useSelector(state => state.summary.error);
    const { isAdmin, checked } = useAdminStatus();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false); 
  

    useEffect(() => {
            const today = new Date().toISOString().slice(0, 10);
            dispatch(fetchSummary(today));
        }, [dispatch]);
    

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const fileExtension = file.name.split('.').pop().toLowerCase();

        const reader = new FileReader();

        reader.onload = (e) => {
            const data = e.target.result;

            if (fileExtension === 'csv') {
                Papa.parse(data, {
                    header: true, 
                    skipEmptyLines: true, 
                    complete: (result) => {
                        console.log("CSV Data :", result.data);
                        showMessage('CSV file parsed. Data logged to console.', 'success');
                    },
                    error: (err) => {
                        showMessage(`Error parsing CSV: ${err.message}`, 'error');
                    }
                });

            } else if (fileExtension === 'xlsx') {
                try {
                    const workbook = XLSX.read(data, { type: "binary" });
                    const sheetname = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetname];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                    console.log("Excel Data :", jsonData);
                    showMessage('Excel file parsed. Data logged to console.', 'success');
                } catch (e) {
                    showMessage(`Error parsing Excel: ${e.message}`, 'error');
                }
            } else {
                showMessage("Only CSV and Excel files are supported", 'error');
            }
        };
        reader.readAsBinaryString(file); 
    };

    // Function to show messages in a custom box
    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        const timer = setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000); // Message disappears after 5 seconds
        return () => clearTimeout(timer);
    };

    // Function to handle data submission to Django backend
    const addData = async (values, resetForm) => {
        if (!isAdmin) {
            //showMessage('Access Denied: You are not authorized to add data.', 'error');
            return;
        }

        setLoading(true); // Start loading

        // Map frontend camelCase to Django snake_case for API payload
        const marketSummaryToSave = {
            scrip: values.scrip,
            ldcp: parseFloat(values.ldcp) || null,
            open: parseFloat(values.open) || null,
            high: parseFloat(values.high) || null,
            low: parseFloat(values.low) || null,
            current: parseFloat(values.current) || null,
            change: parseFloat(values.change) || null,
            volume: parseInt(values.volume) || null,
            date: values.date || new Date().toISOString().slice(0, 10), // Use current date if not provided
        };

        try {
            const response = await api.post('marketsummary/marketsummary/', marketSummaryToSave);
            showMessage(response.data.message || `Market summary for ${marketSummaryToSave.scrip} on ${marketSummaryToSave.date} saved successfully!`, 'success');
            resetForm(); 

        } catch (error) {
            console.error("Error saving market summary data: ", error.response?.data || error.message);
            showMessage(`Failed to save market summary data: ${error.response?.data?.detail || error.message}`, 'error');
        } finally {
            setLoading(false); 
        }
    };

    


    return (

        <motion.div
            ref={refOne}
            initial={{ opacity: 0, x: 100 }}
            animate={inViewOne ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: .8 }}>

                 {/* Conditional Rendering based on useAdminStatus hook */}
            {!checked ? (
                <div className="flex items-center justify-center min-h-[200px] bg-gray-100 p-6 rounded-lg shadow-md max-w-xl mx-auto mt-8">
                    <CircularProgress size={24} className="mr-3" />
                    <Typography variant="h6" className="text-gray-700">Checking admin access...</Typography>
                </div>
            ) : isAdmin ? (
                <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-xl mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Market Summary Data Entry</h2>

                    {/* Feedback message (Success/Error) */}
                    {message && (
                        <Alert severity={messageType} sx={{ my: 2 }}>
                            {message}
                        </Alert>
                    )}                
           
                 <Formik
                        initialValues={{
                            scrip: '', 
                            open: 0,
                            high: 0,
                            low: 0,
                            current: 0,
                            change: 0,
                            volume: 0,
                            date: new Date().toISOString().slice(0, 10), 
                        }}
                        onSubmit={(values, { resetForm }) => {
                            addData(values, resetForm);
                        }}
                    >
                  

            

                {({ handleBlur, handleChange, handleSubmit, values, }) => (
                    <form onSubmit={handleSubmit} className='summary_form_div'>

                        <div className='form_summary'>
                            <div className='summary_heading_div'>
                                <span className='summary_heading_2'>Market Summary</span>
                            </div>
                            <div className='summary_from_import_div'>

                                <div style={{ textAlign: "center", marginTop: "30px" }}>
                                    <button
                                        onClick={handleButtonClick}
                                        className='importBTN'
                                    >
                                        📥 Import Excel or CSV
                                    </button>

                                    <input
                                        type="file"
                                        accept=".csv,.xlsx"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileUpload}
                                    />
                                </div>
                            </div>


                            <div >
                                <Box component="form"
                                    sx={{ '& .MuiTextField-root': { m: 2, width: '38ch' } }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <div className='summary_form_main'>
                                        <TextField
                                            id="outlined-select-currency"
                                            select
                                            label="SCRIP"
                                            placeholder='SCRIP'
                                        >
                                            {stockName.map((option) => (
                                                <MenuItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </TextField>

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
                                            label="LDCP"
                                            type="text"
                                            placeholder="LDCP..."
                                            name='ldcp'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.ldcp}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="Open"
                                            placeholder="Open..."
                                            name='open'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.open}
                                            type="number"

                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="High"
                                            placeholder="High..."
                                            name='high'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.high}
                                            type="number"

                                        />

                                        <TextField
                                            id="outlined-required"
                                            label="Low"
                                            placeholder="Low..."
                                            name='low'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.low}
                                            type="number"

                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="Current"
                                            placeholder="Current ..."
                                            name='current'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.current}
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
                                            label="Change"
                                            placeholder="Change..."
                                            name='change'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.change}
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

                                    </div>

                                </Box>

                            </div>
                            <div className='submit_btn_div'>

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

            </Formik>
            </div>
            ) : (
                <div className="flex items-center justify-center min-h-[200px] bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg shadow-md max-w-xl mx-auto mt-8">
                    <Typography variant="h6" className="text-center font-semibold">
                        Access Denied: You do not have permission to view this content.
                    </Typography>
                </div>
            )}

            {/* Always visible Summary Index */}
            <div className='summary-index mt-8'>
                <SummaryIndex />
            </div>


        </motion.div>

    )
}
export default withSkeleton(Summary, 'summary');