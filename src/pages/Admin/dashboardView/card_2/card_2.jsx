import React from 'react'
import './card_2.css'
import Chart from "react-apexcharts";

export const Card_2 = () => {
  // Bar Chart Data
    const barChartOptions = {
      chart: {
        id: "bar-chart",
        stacked: true,
      },
      colors: ["#6C63FF", "#33BFFF"],
      xaxis: {
        categories: ["17", "18", "19", "20", "21", "22"],
      },
      fill: {
        opacity: 1,
      },
    };
  
    const barChartSeries = [
      {
        name: "Product A",
        data: [200, 300, 400, 500, 600, 700],
      },
      {
        name: "Product B",
        data: [100, 150, 200, 250, 300, 400],
      },
    ];
  return (
    <div className='L_card_2'>
       <div className='bar_chart'>
                
       
                 {/* Bar Chart  */}
                  <div className='chart_bar_div'>
                   <h3 style={{ textAlign: "center" }}>Weekly Revenue</h3>
                   <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
                 </div>
               </div>
    </div>
  )
}
