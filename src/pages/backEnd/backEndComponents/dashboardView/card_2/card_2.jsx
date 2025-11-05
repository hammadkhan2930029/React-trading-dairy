import React, { useState, useEffect } from 'react';
import './card_2.css'
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyPL } from '../../../Redux/tradeSummarySlice'; 

export const Card_2 = () => {

    const dispatch = useDispatch();
    const monthlyPL = useSelector((state) => state.tradeSummary.monthlyPL);
    
    
    useEffect(() => {
      dispatch(fetchMonthlyPL());
    }, [dispatch]);

   const categories = monthlyPL.map(item =>
    new Date(item.month).toLocaleString("default", { month: "short", year: "numeric" })
  );

  const profitData = monthlyPL.map(item => item.total_profit || 0);
  const lossData = monthlyPL.map(item => Math.abs(item.total_loss) || 0); // show losses as positive values in chart

  
  
   console.log("Monthly P/L",monthlyPL); 
  // Bar Chart Data
    const barChartOptions = {
      chart: {
        id: "bar-chart",
        stacked: true,
      },
      //colors: ["#6C63FF", "#33BFFF"],
      xaxis: {
        categories: categories,
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
    <div className='Larg_card_2'>
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
