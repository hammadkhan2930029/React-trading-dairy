import React, { useEffect, useState } from 'react';
import { Footer } from '../footer/footer'
// import './aboutUs.css';
import team from '../../assets/who-we-are.webp'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
// import demoIcon from '../../assets/demoIcon.png';
// import demoIcon1 from '../../assets/demoIcon1.png';
import { motion, useInView } from "framer-motion";
import { New_breadCrumbs } from '../newCrumbs/newcrumbs';
import { Nav } from '../nav/nav';
// import { Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
// icons
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GavelIcon from '@mui/icons-material/Gavel';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SavingsIcon from '@mui/icons-material/Savings';
import PrimaryButton from '../../Buttons/primaryButton';
import banner_bg from '../../assets/new/banner_bg.png'

export const AboutUs = () => {
    const navigate = useNavigate()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    // ----------------------------------------------------------
    const refOne = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    //----------------------------------------------------------
    const features = [
        {
            icon: <QueryStatsIcon className="text-blue-600 w-10 h-10" />,
            title: "PSX Overview/Summary",
            desc: "Watch PSX market overview/summary performance history",
        },
        {
            icon: <SwapHorizIcon className="text-blue-600 w-10 h-10" />,
            title: "Trade & Day Trade Tracking",
            desc: "Track long-term and intraday trade",
        },
        {
            icon: <WorkOutlineIcon className="text-blue-600 w-10 h-10" />,
            title: "Holding Trades",
            desc: "Monitor active holdings with real-time values",
        },
        {
            icon: <TaskAltIcon className="text-blue-600 w-10 h-10" />,
            title: "Closed Trades History",
            desc: "Review completed trades with profit breakdown",
        },
        {
            icon: <MenuBookIcon className="text-blue-600 w-10 h-10" />,
            title: "Trading Journal System",
            desc: "Maintain notes for long-term investment trades",
        },
        {
            icon: <GavelIcon className="text-blue-600 w-10 h-10" />,
            title: "Personal Trading Rules",
            desc: "Create and follow your custom trading rules",
        },
        {
            icon: <CardGiftcardIcon className="text-blue-600 w-10 h-10" />,
            title: "Bonus & Dividend Tracking",
            desc: "Add bonuses & dividends received from stock holdings",
        },
        {
            icon: <SouthIcon className="text-blue-600 w-10 h-10" />,
            title: "Deposit Management",
            desc: "Log all capital deposits into trading account",
        },
        {
            icon: <NorthIcon className="text-blue-600 w-10 h-10" />,
            title: "Withdrawal Tracking",
            desc: "Track withdrawals with complete history",
        },
        {
            icon: <TrendingUpIcon className="text-blue-600 w-10 h-10" />,
            title: "Win vs Loss Analytics",
            desc: "Analyze winning and losing trade performance",
        },
        {
            icon: <ShowChartIcon className="text-blue-600 w-10 h-10" />,
            title: "Profit & Loss Tracking",
            desc: "Track realized and unrealized P&L accurately",
        },
        {
            icon: <SavingsIcon className="text-blue-600 w-10 h-10" />,
            title: "Total Investment Tracking",
            desc: "View total invested capital across all trades",
        },
    ];

    return (
        <div  >
             <div >
                    <Nav />
                    <New_breadCrumbs />
                </div>

            <div style={{ backgroundImage: `url(${banner_bg})` }}
                                    className="bg-cover bg-center min-h-screen ">
               

                <motion.div
                    className="w-full flex flex-col md:flex-col lg:flex-row justify-center items-center px-5  md:px-8 lg:px-10 py-5 md:py-10 lg:py-10"
                    ref={refOne}
                    initial={{ opacity: 0, y: -100 }}
                    animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: .8 }}>

                    <div className="w-full md:w-full lg:w-[60%] px-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0c263a] mb-4 font-sans">

                            <span className="text-blue-600">
                                Who
                            </span>
                            {" "}We Are
                        </h2>
                        <p className="text-gray-500 max-w-full font-sans py-2 text-lg">
                            We are a purpose-built Trading Diary platform designed exclusively for Pakistan Stock Exchange (PSX) traders and investors. Our goal is to help individuals trade with clarity, discipline, and data-backed confidence.
                        </p>
                        <p className="text-gray-500 max-w-full font-sans py-2 text-lg">
                            Trading in PSX requires more than just buy and sell decisions—it demands consistency, risk control, and continuous learning. Our platform enables traders to record, analyze, and improve their trading performance by tracking portfolios, trades, strategies, and outcomes in one structured system.
                        </p>
                        <p className="text-gray-500 max-w-full font-sans py-2 text-lg">
                            Whether you are a beginner learning market behavior or an experienced trader refining strategies, our trading diary helps you identify strengths, uncover mistakes, and make smarter decisions over time. We focus on practical insights, local market relevance, and simplicity—so traders can spend less time managing spreadsheets and more time improving results.
                        </p>
                    </div>

                    <div className="w-full md:w-full lg:w-[40%] px-2 py-8 md:py-0 lg:py-0">
                        <div className="w-[100%] h-[500px] md:h-[600px] lg:h-[600px] bg-[#00d094] rounded-full flex justify-center items-center shadow-xl">
                            <img src={team} alt="Team" className=" w-full object-contain h-[500px] md:h-[600px] lg:h-[600px]  rounded-full" />
                        </div>
                    </div>
                </motion.div>
                {/* ----------------------------------------------------------- */}
                <motion.div className='flex flex-col md:flex-col lg:flex-row justify-evenly items-center py-10 sm:px-4 md:px-5 cursor-pointer'>
                    <motion.div className='group w-[95%] md:w-[95%] lg:w-[45%] bg-white m-2 h-[280px] md:h-[200px] lg:h-[200px] transition-all  duration-500 ease-in-out hover:-translate-y-3 rounded-xl shadow-xl hover:shadow-2xl p-5 hover:border-2 hover:border-[#00d094]'>
                        <div className='flex justify-start items-start'>
                            <TrackChangesIcon sx={{ fontSize: '52px', color: 'blue' }} />
                            <span className='text-3xl md:text-4xl font-bold text-[#00d094] font-sans pl-2'>Our Mission</span>

                        </div>
                        <span className="text-gray-500 max-w-full font-sans  text-lg">Provide tools that simplify trade tracking and portfolio management to analyze performance, control risk, and learn from every trade. Promote disciplined, rule-based trading to building sustainable and profitable trading habits</span>
                    </motion.div>
                    <motion.div className='group w-[95%] md:w-[95%] lg:w-[45%] h-[280px] md:h-[200px] lg:h-[200px] bg-white m-2 transition-all  duration-500 ease-in-out hover:-translate-y-3 rounded-xl shadow-xl hover:shadow-2xl p-5 hover:border-2 hover:border-[#00d094]'>
                        <div className='flex justify-start items-start'>
                            <RemoveRedEyeIcon sx={{ fontSize: '52px', color: 'blue' }} />
                            <span className='text-3xl md:text-4xl font-bold text-[#00d094]  font-sans pl-2'>Our Vision</span>

                        </div>
                        <span className="text-gray-500 max-w-full font-sans  text-lg">To become the most trusted and data-driven trading journal for PSX traders, empowering them to trade with discipline, transparency, and long-term consistency.</span>
                    </motion.div>
                </motion.div>

                {/* ----------------------------------------------------------- */}

                <motion.div className='bg-[#00d094] w-full flex flex-col md:flex-row lg:flex-row justify-between items-center py-5 px-5 shadow-xl rounded-full'>
                    <span className='text-xl md:text-3xl font-bold text-white font-sans py-5 md:py-0 lg:py-0'>Start Your Tracking Now</span>

                    <PrimaryButton title='Get Started' className='bg-blue-600 text-white w-full md:w-auto lg:w-auto ' onClick={() => navigate('/login')} />
                </motion.div>
                {/* ----------------------------------------------------------- */}
                <motion.div className='flex flex-col justify-center items-center py-10'>
                    <div className='flex justify-center flex-col items-center p-3'>
                        <h2 className="text-3xl md:text-4xl font-bold text-[#0c263a] mb-4 font-sans">
                            Smart Trading{' '}
                            <span className="text-blue-600">
                                Features
                            </span>

                        </h2>
                        <p className="text-gray-500 max-w-full font-sans py-2 text-lg text-center">
                            A collection of practical tools and widgets built to simplify portfolio tracking, trade analysis, and performance evaluation for PSX traders.
                        </p>
                    </div>
                    {/* ------------------------------------------------------------------------- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-5">

                        {features.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-4 p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
                            >
                                {item.icon}

                                <div>
                                    <h3 className="text-lg font-semibold text-[#0c263a]">
                                        {item.title}
                                    </h3>

                                    <p className="text-sm text-gray-600 mt-1">
                                        {item.desc}
                                    </p>
                                </div>
                            </div>
                        ))}

                    </div>
                </motion.div>

            </div>
            <Footer />
        </div>

    )
}