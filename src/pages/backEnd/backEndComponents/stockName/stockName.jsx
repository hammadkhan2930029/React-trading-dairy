import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./stockName.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";


import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector} from "react-redux";
import { fetchStocks, selectAllStocks } from "../../Redux/stockSlice";



export const StockName = () => {
    const dispatch = useDispatch();
    const stocks = useSelector(selectAllStocks);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

/*
// Backend say stock fetch from DB ka function
const handlefetchStocks = async ( { setSubmitting }) => {
try {
await dispatch(fetchStocks()).unwrap();
alert("Stock fetched")
console.log("Stock fetched from DB successfully in DB:")
} catch (error) {
console.log("failed - Full Error:");
alert(error);
} finally {
setSubmitting(false);
}
};
*/
// Backend par stock send into Db bhejne ka function
const handlecreateStocks = async (values, { setSubmitting }) => {
try {
const result = await dispatch(createStocks(values)).unwrap();
console.log("Stock  submitted successfully in DB:", result);
alert("Stocks  submitted successfully in DB!");
} catch (error) {
console.error("Error submitting Stocks :", error);
alert("Submission failed. Please check your input.");
} finally {
setSubmitting(false);
}
};
    return (

        <motion.div 
        ref={refOne}
        initial={{ opacity: 0, y: -100 }}
        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: .8 }}>
            <Formik
                initialValues={{
                    stock_name: '',
                    symbol: ''
                }}
                

                onSubmit={async (values, { setSubmitting, resetForm }) => {
                    console.log("Form submitted with:", values);
                    await handlecreateStocks(values,  {setSubmitting} );
                    resetForm();
                      }}
                      >
                {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        <div className='form-main-stock'>
                            <div>
                                <span className='heading'>Stock Name</span>
                            </div>
                            <div >
                                <Box
                                    sx={{ '& .MuiTextField-root': { m: 2, width: isMobile ? '32ch': '60ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    className='form'>
                                    <div>
                                        <TextField                                       
                                        label="Stock Full  Name"
                                        name="stock_name"
                                        onChange={handleChange}
                                        type="text"
                                        onBlur={handleBlur}
                                        value={values.stock_name}
                                      >
                                        
                                    </TextField>                                     


                                    <TextField                                            
                                        id="outlined-required"
                                        label="Short form"
                                        type="text"                                            
                                        placeholder="Short form..."
                                        name='symbol'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.symbol}
                                    />
                                    </div>

                                </Box>

                            </div>

                            <Box sx={{ '& > :not(style)': { m: 1 } }}>

                                <Fab variant="extended" color="primary" type="submit">
                                    <SendIcon sx={{ mr: 1.5 }} />
                                    Submit
                                </Fab>
                            </Box>

                        </div>
                    </form>
                )}

            </Formik>
        </motion.div>

    )
}
