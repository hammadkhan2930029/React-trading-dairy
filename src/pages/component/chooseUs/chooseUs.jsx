import React, { useEffect, useState, useRef } from 'react'
import { motion, useInView } from "framer-motion";
import './chooseUs.css';
import 'react-slideshow-image/dist/styles.css'

import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BrushIcon from '@mui/icons-material/Brush';
import WindowIcon from '@mui/icons-material/Window';
import stock3 from '../../assets/stock-3.jpg';
import stock4 from '../../assets/stock-4.jpg'

import stock5 from '../../assets/stock-5.jpg'




const data = [
  {
    url: stock3,
    icon: <WorkspacePremiumIcon className="icon" />,
    heading: 'Premium Market Analysis',
    data1: 'Backed by expert research, our stock market insights help you make informed investment decisions with confidence.',




  },
  {
    url: stock4,
    icon: <BrushIcon className="icon" />,
    heading: ' Smart & Versatile Trading Strategies',
    data1: 'Whether youre a day trader, swing trader, or long-term investor, our strategies adapt to market trends for maximum returns.',



  },
  {
    url: stock5,
    icon: <WindowIcon className="icon" />,
    heading: 'Well-Structured Portfolio Management',
    data1: 'Stay organized and optimize your stock investments with a balanced portfolio designed for growth and risk management Trade smarter, invest better, and stay ahead in the market! 🚀📊',



  },

];
export const ChooseUs = () => {
  const [currentImage, setCurrentImage] = useState(stock3);
  const refOne = React.useRef(null);
  const refTwo = React.useRef(null);

  const inViewOne = useInView(refOne, { triggerOnce: true });
  const inViewTwo = useInView(refTwo, { triggerOnce: true });
  return (
    <motion.div className='chooseUs'>
      <motion.div
        className="choseOne"
        ref={refOne}
        initial={{ opacity: 0, x: -100 }}
        animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: .8 }}>

        <span className='h1'>We Provide the Best & Most Reliable Stock Market Insights</span>
        <div className='line'></div>
        {data.map((item, index) => (
          <div key={index} className="card-container" onMouseEnter={() => setCurrentImage(item.url)}>
            <motion.div className="highQuality">
              <motion.div >
                <motion.div className="shap2">
                  {item.icon}
                </motion.div>
              </motion.div>


              <motion.div
                className="textarea"

              >
                <span className="h1">{item.heading}</span>
                <span className="h2">{item.data1}</span>
              </motion.div>
            </motion.div>


          </div>
        ))}





      </motion.div>
      {/* ------------------------------Choose tow------------------------------------- */}


      <motion.div className='choseTwo' ref={refTwo}
        initial={{ opacity: 0, x: 100 }}
        animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: .8 }}>
        <motion.div className="image-display"
         //animate={{ y: [0, 20, 0] }}
         //transition={{ duration: 1.5, repeat: Infinity }}
         >
          <img
            src={`${currentImage}`}
            alt="Display"
            className="display-image"
          />
        </motion.div>
      </motion.div>



    </motion.div>
  )
}

