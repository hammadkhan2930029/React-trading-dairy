import React from 'react';
import './howWorks.css'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { motion, useInView } from "framer-motion";
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';


export const HowWorks = forwardRef((prop, ref) => {
    
    const navigate = useNavigate()
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    return (
        
        <motion.div
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>
            <motion.div className="how_div_main" ref={ref}>

                
                <div className='heading-1'>
                    <span>How its work!</span>
                </div>
                <div className="how_div">
                    <div className='new_card'>
                        <div className='new_card_icon'>
                            <HowToRegIcon className='icon' />

                        </div>
                        <span className='new_card_span1'>Register</span>
                        <span className='new_card_span2'> Stay organized and optimize your stock investments with a balanced</span>


                    </div>
                    {/* -------------------------------- */}
                    <div className='new_card'>
                        <div className='new_card_icon'>
                            <LoginIcon className='icon' />

                        </div>
                        <span className='new_card_span1'>Login</span>
                        <span className='new_card_span2'> Stay organized and optimize your stock investments with a balanced</span>


                    </div>
                    {/* -------------------------------- */}
                    <div className='new_card'>
                        <div className='new_card_icon'>
                            <ManageAccountsIcon className='icon' />

                        </div>
                        <span className='new_card_span1'>Manage</span>
                        <span className='new_card_span2'>Stay organized and optimize your stock investments with a balanced</span>


                    </div>

                </div>
            </motion.div>

        </motion.div>
    )
})
