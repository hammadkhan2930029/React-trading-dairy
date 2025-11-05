import React from "react";
import "./adminLogin.css";
import { Formik } from "formik";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useState } from "react";
import { loginAdmin } from "../Redux/loginSlice";
import { useDispatch } from "react-redux";


export const Adminlogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    

    // Backend par login request bhejne ka function
     const handleLogin = async (values, { setSubmitting }) => {
  try {
    const result = await dispatch(loginAdmin(values)).unwrap();

    if (result?.user) {
      setSnackbarMessage(`Welcome, ${result.user.name}!`);
      setSnackbarOpen(true);
      //dispatch(setDashboardView());

      setTimeout(() => navigate("/adminMain"), 3000);
    }
  } catch (err) {
    console.error("Login error:", err);

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
        <div className="admin_login_wrapper">
            <div className="admin_login_card">
                <h2 className="admin_heading">Admin Panel</h2>
                <p className="admin_subheading">Sign in to continue</p>

                <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={handleLogin} 
                >

                    {({ handleBlur, handleChange, handleSubmit, values }) => (
                        <form onSubmit={handleSubmit} className="login_form">
                            <TextField
                                name="email"
                                label="Email"
                                type="email"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.email}
                                className="login_input_field"
                                fullWidth
                            />
                            <TextField
                                name="password"
                                label="Password"
                                type="password"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.password}
                                className="login_input_field"
                                fullWidth
                            />

                            <button type="submit" className="admin_login_btn" >
                                Login
                            </button>
                        </form>
                    )}
                </Formik>
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
                                    backgroundColor: '#1976d2', // Material UI primary blue
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    width: '100%'
                                    }}
                                >
                                    {snackbarMessage}
                                </MuiAlert>
                                </Snackbar>
            </div>
        </div>
    );
};
