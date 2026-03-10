import React from 'react';
import './overviewList.css';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const marketData = [
    { label: "Market Status", value: "Open" },
    { label: "Current Index", value: "10.25" },
    { label: "Change", value: "123.123" },
    { label: "Percent Change", value: "124%" },
    { label: "High", value: "12,1234" },
    { label: "Low", value: "123,214" },
    { label: "Volume", value: "25" },
    { label: "Previous Close", value: "2554,3255" },
    { label: "Value", value: "542,653" }
];

export const OverviewList = () => {
    return (
        <div className='summary_main'>
            <div className='heading_div'>
                <ShowChartIcon fontSize='large' className='chartIcon'/>
                <span className='summary_heading_dashboard'>Market Activity</span>
            </div>
            <div className="market-info">
                {marketData.map((item, index) => (
                    <div key={index} className="market-row">
                        <span className="label">{item.label}</span>
                        <span className="value">{item.value}</span>
                    </div>
                ))}
            </div>

        </div>
    )
}
