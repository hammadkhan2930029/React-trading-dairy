import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./card_4.css";

const Card_4 = ({ data }) => {

    const chartData = {
        total_closed_trades: data?.total_closed_trades || 0,
        full_follow_percent: data?.full_follow_percent || 0,
        partial_follow_percent: data?.partial_follow_percent || 0,
        no_follow_percent: data?.no_follow_percent || 0,
    };

    const series = [
        Number(chartData.full_follow_percent),
        Number(chartData.partial_follow_percent),
        Number(chartData.no_follow_percent),
    ];

    const options = {
        chart: { type: "donut" },
        labels: ["Full Follow", "Partial Follow", "No Follow"],
        plotOptions: {
            pie: {
                donut: {
                    size: "70%",
                    labels: {
                        show: true,
                        // total: {
                        //     show: true,
                        //     label: "Closed Trades",
                        //     formatter: () =>
                        //         data.total_closed_trades || 0,
                        // },
                    },
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val) => val.toFixed(1) + "%"
        },
        colors: ["#00E396", "#FEB019", "#FF4560"],
        legend: { position: "bottom" },
    };

    return (
        <div className="Larg_card_4_pd">
            <div className="Larg_card_4_pd_data">
                <h3>Rule Discipline Performance</h3>
                
                <Chart
                    options={options}
                    series={series}
                    type="donut"
                    height={250}
                />

            </div>
        </div>
    );
};

export default Card_4;
