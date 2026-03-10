import React from 'react';
import './howWorks.css'
import HowToRegIcon from '@mui/icons-material/HowToReg';
import LoginIcon from '@mui/icons-material/Login';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { motion, useInView } from "framer-motion";
import { forwardRef } from 'react';

export const HowWorks = forwardRef((prop, ref) => {
    const refOne = React.useRef(null);


    const inViewOne = useInView(refOne, { triggerOnce: true });
    return (
        
        <motion.div ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}>
            <motion.div ref={ref} className='flex flex-col justify-center items-center py-12 '>
                <h2 className="text-3xl md:text-5xl font-bold text-[#0c263a] mb-4 font-sans">
                    How its{" "}
                    <span className="text-blue-600">
                        Work!
                    </span>
                </h2>

                <div className='w-full md:w-full lg:w-[90%] flex flex-col md:flex-row lg:flex-row lg:justify-around items-center p-10'>

                    <div className=' min-h-[300px] md:min-h-[350px] lg:min-h-[290px] transition-all  duration-500 ease-in-out hover:-translate-y-3  group hover:border-[#00d094] m-2 hover:border w-80 p-8 rounded-xl bg-gradient-to-t from-gray-100 to-slate-50 shadow-lg  flex flex-col items-center text-center' >
                        <div className='bg-white p-4 shadow-sm rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg'>
                            <HowToRegIcon className="text-gray-600 transition-colors duration-500 group-hover:text-[#00d094] !text-4xl" />

                        </div>
                        <span className="text-2xl text-[#0c263a] py-6 font-sans font-bold transition-colors duration-500 group-hover:text-[#00d094]">
                            Register/Login
                        </span>

                        <p className="text-gray-400 text-sm transition-colors duration-500 group-hover:text-gray-600">
                            Start your journey by creating a secure account on our platform.
                        </p>
                    </div>
                                       {/* --------------------------- */}

                    <div className='min-h-[300px] md:min-h-[350px] lg:min-h-[290px] transition-all  duration-500 ease-in-out hover:-translate-y-3  group hover:border-[#00d094] m-2 hover:border w-80 p-8 rounded-xl bg-gradient-to-t from-gray-100 to-slate-50 shadow-lg  flex flex-col items-center text-center' >
                        <div className='bg-white p-4 shadow-sm rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg'>
                            <LoginIcon className="text-gray-600 transition-colors duration-500 group-hover:text-[#00d094] !text-4xl" />

                        </div>

                        <span className="text-2xl text-[#0c263a] py-6 font-sans font-bold transition-colors duration-500 group-hover:text-[#00d094]">Manage Data</span>
                        <p className="text-gray-500 text-sm leading-relaxed transition-colors duration-500 group-hover:text-gray-700">
                            Organize and track your financial assets with our smart tools, ensuring every detail is at your fingertips.
                        </p>
                    </div>
                    {/* --------------------------- */}

                    <div className='min-h-[300px] md:min-h-[350px] lg:min-h-[290px] transition-all  duration-500 ease-in-out hover:-translate-y-3  group hover:border-[#00d094] m-2 hover:border w-80 p-8 rounded-xl bg-gradient-to-t from-gray-100 to-slate-50 shadow-lg  flex flex-col items-center text-center'>
                        <div className='bg-white p-4 shadow-sm rounded-full transition-transform duration-500 group-hover:scale-110 group-hover:shadow-lg'>
                            <ManageAccountsIcon className="text-gray-600 transition-colors duration-500 group-hover:text-[#00d094] !text-4xl" />

                        </div>
                        <span className="text-2xl text-[#0c263a] py-6 font-sans font-bold transition-colors duration-500 group-hover:text-[#00d094]">Empower Decisions</span>
                        <p className="text-gray-500 text-sm leading-relaxed transition-colors duration-500 group-hover:text-gray-700">
                            Make informed choices using real-time analytics and expert insights designed to grow your investment portfolio.
                        </p>
                    </div>
                </div>



            </motion.div>

        </motion.div>

        //----------------old------------------
        // <motion.div
        //     ref={refOne}
        //     initial={{ opacity: 0, y: -100 }}
        //     animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        //     transition={{ duration: .8 }}>

        //     <motion.div className="how_div_main" ref={ref}>


        //         <div className='heading-1'>
        //             <span>How its work!</span>
        //         </div>
        //         <div className="how_div">
        //             <div className='new_card'>
        //                 <div className='new_card_icon'>
        //                     <HowToRegIcon className='icon' />

        //                 </div>
        //                 <span className='new_card_span1'>Register/Login</span>
        //                 {/* <span className='new_card_span2'> Stay organized and optimize your stock investments with a balanced</span> */}


        //             </div>
        //             {/* -------------------------------- */}
        //             <div className='new_card'>
        //                 <div className='new_card_icon'>
        //                     <LoginIcon className='icon' />

        //                 </div>
        //                 <span className='new_card_span1'>Manage Data</span>
        //                 {/* <span className='new_card_span2'> Stay organized and optimize your stock investments with a balanced</span> */}


        //             </div>
        //             {/* -------------------------------- */}
        //             <div className='new_card'>
        //                 <div className='new_card_icon'>
        //                     <ManageAccountsIcon className='icon' />

        //                 </div>
        //                 <span className='new_card_span1'>Empower Decisions</span>
        //                 {/* <span className='new_card_span2'>Stay organized and optimize your stock investments with a balanced</span> */}


        //             </div>

        //         </div>
        //     </motion.div>

        // </motion.div>
    )
})
