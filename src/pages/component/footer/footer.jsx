import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';
import newAsset26 from '../../assets/newAsset26.png'
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import api from "../../../api/axios";
import './footer.css';
import { useLocation, useNavigate } from 'react-router-dom';
import banner_bg from '../../assets/new/banner_bg.png'

export const Footer = () => {

    const navigate = useNavigate()
    const refOne = React.useRef(null);
    const refTwo = React.useRef(null);
    const [footer, setFooter] = useState(null);
    const [footerLogo, setFooterLogo] = useState(null);
    const year = new Date().getFullYear();

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });

    useEffect(() => {

        api.get("/adminpanel/view_footer/")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setFooter(data);
            })
            .catch((err) => {

                setFooter({});
            });

    }, []);

    useEffect(() => {

        const fetchFooterLogo = async () => {

            try {
                const res = await api.get("/adminpanel/header_settings/");
                const logoPath = res.data.footer_logo;

                const BASE_URL = (api.defaults.baseURL)
                    .replace(/\/api\/?$/, "")
                    .replace(/\/$/, "");

                // Build the proper URL
                const logoUrl = logoPath
                    ? logoPath.startsWith("http")
                        ? logoPath
                        : logoPath.startsWith("/media/")
                            ? `${BASE_URL}${logoPath}`
                            : `${BASE_URL}/media/${logoPath}`
                    : null;

                setFooterLogo(logoUrl);
            } catch (err) {

            }

        };

        fetchFooterLogo();
    }, []);

    if (!footer) return <div style={{ minHeight: '50px' }} className='f_main'></div>;

    return (

        <div className='bg-[#00150f]'>
            <div className='bg-cover bg-center min-h-full py-10 px-4 md:px-10'>
                <motion.div
                    className='flex flex-col lg:flex-row justify-between items-start lg:items-center w-full py-10 gap-10 lg:gap-0'
                    ref={refOne}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: .8 }}>

                    {/* Logo & Social Section */}
                    <motion.div className='flex flex-col justify-center items-center lg:items-center w-full lg:w-[30%] text-center lg:text-left'>

                        <motion.div className='border-b-4 border-[#00d094] pb-2'
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: .8 }}>
                            <img
                                src={newAsset26}
                                alt="Logo"
                                className='object-contain w-[160px] md:w-[199px] h-auto drop-shadow-[0_0_25px_rgba(0,208,148,0.9)]'
                            />
                        </motion.div>

                        {/* Social Icons */}
                        <motion.div className='flex flex-row justify-center lg:justify-center gap-4 py-8 w-full'>
                            {[
                                { icon: <FacebookIcon />, link: footer.facebook, hover: 'hover:text-blue-600' },
                                { icon: <TwitterIcon />, link: footer.twitter, hover: 'hover:text-blue-400' },
                                { icon: <LinkedInIcon />, link: footer.linkedin, hover: 'hover:text-blue-700' },
                                { icon: <YouTubeIcon />, link: footer.youtube, hover: 'hover:text-red-600' }
                            ].map((social, index) => social.link && (
                                <a key={index} href={social.link} target="_blank" rel="noreferrer">
                                    <div className='group w-[35px] h-[35px] md:w-[40px] md:h-[40px] rotate-45 rounded-lg bg-[#00d094] hover:bg-white flex justify-center items-center transition-all duration-300 shadow-lg shadow-[#00d094]/20'>
                                        <div className='-rotate-45 group-hover:scale-110 transition-transform'>
                                            {React.cloneElement(social.icon, {
                                                className: `text-white ${social.hover} text-[20px] md:text-[24px]`
                                            })}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </motion.div>

                        <motion.span className='text-gray-400 text-sm'>
                            Copyright © {year} Cogent Devs. <br className="md:hidden" /> All Rights Reserved.
                        </motion.span>
                    </motion.div>

                    {/* Links Sections Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full lg:w-[65%] py-5">

                        {/* Quick Links */}
                        <div className='flex flex-col'>
                            <h3 className="text-gray-200 text-lg font-bold font-sans py-2">Quick links</h3>
                            <div className='w-[60px] h-[3px] bg-[#00d094] rounded-full mb-4'></div>
                            <ul className="space-y-2">
                                {['About Us', 'Blogs', 'Contact Us', 'How it Works'].map((item) => (
                                    <li key={item} onClick={() => navigate(`/${item.toLowerCase().replace(/ /g, '-')}`)}
                                        className="text-gray-400 text-sm md:text-base font-sans hover:text-[#00d094] cursor-pointer transition-colors">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Others */}
                        <div className='flex flex-col'>
                            <h3 className="text-gray-200 text-lg font-bold font-sans py-2">Others</h3>
                            <div className='w-[60px] h-[3px] bg-[#00d094] rounded-full mb-4'></div>
                            <ul className="space-y-2">
                                {['Login', 'FAQs', 'Privacy Policy', 'Terms & Conditions'].map((item) => (
                                    <li key={item} onClick={() => navigate(`/${item.toLowerCase().replace(/ /g, '-')}`)}
                                        className="text-gray-400 text-sm md:text-base font-sans hover:text-[#00d094] cursor-pointer transition-colors">
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div className='flex flex-col sm:col-span-2 md:col-span-1'>
                            <h3 className="text-gray-200 text-lg font-bold font-sans py-2">Contact</h3>
                            <div className='w-[60px] h-[3px] bg-[#00d094] rounded-full mb-4'></div>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-2 text-gray-400 text-sm md:text-base font-sans hover:text-[#00d094] transition-colors">
                                    <LocationOnIcon className="text-[#00d094] shrink-0" />
                                    <span>{footer.address}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-400 text-sm md:text-base font-sans hover:text-[#00d094] transition-colors">
                                    <EmailIcon className="text-[#00d094] shrink-0" />
                                    <span className="break-all">{footer.email}</span>
                                </li>
                                <li className="flex items-center gap-2 text-gray-400 text-sm md:text-base font-sans hover:text-[#00d094] transition-colors">
                                    <CallIcon className="text-[#00d094] shrink-0" />
                                    <span>{footer.phone}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </motion.div>
            </div>
        </div>
    )
}
