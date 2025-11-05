import React from 'react'
import logo from "../../../../images/logoicon.png"
import './card_1.css'
import Chart from "react-apexcharts";
import api from "../../../../api/axios";
import { registerUser } from '../../../backEnd/Redux/authSlice';
import { useState, useEffect } from 'react';


export const Card_1 = () => {
  const [chartData, setChartData] = useState({
      months: [],
      verifiedCounts: [],
      registeredCounts: [],
    });
    useEffect(() => {
    api.get('/accounts/monthly-user-stats/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}` // or your token key
      }
    })
    .then(res => {
      setChartData({
        months: res.data.months,
        verifiedCounts: res.data.verified_counts,
        registeredCounts: res.data.registered_counts,
      });
    })
    .catch(err => console.error(err));
  }, []);
  const lineChartOptions = {
    chart: {
      id: "line-chart",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    colors: ["#6C63FF", "#33BFFF"],
    xaxis: {
      categories: chartData.months,
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    markers: {
      size: 5,
    },
  };

  const lineChartSeries = [
    {
      name: "Registered Users",
      data: chartData.registeredCounts,
    },
    {
      name: "Verified Users",
      data: chartData.verifiedCounts,
    },
  ];

  
  return (
    <div className='L_card_1'>
      <div className='top'>
        <div className='date'>
          <input className='input' type='date' />
        </div>
        <div>
          <img className='card_1_img' src={logo} />
        </div>
      </div>
      {/* ---------------------line chart---------------------------------- */}
      <div>
        <div className='line_chart'>
          {/* Line Chart */}
          <div className='line_chart_div'>
            <h3 style={{ textAlign: "center" }}>Monthly Overview</h3>
            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={300} />
          </div>

          
        </div>
      </div>
    </div>
  )
}
