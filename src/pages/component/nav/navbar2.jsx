// import React, { useEffect, useState } from 'react';
// import './nav.css';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { DrawerBar } from '../drawer/drawer';
// import newAsset23 from '../../assets/newAsset23.png';
// import { useDispatch } from 'react-redux';
// import { setScrollToSection } from '../Redux/scrollSlice';
// import api from '../../../api/axios';
// import { motion, AnimatePresence } from "framer-motion";
// import PrimaryButton from '../../Buttons/primaryButton';
// import MenuIcon from '@mui/icons-material/Menu';
// import CloseIcon from '@mui/icons-material/Close';



// export const Navbar2 = () => {
//     const [mobileOpen, setMobileOpen] = useState(false);

//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();
//     const [isMobile, setIsMobile] = useState(window.innerWidth < 990);
//     const [isSticky, setIsSticky] = useState(false);
//     const [color, setColor] = useState(null)
//     const [headerLogo, setHeaderLogo] = useState(null);

//     useEffect(() => {
//         const fetchHeaderLogo = async () => {
//             try {
//                 const res = await api.get("/adminpanel/header_settings/");

//                 // ✅ Get the logo path safely
//                 const logoPath = res.data?.header_logo || null;

//                 // ✅ Ensure correct base for media (remove '/api' if present)
//                 const API_BASE_URL = api.defaults.baseURL;
//                 const MEDIA_BASE_URL = API_BASE_URL?.includes("/api")
//                     ? API_BASE_URL.replace("/api", "")
//                     : API_BASE_URL;

//                 // ✅ Build proper logo URL
//                 const logoUrl = logoPath
//                     ? logoPath.startsWith("http")
//                         ? logoPath
//                         : logoPath.startsWith("/media/")
//                             ? `${MEDIA_BASE_URL}${logoPath}`
//                             : `${MEDIA_BASE_URL}/media/${logoPath}`
//                     : null;

//                 setHeaderLogo(logoUrl);
//             } catch (err) {

//             }
//         };

//         fetchHeaderLogo();
//     }, []);


//     useEffect(() => {
//         const handleResize = () => {
//             setIsMobile(window.innerWidth < 990);
//         };

//         const handleScroll = () => {
//             setIsSticky(window.scrollY > 0);
//         };

//         window.addEventListener('resize', handleResize);
//         window.addEventListener('scroll', handleScroll);

//         return () => {
//             window.removeEventListener('resize', handleResize);
//             window.removeEventListener('scroll', handleScroll);
//         };
//     }, []);

//     return (
//         <div>
//             <div className={`nav ${isSticky ? 'sticky-nav-main' : ''}`}>
//                 <motion.nav
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: -20 }}
//                     transition={{ duration: 0.3 }}
//                     className="w-full bg-white px-4 md:px-10 py-4 relative z-50 shadow"
//                 >
//                     <div className="flex items-center justify-between lg:justify-evenly">

//                         {/* Logo */}
//                         <div className="w-40 cursor-pointer">
//                             <img
//                                 src={headerLogo}
//                                 alt="Logo"
//                                 className="w-full"
//                                 onClick={() => navigate("/")}
//                             />
//                         </div>

//                         {/* Desktop Menu */}
//                         <div className="hidden md:flex space-x-8 text-[#0c263a] font-medium">
//                             <span className="hover:text-green-400 cursor-pointer font-sans text-lg">Home</span>
//                             <span className="hover:text-green-400 cursor-pointer font-sans text-lg">About</span>
//                             <span className="hover:text-green-400 cursor-pointer font-sans text-lg">How</span>
//                             <span className="hover:text-green-400 cursor-pointer font-sans text-lg">Blogs</span>
//                             <span className="hover:text-green-400 cursor-pointer font-sans text-lg">FAQs</span>
//                         </div>

//                         {/* Join Button (Desktop) */}
//                         <div className="hidden md:block">
//                             <PrimaryButton title='Join Now' />
//                         </div>

//                         {/* Mobile Menu Button */}
//                         <div className="md:hidden">
//                             <button
//                                 onClick={() => setMobileOpen(!mobileOpen)}
//                                 className="text-gray-800 text-2xl"
//                             >
//                                 {mobileOpen ? (<CloseIcon className="w-10 h-10 text-black" />) : (<MenuIcon className="w-10 h-10 text-black" />)}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Mobile Menu (Absolute) */}
//                     <AnimatePresence>
//                         {mobileOpen && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -20 }}
//                                 transition={{ duration: 0.3 }}
//                                 className="md:hidden absolute top-full left-0 w-full bg-white p-4 rounded-b-lg shadow-lg flex flex-col space-y-4 text-[#0c263a] font-medium z-50"
//                             >
//                                 <span className="hover:text-green-400 cursor-pointer">Home</span>
//                                 <span className="hover:text-green-400 cursor-pointer">About</span>
//                                 <span className="hover:text-green-400 cursor-pointer">How</span>
//                                 <span className="hover:text-green-400 cursor-pointer">Blogs</span>
//                                 <span className="hover:text-green-400 cursor-pointer">FAQs</span>

//                                 <PrimaryButton title='Join Now' />

//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </motion.nav>
//                 <div>

//                 </div>
//             </div>
//             {/* <div className={`nav ${isSticky ? 'sticky-nav-main' : ''}`}>
//                 <div className="left">
//                    <img className="nav_logo" src={headerLogo} alt="Logo" onClick={() => navigate('/')} />
//                 </div>

//                 <div className="right">
//                     {isMobile ? (
//                         <DrawerBar />
//                     ) : (
//                         <div>
                            
//                             <span
//                                 style={{ color: location.pathname === '/' ? 'blue' : '#000' }}
//                                 className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
//                                 onClick={() => navigate('/')}
//                             >
//                                 Home
//                             </span>

                            
//                             <span
//                                 style={{color: color == 1 || location.pathname === '/aboutUs' ? 'blue' : '#000' }}
//                                 className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
//                                 onClick={() => {
//                                     setColor(1);
//                                     navigate('/aboutUs');
//                                     setColor(1)
//                                 }}
//                             >
//                                 About
//                             </span>  
                                       
//                             <span
//                                 style={{ color: color == 2 ? 'blue' : '#000' }}

//                                 className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
//                                 onClick={() => {
//                                     dispatch(setScrollToSection('howWorks'))
//                                     setColor(2)
//                                 }}
//                             >
//                                 How
//                             </span>


//                             <span
//                                 style={{ color: color == 2 || location.pathname === '/blogsMultiCards' ? 'blue' : '#000' }}
//                                 className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
//                                 onClick={() => {
//                                     setColor(2)
//                                     dispatch(setScrollToSection('blogs'));
//                                     navigate('/blogsMultiCards')
//                                 }}
//                             >
//                                 Blogs
//                             </span>

//                             <span
//                                 style={{ color: location.pathname === '/contactUs' ? 'blue' : '#000' }}
//                                 className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
//                                 onClick={() => {
//                                     setColor(null)
//                                     navigate('/contactUs')
//                                 }}
//                             >
//                                 Contact
//                             </span>

//                             <span
//                                 style={{ color: color == 3 || location.pathname === '/faqMainPage' ? 'blue' : '#000' }}
//                                 className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
//                                 onClick={() => {
//                                     setColor(3)
//                                     dispatch(setScrollToSection('faqs'));
//                                     navigate('/faqMainPage')
//                                 }}
//                             >
//                                 Faqs
//                             </span>

//                             <span
//                                 style={{ color: color == 4  ? 'blue' : '#000' }}
//                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                            
//                                 onClick={() => {
//                                     setColor(4);
//                                     dispatch(setScrollToSection('login'));
//                                     if (location.pathname !== '/frontPage') {
//                                         navigate('/frontPage');
//                                     }
//                                 }}
//                             >
//                                 Login
//                             </span>
//                         </div>
//                     )}
//                 </div>
//             </div> */}
//         </div>
//     );
// };
