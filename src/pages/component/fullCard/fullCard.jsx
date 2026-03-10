
import React from 'react'
import './fullCard.css';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { motion, useInView } from "framer-motion";
import homeVideo from '../../assets/home-video.webp'


export const FullCard = () => {
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });

    return (
        <motion.div className='bg-[#00d094] overflow-hidden'
            ref={refOne}
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: .8 }}>
            <div className='flex flex-col justify-center items-center py-10 px-4'>

                <div className="mb-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-[#0c263a] mb-4 font-sans">
                        Check the Demo {" "}
                        <span className="text-blue-600">
                            Video!
                        </span>
                    </h2>
                    <p className="text-white  font-sans max-w-lg mx-auto">
                        Maximize your investment potential with a smart, data-driven approach. 📈🚀
                    </p>
                </div>
                <motion.div
                    style={{ backgroundImage: `url(${homeVideo})` }}
                    className="relative w-[90%] md:w-4/5 lg:w-2/3 h-[250px]  sm:h-[350px] md:h-[450px] bg-cover bg-no-repeat bg-center rounded-[50px] flex justify-center items-center shadow-2xl"
                    ref={refTwo}
                    initial={{ opacity: 0, x: 100 }}
                    animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: .8 }}>

                    <motion.div className='bg-[#00d094] p-3 md:p-5 rounded-full z-10 cursor-pointer shadow-lg  transition-colors duration-300 group hover:shadow-xl hover:scale-110'
                        ref={refOne}
                        initial={{ opacity: 0, y: -100 }}
                        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: .8 }}>



                        <PlayArrowIcon sx={{
                            fontSize: { xs: 40, md: 60 },
                            color: 'white',
                            '.group-hover &': { color: '#00d094' } 
                        }} />



                    </motion.div>
                </motion.div>
            </div>
        </motion.div>

        //---------------OLd-------------------
        // <motion.div className='fullCard' >
        //     <motion.div className="back"
        //         ref={refOne}
        //         initial={{ opacity: 0, x: -100 }}
        //         animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        //         transition={{ duration: .8 }}
        //     >

        //         <span className='h1'>Check the Demo Video!</span>
        //         <div className='full_card_line'></div>
        //         <span className='h4'>Maximize your investment potential with a smart, data-driven approach. 📈🚀</span>
        //         <motion.div className="front"
        //             ref={refTwo}
        //             initial={{ opacity: 0, x: 100 }}
        //             animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        //             transition={{ duration: .8 }}>

        //             <motion.div className='playIcon'
        //                 ref={refOne}
        //                 initial={{ opacity: 0, y: -100 }}
        //                 animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        //                 transition={{ duration: .8 }}>

        //                 <motion.div className="one">
        //                     <div className="two">
        //                         <PlayArrowIcon className='icon' />
        //                     </div>
        //                 </motion.div>

        //             </motion.div>
        //         </motion.div>
        //     </motion.div>
        // </motion.div>
    )
}
