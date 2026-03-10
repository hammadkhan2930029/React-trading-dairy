import React from 'react'
import { motion, useInView } from "framer-motion";
import './login.css'
import TextField from '@mui/material/TextField';
import { Formik } from 'formik';
import Button from '@mui/material/Button';
import login_image from '../../assets/login.webp';
import { useDispatch } from "react-redux";
import { setForget, setRegister } from "../../backEnd/Redux/loginSlice";
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../backEnd/Redux/authSlice'; // adjust the path as needed
import { setDashboardView } from '../../backEnd/Redux/formTypeSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState } from 'react';
import withSkeleton from "../../component/Skeletons/withSkeleton.jsx";
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import PrimaryButton from '../../Buttons/primaryButton.jsx';

export const Login = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Backend par login request bhejne ka function
    const handleLogin = async (values, { setSubmitting }) => {
        try {
            const result = await dispatch(loginUser(values)).unwrap();

            if (result?.user) {
                setSnackbarMessage(`Welcome, ${result.user.name}!`);
                setSnackbarOpen(true);
                // dispatch(setDashboardView());

                setTimeout(() => navigate("/dashboard"), 3000);
            }
        } catch (err) {


            // Default message
            let errorMessage = "Something went wrong. Try again later.";

            // Detect structure
            if (typeof err === "string") {
                errorMessage = err;
            } else if (err?.detail) {
                errorMessage = err.detail;
            } else if (Array.isArray(err?.non_field_errors) && err.non_field_errors.length) {
                errorMessage = err.non_field_errors[0];
            } else if (err?.message) {
                errorMessage = err.message;
            }

            // Map backend messages → frontend messages
            if (
                /invalid|unable to log|no active account|credentials|login failed/i.test(
                    errorMessage
                )
            ) {
                errorMessage = "Invalid email or password.";
            } else if (
                /not verified|inactive|verify your email|please activate|email.*verify|activate your account/i.test(
                    errorMessage
                )
            ) {
                errorMessage =
                    "Email already exists. Kindly check your inbox or spam folder to activate your account.";
            }

            setSnackbarMessage(errorMessage);
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
   

        <motion.div className=' flex justify-center items-center ' >
            <motion.div className='register_login_1'>
                <motion.div
                    className='image_div_login'
                    ref={refOne}
                    initial={{ opacity: 0, x: 100 }}
                    animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .8 }}>

                    <img src={login_image} className='image_login' alt="Login" />

                </motion.div>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000} // 5 seconds
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    sx={{ mt: '80px' }}
                >
                    <MuiAlert
                        onClose={() => setSnackbarOpen(false)}
                        variant="filled"
                        icon={false}
                        sx={{
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            fontWeight: 'bold',
                            width: '100%'
                        }}
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
                <motion.div
                    className='register_form'
                    ref={refTwo}
                    initial={{ opacity: 0, x: -100 }}
                    animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .8 }}>

                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={handleLogin}
                    >
                        {({ handleBlur, handleChange, handleSubmit, values, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className='form'>
                                    {/* <span className='h6'>Login</span> */}
                                    <h2 className="text-3xl md:text-5xl font-bold text-blue-600 mb-6 font-sans">
                                        Login

                                    </h2>
                                    <TextField
                                        type='email'
                                        id="outlined-required"
                                        label="Email"
                                        placeholder="Enter your email..."
                                        name='email'
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        className='r_input'
                                        required
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#00d094 ',
                                                     // Focus border color
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                '&.Mui-focused': {
                                                    color: '#00d094', // Focus label color
                                                },
                                            },
                                        }}
                                    />

                                    <TextField
                                        type={showPassword ? 'text' : 'password'}
                                        label="Password"
                                        placeholder="Enter your password..."
                                        name="password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className="r_input"
                                        required
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        edge="end"
                                                        aria-label="toggle password visibility"
                                                    >
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                '&.Mui-focused fieldset': {
                                                    borderColor: '#00d094',
                                                },
                                            },
                                            '& .MuiInputLabel-root': {
                                                '&.Mui-focused': {
                                                    color: '#00d094',
                                                },
                                            },
                                        }}
                                    />


                                    {/* <div className='f_div'>
                                        <button type="button" className='forgot' onClick={() => dispatch(setForget())}>Forgot Password</button>
                                    </div> */}
                                    <div className='f_div'>
                                        <span className='forgot' style={{ color: "#00d094", cursor: 'pointer', fontSize: '16px', backgroundColor: 'transparent', border: 'none' }} onClick={() => dispatch(setForget())}>Forgot Password</span>
                                    </div>

                                    {/* <Button
                                        variant="contained"
                                        disableElevation
                                        className='btn'
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Logging in..." : "Login"}
                                    </Button> */}
                                    <PrimaryButton title={isSubmitting ? "Logging in..." : "Login"} />

                                    <p style={{ color: '#000', padding: 8 }} className='text1' onClick={() => dispatch(setRegister())}>
                                        Don't have an account?
                                        <span style={{ color: "#00d094", cursor: 'pointer' }} className='text2'> Sign up now!</span>
                                    </p>

                                </div>
                            </form>
                        )}
                    </Formik>

                </motion.div>

            </motion.div>
        </motion.div>

    )
}
export default withSkeleton(Login);
