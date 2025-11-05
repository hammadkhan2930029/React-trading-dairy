
import React from 'react'
import './fullCard.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion, useInView } from "framer-motion";


export const FullCard = () => {
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });

    return (
        <motion.div className='fullCard' >
            <motion.div className="back"

                ref={refOne}
                initial={{ opacity: 0, x: -100 }}
                animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: .8 }}
            >
                <motion.div className="front"
                    ref={refTwo}
                    initial={{ opacity: 0, x: 100 }}
                    animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .8 }}>

                    <motion.div className='playIcon'
                        ref={refOne}
                        initial={{ opacity: 0, y: -100 }}
                        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: .8 }}>

                        <motion.div className="one">
                            <div className="two">

                                <PlayArrowIcon className='icon' />
                            </div>
                        </motion.div>

                    </motion.div>
                    <span className='h1'>Check the Demo Video!</span>
                    <div className='full_card_line'></div>
                    <span className='h4'>Maximize your investment potential with a smart, data-driven approach. 📈🚀</span>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}
