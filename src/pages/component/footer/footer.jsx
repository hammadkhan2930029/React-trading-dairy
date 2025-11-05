
import React from 'react';
import { motion, useInView } from "framer-motion";
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import newAsset26 from '../../assets/newAsset26.png'
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';

import './footer.css';

export const Footer = () => {
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    return (
        <div className='f_main'>
            <motion.div
                className='footer_bg'
                ref={refOne}
                initial={{ opacity: 0, y: 100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>

                <motion.div className='footer_main'>

                    <motion.div className='footer_logo' ref={refOne}
                        initial={{ opacity: 0, y: 100 }}
                        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: .8 }}>
                        <img src={newAsset26} className='logo' />

                    </motion.div>


                    <motion.div
                        className='footer_icons'
                        ref={refOne}
                        initial={{ opacity: 0, y: 100 }}
                        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: .8 }}>
                        <div className='f_shap_one'>
                            <div className='f_shap_two'>
                                <div className='f_shap_three'>
                                    <FacebookIcon className='footer_social_icon' />


                                </div>

                            </div>
                        </div>
                        <div className='f_shap_one'>
                            <div className='f_shap_two'>
                                <div className='f_shap_three'>
                                    <TwitterIcon className='footer_social_icon' />


                                </div>

                            </div>
                        </div>
                        <div className='f_shap_one'>
                            <div className='f_shap_two'>
                                <div className='f_shap_three'>
                                    <LinkedInIcon className='footer_social_icon' />


                                </div>

                            </div>
                        </div>
                        <div className='f_shap_one'>
                            <div className='f_shap_two'>
                                <div className='f_shap_three'>
                                    <YouTubeIcon className='footer_social_icon' />


                                </div>

                            </div>
                        </div>

                    </motion.div>
                    <motion.span className='copy'
                        ref={refOne}
                        initial={{ opacity: 0, y: 100 }}
                        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: .8 }}>
                        Copyright © 2025 Cogent Devs. All Rights Reserved.
                    </motion.span>
                </motion.div>
                <div className='quikLinks'>
                    <h3>Quik links</h3>
                    <div className='gradient-line'></div>

                    <ul>
                        <li>Home</li>
                        <li>About</li>
                        <li>How</li>
                        <li>Blogs</li>
                        <li>Contact</li>
                       


                    </ul>

                </div>
                <div className='privacyPolicy'>
                    <h3>Others</h3>
                    <div className='gradient-line'></div>

                    <ul>
                        <li>Login</li>
                         <li>FAQs</li>
                        <li>Terms & conditions</li>
                        <li>Privacy Policy</li>
                      



                    </ul>

                </div>
                <div className='privacyPolicy'>
                    <h3>Contact</h3>
                    <div className='gradient-line'></div>

                    <ul>
                        <li > <LocationOnIcon sx={{color:'#1976d2',margin:'2px',fontSize:'26px'}}/> Mateen Shopping Galaxy, 5th Floor Office # Fi-12, Office Block, Main Rashid Minhas Road, Karachi Pakistan.</li>
                        <li className='icon'><EmailIcon sx={{color:'#1976d2',margin:'2px',fontSize:'26px'}}/>  info@cogentdevs.com</li>
                        <li className='icon'><CallIcon sx={{color:'#1976d2',margin:'2px',fontSize:'26px'}}/>  0331 9998780</li>





                    </ul>

                </div>

            </motion.div>
        </div>
    )
}
