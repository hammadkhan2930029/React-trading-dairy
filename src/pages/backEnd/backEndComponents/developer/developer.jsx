import React from 'react';
import logo from '../../../images/logo.png';
import './developers.css';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { motion, useInView } from "framer-motion";

export const DevelopersComponent = () => {
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    return (
        <div className='developers_page_main'>
            <motion.div className='developers_page'
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>
                <div className='first_div'>
                    <div className='logo_div'>
                        <img src={logo} className='company_logo' />
                    </div>
                    <div className='company_name_div'>
                        <span className='company_name'>Cogent Devs Software Solutions</span>
                    </div>

                </div>
                <div className="second_div">
                    <div className='email_div'>
                        <EmailIcon sx={{ width: 40, height: 40, margin: 1 }} />

                        <span className='email'>info@cogentdevs.com</span>
                    </div>
                    <div className='contact_div'>
                        <PhoneIcon sx={{ width: 40, height: 40, margin: 1 }} />
                        <span className='contact'>+92-331-9998780</span>
                    </div>

                </div>
                <div className="third_div">
                    <div className="socialIcons">
                        <FacebookIcon sx={{ width: 40, height: 40 }} />
                    </div>
                    <div className="socialIcons">
                        <LinkedInIcon sx={{ width: 40, height: 40 }} />

                    </div>
                    <div className="socialIcons">
                        <YouTubeIcon sx={{ width: 40, height: 40 }} />

                    </div>
                </div>

            </motion.div>
        </div>
    )
}
