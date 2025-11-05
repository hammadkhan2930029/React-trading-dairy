import React, { useState, useEffect } from 'react';
import Chart from "react-apexcharts";
import './card_4.css';
import { fetchHoldings } from '../../../Redux/holdingSlice';
import { useSelector, useDispatch } from 'react-redux';

const Card_4 = () => {
    const dispatch = useDispatch();
    const { items: holdingsRawData, loading, error } = useSelector((state) => state.holdings);
    
    // --- Define Placeholder Values ---
    const NO_DATA_OPTIONS_OVERRIDE = {
        labels: ["No Holdings"],
        colors: ["#e0e0e0"], // light grey placeholder color
        tooltip: {
            // Disable tooltip when showing 'No Data'
            enabled: false 
        },
        legend: {
            show: false // Hide legend for the placeholder
        }
    };
    const NO_DATA_SERIES = [100]; // 100% to fill the circle

    // --- Base Chart Options State ---
    const [pieChartOptions, setPieChartOptions] = useState({
        chart: {
            type: "pie",
        },
        labels: [],
        colors: ["#6C63FF", "#33BFFF", "#FFC300", "#FF5733", "#C70039", "#900C3F", "#581845", "#DAF7A6", "#6C63FF", "#33BFFF", "#FF6384", "#FFA500", "#00C49F"],
        legend: {
            position: "bottom",
            // Keep the original formatter, it will only be used if pieChartSeries has data
            formatter: function(val, opts) {
                const percentage = opts.w.globals.series[opts.seriesIndex];
                return val + ": " + percentage.toFixed(1) + '%';
            },
            itemMargin: {
                horizontal: 8, 
                vertical: 2, 
            }
        },
        dataLabels: {
            enabled: false, 
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return val.toFixed(1) + '%';
                }
            }
        }
    });

    const [pieChartSeries, setPieChartSeries] = useState([]);
    const [totalPortfolioValue, setTotalPortfolioValue] = useState(0); 

    useEffect(() => {
        dispatch(fetchHoldings());
    }, [dispatch]);

    useEffect(() => {
        if (holdingsRawData && holdingsRawData.length > 0) {
            const labels = holdingsRawData.map(holding => holding.stock?.symbol).filter(label => label);
            const seriesRawValues = holdingsRawData.map(holding => {
                const quantity = holding.holding_quantity;
                return (typeof quantity === 'number' && !isNaN(quantity)) ? quantity : 0;
            });

            const calculatedTotal = seriesRawValues.reduce((sum, val) => sum + val, 0);
            
            // Only update chart data if there's a positive total value
            if (calculatedTotal > 0) {
                const seriesPercentages = seriesRawValues.map(value => (value / calculatedTotal) * 100);

                setTotalPortfolioValue(calculatedTotal); 
                setPieChartOptions(prevOptions => ({
                    ...prevOptions,
                    labels: labels,
                    // Ensure the original legend and tooltip settings are restored
                    legend: { ...prevOptions.legend, show: true }, 
                    tooltip: { ...prevOptions.tooltip, enabled: true }
                }));
                setPieChartSeries(seriesPercentages);
            } else {
                 // If data is present but total quantity is zero, treat as 'No Data'
                setPieChartSeries([]);
            }

        } else if (loading === 'succeeded' && !error) {
            // Data fetch succeeded but returned 0 holdings
            setPieChartSeries([]);
        }
    }, [holdingsRawData, loading, error]);

    // --- Final Chart Rendering Logic ---

    // Determine if we need to show the 'No Data' placeholder
    const showNoData = pieChartSeries.length === 0;

    // Set the final options and series based on the 'showNoData' flag
    const finalChartOptions = showNoData 
        ? { ...pieChartOptions, ...NO_DATA_OPTIONS_OVERRIDE }
        : pieChartOptions;

    const finalChartSeries = showNoData 
        ? NO_DATA_SERIES 
        : pieChartSeries;


    if (loading === 'pending') {
        return <div className="L_card_4">Loading holdings data...</div>;
    }

    if (loading === 'failed' || error) {
        return <div className="L_card_4">Error: {error?.message || "Failed to fetch holdings data."}</div>;
    }
    
    return (
        <div className="Larg_card_4">
            <div className="Lard_card_4_data">
                <h4>Your Holdings Distribution</h4>
                <Chart
                    options={finalChartOptions}
                    series={finalChartSeries}
                    type="pie"
                    height={250}
                />
                
                {/* Optional: You can hide this legend section if the chart is showing 'No Data' */}
                {!showNoData && (
                    <div style={{ display: "flex", justifyContent: "space-evenly", flexWrap: "wrap", marginTop: "10px" }}>
                        {/* The code for your manual legend goes here, if needed */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Card_4;