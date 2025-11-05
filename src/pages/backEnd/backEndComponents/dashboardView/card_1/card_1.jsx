import React, { useState, useEffect } from 'react';
import logo from "../../../../images/logoicon.png";
import './card_1.css';
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMonthlyROI } from '../../../Redux/tradeSummarySlice';

export const Card_1 = () => {
  const dispatch = useDispatch();
  const monthlyROI = useSelector((state) => state.tradeSummary.monthlyROI || []);

  console.log("Monthly ROI", monthlyROI);

  useEffect(() => {
    dispatch(fetchMonthlyROI());
  }, [dispatch]);

  const months = monthlyROI.map(item => item.month);
  const roiValues = monthlyROI.map(item => parseFloat(item.monthly_roi));

  const lineChartOptions = {
    chart: {
      id: "line-chart",
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    colors: ["#6C63FF", "#33BFFF"],
    xaxis: { categories: months },
    yaxis: {
      labels: {
        formatter: (value) => `${value}%`,
      },
    },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 5 },
  };

  const lineChartSeries = [{ name: "ROI", data: roiValues }];

  return (
    <div className='Larg_card_1'>
      <div className='top'>
        <div className='date'>
          <input className='input' type='date' />
        </div>
        <div>
          <img className='card_1_img' src={logo} />
        </div>
      </div>

      <div className='line_chart'>
        <div className='line_chart_div'>
          <h3 style={{ textAlign: "center" }}>Monthly ROI</h3>
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height={300}
          />
        </div>
      </div>
    </div>
  );
};
