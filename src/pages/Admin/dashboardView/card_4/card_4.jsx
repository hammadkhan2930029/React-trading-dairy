import React from "react";
import Chart from "react-apexcharts";
import './card_4.css'

const Card_4 = () => {
  

  // Pie Chart
  const pieChartOptions = {
    chart: {
      type: "pie",
    },
    labels: ["Your Files", "System"],
    colors: ["#6C63FF", "#33BFFF"],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
    },
  };

  const pieChartSeries = [65, 35];

 

  return (
    <div className="L_card_4">
      

      {/* Pie Chart */}
      <div className="L_card_4_data">
        <h4>Your Pie Chart</h4>
        <Chart
          options={pieChartOptions}
          series={pieChartSeries}
          type="pie"
          height={250}
        />
        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
          <p>
            <span style={{ color: "#6C63FF", fontWeight: "bold" }}>●</span> Your
            Files: 65%
          </p>
          <p>
            <span style={{ color: "#33BFFF", fontWeight: "bold" }}>●</span>{" "}
            System: 35%
          </p>
        </div>
      </div>
    </div>
  );
};

export default Card_4;
