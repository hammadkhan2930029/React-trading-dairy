import React, { useState, useEffect } from 'react';
import './card_2.css'

export const Card_2_2 = ({ data }) => {

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    return (
        <div className="Larg_card_2_pd_full">
            <div className="L_card_2_data_pd_full">
                <h3>Partial Rules</h3>
                <div>
                    <div className='main_card_view_pd_full'>
                        <div className="card_pd_full">
                            <div className='card_pd_full_data'>
                                <div className='card_pd_full_text' >
                                    <span className="card_title_pd_full" style={{background: 'green', color: 'white'}}>P/L</span>
                                    <span className='counter_label_pd_full'>
                                        <span className='card_counter_pd_full'>
                                            {intlNumFormatTwoDecimal.format(data?.partial_rules_pl)}
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="card_pd_full">
                            <div className='card_pd_full_data'>
                                <div className='card_pd_full_text' >
                                    <span className="card_title_pd_full" style={{background: '#1976d2', color: 'white'}}>ROI</span>
                                    <span className='counter_label_pd_full'>
                                        <span className='card_counter_pd_full'>
                                            {intlNumFormatTwoDecimal.format(data?.partial_rules_roi)}%
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
