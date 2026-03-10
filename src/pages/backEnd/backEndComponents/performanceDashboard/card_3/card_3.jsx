import React, { useEffect, useState } from "react";
import './card_3.css';

const Card_3 = ({ data }) => {

    return (
        <div className="Larg_card_3_pd">
            <div className="L_card_3_data_pd">
                <h3>Rules Overview</h3>
                <div>
                    <div className='main_card_view_pd'>
                        <div className="card_pd">
                            <div className='card_pd_data'>
                                <div className='card_pd_text' >
                                    <span className="card_title_pd" style={{background: '#1976d2', color: 'white'}}>Total Trades</span>
                                    <span className='card_counter_pd' style={{color: '#1976d2'}}>
                                        {data?.total_closed_trades || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card_pd">
                            <div className='card_pd_data'>
                                <div className='card_pd_text' >
                                    <span className="card_title_pd" style={{background: 'green', color: 'white'}}>Full Rules</span>
                                    <span className='counter_label'>
                                        <span className='card_counter_pd' style={{color: 'green'}}>
                                            {data?.full_follow_count || 0} 
                                        </span>
                                        Trades
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card_pd">
                            <div className='card_pd_data'>
                                <div className='card_pd_text' >
                                    <span className="card_title_pd" style={{background: '#ffad00', color: 'white'}}>Partial Rules</span>
                                    <span className='counter_label'>
                                        <span className='card_counter_pd' style={{color: '#ffad00'}}>
                                            {data?.partial_follow_count || 0} 
                                        </span>
                                        Trades
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card_pd">
                            <div className='card_pd_data'>
                                <div className='card_pd_text' >
                                    <span className="card_title_pd" style={{background: 'red', color: 'white'}}>No Rules</span>
                                    <span className='counter_label'>
                                        <span className='card_counter_pd' style={{color: 'red'}}>
                                            {data?.no_follow_count || 0} 
                                        </span>
                                        Trades
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card_3;
