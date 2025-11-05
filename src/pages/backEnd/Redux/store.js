import { configureStore } from "@reduxjs/toolkit";
import formTypeReducer from './formTypeSlice';
import profileReducer from "./profileSlice";
import loginReducer from './loginSlice';
import authReducer from './authSlice'
import stockReducer from './stockSlice'
import brokerReducer from './brokerSlice'
import scrollReducer from '../../component/Redux/scrollSlice'; 
import extrachargesReducer from '../Redux/extrachargesSlice'
import dividendReducer  from './dividendSlice'; 
import transactionReducer from './transactionSlice'
import  holdingReducer from './holdingSlice';
import summaryReducer from './summarySlice';
import overviewReducer from './overviewSlice';
import tradingJournalReducer from './tradingJournalSlice';
import  ruleReducer from './rulesSlice';
import tradecounterReducer from './tradecounterSlice';
import closeCounterReducer from './closeCounterSlice';
import winLossReducer from './winLossSlice';
import userHoldingReducer from './userHoldingSlice';
import profitLossReducer  from './profitLossSlice';
import  tradeSummaryReducer  from "./tradeSummarySlice";
import userBrokerReducer from "./userBrokerSlice";

//-----------------------------------

import userTypeReducer from '../../Admin/Redux/userListTypeslice'
import summary2Reducer from '../../Admin/Redux/summarySlice2';




const store = configureStore({
  reducer: {
    formType: formTypeReducer,
    profile: profileReducer,
    login: loginReducer,
    auth: authReducer,
    stocks: stockReducer,
    brokers: brokerReducer,
    trades: stockReducer,
    scroll: scrollReducer,
    extraCharges : extrachargesReducer,
    dividend: dividendReducer, 
    transactions: transactionReducer,
    holdings: holdingReducer,
    summary: summaryReducer,
    overview: overviewReducer,
    tradingJournal: tradingJournalReducer,
    rules: ruleReducer,
    tradecounter: tradecounterReducer,
    closeCounter: closeCounterReducer,
    winLoss: winLossReducer,
    userHolding: userHoldingReducer,
    profitLoss: profitLossReducer,  
    tradeSummary: tradeSummaryReducer, 
    userBrokers: userBrokerReducer,

    summary2: summary2Reducer,
    userType:userTypeReducer,
  },
});

export default store;