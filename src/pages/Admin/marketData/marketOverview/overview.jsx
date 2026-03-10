import React, { useEffect, useState, useRef } from 'react';
import { Formik, ErrorMessage } from 'formik';
import { useDispatch, useSelector } from "react-redux";
import "./overview.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { OverviewIndex } from '../marketOverviewList/overviewIndex';
import * as Yup from "yup";
import MenuItem from '@mui/material/MenuItem';
import api from "../../../../api/axios"; 
import { fetchOverview, selectAllOverview } from "../../../backEnd/Redux/overviewSlice.js";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const OverviewSchema = Yup.object().shape({
    date: Yup.string().required("Date is required"),
    marketStatus: Yup.string().required("Market status is required"),
    currentIndex: Yup.number().required("Current index is required"),
    change: Yup.number().required("Change is required"),
    percentChange: Yup.number().required("Percent change is required"),
    high: Yup.number().required("High is required"),
    low: Yup.number().required("Low is required"),
    volume: Yup.number().required("Volume is required"),
    previousClose: Yup.number().required("Previous close is required"),
    value: Yup.number().required("Value is required"),
});

export const OverView = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

    const dispatch = useDispatch()
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    const [value, setValue] = React.useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const addData = async (values) => {
        try {
            await api.post('/marketoverview/marketoverview/', {
                date: values.date,
                market_status: values.marketStatus,
                current_index: Number(values.currentIndex),
                index_change: Number(values.change),
                index_percent_change: Number(values.percentChange),
                index_high: Number(values.high),
                index_low: Number(values.low),
                volume: Number(values.volume),
                previous_close: Number(values.previousClose),
                value: Number(values.value),
            });

            dispatch(fetchOverview());
            setSnackbarMessage('Overview created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);

            setValue({
                date: '',
                market_status: '',
                current_index: '',
                index_change: '',
                index_percent_change: '',
                index_high: '',
                index_low: '',
                volume: '',
                previous_close: '',
                value: '',
            });

        } catch (error) {
            console.error(error.response?.data || error);
            setSnackbarMessage('Something went wrong');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };


    return (

        <div>
            <motion.div
                ref={refOne}
                initial={{ opacity: 0, x: -100 }}
                animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}
            >

                <Formik
                    initialValues={{
                        marketStatus: '',
                        currentIndex: '',
                        change: '',
                        percentChange: '',
                        high: '',
                        low: '',
                        volume: '',
                        previousClose: '',
                        value: '',
                        date: ''
                    }}
                    validationSchema={OverviewSchema}
                    onSubmit={(values, { resetForm }) => {
                        addData(values)
                        resetForm();
                    }}
                >
                    {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                        <form onSubmit={handleSubmit} className='highlights_form_div'>
                            <div className='form_highlights'>
                                <div>
                                    <span className='highlights_heading'>Market Overview</span>
                                </div>

                                <div >
                                    <Box sx={{ '& .MuiTextField-root': { m: 1, width: isMobile ? '32ch': '60ch' } }}
                                        autoComplete="off"
                                        className=''
                                    >
                                        <div className='highlights_form_main'>

                                            <TextField
                                                id="outlined-required"
                                                label="Date"
                                                type="date"
                                                name="date"
                                                value={values.date}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                InputLabelProps={{ shrink: true }}
                                                error={touched.date && Boolean(errors.date)}
                                                helperText={touched.date && errors.date}
                                                required
                                                fullWidth 
                                            />

                                            <TextField
                                                id="outlined-required"
                                                select
                                                label="Market Status"
                                                name="marketStatus"
                                                value={values.marketStatus}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={touched.marketStatus && Boolean(errors.marketStatus)}
                                                helperText={touched.marketStatus && errors.marketStatus}
                                                required
                                                fullWidth 
                                            >
                                                <MenuItem value="Open">Open</MenuItem>
                                                <MenuItem value="Closed">Closed</MenuItem>
                                            </TextField>

                                            <TextField
                                                id="outlined-required"
                                                label="Current Index"
                                                placeholder="current index..."
                                                name='currentIndex'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.currentIndex}
                                                type="number"
                                                error={touched.currentIndex && Boolean(errors.currentIndex)}
                                                helperText={touched.currentIndex && errors.currentIndex}
                                                fullWidth 
                                            />

                                            <TextField
                                                id="outlined-required"
                                                label="Change"
                                                placeholder="change..."
                                                name='change'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.change}
                                                type="number"
                                                error={touched.change && Boolean(errors.change)}
                                                helperText={touched.change && errors.change}
                                                fullWidth 
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
                                                error={touched.percentChange && Boolean(errors.percentChange)}
                                                helperText={touched.percentChange && errors.percentChange}
                                                fullWidth 
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
                                                error={touched.high && Boolean(errors.high)}
                                                helperText={touched.high && errors.high}
                                                fullWidth 
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
                                                error={touched.low && Boolean(errors.low)}
                                                helperText={touched.low && errors.low}
                                                fullWidth 
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
                                                error={touched.volume && Boolean(errors.volume)}
                                                helperText={touched.volume && errors.volume}
                                                fullWidth 
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
                                                error={touched.previousClose && Boolean(errors.previousClose)}
                                                helperText={touched.previousClose && errors.previousClose}
                                                fullWidth 
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
                                                error={touched.value && Boolean(errors.value)}
                                                helperText={touched.value && errors.value}
                                                fullWidth 
                                            />
                                        </div>

                                    </Box>
                                </div>
                                <div>
                                    <Box sx={{ '& > :not(style)': { m: 1, ml: -10 } }}>
                                        <Fab variant="extended" color="primary" type="submit" disabled={!isValid}>
                                            <SendIcon sx={{ mr: 1.5 }} />
                                            Submit
                                        </Fab>
                                    </Box>
                                </div>
                            </div>
                        </form>
                    )}

                </Formik>
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
                            backgroundColor: 'rgba(15, 134, 231, 0.94)',
                            color: '#fff',

                        }}
                        elevation={6}
                        variant="filled"
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>

                {/* className='index' */}
                <div >
                    <OverviewIndex />
                </div>

            </motion.div>
        </div>


    )
}
