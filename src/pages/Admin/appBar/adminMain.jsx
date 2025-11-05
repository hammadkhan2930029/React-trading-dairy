import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { PrimarySearchAppBar } from './appBar.jsx';

import { StockName } from '../stockName/stockName.jsx';
import { DashboardView } from '../dashboardView/dashboardView.jsx';
import SettingsIcon from '@mui/icons-material/Settings';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useDispatch, useSelector } from "react-redux";
import tradingLogo3 from '../../assets/tradingLogo3.png';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import ShowChartIcon from '@mui/icons-material/ShowChart';
const drawerWidth = 240;
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditIcon from '@mui/icons-material/Edit';
import { resetProfile, setProfile } from '../Redux/profileSlice.js';
import { reset } from '../Redux/userListTypeslice.js';
import newLogo from '../../assets/newLogo.png'
import { Summary } from '../../backEnd/backEndComponents/marketData/marketSummary/summary.jsx'
import { OverView } from '../../backEnd/backEndComponents/marketData/marketOverview/overview.jsx';
import { OverviewList } from '../../backEnd/backEndComponents/dashboardView/overviewDataList/overviewList.jsx';
import { SummaryIndex } from '../../backEnd/backEndComponents/marketData/marketSummaryIndex/summaryIndex.jsx';
import { resetSummary } from '../../backEnd/Redux/summarySlice.js';
// import ProfilePage from '../../backEnd/profile/profile.jsx';
import { AdminProfilePage } from '../profile/AdminProfile.jsx';
import { RegisteredUsers } from '../RegisteredUsers/registeredUsers.jsx';
import { VerifiedUsers } from '../VerifiedUsers/verifiedUsers.jsx';
import { resetSummary2 } from '../Redux/summarySlice2.js';
import Header from '../SiteSettings/Header/Header.jsx';
import Slider from '../SiteSettings/Slider/Slider.jsx';
import Cards from '../SiteSettings/whyChooseUs/whyChooseUs.jsx';
import AddVideo from '../SiteSettings/AddVideo/AddVideo.jsx';
import HowWorks from '../SiteSettings/HowWorks/HowWorks.jsx';
import Blogs from '../SiteSettings/Blogs/Blogs.jsx';
import FAQs from '../SiteSettings/FAQs/FAQs.jsx';
import ChooseUs from '../SiteSettings/ChooseUs/ChooseUs.jsx';
import FooterSettings from '../FooterSettings/FooterSettings.jsx';
import WhyChooseUs_crud from '../SiteSettings/whyChooseUs/whyChooseUs.jsx';
//import { AdminFooter } from "./adminFooter.jsx";



export const AdminMain = (props) => {
    const dispatch = useDispatch()

    // --------------------------------------------
    const formType = useSelector((state) => state.userType.formType);
    const profileFormType = useSelector((state) => state.profile.formType);
    const extra_Charges = useSelector((state) => state.extraCharges.formType)
    const summary = useSelector((state) => state.summary.formType)
    console.log('summary', summary)



    // ------------------------------------------------------
    const [selectedIndex, setSelectedIndex] = useState(1);
    const [count, setCount] = useState(1)

    // ----------------------------------------------------------------
    const [dropdownOpen, setDropDownOpen] = useState(false);
    // -----------------------------------------------------------------
    const [dropdownOpen_three, setDropDownOpen_three] = useState(false);
    const [selectedIndex_3, setSelectedIndex_3] = useState(1);
    const [count_3, setCount_3] = useState(1)
    // ----------------------------------------------------------
    const [selectedIndex_2, setSelectedIndex_2] = useState(1);
    const [count_2, setCount_2] = useState(1)
    // --------------------------------------------------------------
    const [extraCharges, setExtraCharges] = useState(false)
    const [count_4, setCount_4] = useState()
    const [selectedIndex_4, setSelectedIndex_4] = useState();

    console.log('form type :', formType)
    // ----------------------------------------------------------------
    useEffect(() => {
        if (formType !== null) {
            setSelectedIndex(formType);
            setCount(formType);
            // ---------------------
            setCount_2(null)
            setSelectedIndex_2(null)
            setSelectedIndex_3(null)
            setCount_3(null)

        }
    }, [formType]);

    useEffect(() => {
        if (profileFormType !== null) {
            setCount(null)
            setSelectedIndex(null)
            setSelectedIndex_3(null)
            setCount_3(null)
            // -----------------------
            setSelectedIndex_2(profileFormType);
            setCount_2(profileFormType);
        }
    }, [profileFormType]);
    // --------------------------------------
    useEffect(() => {
        if (extra_Charges !== null) {
            setCount(null)
            setSelectedIndex(null)
            setCount_2(null)
            setSelectedIndex_2(null)
            setSelectedIndex_3(null)
            setCount_3(null)
            // -----------------------
            setSelectedIndex_4(extra_Charges);
            setCount_4(extra_Charges);
        }
    }, [extra_Charges]);
    // ----------------------------------------------
    useEffect(() => {
        if (summary !== null) {
            setCount(null)
            setSelectedIndex(null)
            setCount_2(null)
            setSelectedIndex_2(null)
            setSelectedIndex_4(null)
            setCount_4(null)
            // -----------------------
            setSelectedIndex_3(summary);
            setCount_3(summary);
        }
    }, [summary]);




    // -----------------------------------------------------------

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };
    // ------------------------------------------------------
    const menuItems_one = [
        { value: 1, name: 'Dashboard' },
        { value: 991, name: 'Registered Users' },

        { value: 992, name: 'Verified Users' },
        // { value: 2, name: 'Buy' },
        // { value: 3, name: 'Sell' },


    ];
    // -------------------------------------------------
    const menuItems_two = [
        { value: 5, name: 'Header' },
        { value: 6, name: 'Slider' },
        { value: 17, name: 'Choose Us Crud' },
        { value: 18, name: 'Add Video' },

        { value: 8, name: 'Choose Us' },
        { value: 9, name: 'How Works' },
        { value: 10, name: 'Blogs' },
        { value: 101, name: 'FAQs' },



    ];

    // ------------------------------------------------
    const menuItems_three = [
        { value: 11, name: 'Overview ' },
        { value: 12, name: 'Summary' },
        // { value: 13, name: 'Overview Index' },
        // { value: 14, name: 'Summary Index' },




    ];
    // ---------------------------------------------------------
    const plans = [
        { id: 7, label: 'One Time' },
        { id: 77, label: 'Monthly' },
        { id: 78, label: 'Charges List' }

    ];



    // ------------------------------------------------------

    const drawer = (
        <div style={{ backgroundColor: '#FAF9F6', color: '#000', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                <img src={newLogo} style={{ width: '100%' }} />
            </div>
            <Divider />
            {/* -------------------------------------------------------------------------------------- */}
            <List>
                {menuItems_one.map((item) => (
                    <ListItem key={item.value} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setSelectedIndex(item.value);
                                setCount(item.value);
                                setCount_3(null)
                                setSelectedIndex_3(null)
                                setSelectedIndex_2(null)
                                setCount_2(null)
                                dispatch(resetProfile())
                                dispatch(reset())
                                dispatch(resetSummary())

                                setDropDownOpen(null)
                                setDropDownOpen_three(null)
                                // ------------
                                setIsClosing(false)
                                setMobileOpen(false)
                            }}
                            sx={{
                                backgroundColor: selectedIndex === item.value ? '#1976d2' : 'transparent',
                                '&:hover': { backgroundColor: '#B9D9EB' }
                            }}
                        >
                            <ListItemIcon sx={{ color: selectedIndex === item.value ? '#fff' : '#000', }}>
                                {item.value === 991 || item.value === 992 ? <FormatListBulletedIcon /> : <MailIcon />}

                            </ListItemIcon>
                            <ListItemText primary={item.name} sx={{ color: selectedIndex === item.value ? '#fff' : '#000', }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {/* -----------------------------------section two------------------------------------------------- */}
            <List>

                <div>
                    {/* -----------------------market summery----------------------------------- */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setDropDownOpen_three(prev => !prev)
                                setDropDownOpen(false)
                            }}
                            sx={{
                                backgroundColor: dropdownOpen_three ? '#36454F' : 'transparent',
                                '&:hover': { backgroundColor: '#C0C0C0' }
                            }} >
                            <ListItemIcon sx={{ color: dropdownOpen_three ? '#fff' : '#000', }}>
                                <ShowChartIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Market Data"} sx={{ color: dropdownOpen_three ? '#fff' : '#000', }} />
                            <ListItemIcon sx={{ color: dropdownOpen_three ? '#fff' : '#000', }}>
                                {dropdownOpen_three ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </ListItemIcon>


                        </ListItemButton>


                    </ListItem>
                    {dropdownOpen_three && (
                        <List sx={{ backgroundColor: '#E5E4E2' }}>

                            {menuItems_three.map((item) => (
                                <div >
                                    <ListItem key={item.value} disablePadding>
                                        <ListItemButton onClick={() => {
                                            setCount_3(item.value)
                                            setSelectedIndex_3(item.value)
                                            setSelectedIndex_2(null)
                                            setCount_2(null)
                                            dispatch(resetProfile())
                                            dispatch(reset())
                                            dispatch(resetSummary())

                                            setCount(null)
                                            setSelectedIndex(null)
                                            setCount_4()
                                            setSelectedIndex_4()
                                            // ------------
                                            setIsClosing(false)
                                            setMobileOpen(false)

                                        }}
                                            sx={{
                                                backgroundColor: selectedIndex_3 === item.value ? '#1976d2' : 'transparent',
                                                '&:hover': { backgroundColor: '#B9D9EB' }
                                            }} >
                                            <ListItemIcon sx={{ color: selectedIndex_3 === item.value ? '#fff' : '#000', }}>

                                                {(item.value === 13) || (item.value === 14) ? <FormatListBulletedIcon /> : <MailIcon />}
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} sx={{ color: selectedIndex_3 === item.value ? '#fff' : '#000', }} />


                                        </ListItemButton>


                                    </ListItem>
                                </div>

                            ))}
                        </List>
                    )}
                    {/* --------------------------------------setting----------------------------------------------- */}
                    <ListItem disablePadding>
                        <ListItemButton
                            onClick={() => {
                                setDropDownOpen(prev => !prev)
                                setDropDownOpen_three(false)

                            }}
                            sx={{
                                backgroundColor: dropdownOpen ? '#36454F' : 'transparent',
                                '&:hover': { backgroundColor: '#C0C0C0' }
                            }}>
                            <ListItemIcon sx={{ color: dropdownOpen ? '#fff' : '#000', }}>
                                <SettingsIcon />
                            </ListItemIcon>
                            <ListItemText primary={"Site Settings"} sx={{ color: dropdownOpen ? '#fff' : '#000', }} />
                            <ListItemIcon sx={{ color: dropdownOpen ? '#fff' : '#000', }}>
                                {dropdownOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </ListItemIcon>


                        </ListItemButton>


                    </ListItem>
                    {dropdownOpen && (
                        <List sx={{ backgroundColor: '#E5E4E2' }}>

                            {/* --------------------------------menuitems tow------------------------------ */}

                            {menuItems_two.map((item) => (
                                <div>
                                    <ListItem key={item.value} disablePadding>
                                        <ListItemButton onClick={() => {
                                            setSelectedIndex_2(item.value)
                                            setCount_2(item.value)
                                            setSelectedIndex_4(null)
                                            dispatch(resetProfile())
                                            dispatch(reset())
                                            dispatch(resetSummary2())

                                            setCount(null)
                                            setSelectedIndex(null)
                                            setCount_4()
                                            setCount_3(null)
                                            setSelectedIndex_3(null)
                                            // ------------
                                            setIsClosing(false)
                                            setMobileOpen(false)
                                            setExtraCharges(false)
                                        }}
                                            sx={{
                                                backgroundColor: selectedIndex_2 === item.value ? '#1976d2' : 'transparent',
                                                '&:hover': { backgroundColor: '#B9D9EB' }
                                            }} >
                                            <ListItemIcon sx={{ color: selectedIndex_2 === item.value ? '#fff' : '#000', }}>
                                                <EditIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} sx={{ color: selectedIndex_2 === item.value ? '#fff' : '#000', }} />


                                        </ListItemButton>



                                    </ListItem>

                                </div>

                            ))}

                        </List>
                    )}



                    {/* ------------------------------Developer page------------------------------------- */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => {
                            setSelectedIndex_2(1010)
                            setCount_2(1010)
                            setCount(null)
                            dispatch(resetProfile())
                            dispatch(reset())
                            dispatch(resetSummary())

                            setSelectedIndex(null)
                            setCount_3(null)
                            setSelectedIndex_3(null)
                            setMobileOpen(false);
                        }}
                            sx={{
                                backgroundColor: selectedIndex_2 === 1010 ? '#1976d2' : 'transparent',
                                '&:hover': { backgroundColor: '#B9D9EB' }
                            }} >
                            <ListItemIcon sx={{ color: selectedIndex_2 === 1010 ? '#fff' : '#000', }}>
                                <SettingsIcon />
                            </ListItemIcon >
                            <ListItemText primary={"Footer Setting"} sx={{ color: selectedIndex_2 === 1010 ? '#fff' : '#000', }} />



                        </ListItemButton>


                    </ListItem>
                    {/* ------------------------------------------------------------------------------------ */}
                    {/* <ListItem disablePadding>
                        <ListItemButton onClick={() => {
                            setSelectedIndex_2(222)
                            setCount_2(222)
                            setCount(null)
                            dispatch(resetProfile())
                            dispatch(reset())
                            dispatch(resetSummary())

                            setSelectedIndex(null)
                            setCount_3(null)
                            setSelectedIndex_3(null)
                            setMobileOpen(false);
                        }}
                            sx={{
                                backgroundColor: selectedIndex_2 === 222 ? '#1976d2' : 'transparent',
                                '&:hover': { backgroundColor: '#B9D9EB' }
                            }} >
                            <ListItemIcon sx={{ color: selectedIndex_2 === 222 ? '#fff' : '#000', }}>
                                <ContactPageIcon />
                            </ListItemIcon >
                            <ListItemText primary={"My Rules Book"} sx={{ color: selectedIndex_2 === 222 ? '#fff' : '#000', }} />



                        </ListItemButton>


                    </ListItem> */}
                </div>


            </List>


        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;
    // --------------------------------------------------



    const renderForm = () => {






        if (count !== null && count !== undefined) {
            switch (count) {
                case 1: return <DashboardView />;
                // case 2: return <BuyForm />;
                // case 3: return <SellForm />;
                case 992: return <VerifiedUsers />;
                case 991: return <RegisteredUsers />
                // case 111: return <ClosedTrades />

                default: return null;
            }
        }

        if (count_2 !== null && count_2 !== undefined) {
            switch (count_2) {
                case 5: return <Header />;
                case 6: return <Slider />;
                case 17: return <WhyChooseUs_crud />;
                case 18: return <AddVideo />;
                case 888: return <AdminProfilePage />;
                case 9: return <HowWorks />;
                case 10: return <Blogs />;
                case 101: return <FAQs />;
                case 8: return <ChooseUs />;
                case 1010: return <FooterSettings />;




                default: return null;
            }
        }

        if (count_3 !== null && count_3 !== undefined) {
            switch (count_3) {

                case 11: return <OverView />;
                case 12: return <Summary />;
                case 13: return <OverviewList />;
                case 14: return <SummaryIndex />;




                default: return null;
            }
        }
        // if (count_4 !== null && count_4 !== undefined) {
        //     switch (count_4) {

        //         case 7: return <OneTime />;
        //         case 77: return <Monthly />;
        //         // case 78: return <ExtraChargesList />

        //         default: return null;
        //     }
        // }


        return null;
    };





    return (
        <Box sx={{ display: 'flex', backgroundColor: '#FAF9F6', width: '100%', overflow: 'hidden' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar style={{ width: '100%' }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <PrimarySearchAppBar />
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}

            >
                {renderForm()}
            
            

            



            </Box>
        </Box>
    );
}

AdminMain.propTypes = {

    window: PropTypes.func,
};

