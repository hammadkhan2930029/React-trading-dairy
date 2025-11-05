import * as React from 'react';
import  { useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import PaidIcon from '@mui/icons-material/Paid';
// ---------------------------------------------------
import Button from '@mui/material/Button';
// -----------------------------------------------------
import './dashboardView.css';
import avatar from '../../../images/avatar.jpg';
import india from '../../../images/india.png';
import england from '../../../images/england.png';
import flag from '../../../images/flag.png';
import { Card_1 } from './card_1/card_1';
import { Card_2 } from './card_2/card_2';
import Card_3 from './card_3/card_3';
import Card_4 from './card_4/card_4';
import { OverviewList } from './overviewDataList/overviewList';
import { fetchdividend, selectAllDividends } from "../../Redux/dividendSlice";
import { fetchTrades, selectAllTrades } from '../../Redux/stockSlice';  
import { useSelector, useDispatch } from "react-redux";
import { holding_details, close_Trades, DividenList} from '../../Redux/formTypeSlice';

import { OverviewIndex } from '../marketData/marketOverviewList/overviewIndex';
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
import { fetchTradeStats, selectTradeStats } from '../../Redux/tradingJournalSlice';
import { fetchHoldings, selectAllHoldings } from '../../Redux/holdingSlice';
import { fetchTradeCounter, selectTradeCount } from '../../Redux/tradecounterSlice';
import { fetchCloseCounter, selectCloseTradeCount } from '../../Redux/closeCounterSlice';
import { fetchWinLossStats } from '../../Redux/winLossSlice';
import { fetchTotalProfitLoss } from '../../Redux/profitLossSlice';
import { fetchTradeSummary , selectPositiveSum, selectNegativeSum } from '../../Redux/tradeSummarySlice';
import { setTotalInvestment, setBuy_sell_list } from "../../Redux/formTypeSlice";
import { fetchTransactionsReport, selectTransactionsReport } from "../../Redux/transactionSlice";





export const DashboardView = () => {

    const dispatch = useDispatch();
    const trades = useSelector(selectAllTrades); 
    const dividends = useSelector(selectAllDividends);   
    const holdings = useSelector(selectAllHoldings);
    const tradecounter = useSelector(selectTradeCount)
    const closecounter = useSelector(selectCloseTradeCount)
    const {win_count, loss_count, total_trades, win_percentage,
    loss_percentage,  loading,  error, } = useSelector((state) => state.winLoss);
    const { totalProfit, totalLoss } = useSelector( (state) => state.profitLoss );    
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const summary = useSelector((state) => state.tradeSummary.summary);
    const report = useSelector(selectTransactionsReport)
    
   

    // Calculate total net amount from dividends (Total Dividend Earnings)
    const totalDividendAmount = Array.isArray(dividends)
        ? dividends.reduce((sum, dividend) => sum + parseFloat(dividend.net_amount || 0), 0): 0;

    
      
    // -----------------------------------
    const tradeStats = useSelector(selectTradeStats);

    useEffect(() => {
        dispatch(fetchTradeStats());
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
    React.useEffect(() => {
        window.scrollTo(0, 0)
    },[])
    // -----------------------------------
     useEffect(() => {
        dispatch(fetchdividend())
        dispatch(fetchTrades())
        dispatch(fetchHoldings())
        dispatch(fetchTradeCounter())
        dispatch(fetchCloseCounter())
        dispatch(fetchWinLossStats())
        dispatch(fetchTotalProfitLoss())
        dispatch(fetchTradeSummary())
        dispatch(fetchTransactionsReport());
     }, []); 

   


    let positiveSum = 0;
    let negativeSum = 0;

        if (summary && summary.length > 0) {
        summary.forEach((trade) => {
        const pl = parseFloat(trade.pl); // make sure it's number

        if (pl > 0) {
            positiveSum += pl;
        } else if (pl < 0) {
            negativeSum += Math.abs(pl); // keep it positive
        }
        });
    }
    const totalEanrings = (positiveSum + totalDividendAmount) - negativeSum;
    const holdingcount = holdings?.length || 0;  
   

    console.log('total Trades counter',tradecounter)
    console.log("Toal close trades ",closecounter)
    console.log("win ",win_count)
    console.log("loss",loss_count)
    console.log("positive Sum ",positiveSum)
    console.log("negative Sum ",negativeSum)
    console.log("Net Investment ",report.net_investment)
  

    useEffect(() => {
        console.log('Total Trades counter has been updated:', tradecounter);
    }, [tradecounter]);

    const handleOpenTotalInvestment = () => {
        dispatch(setTotalInvestment());
    };

   
    return (
        <div className='dashboard_main'>
            {/* --------------------------top bar------------------------------------ */}
          {/*}  <div className='top_bar'>

                <div className='search_bar'>
                    <input placeholder='Search' className='input' />
                    <SearchIcon />

                </div>
              
            </div>*/}
            {/* ----------------------------small cards-------------------------------------- */}
            <div>
                <div className='main_card_view'>
                    {/* ---------------------1------------------------------------ */}
                <div className="card"  onClick={() => dispatch(setBuy_sell_list())}>
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <Filter9PlusIcon style={{ width: 50, height: 50, textAlign: 'center',color:'blue' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Total No. of Trades</span>
                            <span className='h_1'>{tradecounter}</span>
                        </div>
                    </div>
                </div>
                {/* ---------------------2------------------------------------ */}
                 <div className="card" onClick={() => dispatch(close_Trades())}>
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <Filter9PlusIcon style={{ width: 50, height: 50, textAlign: 'center',color: '#FEBE10' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Closed Trades</span>
                            <span className='h_1'>{closecounter}</span>
                        </div>
                    </div>
                 </div>
                 {/* ---------------------3------------------------------------ */}
                  <div className="card" onClick={() => dispatch(holding_details())}>
                    <div className='card_4_data'>
                        <div className='card_icon'>
                            <BusinessCenterOutlinedIcon style={{ width: 50, height: 50, textAlign: 'center',color:'blue' }} />
                        </div>
                        <div className='card_4_text' >
                            <span className="sale_text1">Holdings</span>
                            <span className="sale_text2">{holdingcount}</span>

                        </div>

                    </div>
                    </div>
                {/* ---------------------4------------------------------------ */}
                <div className="card" onClick={() => dispatch(close_Trades())}>
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <TrendingUpIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'green' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Win Trades (%)</span>
                            <span className='h_1'>  ({win_count}) {win_percentage.toFixed(2)}% </span>
                        </div>
                    </div>
                </div>
                {/* ---------------------4------------------------------------ */}
                <div className="card" onClick={() => dispatch(close_Trades())}>
                    <div className='card_1_data'>
                        <div className='card_icon'>
                            <TrendingDownIcon style={{ width: 50, height: 50, textAlign: 'center', color: 'red' }} />
                        </div>
                        <div className='price'>
                            <span className='h_6'>Lose Trades (%)</span>
                            <span className='h_1'>  ({loss_count}) {loss_percentage.toFixed(2)}%</span>
                                               
                        </div>
                    </div>
                    </div>
                    {/* -------------------one----------------------- ---------------*/}
                    <div className="card">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                               <FontAwesomeIcon icon={faMoneyBillTrendUp} style={{ width: 50, height: 50, textAlign:'center',color:'green'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Total Earnings</span>
                                <span className='h_1'>Rs.{totalEanrings.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {/* ---------------------two------------------------------------ */}
                    <div className="card"  onClick={() => dispatch(setTotalInvestment())}>
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <CurrencyExchangeIcon style={{ width: 50, height: 50, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Total Investment</span>
                                <span className='h_1'>Rs.{report.net_investment.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {/* ---------------------------three------------------------------ */}

                    <div className="card">                         
                        <div className='card_3'>
                             <div className='card_icon'>
                                <ScoreIcon style={{ width: 50, height: 50, textAlign: 'center',color:'green'}} />
                            </div>
                             <div className='card_data_3'>                            
                                <span className="sale_text1">Profit </span>
                                <span className="sale_text2">Rs.{positiveSum.toFixed(2) }</span>
                             </div>
                       </div>
                    </div>
                    {/* ----------------------------four------------------------------ */}
                      <div className="card">                         
                        <div className='card_3'>
                             <div className='card_icon'>
                                <ScoreIcon style={{ width: 50, height: 50, textAlign: 'center',color:'red'}} />
                            </div>
                             <div className='card_data_3'>                            
                                <span className="sale_text1">Loss </span>
                                <span className="sale_text2">Rs.{negativeSum.toFixed(2)}</span>
                            </div>
                       </div>
                    </div>

                    {/* ------------------------------five---------------------------- */}
                    <div className="card" onClick={() => dispatch(DividenList())}>
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <AccountBalanceWalletOutlinedIcon style={{ width: 50, height: 50, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Dividends</span>
                                <span className='h_1'>Rs.{totalDividendAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    {/* ---------------------------------six-------------------------- */}
                    {/*<div className="card">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <WorkspacePremiumIcon style={{ width: 50, height: 50, textAlign:'center',color:'#ffbf00'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Bonus</span>
                                <span className='h_1'>Rs.350.5</span>
                            </div>
                        </div>*
                    </div>*/}
                </div>
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
               {/* <div className="larg_cards_data">
                    <Card_3 />

                </div>*/}
                <div className="larg_cards_data">
                    <Card_4 />

                </div>

            </div>
        </div>
    )
}
