import React, { useState, useEffect, useRef, Children } from "react";
import "./profile.css";
import avatar from '../../../images/avatar.jpg';
import { useDispatch, useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import { EditeProfile } from "./editeProfile/editeProfile";
import { reset } from "../../Redux/tradingJournalSlice";
import { setEditeProfile, fetchProfile, selectProfileData } from "../../Redux/profileSlice";
import { RuleForm } from "./Rules/rules";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

export const ProfilePage = () => {

    const [state, setState] = useState({
        top: false,
    });

    const journalTrade = useSelector((state) => state.tradingJournal.formType);
    const [profileComponents, setProfileComponents] = useState(1)
    useEffect(() => {
        if (journalTrade !== null) {
            setProfileComponents(journalTrade);
        }
    }, [journalTrade]);
    // -------------------------------------------
    const dispatch = useDispatch()
    
    const profileData = useSelector(selectProfileData);
    const profileStatus = useSelector((state) => state.profile.status);
    const profileError = useSelector((state) => state.profile.error);

    useEffect(() => {
        if (profileStatus === 'idle' || (profileStatus === 'succeeded' && !profileData)) {
            dispatch(fetchProfile())
            .unwrap()
            .catch(error => {
            
            });
        }
    }, [dispatch, profileStatus, profileData]); // Added profileData to dependencies

    // FIX: Added a more robust check for loading state including when profileData is null
    if (profileStatus === 'loading' || !profileData) {
        return (
            <div className="profile-container flex justify-center items-center h-screen text-lg">
                Loading profile data...
            </div>
        );
    }

    if (profileStatus === 'failed') {
        return (
            <div className="profile-container flex justify-center items-center h-screen text-lg text-red-600">
                Error loading profile: {JSON.stringify(profileError)}
            </div>
        );
    }

    // Now, profileData is guaranteed not to be null here
    const userEmail = profileData?.email || 'N/A';
    const userName = profileData?.name || 'User Name'; // Access 'name' directly from profileData
    const userNumber = profileData?.number || 'N/A';
    const profileType = profileData?.type || 'N/A';

    // ================================================================

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (

        <Box
            sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250,padding:1 }}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <motion.div className="profile-card">
                <img
                    src={avatar}
                    alt="User Avatar"
                    className="profile-img"
                />
                <h2 className="profile-name">John Doe</h2>
                <p className="profile-role">Full Stack Developer</p>
                <p className="profile-location">San Francisco, CA</p>
            </motion.div>

            <div className="profile_menu" >
                <span className="menu_items" style={{ backgroundColor: profileComponents === 1 && '#1976d2', color: profileComponents === 1 && '#fff' }}
                    onClick={() => {
                        setProfileComponents(1)
                        dispatch(reset())
                    }}
                >
                    Profile Details
                </span>
                <span className="menu_items" style={{ backgroundColor: profileComponents === 2 && '#1976d2', color: profileComponents === 2 && '#fff' }}
                    onClick={() => {
                        setProfileComponents(2)
                        dispatch(reset())
                    }}
                >
                    Edit Profile
                </span>
                <span className="menu_items" style={{ backgroundColor: profileComponents === 9 && '#1976d2', color: profileComponents === 9 && '#fff' }}
                    onClick={() => {
                        setProfileComponents(9)
                        dispatch(reset())
                    }}
                >
                    Rules
                </span>
            </div>
        
        </Box>
    );
    // ==============================================================================

    return (
        <div className="profile-container">
            <div className="drawer_top">
                {['top'].map((anchor) => (
                    <React.Fragment key={anchor}>
                        <Button onClick={toggleDrawer(anchor, true)} >
                            <AccountBoxIcon sx={{ fontSize: 40 }}/>
                            <span className="menuBtn">Menu</span>
                        </Button>
                        <Drawer
                            anchor={anchor}
                            open={state[anchor]}
                            onClose={toggleDrawer(anchor, false)}
                        >
                            {list(anchor)}
                        </Drawer>
                    </React.Fragment>
                ))}
            </div>

            <motion.div className="profile_side_bar">
                <motion.div className="profile-card" >
                    <img
                        src={avatar}
                        alt="User Avatar"
                        className="profile-img"
                    />
                    <h2 className="profile-name">John Doe</h2>
                    <p className="profile-role">Full Stack Developer</p>
                    <p className="profile-location">San Francisco, CA</p>
                </motion.div>
                <div className="profile_menu" >
                    <span className="menu_items" style={{ backgroundColor: profileComponents === 1 && '#1976d2', color: profileComponents === 1 && '#fff' }}
                        onClick={() => {
                            setProfileComponents(1)
                            dispatch(reset())
                        }}
                    >
                        Profile Details
                    </span>
                    <span className="menu_items" style={{ backgroundColor: profileComponents === 2 && '#1976d2', color: profileComponents === 2 && '#fff' }}
                        onClick={() => {
                            setProfileComponents(2)
                            dispatch(reset())
                        }}
                    >
                        Edit Profile
                    </span>
                    {/* <span className="menu_items" style={{ backgroundColor: profileComponents === 9 && '#1976d2', color: profileComponents === 9 && '#fff' }}
                        onClick={() => {
                            setProfileComponents(9)
                            dispatch(reset())
                        }}
                    >
                        Rules
                    </span> */}
                </div>
            </motion.div>

            <div className="profile_Components" >
                {profileComponents === 1 && (
                    <motion.div key="profile-details" className="profile-details">
                        <h3>Personal Information</h3>
                        <ul>
                            <li><strong>Email:</strong> john.doe@example.com</li>
                            <li><strong>Phone:</strong> (123) 456-7890</li>
                            <li><strong>Filer Or Non-filer:</strong> Yes</li>
                            <li><strong>Address:</strong> San Francisco, CA</li>
                        </ul>
                    </motion.div>
                )}

                {profileComponents === 2 && (
                    <EditeProfile />
                )}

                {/* {profileComponents === 9 && (
                    <RuleForm />
                )} */}

            </div>

        </div>

    );
};