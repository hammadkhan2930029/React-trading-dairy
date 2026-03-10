import React, { useState, useEffect } from 'react';
import './card_2.css'
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyPLClosedTrade } from '../../../Redux/tradeSummarySlice'; 

export const Card_2 = () => {

    const dispatch = useDispatch();
    const monthlyPLClosedTrade = useSelector((state) => state.tradeSummary.monthlyPLClosedTrade);
    
    useEffect(() => {
        dispatch(fetchMonthlyPLClosedTrade());
    }, [dispatch]);

    const numberFormatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const categories = monthlyPLClosedTrade.map(item =>
        new Date(item.month).toLocaleString("default", { month: "short", year: "numeric" })
    );

    const profitData = monthlyPLClosedTrade.map(item => item.total_profit || 0);
    const lossData = monthlyPLClosedTrade.map(item => Math.abs(item.total_loss) || 0); // show losses as positive values in chart
    
    // Bar Chart Data
    const barChartOptions = {
        chart: {
            id: "bar-chart",
            stacked: true,
        },
        xaxis: {
            categories: categories,
        },
        yaxis: {
            labels: {
                formatter: (value) => numberFormatter.format(value)
            }
        },
        tooltip: {
            y: {
                formatter: (value) => `Rs.${numberFormatter.format(value)}`
            }
        },
        dataLabels: {
            enabled: true // usually cleaner for stacked bars
        },
        fill: {
            opacity: 1,
        },
    };


    const barChartSeries = [
        {
            name: "Profit",
            data: profitData,
        },
        {
            name: "Loss",
            data: lossData,
        },
            
    ];

    return (
        <div className='Larg_card_2_ct'>
            <div className='bar_chart'>
                {/* Bar Chart  */}
                <div className='chart_bar_div'>
                    <h3 style={{ textAlign: "center" }}>Monthly P/L</h3>
                    <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
                </div>
            </div>
        </div>
    )
}
