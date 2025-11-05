import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView } from "framer-motion";
import avatar from '../../../../images/avatar.jpg';
import './editeProfile.css';
import TextField from '@mui/material/TextField';
import { Formik, Form } from 'formik';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { createProfile, fetchProfile, selectProfileData } from "../../../Redux/profileSlice";
import * as Yup from 'yup';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { resetUpdateStatus } from "../../../Redux/profileSlice";


// --- Validation Schema ---
const profileSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be at most 100 characters')
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    number: Yup.string()
        .matches(/^03\d{9}$/, 'Contact number must start with 03 and be 11 digits')
        .min(11, 'Contact number must be at 11 digits')
        .max(11, 'Contact number must be at 11 digits')
        .required('Contact number is required'),
         
    type: Yup.string()
        .required('Please select a profile type'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .test(
            'password-required-if-provided',
            'Password is required if you are changing it',
            function (value) {
                if (this.parent.confirmPassword) {
                    return !!value;
                }
                return true;
            }
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .test(
            'confirm-password-required-if-password',
            'Confirm password is required if you are setting a new password',
            function (value) {
                if (this.parent.password) {
                    return !!value;
                }
                return true;
            }
        ),
});

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const EditeProfile = () => {
    const refOne = useRef(null);
    const refTwo = useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });

    // Snackbar state
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [avatar_picker, setAvatar_picker] = useState(null);
    const fileInputRef = useRef(null);
    

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatar_picker(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const dispatch = useDispatch();
    const updateStatus = useSelector((state) => state.profile.updateStatus);
    const profileData = useSelector(selectProfileData);
    const profileStatus = useSelector((state) => state.profile.status);
    const profileError = useSelector((state) => state.profile.error);
    

   
   useEffect(() => {
    if (updateStatus === 'succeeded') {
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        // CRITICAL STEP: Reset status immediately after showing the success message
        // This makes the success state transient (it exists only until the next render)
        dispatch(resetUpdateStatus()); 
    } else if (updateStatus === 'failed') {
        setSnackbarMessage('Failed to update profile.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        // Reset status after failure message too
        dispatch(resetUpdateStatus()); 
    }
}, [updateStatus, dispatch]);
    

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    const handleProfileUpdate = async (values, { setSubmitting }) => {
        // Get the initial values from Redux state for comparison
        const initialValues = {
            name: profileData?.name,
            email: profileData?.email,
            number: profileData?.number,
            type: profileData?.type,
        };

        // Check if any of the main profile fields have changed
        const isDataChanged =
            values.name !== initialValues.name ||
            values.email !== initialValues.email ||
            values.number !== initialValues.number ||
            values.type !== initialValues.type;

        // If no data has changed and password fields are empty, show a message and stop
        if (!isDataChanged && !values.password && !values.confirmPassword) {
            setSnackbarMessage('No changes detected. Profile was not updated.');
            setSnackbarSeverity('info');
            setSnackbarOpen(true);
            setSubmitting(false);
            return;
        }

        try {
            const payload = {
                email: values.email,
                name: values.name,
                number: values.number,
                type: values.type,
            };
            if (values.password) {
                payload.password = values.password;
                payload.confirm_password = values.confirmPassword;
            }

            console.log("Sending payload:", payload);
            
            // This line correctly waits for the thunk to resolve or reject
            await dispatch(createProfile(payload)).unwrap();
            
            // The snackbar logic is now handled by the useEffect.
        } catch (error) {
            // The catch block here is no longer needed for the snackbar
            // as the error is now handled by the useEffect.
            console.error("Profile update failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const initialFormValues = {
        name: profileData?.name || '',
        email: profileData?.email || '',
        number: profileData?.number || '',
        type: profileData?.type || '',
        password: '',
        confirmPassword: ''
    };

    if (profileStatus === 'loading' && !profileData) {
        return <div className="flex justify-center items-center h-screen text-lg">Loading Profile...</div>;
    }

    if (profileError) {
        return <div className="flex justify-center items-center h-screen text-lg text-red-600">Error loading profile: {JSON.stringify(profileError)}</div>;
    }

    return (
        <motion.div className='edite_profile'>
            <motion.div className='edite'>
                <motion.div
                    className='edite_profile_form'
                    ref={refTwo}
                    initial={{ opacity: 0, x: 100 }}
                    animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .7 }}
                >
                    <Formik
                        initialValues={initialFormValues}
                        validationSchema={profileSchema}
                        onSubmit={handleProfileUpdate}
                        enableReinitialize={true}
                    >
                        {({
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            values,
                            errors,
                            touched,
                            isSubmitting
                        }) => (
                            <Form onSubmit={handleSubmit} className='e_form'>
                                <span className='h6'>Edit Profile</span>
                                <motion.div
                                    className='view_profile'
                                    ref={refOne}
                                    initial={{ opacity: 0, x: -100 }}
                                    animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: .7 }}
                                >
                                    <img
                                        src={avatar_picker || avatar}
                                        className="profile_image_view"
                                        alt="Profile"
                                        onClick={() => fileInputRef.current.click()}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleImageChange}
                                    />
                                    <AddCircleIcon
                                        className="addIcon"
                                        style={{ cursor: "pointer", color: '#000' }}
                                        onClick={() => fileInputRef.current.click()}
                                    />
                                    <span className='userName'>{profileData.name || profileData.user?.name || 'User Name'}</span>
                                </motion.div>

                                <div className='form_main' >
                                    <TextField
                                        placeholder='Name'
                                        name='name'
                                        id="name-input"
                                        label="Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                        className='e_input'
                                        type='text'
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                     <TextField
                                        placeholder='email'
                                        name='email'
                                        id="outlined-required"
                                        label="Email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        className='e_input'
                                        type='text'
                                        slotProps={{
                                                input: {
                                                    readOnly: true,
                                                },
                                            }}

                                    />
                                    <TextField
                                        placeholder='Number'
                                        name='number'
                                        id="number-input"
                                        label="Contact"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.number}
                                        className='e_input'
                                        type='tel'
                                        error={touched.number && Boolean(errors.number)}
                                        helperText={touched.number && errors.number}
                                    />
                                    <Box className='e_input'>
                                        <FormControl fullWidth error={touched.type && Boolean(errors.type)}>
                                            <InputLabel id="type-select-label">Filer or Non-filer</InputLabel>
                                            <Select
                                                labelId="type-select-label"
                                                id="type-select"
                                                value={values.type}
                                                label="Filer or Non-filer"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                name='type'
                                            >
                                                <MenuItem value={"Filer"}>Filer</MenuItem>
                                                <MenuItem value={"Non Filer"}>Non Filer</MenuItem>
                                            </Select>
                                            {touched.type && errors.type && (
                                                <p style={{ color: '#d32f2f', fontSize: '0.75rem', marginLeft: '14px', marginTop: '3px' }}>
                                                    {errors.type}
                                                </p>
                                            )}
                                        </FormControl>
                                    </Box>
                                    <TextField
                                        placeholder='password'
                                        name='password'
                                        id="password-input"
                                        label="Password (leave blank to keep current)"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        className='e_input'
                                        type='password'
                                        error={touched.password && Boolean(errors.password)}
                                        helperText={touched.password && errors.password}
                                    />
                                    <TextField
                                        placeholder='confirm password'
                                        name='confirmPassword'
                                        id="confirmPassword-input"
                                        label="Confirm password"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.confirmPassword}
                                        className='e_input'
                                        type='password'
                                        error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                                        helperText={touched.confirmPassword && errors.confirmPassword}
                                    />
                                </div>

                                <Button
                                    variant="contained"
                                    disableElevation
                                    className='e_btn'
                                    type='submit'
                                    disabled={isSubmitting}
                                >
                                    Update Profile
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </motion.div>
            </motion.div>

            {/* ✅ Snackbar placed OUTSIDE Formik to avoid reset issues */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                     sx={{
                                    width: '100%',
                                    backgroundColor: 'rgba(15, 134, 231, 0.94)',
                                    color: '#fff',
                                    
                                }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </motion.div>
    );
};
