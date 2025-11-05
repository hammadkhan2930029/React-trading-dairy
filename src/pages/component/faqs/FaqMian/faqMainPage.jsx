
import React, { useEffect, useState } from 'react';
import './faqMainPage.css'
import { motion, useInView } from "framer-motion";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from 'react-router-dom';
import { Nav } from '../../nav/nav';
import { Navbar2 } from '../../nav/navbar2';
import { Footer } from '../../footer/footer';



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
    {
        id: 6,
        question: "What are blue-chip stocks?",
        answer: "Blue-chip stocks belong to well-established and financially strong companies."
    },
    {
        id: 7,
        question: "What are penny stocks?",
        answer: "Penny stocks are low-priced shares that are highly volatile and risky."
    },
    {
        id: 8,
        question: "How can someone invest in the stock market?",
        answer: "To invest in the stock market, you need to open a brokerage account and buy/sell shares."
    },
    {
        id: 9,
        question: "What is the difference between technical and fundamental analysis?",
        answer: "Technical analysis is based on price charts and patterns, while fundamental analysis evaluates a company's financial health and growth potential."
    },
    {
        id: 10,
        question: "What is a stop-loss order?",
        answer: "A stop-loss order is an automatic order to sell a stock when its price falls to a certain level to minimize losses."
    }
];

// --------------------------------------------------

const stockMarketQA2 = [
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
    {
        id: 6,
        question: "What are blue-chip stocks?",
        answer: "Blue-chip stocks belong to well-established and financially strong companies."
    },
    {
        id: 7,
        question: "What are penny stocks?",
        answer: "Penny stocks are low-priced shares that are highly volatile and risky."
    },
    {
        id: 8,
        question: "How can someone invest in the stock market?",
        answer: "To invest in the stock market, you need to open a brokerage account and buy/sell shares."
    },
    {
        id: 9,
        question: "What is the difference between technical and fundamental analysis?",
        answer: "Technical analysis is based on price charts and patterns, while fundamental analysis evaluates a company's financial health and growth potential."
    },
    {
        id: 10,
        question: "What is a stop-loss order?",
        answer: "A stop-loss order is an automatic order to sell a stock when its price falls to a certain level to minimize losses."
    }
];



export const FaqMainPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    const navigate = useNavigate()
    const [select_drop, setSelect_drop] = useState(1)
    const [select_drop_2, setSelect_drop_2] = useState(1)

    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    return (
        <motion.div className='faqs_first_div_main_page'>
            <motion.div >

                <Navbar2 />
            </motion.div>
            <motion.div className='faqs_heading_div_main_page'>

                <span className='h_main_main_page'>FAQ</span>
            </motion.div>
            <motion.div className='faqs_main_page' ref={refTwo}
                initial={{ opacity: 0, x: -100 }}
                animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}>


                <motion.div className='faqs_main_main_page'>

                    <motion.div className='faqs_left_main_page'
                    >

                        {stockMarketQA.map((item, index) => (
                            <motion.div key={index} className='drop_main_page' onClick={() => setSelect_drop(item.id)}

                            >
                                <motion.div className='drop_style_main_page' style={{ backgroundColor: select_drop == item.id ? "#1976D2" : null }}>
                                    <motion.div className='drop_icon_main_page'>
                                        {select_drop == item.id ? (
                                            <RemoveCircleIcon className='icon_main_page' />
                                        ) : (

                                            <AddCircleIcon className='icon_main_page' />
                                        )}
                                    </motion.div>
                                    <motion.div className='drop_text_main_page'>
                                        <p className='text_main_page' style={{ color: select_drop == item.id ? '#fff' : null }}>{item.question} </p>
                                    </motion.div>

                                </motion.div>
                                {select_drop == item.id ? (
                                    <motion.div >
                                        <p className='para_text_main_page'>{item.answer}</p>
                                    </motion.div>
                                ) : null}


                            </motion.div>
                        ))}


                    </motion.div>

                    {/* -------------------------------------------------------------RIGHT----------------------------------------------- */}
                    <motion.div className='faqs_right_main_page'
                    >
                        {stockMarketQA2.map((item, index) => (
                            <motion.div className='drop_main_page' onClick={() => setSelect_drop_2(item.id)}>
                                <motion.div className='drop_style_main_page' style={{ backgroundColor: select_drop_2 == item.id ? "#1976D2" : null }}>
                                    <motion.div className='drop_icon_main_page'>
                                        {select_drop_2 == item.id ? (
                                            <RemoveCircleIcon className='icon_main_page' />
                                        ) : (

                                            <AddCircleIcon className='icon_main_page' />
                                        )}
                                    </motion.div>
                                    <motion.div className='drop_text_main_page'>
                                        <p className='text_main_page' style={{ color: select_drop_2 == item.id ? '#fff' : null }}>{item.question} </p>
                                    </motion.div>

                                </motion.div>
                                {select_drop_2 == item.id ? (
                                    <motion.div >
                                        <p className='para_text_main_page'>{item.answer}</p>
                                    </motion.div>
                                ) : null}


                            </motion.div>

                        ))}

                    </motion.div>
                </motion.div>
            </motion.div>

            <Footer />
        </motion.div>

    )
}
