import React, { useState, useEffect } from 'react';
import './Slider.css';

import { Nav } from '../nav/nav';
import banner_bg from '../../assets/new/banner_bg.png'
import { motion, AnimatePresence, useInView } from "framer-motion";
import banner_img from '../../assets/new/banner_img-2.png'
import banner_coin from '../../assets/new/banner_coin.png'
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';



export const Slider = () => {
    const cardVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
    };

    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    return (
        <div style={{ backgroundImage: `url(${banner_bg})` }}
            className="bg-cover bg-center min-h-screen ">
            <Nav />
          
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen gap-0">

                {/* LEFT SIDE (TEXT) */}
                <motion.div
                    ref={refTwo}
                    initial={{ opacity: 0, x: -100 }}
                    animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .8 }}
                    className="flex flex-col items-center justify-center lg:item-center  lg:justify-center text-center px-4 sm:px-8  lg:text-left lg:px-20 py-12 lg:py-0 -mt-12"
                >
                    <div className='flex flex-start w-full'>
                        <motion.img src={banner_coin} 
                        className="w-1/4 lg:w-1/4"
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-sans md:text-5xl lg:text-6xl font-bold leading-snug sm:leading-tight md:leading-tight lg:leading-tight text-start ">
                        Invest your money with{" "}
                        <span className="text-blue-600">
                            higher return
                        </span>
                    </h1>

                    <p className="text-base font-sans sm:text-lg md:text-lg lg:text-lg py-4 sm:py-6 max-w-md sm:max-w-lg lg:max-w-xl text-start ">
                        Anyone can invest money to different currency to increase their
                        earnings by the help of Bitrader through online.
                    </p>

                    <div className="w-full  flex font-sans flex-row lg-flex-row md:flex-row gap-4 mt-4 sm:mt-6">
                        <button className="bg-[#00d094]  hover:bg-[#00b371] hover:shadow-lg active:scale-95 text-white font-bold py-3 px-6 rounded-xl w-full sm:w-auto flex flex-row justify-center item-center">
                            Get Started
                            <ArrowForwardIcon className="w-6 h-6 text-white pl-2" />
                        </button>


                        <button className="group bg-transparent font-sans hover:bg-blue-500 text-blue-600 font-semibold hover:text-white py-3 px-6 border border-blue-500 hover:border-transparent rounded-xl w-full sm:w-auto flex flex-row justify-around item-center">
                            <PlayCircleOutlineIcon className="w-6 h-6 text-blue-500 pr-2 group-hover:text-white" />  Watch Video
                        </button>
                    </div>
                    <div className='w-full   flex flex-start pt-12 '>
                        <span className='text-black font-semibold font-sans'>Follow Us</span>
                    </div>
                    <div className='w-full  flex flex-row flex-start justify-start items-center p-5 '>
                        <div className='border-2 border-solid  rounded-full p-2 hover:bg-[#00d094] cursor-pointer '>

                            <FacebookOutlinedIcon />
                        </div>
                        <div className='border-2 border-solid rounded-full p-2 hover:bg-[#00d094] cursor-pointer ml-1'>

                            <InstagramIcon />
                        </div>
                        <div className='border-2 border-solid rounded-full p-2 hover:bg-[#00d094] cursor-pointer ml-1'>
                            <TwitterIcon />
                        </div>
                        <div className='border-2 border-solid rounded-full p-2 hover:bg-[#00d094] cursor-pointer ml-1'>
                            <YouTubeIcon />
                        </div>
                        <div className='border-2 border-solid rounded-full p-2 hover:bg-[#00d094] cursor-pointer ml-1' >
                            <LinkedInIcon />
                        </div>


                    </div>
                </motion.div>

                {/* RIGHT SIDE (IMAGE) */}
                <motion.div
                    ref={refTwo}
                    initial={{ opacity: 0, x: 100 }}
                    animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .8 }}
                    className="flex items-center justify-center px-4 sm:px-8 py-6 lg:py-0"
                >
                    <motion.img src={banner_img} className="w-full max-w-md sm:max-w-lg lg:max-w-xl object-contain" animate={{
                        y: [0, -20, 0],
                        x: [0, 10, 0]
                    }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "mirror",
                            ease: "easeInOut"
                        }} />
                </motion.div>

            </div>

            {/* <div className="container">
                
            
                <img className="coverImg" src={tradingCover} alt="cover" />

             
                <div className="btnDiv">
                    <Button
                        variant="contained"
                        disableElevation
                        className="sliderbtn"
                        component={Link}
                        to="/login"
                    >
                        Get Started
                    </Button>
                </div>
            </div> */}
        </div>
    )
}