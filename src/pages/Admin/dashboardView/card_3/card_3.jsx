import React from "react";
import Chart from "react-apexcharts";
import './card_3.css'

const Card_3 = () => {
  
  const barChartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        columnWidth: "40%",
        borderRadius: 5,
        distributed: false,
      },
    },
    colors: ["#6C63FF"],
    xaxis: {
      categories: ["00", "04", "08", "12", "14", "16", "18"],
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        gradientToColors: ["#A3A1FF"],
        stops: [0, 100],
      },
    },
  };

  const barChartSeries = [
    {
      name: "Visitors",
      data: [300, 200, 500, 400, 450, 350, 250],
    },
  ];

 

  return (
    <div className="L_card_3">
     
      <div className="L_card_3_data">
        <h4>Daily Traffic</h4>
        <p>
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>2,579</span>{" "}
          Visitors
        </p>
        <p style={{ color: "green", fontWeight: "bold" }}>+2.45%</p>
        <Chart
          options={barChartOptions}
          series={barChartSeries}
          type="bar"
          height={200}
        />
      </div>

     
    </div>
  );
};

export default Card_3;
