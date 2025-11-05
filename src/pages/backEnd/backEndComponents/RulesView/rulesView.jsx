import React, { useState, useEffect } from 'react';
import './rulesView.css';
import { fetchRules} from '../../Redux/rulesSlice';   
import { useDispatch, useSelector } from 'react-redux'; 

export const RulesView = () => {
  const dispatch = useDispatch();
  const rulesData = useSelector((state) => state.rules.rules);
  
  useEffect(() => {
          dispatch(fetchRules());
  }, [dispatch]);

  return (
    <div className='rulesView_container'>

    <div className="rules-list-container">
      <h2 className="rules-list-heading">📜 My Rules Book</h2>
      <div className="rules_grid">
        {rulesData.map((item, index) => (
          <div key={item.id} className="rule_card">
            <div className="rule_number">

            <span >Rule #{index + 1}</span>
            </div>
            <p className="rule_text">{item.rule_text}</p>
          </div>
        ))}
      </div>
    </div>
    </div>

  );
};
