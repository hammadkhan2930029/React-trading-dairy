import React, { useState, useEffect } from 'react';
import { motion, useInView } from "framer-motion";
import './register.css';
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import Button from '@mui/material/Button';
import stock8 from '../../assets/stock-8.jpg';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../backEnd/Redux/loginSlice";
import {  registerUser } from '../../backEnd/Redux/authSlice'; 
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from 'yup';




export const Register = () => {
    const dispatch = useDispatch();    
    const navigate = useNavigate();
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    const status = useSelector((state) => state.auth.status);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
    const message = useSelector((state) => state.auth.message);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });

    const handleRegister = async (values, { setSubmitting }) => {
  try {
    const result = await dispatch(registerUser(values)).unwrap();
    setSnackbarMessage("Registration successful! Please check your email to verify your account.");
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
   
  } catch (error) {
  console.error("Registration failed", error);
  const backendError = error?.response?.data || error;

    //  EMAIL VALIDATION CHECK
    if (backendError?.email) {
      const backendMessage = Array.isArray(backendError.email)
        ? backendError.email[0]
        : backendError.email;

      if (
        backendMessage.toLowerCase().includes("already") ||
        backendMessage.toLowerCase().includes("exist")
      ) {
        setSnackbarMessage("Email already exists");
      } else {
        setSnackbarMessage(backendMessage || "Invalid email address.");
      }

      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSubmitting(false);
      return;
    }

    // NUMBER VALIDATION CHECK
    else if (backendError?.number) {
      const backendMessage = Array.isArray(backendError.number)
        ? backendError.number[0]
        : backendError.number;
      setSnackbarMessage(backendMessage || "Invalid contact number.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSubmitting(false);
      return;
    }

    // PASSWORD VALIDATION CHECKS
    if (values.password.length < 8) {
      setSnackbarMessage("Password must be at least 8 characters long.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSubmitting(false);
      return;
    }

    if (values.password !== values.confirmPassword) {
      setSnackbarMessage("Passwords do not match.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setSubmitting(false);
      return;
    }

    //  GENERIC ERROR FALLBACK
    if (backendError?.message) {
      setSnackbarMessage(backendError.message);
    } else {
      setSnackbarMessage("Registration failed. Please try again later.");
    }
    setSnackbarSeverity("error");
    setSnackbarOpen(true);

  } finally {
    setSubmitting(false);
  }
}




const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Full name is required'),
  
  email: Yup.string()
    .email('Email already exist')
    .required('Email is required'),

  number: Yup.string()
    .matches(/^03\d{9}$/, 'Contact number must start with 03 and be 11 digits long')
    .required('Contact number is required'),

  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm your password'),
});

    return (
        <motion.div className='registration_main'>
            <motion.div className='register_main_main'>
                <motion.div
                    className='image_div_register'
                    ref={refOne}
                    initial={{ opacity: 0, x: -100 }}
                    animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .7 }}>
                    <img src={stock8} className='register_image' alt="Register Illustration" />
                </motion.div>

                <motion.div
                    className='register_form'
                    ref={refTwo}
                    initial={{ opacity: 0, x: 100 }}
                    animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .7 }}>

                    <Formik
                        initialValues={{
                            name: '',
                            email: '',
                            number: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                             if (!recaptchaToken) {

                                setSnackbarMessage("Please complete the captcha.");
                                setSnackbarSeverity("error");
                                setSnackbarOpen(true);
                                setSubmitting(false);
                                return;
                                }                           

                            if (values.password !== values.confirmPassword){

                                setSnackbarMessage("Passwords do not match.");
                                setSnackbarSeverity('error');
                                setSnackbarOpen(true);
                                setSubmitting(false);
                                return;
                                 }     
                                await handleRegister(values, { setSubmitting }); 
                                resetForm();                      
                        }}>
                        
                        {({ handleBlur, handleChange, handleSubmit, values, isSubmitting ,touched, errors}) => (
                            <form onSubmit={handleSubmit} className='form'>
                                <div className='arrowBack' onClick={()=> dispatch(setLogin())}>
                                    <ArrowBackIosIcon className='arrow'/>
                                    <span>Back</span>
                                </div>
                                <span className='h6'>Registration Form</span>
                                
                                <TextField label="Full Name" name='name' onChange={handleChange} onBlur={handleBlur} value={values.name} className='r_input'  error={touched.name && Boolean(errors.name)} required />
                                <TextField label="Email" name='email' onChange={handleChange} onBlur={handleBlur} value={values.email} className='r_input'   error={touched.email && Boolean(errors.email)} required />
                                <TextField label="Contact Number" name='number' onChange={handleChange} onBlur={handleBlur} value={values.number} className='r_input' type='text'  error={touched.number && Boolean(errors.number)} required/>
                                <TextField label="Password" name='password' onChange={handleChange} onBlur={handleBlur} value={values.password} className='r_input' type='password'  error={touched.password && Boolean(errors.password)}
                                  helperText={touched.password && errors.password} required />
                                 <TextField label="Confirm Password" name='confirmPassword' onChange={handleChange} onBlur={handleBlur} value={values.confirmPassword} className='r_input' type='password'  error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                    helperText={touched.confirmPassword && errors.confirmPassword}
                                    required />
                                <ReCAPTCHA sitekey={siteKey}
                                onChange={(token) => setRecaptchaToken(token)}
                                />
                                <Button variant="contained" disableElevation className='btn' type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Registering..." : "Register"}
                                </Button>
                               
                            </form>
                        )}
                    </Formik>
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

                </motion.div>
            </motion.div>
        </motion.div>
    );
};
