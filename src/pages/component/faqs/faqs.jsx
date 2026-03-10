
import React, { useState, forwardRef, useEffect } from 'react';
import './faqs.css'
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { motion, useInView } from "framer-motion";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import faq2 from '../../assets/new/faq-2.png'

import { useNavigate } from 'react-router-dom';

export const Faqs = forwardRef((props, ref) => {

    const navigate = useNavigate()
    const [select_drop, setSelect_drop] = useState(1)
    const [select_drop_2, setSelect_drop_2] = useState(4)

    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });

    const stockMarketQA = [
        {
            id: 1,
            question: "What is the stock market?",
            answer: "The stock market is a place where people buy and sell shares of companies."
        },
        {
            id: 2,
            question: "What are shares?",
            answer: "Shares represent a small ownership portion of a company that investors can buy."
        },
        {
            id: 3,
            question: "What is the difference between ?",
            answer: "A bull market is when stock prices are rising, while a bear market is when stock prices are falling."
        },
        {
            id: 4,
            question: "What is an IPO?",
            answer: "An IPO (Initial Public Offering) is when a company sells its shares to the public for the first time."
        },
        {
            id: 5,
            question: "What is a dividend?",
            answer: "A dividend is a portion of a company's profits distributed to shareholders."
        },

    ];
    return (
        <motion.div ref={ref} className='py-10 px-5'>
            <div className='flex flex-col justify-center items-center'>
                <motion.div
                    ref={refOne}
                    initial={{ opacity: 0, y: -100 }}
                    animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: .8 }}
                    className="mb-8 flex flex-col justify-center items-center pt-10">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#0c263a] mb-4 font-sans text-center">

                        <span className="text-blue-600">
                            Frequently {" "}
                        </span>
                        Asked Questions
                    </h2>
                    <p className="text-gray-500 max-w-md font-sans text-center">
                        Hey there! Got questions? We've got answers. Check out our FAQ page for all the deets. Still not satisfied? Hit us up.
                    </p>
                </motion.div>
                {/* -------------------------------------------- */}
                <div className='flex flex-col md:flex-col lg:flex-row xl:flex-row justify-center items-center w-full'>
                    <div className='flex flex-col justify-center items-center  w-full  md:w-full lg:w-[45%]'>
                        {stockMarketQA.map((item, index) => {
                            return (

                                <motion.div
                                    ref={refOne}
                                    initial={{ opacity: 0, x: -100 }}
                                    animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: .8 }}
                                    className='w-full border-b-2 border-gray-200  ' onClick={() => setSelect_drop(item.id)}>
                                    <div className='flex flex-row justify-between items-center p-3 '>
                                        <span className={`${select_drop === item.id ? 'text-[#00d094]' : 'text-black'} text-lg font-bold transition-all duration-300`}>{item.question}</span>
                                        <div className={`border ${select_drop === item.id ? 'border-[#00d094] text-[#00d094] drop-shadow-[0_0_10px_rgba(0,208,148,0.5)]' : 'border-gray-200 text-gray-500'} rounded-full transition-all duration-300`}>
                                            {select_drop === item.id ? (<RemoveIcon />) : (<AddIcon />)}
                                        </div>

                                    </div>
                                    {select_drop === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className='overflow-hidden'>
                                            <p className='text-sm text-gray-500 p-2'>{item.answer}</p>
                                        </motion.div>
                                    )}

                                </motion.div>
                            )
                        })}
                    </div>

                    <motion.div
                        ref={refOne}
                        initial={{ opacity: 0, x: 100 }}
                        animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: .8 }}
                        className='w-full md:w-full lg:w-[40%]  flex justify-center md:pt-5'>
                        <img src={faq2} className='w-auto object-contain drop-shadow-[0_0_25px_rgba(0,208,148,0.5)]' />
                    </motion.div>

                </div>

            </div>

        </motion.div>
        //---------------OLD------------------------------------
        // <motion.div className='faqs_first_div' ref={ref}>
        //     <motion.div className='faqs_heading_div'>

        //         <span className='h_main'>FAQ</span>
        //     </motion.div>
        //     <motion.div className='faqs'>


        //         <motion.div className='faqs_main'>

        //             <motion.div className='faqs_left'
        //                 ref={refOne}
        //                 initial={{ opacity: 0, x: -100 }}
        //                 animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        //                 transition={{ duration: .8 }}>



        //                 <motion.div className='drop' onClick={() => setSelect_drop(1)}
        //                     ref={refOne}
        //                     initial={{ opacity: 0, x: -100 }}
        //                     animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        //                     transition={{ duration: .8 }}>
        //                     <motion.div className='drop_style' style={{ backgroundColor: select_drop == 1 ? "var(--primary-green)" : null }}>
        //                         <motion.div className='drop_icon'>
        //                             {select_drop == 1 ? (
        //                                 <RemoveCircleIcon className='icon' />
        //                             ) : (

        //                                 <AddCircleIcon className='icon' />
        //                             )}
        //                         </motion.div>
        //                         <motion.div className='drop_text'>
        //                             <p className='text' style={{ color: select_drop == 1 ? '#fff' : null }}>Explore Market Opportunities </p>
        //                         </motion.div>

        //                     </motion.div>
        //                     {select_drop == 1 ? (
        //                         <motion.div >
        //                             <p className='para_text'>Analyze the latest stock trends and find potential investment opportunities.</p>
        //                         </motion.div>
        //                     ) : null}


        //                 </motion.div>

        //                 <motion.div className='drop' onClick={() => setSelect_drop(2)}>
        //                     <motion.div className='drop_style' style={{ backgroundColor: select_drop == 2 ? "var(--primary-green)" : null }}>
        //                         <motion.div className='drop_icon'>
        //                             {select_drop == 2 ? (
        //                                 <RemoveCircleIcon className='icon' />
        //                             ) : (

        //                                 <AddCircleIcon className='icon' />
        //                             )}
        //                         </motion.div>
        //                         <motion.div className='drop_text'>
        //                             <p className='text' style={{ color: select_drop == 2 ? '#fff' : null }}> Select the Right Stocks</p>
        //                         </motion.div>

        //                     </motion.div>
        //                     {select_drop == 2 ? (
        //                         <motion.div >
        //                             <p className='para_text'>Choose stocks that align with your financial goals and risk appetite.</p>
        //                         </motion.div>
        //                     ) : null}


        //                 </motion.div>

        //                 <motion.div className='drop' onClick={() => setSelect_drop(3)}>
        //                     <motion.div className='drop_style' style={{ backgroundColor: select_drop == 3 ? "var(--primary-green)" : null }}>
        //                         <motion.div className='drop_icon'>
        //                             {select_drop == 3 ? (
        //                                 <RemoveCircleIcon className='icon' />
        //                             ) : (

        //                                 <AddCircleIcon className='icon' />
        //                             )}
        //                         </motion.div>
        //                         <motion.div className='drop_text'>
        //                             <p className='text' style={{ color: select_drop == 3 ? '#fff' : null }}> Invest Securely </p>
        //                         </motion.div>

        //                     </motion.div>
        //                     {select_drop == 3 ? (
        //                         <motion.div >
        //                             <p className='para_text'>Execute trades with just a few clicks through a trusted brokerage platform.

        //                                 Start building your wealth today! 📈🚀.</p>
        //                         </motion.div>
        //                     ) : null}


        //                 </motion.div>

        //             </motion.div>

        //             {/* -------------------------------------------------------------RIGHT----------------------------------------------- */}
        //             <motion.div className='faqs_right'
        //                 ref={refTwo}
        //                 initial={{ opacity: 0, x: 100 }}
        //                 animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
        //                 transition={{ duration: .8 }}>

        //                 <motion.div className='drop' onClick={() => setSelect_drop_2(4)}
        //                     ref={refOne}
        //                     initial={{ opacity: 0, x: 100 }}
        //                     animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        //                     transition={{ duration: .8 }}>
        //                     <motion.div className='drop_style' style={{ backgroundColor: select_drop_2 == 4 ? "var(--primary-green)" : null }}>
        //                         <motion.div className='drop_icon'>
        //                             {select_drop_2 == 4 ? (
        //                                 <RemoveCircleIcon className='icon' />
        //                             ) : (

        //                                 <AddCircleIcon className='icon' />
        //                             )}
        //                         </motion.div>
        //                         <motion.div className='drop_text'>
        //                             <p className='text' style={{ color: select_drop_2 == 4 ? '#fff' : null }}>Explore Market Opportunities </p>
        //                         </motion.div>

        //                     </motion.div>
        //                     {select_drop_2 == 4 ? (
        //                         <motion.div >
        //                             <p className='para_text'>Analyze the latest stock trends and find potential investment opportunities.</p>
        //                         </motion.div>
        //                     ) : null}


        //                 </motion.div>

        //                 <motion.div className='drop' onClick={() => setSelect_drop_2(5)}>
        //                     <motion.div className='drop_style' style={{ backgroundColor: select_drop_2 == 5 ? "var(--primary-green)" : null }}>
        //                         <motion.div className='drop_icon'>
        //                             {select_drop_2 == 5 ? (
        //                                 <RemoveCircleIcon className='icon' />
        //                             ) : (

        //                                 <AddCircleIcon className='icon' />
        //                             )}
        //                         </motion.div>
        //                         <motion.div className='drop_text'>
        //                             <p className='text' style={{ color: select_drop_2 == 5 ? '#fff' : null }}> Select the Right Stocks</p>
        //                         </motion.div>

        //                     </motion.div>
        //                     {select_drop_2 == 5 ? (
        //                         <motion.div >
        //                             <p className='para_text'>Choose stocks that align with your financial goals and risk appetite.</p>
        //                         </motion.div>
        //                     ) : null}


        //                 </motion.div>

        //                 <motion.div className='drop' onClick={() => setSelect_drop_2(6)}>
        //                     <motion.div className='drop_style' style={{ backgroundColor: select_drop_2 == 6 ? "var(--primary-green)" : null }}>
        //                         <motion.div className='drop_icon'>
        //                             {select_drop_2 == 6 ? (
        //                                 <RemoveCircleIcon className='icon' />
        //                             ) : (

        //                                 <AddCircleIcon className='icon' />
        //                             )}
        //                         </motion.div>
        //                         <motion.div className='drop_text'>
        //                             <p className='text' style={{ color: select_drop_2 == 6 ? '#fff' : null }}> Invest Securely </p>
        //                         </motion.div>

        //                     </motion.div>
        //                     {select_drop_2 == 6 ? (
        //                         <motion.div >
        //                             <p className='para_text'>Execute trades with just a few clicks through a trusted brokerage platform.

        //                                 Start building your wealth today! 📈🚀.</p>
        //                         </motion.div>
        //                     ) : null}


        //                 </motion.div>
        //             </motion.div>
        //         </motion.div>
        //     </motion.div>
        //     <motion.div className='read_more_div' onClick={()=> navigate('/FAQs')}>

        //         <span className='read'>Read More</span>
        //     </motion.div>
        // </motion.div>

    )
})
