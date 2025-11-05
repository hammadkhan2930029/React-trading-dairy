import React, { useState,useEffect } from "react";
import "./profile.css";
import avatar from '../../../images/avatar.jpg';
// import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from "react-redux";
// import { setEditeProfile } from "../Redux/profileSlice";
import { motion, useInView } from "framer-motion";
// import { EditeProfile } from "../editeProfile/editeProfile";
// import { TotalInvestment } from "./totalInvestment/totalInvestmentForm";
// import { Withdrawal } from "./withdraw/withdrawal";
// import { JournalIndex } from "./Trading_journal/index/journal_index";
// import { TradeCard } from "./Trading_journal/view/TradeCardView";
// import { setTradingJournal_from, setTradingJournal_View } from "../Redux/tradingJournalSlice";
import { reset } from "../Redux/tradingJournalSlice";
// import { JournalForm } from "./Trading_journal/trading_journal_form/journalForm";
// import { Edit_JournalForm } from "./Trading_journal/Edit_journal_form/editJournalForm";
// import { RuleForm } from "./Rules/rules";


export const AdminProfilePage = () => {


  const journalTrade = useSelector((state) => state.tradingJournal.formType);
  const [profileComponents, setProfileComponents] = useState(1)
 useEffect(() => {
  if (journalTrade !== null) {
    setProfileComponents(journalTrade);
  }
}, [journalTrade]);
  // -------------------------------------------
  const dispatch = useDispatch()
  const refOne = React.useRef(null);
  const refTwo = React.useRef(null);

  const inViewOne = useInView(refOne);
  const inViewTwo = useInView(refTwo);
  // console.log('set profile compoennet', profileComponents)
  return (
    <div>
      <div className="profile-container">
        <motion.div className="profile_side_bar"
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
          <div className="profile_menu">
            <span className="menu_items" style={{ backgroundColor: profileComponents === 1 && '#1976d2', color: profileComponents === 1 && '#fff' }}
              onClick={() => {
                setProfileComponents(1)
                dispatch(reset())
              }}
            >Profile Details</span>
            {/* <span className="menu_items" style={{ backgroundColor: profileComponents === 2 && '#1976d2', color: profileComponents === 2 && '#fff' }}
              onClick={() => {
                setProfileComponents(2)
                dispatch(reset())
              }}>Edit Profile</span> */}
            {/* <span className="menu_items" style={{ backgroundColor: profileComponents === 3 && '#1976d2', color: profileComponents === 3 && '#fff' }}
              onClick={() => {
                setProfileComponents(3)
                dispatch(reset())
              }}>Total investemnt</span>
            <span className="menu_items" style={{ backgroundColor: profileComponents === 4 && '#1976d2', color: profileComponents === 4 && '#fff' }}
              onClick={() => {
                setProfileComponents(4)
                dispatch(reset())
              }}>Withdrawal</span>
            <span className="menu_items" style={{ backgroundColor: [5,6,7,8].includes(profileComponents) ? '#1976d2' : '', color: [5,6,7,8].includes(profileComponents) ? "#fff" :'' }}
              onClick={() => {
                setProfileComponents(5)
                dispatch(reset())
              }}>Trading Journal</span>
              <span className="menu_items" style={{ backgroundColor: profileComponents === 9 && '#1976d2', color: profileComponents === 9 && '#fff' }}
              onClick={() => {
                setProfileComponents(9)
                dispatch(reset())
              }}>Rules</span> */}
             



          </div>

        </motion.div>
        <div className="profile_Components">
          {profileComponents === 1 && (

            <motion.div
              key="profile-details"
              className="profile-details">
              <h3>Personal Information</h3>
              <ul>
                <li><strong>Email:</strong> john.doe@example.com</li>
                <li><strong>Phone:</strong> (123) 456-7890</li>
                <li><strong>Filer Or Non-filer:</strong> Yes</li>

                <li><strong>Address:</strong> San Francisco, CA</li>
              </ul>

            </motion.div>)}

          {/* {profileComponents === 2 && (<EditeProfile />)}
          {profileComponents === 3 && (<TotalInvestment />)}
          {profileComponents === 4 && (<Withdrawal />)}
          {profileComponents === 5 && (<JournalIndex />)}
          {profileComponents === 6 && (<JournalForm />)}
          {profileComponents === 7 && (<TradeCard />)}
          {profileComponents === 8 && (<Edit_JournalForm />)}
          {profileComponents === 9 && (<RuleForm />)} */}








        </div>

      </div>
    </div>

  );
};

