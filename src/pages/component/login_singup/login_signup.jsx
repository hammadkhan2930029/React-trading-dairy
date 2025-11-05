import React, { useEffect, useState, forwardRef } from 'react';
import { Login } from '../login/login';
import { Register } from '../registrationForm/register';
import { ForgotPassword } from '../forgotPassword/forgotPassword';
import './login_signup.css'
import { motion, useInView } from "framer-motion";
import { useSelector } from "react-redux";

export const LoginPage = forwardRef((props, ref) => {
    const loginSignUp = useSelector((state) => state.login.formType);
    console.log('redux', loginSignUp)

    const [view, setView] = useState(1);
    useEffect(() => {
        if (loginSignUp) {
            setView(loginSignUp);
        }
    }, [loginSignUp]);
    const refOne = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });

    return (
        <motion.div className='login_signup_main' ref={ref}>
            <motion.div className='view' ref={refOne}
                initial={{ opacity: 0, x: -100 }}
                animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}>
                {view == 1 && <Login />}
                {view == 2 && <Register />}
                {view == 3 && <ForgotPassword />}
            </motion.div>



        </motion.div>
    );
})

