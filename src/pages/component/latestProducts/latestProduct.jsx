
import React, { useEffect, useState, useRef } from 'react';
import './latestProduct.css';
import { motion, useInView } from "framer-motion";

import one from '../../assets/one.png';
import two from '../../assets/two.png';
import three from '../../assets/three.png';





const cardsData = [
    {
        url: one,
        heading: 'Shoulder Bag - E358',
        data1: 'ZELLBURY WOMEN',
        data2: 'Shoulder Bag witn inside pocket, two hand carry handles',
      
        price: '$155'



    },
    {
        url: two,
        heading: 'Canvas Bags - E500',
        data1: 'ZELLBURY WOMEN',
        data2: 'Tote Bag in canvas fabric with zip closure. Single compartment, two hand carry handles',
      
        price: '$110'



    },
    {
        url: three,
        heading: 'Cross-Body Bags - E504',
        data1: 'ZELLBURY WOMEN',
        data2: 'Cross body bag with a flap, single compartment with a long chain',
        
        price: '$50'



    },

];

export const Latest = () => {
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });


    return (
        < motion.div className='latestProduct'>
            <motion.div
            className='latest_main'
                ref={refOne}
                initial={{ opacity: 0, x: 100 }}
                animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}>

                <motion.div className='top_latest'>
                    <span className='topHeading2'>We Have Lots of Excellent And High Quality Products.</span>
                 <div className='line'></div>

                </motion.div>
                <motion.div className='productCards'
                    ref={refTwo}
                    initial={{ opacity: 0, x: -50 }}
                    animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .8 }}

                >
                    {cardsData.map((item, index) => (
                        <motion.div className='productCard1' >

                            <div className='img_Div_latest'>
                                <img src={item.url} className='card_image_latest' />
                            </div>
                            <div className='cardData'>
                                <h2 className="h2">{item.heading}</h2>
                                <p className='brandName'>{item.data1}</p>
                                <p className='h7'>{item.data2}</p>
                              
                                <h2 className='price'>{item.price}</h2>
                                <button className='btn_latest'>Buy now</button>
                              
                            </div>


                        </motion.div>
                    ))}
                   
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

