import React, { useEffect, useState } from 'react';
import './nav.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { DrawerBar } from '../drawer/drawer';
import newAsset23 from '../../assets/newAsset23.png';
import { useDispatch } from 'react-redux';
import { setScrollToSection } from '../Redux/scrollSlice';

export const Nav = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 990);
    const [isSticky, setIsSticky] = useState(false);
    const [color,setColor]=useState(null)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 990);
        };

        const handleScroll = () => {
            setIsSticky(window.scrollY > 0);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

   return (
        <div>
            <div className={`nav ${isSticky ? 'sticky-nav-main' : ''}`}>
                <div className="left">
                    <img className="nav_logo" src={newAsset23} alt="Logo"  onClick={() => navigate('/frontPage')}/>
                </div>

                <div className="right">
                    {isMobile ? (
                        <DrawerBar />
                    ) : (
                        <div>
                            
                            <span
                                style={{ color: location.pathname === '/frontPage' ? 'blue' : '#000' }}
                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                                onClick={() => navigate('/frontPage')}
                            >
                                Home
                            </span>

                           <span
                                style={{ color: color == 1 ? 'blue' : '#000' }}

                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                                onClick={() => {
                                    // dispatch(setScrollToSection('chooseUs'))
                                    dispatch(setScrollToSection('aboutUs'))
                                    navigate('/aboutUs')
                                    setColor(1)
                                }}
                            >
                                About
                            </span>

                            <span
                                style={{ color: color == 2 ? 'blue' : '#000' }}
                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                                onClick={() => {
                                    dispatch(setScrollToSection('chooseUs'))   
                                    setColor(2)
                                }}
                            >
                                How
                            </span>

                            <span
                                style={{ color: color == 2 || location.pathname === '/blogsMultiCards' ? 'blue' : '#000' }}
                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                                onClick={() => {
                                    setColor(2)
                                    dispatch(setScrollToSection('blogs'));
                                    navigate('/blogsMultiCards')
                                }}
                            >
                                Blogs
                            </span>

                            <span
                                style={{ color: location.pathname === '/contactUs' ? 'blue' : '#000' }}
                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                                onClick={() => {
                                    setColor(null)
                                    navigate('/contactUs')
                                }}
                            >
                                Contact
                            </span>

                            <span
                                style={{ color: color == 3 || location.pathname === '/faqMainPage' ? 'blue' : '#000' }}
                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                                onClick={() => {
                                    setColor(3)
                                    dispatch(setScrollToSection('faqs'));
                                    navigate('/faqMainPage')
                                }}
                            >
                                Faqs
                            </span>

                          <span
                                style={{ color: color == 5 ? 'blue' : '#000' }}
                                className={`nav_main ${isSticky ? 'nav_changeColor' : ''}`}
                                onClick={() => {

                                    dispatch(setScrollToSection('login'));
                                    setColor(5)

                                }}
                            >
                                Login
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
