import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./contactUs.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Autocomplete } from "@mui/material";
import { motion, useInView } from "framer-motion";
import { Nav } from '../nav/nav';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Footer } from '../footer/footer';
import { New_breadCrumbs } from '../newCrumbs/newcrumbs';
import banner_bg from '../../assets/new/banner_bg.png'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PrimaryButton from '../../Buttons/primaryButton';


const stockName = [
    {
        value: '1',
        label: 'stock one',
    },
    {
        value: '2',
        label: 'stock two',
    },
    {
        value: '3',
        label: 'stock three',
    },
    {
        value: '4',
        label: 'stock four',
    },
];
const tax = [
    {
        value: '1',
        label: 'tax 1',
    },
    {
        value: '2',
        label: 'tax 2',
    },
    {
        value: '3',
        label: 'tax 3',
    },
    {
        value: '4',
        label: 'tax 4',
    },
];

export const ContactUs = () => {
    const [selectedStock, setSelectedStock] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const refOne = React.useRef(null);


    const inViewOne = useInView(refOne, { triggerOnce: true });
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div >

            <div>
                <Nav />
                <New_breadCrumbs />
            </div>
            <div style={{ backgroundImage: `url(${banner_bg})` }}
                className="bg-cover bg-center min-h-screen ">
                <div className='flex flex-col md:flex-col lg:flex-row justify-center w-full overflow-hidden'>
                    <motion.div className=' py-3 md:py-5 lg:py-10 px-2 md:px-5 lg:px-10 w-full md:w-full lg:w-[40%] flex  justify-center items-start'>
                        <div className='w-full md:w-full lg:w-[70%]  py-10 px-10'>
                            <div>
                                <h2 className="text-3xl md:text-3xl font-bold text-[#0c263a] mb-4 font-sans">
                                    Let’s{" "}
                                    <span className="text-blue-600">
                                        get in touch
                                    </span>
                                    {" "}With Us
                                </h2>
                            </div>
                            <div className='flex flex-row justify-between items-center py-5'>
                                <div className='group border border-gray-200 hover:border-green-600 p-1 rounded-full transition duration-300 cursor-pointer'>
                                    <FacebookIcon className='group-hover:text-#00d094' />
                                </div>
                                <div className='group border border-gray-200 hover:border-green-600 p-1 rounded-full transition duration-300 cursor-pointer'>
                                    <TwitterIcon className='group-hover:text-#00d094' />
                                </div>
                                <div className='group border border-gray-200 hover:border-green-600 p-1 rounded-full transition duration-300 cursor-pointer'>
                                    <LinkedInIcon className='group-hover:text-#00d094' />
                                </div>
                                <div className='group border border-gray-200 hover:border-green-600 p-1 rounded-full transition duration-300 cursor-pointer'>
                                    <YouTubeIcon className='group-hover:text-#00d094' />
                                </div>
                            </div>
                            <div className='flex flex-col items-start'>
                                <div className='flex flex-row justify-center items-center py-4'>
                                    <div className='bg-[#f5f7fc] shadow-lg rounded-full p-5'>
                                        <PhoneOutlinedIcon className='text-blue-600' sx={{ fontSize: '30px' }} />
                                    </div>
                                    <div className='text-lg font-sans pl-2 font-semibold text-[#6b777f]'>0331 9998780</div>
                                </div>

                                <div className='flex flex-row justify-center items-center py-4'>
                                    <div className='bg-[#f5f7fc] shadow-lg rounded-full p-5'>
                                        <EmailOutlinedIcon className='text-blue-600' sx={{ fontSize: '30px' }} />
                                    </div>
                                    <div className='text-lg font-sans pl-2 font-semibold text-[#6b777f]'>info@tradingdiary.pk</div>
                                </div>

                                <div className='flex flex-row justify-center items-center'>
                                    <div className='bg-[#f5f7fc] shadow-lg rounded-full p-5'>
                                        <PlaceOutlinedIcon className='text-blue-600' sx={{ fontSize: '30px' }} />
                                    </div>
                                    <div className='text-lg font-sans pl-2 font-semibold text-[#6b777f]'>R-5, Row-5, Block D, NCECHS, Gulshan-e-iqbal Block 10-A, Karachi.</div>
                                </div>

                            </div>
                        </div>


                    </motion.div>


                    <motion.div
                        className='py-2 md:py-5 lg:py-10 px-5 md:px-[30px] lg:px-[80px]  w-full md:w-full lg:w-[60%]'
                        ref={refOne}
                        initial={{ opacity: 0, y: -100 }}
                        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: .8 }}>
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                contact: '',
                                subject: '',
                                msg: ''
                            }}
                            onSubmit={(values, { resetForm }) => {
                                addData(values)
                                resetForm();
                            }}>
                            {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                                <form onSubmit={handleSubmit} >

                                    <div className='w-full flex flex-col '>

                                        <TextField
                                            type='text'

                                            id="outlined-required"
                                            label="Name"
                                            placeholder="Name..."
                                            selected={values.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            sx={{
                                                width: '100%', marginTop: 2, backgroundColor: '#fff',
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00d094',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: '#00d094',
                                                    },
                                                },
                                            }}

                                        />
                                        <TextField
                                            type='email'
                                            id="outlined-required"
                                            placeholder="Email..."

                                            label="email"
                                            selected={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            sx={{
                                                width: '100%', marginTop: 2, backgroundColor: '#fff', outline: 'none', border: 'none',
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00d094',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: '#00d094',
                                                    },
                                                },
                                            }}

                                        />

                                        <TextField
                                            id="outlined-required"
                                            label="Contact"
                                            type="number"
                                            placeholder="Contact..."
                                            name='contact'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.contact}
                                            sx={{
                                                width: '100%', marginTop: 2, backgroundColor: '#fff',
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00d094',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: '#00d094',
                                                    },
                                                },
                                            }}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="Subject"
                                            type="text"
                                            placeholder="Subject..."
                                            name='Subject'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.subject}
                                            sx={{
                                                width: '100%', marginTop: 2, backgroundColor: '#fff',
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00d094',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: '#00d094',
                                                    },
                                                },
                                            }}
                                        />
                                        <TextField
                                            id="outlined-required"
                                            label="Message"
                                            type="text"
                                            placeholder="Message..."
                                            name='Message'
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.msg}
                                            rows={6}
                                            multiline
                                            sx={{
                                                width: '100%', marginTop: 2, backgroundColor: '#fff',
                                                '& .MuiOutlinedInput-root': {
                                                    '&.Mui-focused fieldset': {
                                                        borderColor: '#00d094',
                                                    },
                                                },
                                                '& .MuiInputLabel-root': {
                                                    '&.Mui-focused': {
                                                        color: '#00d094',
                                                    },
                                                },
                                            }}

                                        />


                                        <div className=' w-full flex flex-row items-center justify-center py-10'>
                                            <PrimaryButton title='Contact us now' onClick={() => dispatch(setDividen_list())} />
                                        </div>
                                    </div>
                                </form>
                            )}

                        </Formik>
                    </motion.div>
                </div>
            </div>
            <Footer />
        </div>

    )
}
