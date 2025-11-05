import { configureStore } from "@reduxjs/toolkit";
import formTypeReducer from './formTypeSlice';
import profileReducer from "./profileSlice";
import loginReducer from './loginSlice';
import scrollReducer from '../../component/Redux/scrollSlice'; // Add this line
import extrachargesReducer from '../Redux/extrachargesSlice';
import summaryReducer from './summarySlice2';
import tradingJournalReducer from './tradingJournalSlice';



const store = configureStore({
  reducer: {
    formType: formTypeReducer,
    profile: profileReducer,
    login: loginReducer,
    scroll: scrollReducer,
    extraCharges: extrachargesReducer,
    summary: summaryReducer,

    tradingJournal:tradingJournalReducer,

    // Add this here too
  },
});

export default store;

