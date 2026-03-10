import React, { useEffect, useState, useRef, forwardRef } from 'react'
import { motion, useInView } from "framer-motion";
import 'react-slideshow-image/dist/styles.css'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import BrushIcon from '@mui/icons-material/Brush';
import WindowIcon from '@mui/icons-material/Window';
import features01 from '../../assets/new/features01.png';
import features02 from '../../assets/new/features02.png';


const data = [
    {
        url: features01,
        icon: <WorkspacePremiumIcon className="icon" />,
        heading: 'Track Your Trading Performance',
        data1: 'Monitor your portfolio to see where your investments are performing well and where they need attention.',
    },
    {
        url: features02,
        icon: <BrushIcon className="icon" />,
        heading: 'Gain Clear Visibility of Your Investments',
        data1: 'Keep all your assets—stocks, mutual funds, ETFs, and more—organized in one place.',
    },
    {
        url: features01,
        icon: <WindowIcon className="icon" />,
        heading: 'Improve Long-Term Growth',
        data1: 'Use visual dashboards to understand diversification and asset allocation, enabling smarter, informed decisions instead of juggling spreadsheets.',
    },

];


export const ChooseUs = forwardRef((props, ref) => {

    const [currentImage, setCurrentImage] = useState(features01);
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });

    return (
        <section className="bg-gradient-to-r from-gray-200 to-gray-50  py-16 px-6 md:px-12 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-5xl font-bold text-[#0c263a] mb-4 font-sans">
                            Why You Should Manage Your{" "}
                            <span className="text-blue-600">
                                Portfolio
                            </span>
                        </h2>
                        <p className="text-gray-500 max-w-md font-sans">
                            Unlock the full potential of our product with our amazing features and top-notch services.
                        </p>
                    </div>

                    <div className="space-y-4 ">
                        {data.map((item, index) => (
                            <motion.div
                                key={index}
                                onMouseEnter={() => setCurrentImage(item.url)}
                                className="group p-6 bg-transparent hover:bg-white rounded-2xl transition-all duration-300 cursor-pointer border border-gray-200 hover:shadow-xl hover:border-gray-100 border-gray-200"
                            >
                                <h3 className="text-lg font-bold text-[#0c263a] group-hover:text-blue-600 transition-colors font-sans">
                                    {item.heading}
                                </h3>
                                <p className="text-gray-500 mt-2 text-sm leading-relaxed  transition-opacity duration-300 font-sans ">
                                    {item.data1}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="relative flex justify-center items-center"
                >
                    <div className="absolute inset-0 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10 transform scale-110"></div>

                    <div className="relative z-10 w-full max-w-lg">
                        <img
                            src={currentImage}
                            alt="Feature Illustration"
                            className="w-full h-auto  drop-shadow-[0_0_25px_rgba(0,208,148,0.5)]"
                        />
                    </div>
                </motion.div>

            </div>
        </section>
       
        //------------------------------------------------------------
        // <motion.div className='chooseUs' ref={ref}>
        //     <motion.div
        //         className="choseOne"
        //         ref={refOne}
        //         initial={{ opacity: 0, x: -100 }}
        //         animate={inViewOne ? { opacity: 1, x: 0 } : {}}
        //         transition={{ duration: .8 }}
        //     >
        //         <span className='h1'>Why You Should Manage Your Portfolio</span>
        //         <div className='line5'></div>
        //         {data.map((item, index) => (
        //             <div key={index} className="card-container" onMouseEnter={() => setCurrentImage(item.url)}>
        //                 <motion.div className="highQuality">
        //                     <motion.div >
        //                         <motion.div className="shap2">
        //                         {item.icon}
        //                         </motion.div>
        //                     </motion.div>

        //                     <motion.div
        //                         className="textarea"
        //                     >
        //                         <span className="h1">{item.heading}</span>
        //                         <span className="h2">{item.data1}</span>
        //                     </motion.div>
        //                 </motion.div>
        //             </div>
        //         ))}

        //     </motion.div>
        //     {/* ------------------------------Choose tow------------------------------------- */}
        //     <motion.div className='choseTwo' ref={refTwo}
        //         initial={{ opacity: 0, x: 100 }}
        //         animate={inViewTwo ? { opacity: 1, x: 0 } : {}}
        //         transition={{ duration: .8 }}
        //     >
        //         <motion.div className="image-display"

        //         >
        //             <img
        //                 src={`${currentImage}`}
        //                 alt="Display"
        //                 className="display-image"
        //             />
        //         </motion.div>
        //     </motion.div>

        // </motion.div>
    )

})

