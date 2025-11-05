import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./stockName.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";



export const StockName = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const refOne = React.useRef(null);
  

    const inViewOne = useInView(refOne, { triggerOnce: true });
   

    return (

        <motion.div 
        ref={refOne}
        initial={{ opacity: 0, y: -100 }}
        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: .8 }}>
            <Formik
                initialValues={{
                    fullStockName: '',
                    shortForm: ''
                }}
                onSubmit={(values, { resetForm }) => {
                    addData(values)
                    resetForm();
                }}>
                {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        <div className='form-main-stock'>
                            <div>
                                <span className='heading'>Stock Name</span>
                            </div>



                            <div >
                                <Box component="form"
                                    sx={{ '& .MuiTextField-root': { m: 2, width: isMobile ? '32ch': '60ch' } }}
                                    noValidate
                                    autoComplete="off"
                                    className='form'>
                                    <div>
                                        <TextField
                                            id="outlined-required"
                                            label="Full Stock Name"
                                            type="text"
                                            placeholder="Full Stock Name..."
                                            name='fullStockName'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.fullStockName}
                                        />


                                        <TextField
                                            id="outlined-required"
                                            label="Short form"
                                            type="text"
                                            
                                            placeholder="Short form..."
                                            name='shortForm'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.shortForm}
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
