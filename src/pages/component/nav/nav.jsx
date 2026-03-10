import React, { useEffect, useState } from 'react';
import './nav.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { DrawerBar } from '../drawer/drawer';
import { useDispatch } from 'react-redux';
import { setScrollToSection } from '../Redux/scrollSlice';
import api from '../../../api/axios';
import banner_bg from '../../assets/new/banner_bg.png'
import { motion, AnimatePresence, useInView } from "framer-motion";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import PrimaryButton from '../../Buttons/primaryButton';


export const Nav = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 990);
    const [isSticky, setIsSticky] = useState(false);
    const [color, setColor] = useState(null)
    const [headerLogo, setHeaderLogo] = useState(null);

    useEffect(() => {

        const fetchHeaderLogo = async () => {
            try {
                const res = await api.get("/adminpanel/header_settings/");
                const logoPath = res.data.header_logo;

                const BASE_URL = (api.defaults.baseURL)
                    .replace(/\/api\/?$/, "")
                    .replace(/\/$/, "");

                //  Build proper image URL
                const logoUrl = logoPath
                    ? logoPath.startsWith("http")
                        ? logoPath
                        : logoPath.startsWith("/media/")
                            ? `${BASE_URL}${logoPath}`
                            : `${BASE_URL}/media/${logoPath}`
                    : null;

                setHeaderLogo(logoUrl);
            } catch (err) {

            }

        };

        fetchHeaderLogo();

    }, []);
    //------------------------------------------------------------------

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth < 990);
        };

        const handleScroll = () => {
            if (window.scrollY > 100) {

                setIsSticky(true);
            } else {
                setIsSticky(false);

            }
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };

    }, []);

    //-------------------------------------------------
    const refOne = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });

    return (


        <div className={`w-full transition-all duration-300  ${isSticky
            ? "fixed top-0 left-0 z-50 bg-white shadow-lg"
            : "relative bg-transparent"
            }`}>
            <motion.nav

                ref={refOne}
                initial={{ opacity: 0, y: -20 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}

                className="w-full bg-transparent-all duration-300 px-4 md:px-10 py-4 relative z-50"
            >
                <div className="flex items-center justify-between lg:justify-evenly">

                    <div className="w-40 cursor-pointer">
                        <img
                            src={headerLogo}
                            alt="Logo"
                            className="w-full"
                            onClick={() => navigate("/")}
                        />
                    </div>

                    <div className="hidden lg:flex space-x-8 text-[#0c263a] font-medium">
                        <span className={`hover:text-green-400 cursor-pointer font-sans text-lg ${location.pathname === '/' ? 'text-green-400' : 'text-[#0c263a]'}`} onClick={() => navigate('/')}>Home</span>
                        <span className={`hover:text-green-400 cursor-pointer font-sans text-lg ${color == 1 || location.pathname === '/about-us' ? 'text-green-400' : 'text-[#0c263a]'}`}
                            onClick={() => {
                                dispatch(setScrollToSection('about-us'))
                                navigate('/about-us')
                                setColor(1)
                            }}>About</span>

                        <span className={`hover:text-green-400 cursor-pointer font-sans text-lg ${color == 2 || location.pathname === '/how-works' ? 'text-green-400' : 'text-[#0c263a]'}`}
                            onClick={() => {
                                navigate('/how-works')
                                setColor(2)
                            }}>How</span>

                        <span className={`hover:text-green-400 cursor-pointer font-sans text-lg ${color == 3 || location.pathname === '/blogs' ? 'text-green-400' : 'text-[#0c263a]'}`}
                            onClick={() => {
                                setColor(3)
                                navigate('/blogs')

                            }}>Blogs</span>

                        <span className={`hover:text-green-400 cursor-pointer font-sans text-lg ${color == 4 || location.pathname === '/faqs' ? 'text-green-400' : 'text-[#0c263a]'}`}
                            onClick={() => {
                                setColor(4)
                                dispatch(setScrollToSection('faqs'));
                                navigate('/faqs')

                            }}>FAQs</span>

                        <span className={`hover:text-green-400 cursor-pointer font-sans text-lg ${color == 5 || location.pathname === '/contact-us' ? 'text-green-400' : 'text-[#0c263a]'}`}
                            onClick={() => {
                                setColor(null)
                                navigate('/contact-us')
                            }}>Contact</span>

                    </div>

                    <div className="hidden lg:block">

                        <PrimaryButton title='Join Now'
                            onClick={() => {
                                navigate('/login')
                            }} />
                    </div>

                    <div className="lg:hidden">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="text-gray-800 text-2xl"
                        >
                            {mobileOpen ? (<CloseIcon className="w-10 h-10 text-black" />) : (<MenuIcon className="w-10 h-10 text-black" />)}

                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden absolute top-full left-0 w-full bg-white p-4 rounded-b-lg shadow-lg flex flex-col space-y-4 text-[#0c263a] font-medium z-50"
                        >
                            <span className="hover:text-green-400 cursor-pointer" onClick={() => navigate('/')}>Home</span>
                            <span className="hover:text-green-400 cursor-pointer"
                                onClick={() => {
                                    dispatch(setScrollToSection('about-us'))
                                    navigate('/about-us')
                                    setColor(1)
                                }}>About</span>
                            <span className="hover:text-green-400 cursor-pointer"
                                onClick={() => {
                                    navigate('/how-works')
                                    setColor(2)
                                }}>How</span>
                            <span className="hover:text-green-400 cursor-pointer"
                                onClick={() => {
                                    setColor(3)
                                    navigate('/blogs')

                                }}>Blogs</span>
                            <span className="hover:text-green-400 cursor-pointer"
                                onClick={() => {
                                    setColor(4)
                                    dispatch(setScrollToSection('faqs'));
                                    navigate('/faqs')

                                }}>FAQs</span>
                            <span className="hover:text-green-400 cursor-pointer"
                                onClick={() => {
                                    setColor(null)
                                    navigate('/contact-us')
                                }}>Contact</span>

                            <PrimaryButton title='Join Now'
                                onClick={() => {
                                    navigate('/login')
                                }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

        </div>

        //--------------------old----------------------
        /* <div className={`nav ${isSticky ? 'sticky-nav-main' : ''}`}>
            <div className="left">
                <img className="nav_logo" src={headerLogo }  alt="Logo"  onClick={() => navigate('/')}/>
            </div>

            <div className="right">
                {isMobile ? (
                    <DrawerBar />
                ) : (
                    <div>
                        
                        <span
                            style={{ color: location.pathname === '/' ? 'var(--primary-blue)' : '#000' }}
                            className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            onClick={() => navigate('/')}
                        >
                            Home
                        </span>

                       <span
                            style={{ color: color == 1 || location.pathname === '/about-us' ? 'var(--primary-blue)' : '#000' }}

                            className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            onClick={() => {
                                dispatch(setScrollToSection('about-us'))
                                navigate('/about-us')
                                setColor(1)
                            }}
                        >
                            About
                        </span>

                        <span
                            style={{ color: color == 2 || location.pathname === '/how-works' ? 'var(--primary-blue)' : '#000' }}

                            className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            onClick={() => {
                                navigate('/how-works')
                                setColor(2)
                            }}
                        >
                            How
                        </span>

                        <span
                            style={{ color: color == 3 || location.pathname === '/blogs' ? 'var(--primary-blue)' : '#000' }}
                            className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            onClick={() => {
                                setColor(3)
                                navigate('/blogs')

                            }}
                        >
                            Blogs
                        </span>

                        <span
                            style={{ color: color == 4 || location.pathname === '/faqs' ? 'var(--primary-blue)' : '#000' }}
                            className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            onClick={() => {
                                setColor(4)
                                dispatch(setScrollToSection('faqs'));
                                navigate('/faqs')

                            }}
                        >
                            FAQs
                        </span>
                        <span
                            style={{ color: color == 5 || location.pathname === '/contact-us' ? '#1976d2' : '#000' }}
                            className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            onClick={() => {
                                setColor(null)
                                navigate('/contact-us')
                            }}
                        >
                            Contact
                        </span>

                        <span
                            style={{ color: color == 6 || location.pathname === '/login' ? '#1976d2' : '#000' }}
                            className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            onClick={() => {
                                navigate('/login')
                                setColor(5)
                            }}
                        >
                            Login
                        </span>

                    </div>
                )}
            </div>
        </div> */
    );
};
