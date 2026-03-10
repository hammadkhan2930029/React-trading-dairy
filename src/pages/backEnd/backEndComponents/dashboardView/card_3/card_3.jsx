import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import './card_3.css'
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyRealizedPL } from '../../../Redux/tradeSummarySlice'; 

const Card_3 = () => {

    const dispatch = useDispatch();
    const monthlyRealizedPL = useSelector((state) => state.tradeSummary.monthlyRealizedPL) || [];
    
    useEffect(() => {
        dispatch(fetchMonthlyRealizedPL());
    }, [dispatch]);

    const numberFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const categories = monthlyRealizedPL.map(item => item.month);
    const values = monthlyRealizedPL.map(item => Number(item.realized_pl));
  
    const barChartOptions = {
        chart: {
            type: "bar",
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                columnWidth: "40%",
                borderRadius: 5,
            },
        },
        colors: ["#6C63FF"],
        xaxis: {
            categories: categories, 
        },
        tooltip: {
            y: {
                formatter: (val) => numberFormatter.format(val),
            },
        },
    };

    const barChartSeries = [
        {
            name: "Realized P/L",
            data: values, 
        },
    ];

    return (
        <div className="Larg_card_3">
            <div className="L_card_3_data">
                <h4 style={{ textAlign: "center" }}>Monthly Realized P/L</h4>
                <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
            </div>
        </div>
    );
};

export default Card_3;
