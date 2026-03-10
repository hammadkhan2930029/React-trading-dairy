import * as React from 'react';
import  { useEffect, useState} from 'react';
import './dashboardView.css';
import { Card_1 } from './card_1/card_1';
import { Card_2 } from './card_2/card_2';
import Card_3 from './card_3/card_3';
import Card_4 from './card_4/card_4';
import { OverviewList } from './overviewDataList/overviewList';
import { fetchdividend, selectAllDividends } from "../../Redux/dividendSlice";
import { fetchbonus, selectAllbonuss } from "../../Redux/bonusSlice";
import { fetchTrades, selectAllTrades } from '../../Redux/stockSlice';  
import { useSelector, useDispatch } from "react-redux";
import { holding_details, close_Trades, DividenList} from '../../Redux/formTypeSlice';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SouthWestIcon from '@mui/icons-material/SouthWest'; // Deposit
import NorthEastIcon from '@mui/icons-material/NorthEast'; // Withdrawal
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
import { fetchExtraCharges ,selectExtraCharges } from "../../Redux/extrachargesSlice";
import { fetchrightShare, selectAllrightShares } from "../../Redux/rightShareSlice";
import { Link } from 'react-router-dom';
import api from "../../../../api/axios";  
import PercentIcon from '@mui/icons-material/Percent';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { fetchsplit, selectAllsplits } from "../../Redux/splitSlice";
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';

export const DashboardView = () => {

    const dispatch = useDispatch();
    const trades = useSelector(selectAllTrades); 
    const dividends = useSelector(selectAllDividends);   
    const bonuses = useSelector(selectAllbonuss);   
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
    const [dayTradeYes, setDayTradeYes] = useState(0);
    const [dayTradeNo, setDayTradeNo] = useState(0);
    const extraCharges = useSelector(selectExtraCharges);
    const rightShareData = useSelector(selectAllrightShares);
    const splitData = useSelector(selectAllsplits);

    // calculate extra charges
    const totalExtraCharges = extraCharges.reduce(
        (sum, c) => sum + Number(c.charges || 0),
        0
    );

    // Calculate total net amount from dividends (Total Dividend Earnings)
    const totalDividendAmount = Array.isArray(dividends)
        ? dividends.reduce((sum, dividend) => sum + parseFloat(dividend.net_amount || 0), 0): 0; 
        
    // Calculate total net amount from dividends (Total Dividend Earnings)
    const totalBonusAmount = Array.isArray(bonuses)
        ? bonuses.reduce((sum, bonus) => sum + parseFloat(bonus.net_shares || 0), 0): 0; 
      
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
        dispatch(fetchExtraCharges())
        dispatch(fetchrightShare())
        dispatch(fetchsplit())
        dispatch(fetchdividend())
        dispatch(fetchbonus())
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

    let rightSharesSellSum = 0;
    if (rightShareData && rightShareData.length > 0) {
        rightShareData.forEach((rs_data) => {
            const total_amount = parseFloat(rs_data.total_amount); // make sure it's number

            if (rs_data.rs_status == 'Sell') {
                rightSharesSellSum += total_amount;
            }
        });
    }

    let rightSharesBuySharesSum = 0;
    if (rightShareData && rightShareData.length > 0) {
        rightShareData.forEach((rs_data) => {
            const right_shares = parseFloat(rs_data.right_shares); // make sure it's number

            if (rs_data.rs_status == 'Buy') {
                rightSharesBuySharesSum += right_shares;
            }
        });
    }

    const splitSharesSum = splitData?.reduce((total, item) => total + Number(item.net_shares || 0), 0);

    const totalEanring = (positiveSum + totalDividendAmount) - negativeSum;
    const totalEanrings = (totalEanring - totalExtraCharges) + rightSharesSellSum;
    const holdingcount = holdings?.length || 0;    
    const net_unrealized = holdings?.reduce((total, item) => total + Number(item.unrealized_pl || 0), 0) || 0;
    const net_total_inv = holdings?.reduce((total, item) => total + Number(item.total_investment || 0), 0) || 0;
    const realized_pl = summary?.reduce((total, item) => total + Number(item.pl || 0), 0);
    const totalInv = summary?.reduce((total, item) => total + Number(item.total_investment || 0), 0);

    const totalPL = net_unrealized + realized_pl;
    const totalInvestment = net_total_inv + totalInv;

    const overall_roi = totalInvestment > 0 ? (totalPL / totalInvestment) * 100 : 0;

    const net_worth = net_total_inv + net_unrealized;
  
    useEffect(() => {
        
    }, [tradecounter]);
    
    useEffect(() => {
        const fetchCounters = async () => {
            try {
                const res = await api.get("/holdings/daytrade-close-counter/");
                
                const daytradeyes = res.data.day_trade_yes|| 0; 
                const daytradeno = res.data.day_trade_no|| 0; 

                setDayTradeYes(daytradeyes); 
                setDayTradeNo(daytradeno);
            } catch (err) {
                
            }
        };

        fetchCounters();
    }, []);

    const handleOpenTotalInvestment = () => {
        dispatch(setTotalInvestment());
    };

    const intlNumFormatNoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    });

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
   
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
                    
                    {/* -------------------account roi */}
                    <Link className="card">
                        <div className='card_4_data'>
                            <div className='card_icon'>
                                <PercentIcon style={{ width: 40, height: 40, textAlign: 'center',color:'blue' }} />
                            </div>
                            <div className='card_4_text' >
                                <span className="sale_text1">Account ROI</span>
                                <span className='sale_text2'>
                                    {intlNumFormatNoDecimal.format(overall_roi)}%
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* -------------------realized pl */}
                    <Link className="card" to="/closed-trades">
                        <div className='card_4_data'>
                            <div className='card_icon'>
                                <ScoreIcon style={{ width: 40, height: 40, textAlign: 'center',color:'green' }} />
                            </div>
                            <div className='card_4_text' >
                                <span className="sale_text1">Realized P/L</span>
                                <span className='sale_text2'>
                                    {intlNumFormatNoDecimal.format(realized_pl)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* -------------------net unrealized pl */}
                    <Link className="card" to="/holdings" onClick={() => dispatch(holding_details())}>
                        <div className='card_4_data'>
                            <div className='card_icon'>
                                <CurrencyExchangeIcon style={{ width: 40, height: 40, textAlign: 'center',color:'orange' }} />
                            </div>
                            <div className='card_4_text' >
                                <span className="sale_text1">Net Unrealized P/L</span>
                                <span className='sale_text2'>
                                    {intlNumFormatNoDecimal.format(net_unrealized)}
                                </span>
                            </div>
                        </div>
                    </Link>         
                    {/* ---------------------two------------------------------------ */}
                    <Link className="card" to="/account-balance">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <CurrencyExchangeIcon style={{ width: 40, height: 40, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Account Balance</span>
                                <span className="h_1">
                                    Rs.{intlNumFormatTwoDecimal.format(report.net_investment)}
                                </span>
                            </div>
                        </div>
                    </Link>   
                    {/* ---------------------1------------------------------------ */}
                    <Link className="card" to="/buy-sell/list">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <Filter9PlusIcon style={{ width: 40, height: 40, textAlign: 'center',color:'blue' }} />
                            </div>
                            <div className='price'>
                                <span className='h_6'>Total No. of Trades</span>
                                <span className='h_1'>
                                    {intlNumFormatNoDecimal.format(tradecounter)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------2------------------------------------ */}
                    <Link className="card" to="/closed-trades/dashboard">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <Filter9PlusIcon style={{ width: 40, height: 40, textAlign: 'center',color: 'green' }} />
                            </div>
                            <div className='price'>
                                <span className='h_6'>Closed Trades</span>
                                <span className='h_1'>
                                    {intlNumFormatNoDecimal.format(closecounter)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------2------------------------------------ */}
                    <Link className="card" to="/closed-trades">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <Filter9PlusIcon style={{ width: 40, height: 40, textAlign: 'center',color: 'green' }} />
                            </div>
                            <div className='price'>
                                <span className='h_6'>Closed Day Trades</span>
                                <span className='h_1'>
                                    {intlNumFormatNoDecimal.format(dayTradeYes)}
                                </span>
                            </div>
                        </div>
                    </Link>    
                    {/* ---------------------3------------------------------------ */}
                    <Link className="card" to="/holdings" onClick={() => dispatch(holding_details())}>
                        <div className='card_4_data'>
                            <div className='card_icon'>
                                <BusinessCenterOutlinedIcon style={{ width: 40, height: 40, textAlign: 'center',color:'blue' }} />
                            </div>
                            <div className='card_4_text' >
                                <span className="sale_text1">Holdings</span>
                                <span className='sale_text2'>
                                    {intlNumFormatNoDecimal.format(holdingcount)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------4------------------------------------ */}
                    <div className="card" >
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <TrendingUpIcon style={{ width: 40, height: 40, textAlign: 'center', color: 'green' }} />
                            </div>
                            <div className='price'>
                                <span className='h_6'>Win Trades (%)</span>
                                <span className='h_1'>  ({win_count}) {win_percentage.toFixed(2)}% </span>
                            </div>
                        </div>
                    </div>
                    {/* ---------------------4------------------------------------ */}
                    <div className="card">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <TrendingDownIcon style={{ width: 40, height: 40, textAlign: 'center', color: 'red' }} />
                            </div>
                            <div className='price'>
                                <span className='h_6'>Lose Trades (%)</span>
                                <span className='h_1'>  ({loss_count}) {loss_percentage.toFixed(2)}%</span>
                                                
                            </div>
                        </div>
                    </div>
                    {/* -------------------net unrealized pl */}
                    <Link className="card" to="/holdings">
                        <div className='card_4_data'>
                            <div className='card_icon'>
                                <SouthWestIcon style={{ width: 40, height: 40, textAlign: 'center',color:'blue' }} />
                            </div>
                            <div className='card_4_text' >
                                <span className="sale_text1">Invested Amount</span>
                                <span className='sale_text2'>
                                    {intlNumFormatNoDecimal.format(net_total_inv)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* -------------------one----------------------- ---------------*/}
                    <div className="card">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                               <FontAwesomeIcon icon={faMoneyBillTrendUp} style={{ width: 40, height: 40, textAlign:'center',color:'green'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Net Earning</span>
                                <span className="h_1">
                                    Rs.{intlNumFormatTwoDecimal.format(totalEanrings)}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* ------------------------------five---------------------------- */}
                    <Link className="card" to="/dividend/list" onClick={() => dispatch(DividenList())}>
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <AccountBalanceWalletOutlinedIcon style={{ width: 40, height: 40, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Dividends</span> 
                                <span className="h_1">
                                    Rs.{intlNumFormatTwoDecimal.format(totalDividendAmount)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------------------six-------------------------- */}
                    <Link className="card" to="/bonus/list">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <WorkspacePremiumIcon style={{ width: 40, height: 40, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Bonus Shares</span>
                                <span className='h_1'>{totalBonusAmount}</span>
                            </div>
                        </div>
                    </Link>
                    {/* ------------------------------five---------------------------- */}
                    <Link className="card" to="/split/list">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <CallSplitIcon style={{ width: 40, height: 40, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Split Shares</span> 
                                <span className="h_1">
                                    {splitSharesSum}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------------------six-------------------------- */}
                    <Link className="card" to="/right-shares/list">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <SwapHorizIcon style={{ width: 40, height: 40, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Right Shares</span>
                                <span className='h_1'>{rightSharesBuySharesSum}</span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------two------------------------------------ */}
                    <Link className="card" to="/deposit">
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <SouthWestIcon style={{ width: 40, height: 40, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Deposit</span>
                                <span className="h_1">
                                    Rs.{intlNumFormatTwoDecimal.format(report.total_deposit)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------two------------------------------------ */}
                    <Link className="card" to="/withdrawal" >
                        <div className='card_1_data'>
                            <div className='card_icon'>
                                <NorthEastIcon style={{ width: 40, height: 40, textAlign:'center',color:'blue'}}/>
                            </div>
                            <div className='price'>
                                <span className='h_6'>Withdrawal</span>
                                <span className="h_1">
                                    Rs.{intlNumFormatTwoDecimal.format(report.total_withdrawn)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    {/* ---------------------------three------------------------------ */}
                    <div className="card">                         
                        <div className='card_3'>
                             <div className='card_icon'>
                                <ScoreIcon style={{ width: 40, height: 40, textAlign: 'center',color:'green'}} />
                            </div>
                             <div className='card_data_3'>                            
                                <span className="sale_text1">Profit </span>
                                <span className="sale_text2">
                                    Rs.{intlNumFormatTwoDecimal.format(positiveSum)}
                                </span>
                             </div>
                       </div>
                    </div>
                    {/* ----------------------------four------------------------------ */}
                    <div className="card">                         
                        <div className='card_3'>
                             <div className='card_icon'>
                                <ScoreIcon style={{ width: 40, height: 40, textAlign: 'center',color:'red'}} />
                            </div>
                             <div className='card_data_3'>                            
                                <span className="sale_text1">Loss </span>
                                <span className="sale_text2">
                                    Rs.{intlNumFormatTwoDecimal.format(negativeSum)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <Link className="card" to="/extra-charges/list">                         
                        <div className='card_3'>
                             <div className='card_icon'>
                                <AttachMoneyOutlinedIcon style={{ width: 40, height: 40, textAlign: 'center',color:'blue'}} />
                            </div>
                             <div className='card_data_3'>                            
                                <span className="sale_text1">Extra Charges </span>
                                <span className="sale_text2">
                                    Rs.{intlNumFormatTwoDecimal.format(totalExtraCharges)}
                                </span>
                            </div>
                        </div>
                    </Link>
                    <div className="card">                         
                        <div className='card_3'>
                             <div className='card_icon'>
                                <ScoreIcon style={{ width: 40, height: 40, textAlign: 'center',color:'green'}} />
                            </div>
                             <div className='card_data_3'>                            
                                <span className="sale_text1">Net Worth </span>
                                <span className="sale_text2">
                                    Rs.{intlNumFormatTwoDecimal.format(net_worth)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ------------------------------------------Larg card----------------------------------------------- */}
            <div className="larg_cards">
                {/* <div className="larg_cards_data">
                    <OverviewList />
                </div> */}
                <div className="larg_cards_data">
                    <Card_4 />
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
            </div>
        </div>
    )
}
