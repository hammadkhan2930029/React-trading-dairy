import React from 'react';
import banner_bg from '../../assets/new/banner_bg.png'
import newLogo from '../../assets/newLogo.png'
import { ThreeDots } from 'react-loader-spinner'
import { motion, useInView } from "framer-motion";

export const Splash = () => {

    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    return (
        <div style={{ backgroundImage: `url(${banner_bg})` }}
            className="bg-cover bg-center min-h-screen flex  justify-center items-center ">
            <motion.div
                className='flex flex-col justify-center items-center'
               
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.8,
                    scale: { type: "spring", visualDuration: 0.7, bounce: 0.6 },
                }}
            >

                <img src={newLogo} className='object-contain w-[191px] h-[77px] ' />
                <ThreeDots
                    height="60"
                    width="100"
                    radius="9"
                    color="#4fa94d"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{ margin: '-5px' }}
                    wrapperClass="custom-loader"
                    visible={true}
                />
            </motion.div >


        </div>
    )
}