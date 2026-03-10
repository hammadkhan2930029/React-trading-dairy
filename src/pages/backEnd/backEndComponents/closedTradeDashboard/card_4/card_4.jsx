import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { fetchROIClosedTrade } from "../../../Redux/tradeSummarySlice";
import "./card_4.css";

const COLORS = [
    "#6C63FF", "#33BFFF", "#FFC300", "#FF5733", "#C70039",
    "#900C3F", "#581845", "#DAF7A6", "#00C49F", "#FF6384",
    "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
    "#8BC34A", "#E91E63", "#3F51B5", "#009688", "#CDDC39"
];

const Card_4 = () => {
    const dispatch = useDispatch();
    const { roiClosedTrade, loading, error } = useSelector((state) => state.tradeSummary);

    const NO_DATA_OPTIONS = {
        labels: ["No Closed Trades"],
        colors: ["#e0e0e0"],
        tooltip: { enabled: false },
        legend: { show: false },
    };
    const NO_DATA_SERIES = [100];

    const [pieChartOptions, setPieChartOptions] = useState({
        chart: { type: "pie" },
        labels: [],
        colors: COLORS,
        legend: {
            position: "bottom",
            formatter: function (val, opts) {
                const roi = roiClosedTrade[opts.seriesIndex]?.total_roi ?? 0;
                return `${val}: ${roi.toFixed(2)}%`;
            },
            itemMargin: { horizontal: 8, vertical: 2 },
        },
        dataLabels: { enabled: false },
        tooltip: {
            y: {
                formatter: function (val, opts) {
                const roi = roiClosedTrade[opts.seriesIndex]?.total_roi ?? 0;
                return roi.toFixed(2) + "%";
                },
            },
        },
    });

    const [pieChartSeries, setPieChartSeries] = useState([]);

    useEffect(() => {
        dispatch(fetchROIClosedTrade());
    }, [dispatch]);

    useEffect(() => {
        if (!roiClosedTrade || roiClosedTrade.length === 0) {
            setPieChartSeries([]);
            setPieChartOptions(prev => ({ ...prev, labels: [] }));
            return;
        }

        const seriesValues = roiClosedTrade.map(item => Math.abs(item.total_roi));
        const total = seriesValues.reduce((sum, val) => sum + val, 0);

        if (total > 0) {
            const percentages = seriesValues.map(val => (val / total) * 100);

            setPieChartSeries(percentages);
            setPieChartOptions(prev => ({
                ...prev,
                labels: roiClosedTrade.map(item => item.symbol),
            }));
        } else {
            setPieChartSeries([]);
        }
    }, [roiClosedTrade]);

    const showNoData = pieChartSeries.length === 0;
    const finalChartOptions = showNoData ? { ...pieChartOptions, ...NO_DATA_OPTIONS } : pieChartOptions;
    const finalChartSeries = showNoData ? NO_DATA_SERIES : pieChartSeries;

    if (loading) return <div className="L_card_4">Loading closed trades ROI...</div>;
    if (error) return <div className="L_card_4">Failed to load data</div>;

    return (
        <div className="Larg_card_4_ct">
            <div className="Larg_card_4_ct_data">
                <h4>Closed Trades ROI</h4>
                <Chart options={finalChartOptions} series={finalChartSeries} type="pie" height={300} />

            </div>
        </div>
    );
};

export default Card_4;
