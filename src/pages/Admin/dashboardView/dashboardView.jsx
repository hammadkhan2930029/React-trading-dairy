import { useEffect, useState } from "react";
import * as React from 'react';
import './dashboardView.css';
import { Card_1 } from './card_1/card_1';
import { Card_2 } from './card_2/card_2';
import Card_3 from './card_3/card_3';
import Card_4 from './card_4/card_4';
import { OverviewList } from './overviewDataList/overviewList';
import { useDispatch } from 'react-redux';
import { registeredUsers, setVerifiedusers, setUserImports } from '../Redux/userListTypeslice';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoneyBillTrendUp } from '@fortawesome/free-solid-svg-icons';
import BusinessCenterOutlinedIcon from '@mui/icons-material/BusinessCenterOutlined';
import ScoreIcon from '@mui/icons-material/Score';
import Filter9PlusIcon from '@mui/icons-material/Filter9Plus';
import { useSelector } from 'react-redux';
import { fetchUserCounts } from '../Redux/userListTypeslice';
import { useNavigate } from "react-router-dom";
import api from '../../../api/axios';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';

export const DashboardView = () => {

    //   ---------------------------------------

    const dispatch = useDispatch();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);   
    const { registered_count, verified_count } = useSelector((state) => state.userType);

    const navigate = useNavigate();
    const [pendingImports, setPendingImports] = useState(0);

    useEffect(() => {
        api.get("/userimports/admin/view-list/pending-count/")
            .then(res => {
                setPendingImports(res.data.pending || 0);
            })
            .catch(err => {
                console.error(err);
                setPendingImports(0);
            });
    }, []);

    useEffect(() => {            
        dispatch(fetchUserCounts());
    }, [dispatch]);


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    // -----------------------------------
    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);
    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = () => {
        setAnchorEl2(null);
    };
    // --------------------------------------
    const formType = useSelector((state) => state.userType.formType);
    
    React.useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    return (
        <div className='dashboard_main'>

            {/* ----------------------------small cards-------------------------------------- */}
            <div className='main_card_view'>

                {/* ---------------------1------------------------------------ */}
                <div className="card" onClick={() => dispatch(setVerifiedusers())}>
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <Filter9PlusIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'blue' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Total Registered Users</span>
                            <span className='h_1'>{registered_count}</span>
                        </div>
                    </div>
                </div>
                 
              
                {/* ---------------------2------------------------------------ */}
                <div className="card" onClick={() => dispatch(setVerifiedusers())}>
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <Filter9PlusIcon style={{ width: 50, height: 50, textAlign: 'center', color: '#FEBE10' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Verified Users</span>
                            <span className='h_1'>{verified_count}</span>
                        </div>
                    </div>
                </div>
                {/* ---------------------3------------------------------------ */}
              
                {/* ----------------------------8------------------------------ */}
                <div className="card" onClick={() => dispatch(setUserImports())}>
                    <div className='card_4_data'>
                        <div className='card_icon'>
                            <FileUploadOutlinedIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'blue' }} />
                        </div>
                        <div className='card_4_text' >
                            <span className="sale_text1">Pending Imports</span>
                            <span className="sale_text2">{pendingImports}</span>

                        </div>

                    </div>
                </div>
                {/* ---------------------2------------------------------------ */}
                {/* <div className="card">
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <TrendingUpIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'green' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Win Trades (%)</span>
                            <span className='h_1'>65%</span>
                        </div>
                    </div>
                </div> */}
                {/* ---------------------3------------------------------------ */}
                {/* <div className="card">
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <TrendingDownIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'red' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Lose Trades (%)</span>
                            <span className='h_1'>35%</span>
                        </div>
                    </div>
                </div> */}
                {/* -------------------4--------------------------------------*/}
                {/* <div className="card">
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <FontAwesomeIcon icon={faMoneyBillTrendUp} style={{ width: 50, height: 50, textAlign: 'center', color: 'green' }} />

                        </div>
                        <div className='price'>
                            <span className='h_6'>Total Earnings</span>
                            <span className='h_1'>350.5</span>
                        </div>
                    </div>
                </div> */}
                {/* ---------------------6------------------------------------ */}
                {/* <div className="card">
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <CurrencyExchangeIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'blue' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Total Investment</span>
                            <span className='h_1'>350.5</span>
                        </div>
                    </div>
                </div> */}


                {/* ---------------------------7------------------------------ */}

                {/* <div className="card">
                    <div className='card_3'>

                        <div className='card_icon'>
                            <ScoreIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'green' }} />
                        </div>

                        <div className='card_data_3'>
                            <span className="sale_text1">Profit</span>
                            <span className="sale_text2">3562.25</span>
                        </div>
                    </div>

                </div> */}
                {/* ---------------------------7------------------------------ */}

                {/* <div className="card">
                    <div className='card_3'>

                        <div className='card_icon'>
                            <ScoreIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'red' }} />
                        </div>

                        <div className='card_data_3'>
                            <span className="sale_text1">Loss</span>
                            <span className="sale_text2" >3562</span>
                        </div>
                    </div>

                </div> */}


                {/* ------------------------------9---------------------------- */}
                {/* <div className="card">
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <AccountBalanceWalletOutlinedIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'blue' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Dividends</span>
                            <span className='h_1'>350.5</span>
                        </div>
                    </div>
                </div> */}
                {/* ---------------------------------10-------------------------- */}

            </div>

            {/* ------------------------------------------Larg card----------------------------------------------- */}
            <div className="larg_cards">
                <div className="larg_cards_data">
                    <OverviewList />

                </div>
                <div className="larg_cards_data">
                    <Card_1 />
                </div>
                <div className="larg_cards_data">
                    <Card_2 />

                </div>
                <div className="larg_cards_data">
                    <Card_3 />

                </div>
                <div className="larg_cards_data">
                    <Card_4 />

                </div>

            </div>
        </div>
    )
}
