
import React from 'react';
import { motion, useInView } from "framer-motion";
import EmailIcon from '@mui/icons-material/Email';
import shap01 from '../../assets/new/shape01-2.png';
import shap03 from '../../assets/new/shape03.png';
import map from '../../assets/new/map.png'
import cta from '../../assets/new/cta-2.png'


import './newsletter.css';
export const NewsLetter = () => {
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    return (
        <motion.div className='bg-gradient-to-r from-slate-50 to-gray-100 overflow-hidden'>
            <div style={{ backgroundImage: `url(${map})` }} className='bg-cover bg-center min-h-full py-5'>


                <div className='flex justify-start px-10 md:px-20'>
                    <motion.img src={shap03}
                        className="w-[50px] md:w-[80px]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                </div>


                <motion.div 
                 ref={refOne}
                initial={{ opacity: 0, x: -100 }}
                whileInView={inViewOne ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}
                className='flex justify-center items-center px-6 md:px-20 py-5'>
                    <div className='bg-[#00D094] flex flex-col lg:flex-row justify-between items-center p-6 md:p-8 lg:p-10 shadow-2xl rounded-3xl w-full max-w-4xl mx-auto'>


                        <div className='w-full lg:w-2/5 flex justify-center mb-6 lg:mb-0'>
                            <img src={cta} className='w-full max-w-[200px] md:max-w-[280px] h-auto object-contain' alt="CTA" />
                        </div>

                        <div className='w-full lg:w-3/5 flex flex-col text-center lg:text-start lg:pl-6'>
                            <div className="mb-6">
                                <h2 className="text-2xl md:text-4xl font-bold text-[#0c263a] mb-3 font-sans leading-tight">
                                    <span className="text-blue-700">Subscribe</span> Our News
                                </h2>
                                <p className="text-gray-700 text-sm md:text-base max-w-sm mx-auto lg:mx-0 font-sans opacity-90">
                                    Hey! Are you tired of missing out on our updates? Subscribe now and stay in the loop!
                                </p>
                            </div>

                            <div className='bg-white rounded-full p-1.5 flex flex-row items-center shadow-lg'>
                                <div className='hidden sm:flex pl-3'>
                                    <EmailIcon sx={{ fontSize: '28px', color: '#0c263a' }} />
                                </div>
                                <input
                                    placeholder='Email address...'
                                    className='w-full bg-transparent px-3 py-2 outline-none text-sm md:text-base'
                                />
                                <button className='bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-full px-5 md:px-7 py-2 md:py-2.5 text-sm font-bold shadow-md active:scale-95'>
                                    Subscribe
                                </button>
                            </div>
                        </div>

                    </div>
                </motion.div>

                <div className='flex justify-end items-end px-10 md:px-20'>
                    <motion.img src={shap01}
                        className="w-[50px] md:w-[80px]"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
                </div>

            </div>
        </motion.div>

        //-----------old-----------------------

        // <motion.div className='newsletter_bg'>
        //     <motion.div
        //         className='newsLetter_main'
        //         ref={refOne}
        //         initial={{ opacity: 0, x: -100 }}
        //         animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        //         transition={{ duration: .8 }}>
        //         <h2 className='newsLetter_h2'>Subscribe to get updates</h2>
        //         <div className='newsLetter_line'></div>
        //         <div className='input_div'>
        //             <EmailIcon className='email_icon' />
        //             <input placeholder='Email address here' className='newsletter_input' />

        //             <button className='newsLetter_btn'>Subscribe now</button>
        //         </div>

        //     </motion.div>
        // </motion.div>
    )
}
