import React, { useEffect } from "react";
import './overviewList.css';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { selectAllOverview, fetchCurrentDayOverview, fetchLatestOverview } from "../../../Redux/overviewSlice";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Alert, Box, Typography } from '@mui/material';


export const OverviewList = () => {
  const dispatch = useDispatch();
  const overviewData = useSelector(selectAllOverview);
  const loading = useSelector(state => state.overview.loading);
  const error = useSelector(state => state.overview.error);
  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchCurrentDayOverview());
      if (result.payload === null) {
        dispatch(fetchLatestOverview());
      }
    };
    fetchData();
  }, [dispatch]);

  // Helper function to render a single market info row
  const renderMarketInfoRow = (label, value) => {
    if (value === null || value === undefined || value === '') {
      return null; // Don't render if value is null, undefined, or empty string
    }

    let formattedValue = value;
    // Attempt to parse and format numeric values, handling potential non-numeric strings
    if (typeof value === 'string') {
      if (label === "Percent Change") {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          formattedValue = `${numValue.toFixed(2)}%`;
        }
      } else if (label === "Volume" || label === "Value") {
        const numValue = parseInt(value.replace(/,/g, ''), 10); // Remove commas for parsing
        if (!isNaN(numValue)) {
          formattedValue = numValue.toLocaleString();
        }
      } else if (label !== "Market Status") { // All other numeric fields
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          formattedValue = numValue.toFixed(2);
        }
      }
    } else if (typeof value === 'number') {
      if (label === "Percent Change") {
        formattedValue = `${value.toFixed(2)}%`;
      } else if (label === "Volume" || label === "Value") {
        formattedValue = value.toLocaleString();
      } else {
        formattedValue = value.toFixed(2);
      }
    }


    // Determine color for Change and Percent Change
    let valueColorClass = '';
    if (label === "Change" || label === "Percent Change") {
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        if (numValue > 0) {
          valueColorClass = 'text-green-600'; // Tailwind green
        } else if (numValue < 0) {
          valueColorClass = 'text-red-600'; // Tailwind red
        }
      }
    }


    return (
      <div className="market-row" key={label}> {/* Using label as key, assuming unique labels */}
        <span className="label font-medium text-gray-700">{label}:</span>
        <span className={`value font-semibold ${valueColorClass}`}>{formattedValue}</span>
      </div>
    );
  };

  // Define the order of fields for display
  const orderedFields = [
    { label: "Market Status", key: "market_status" },
    { label: "Current Index", key: "current_index" },
    { label: "Change", key: "index_change" },
    { label: "Percent Change", key: "index_percent_change" },
    { label: "High", key: "index_high" },
    { label: "Low", key: "index_low" },
    { label: "Volume", key: "volume" },
    { label: "Previous Close", key: "previous_close" },
    { label: "Value", key: "value" }
  ];

  // Get the single overview item (assuming only one per day)
  const currentOverview = overviewData.length > 0 ? overviewData[0] : null;

  return (
    <div className="summary_main">
      <div className="heading_div">
        <ShowChartIcon className="chartIcon" />
        <span className="summary_heading_dashboard">Market Activity</span>
      </div>

      {loading === "pending" && (
        <div className="loading_box">
          <div className="spinner"></div>
          <p className="loading_text">Loading Market Overview...</p>
        </div>
      )}

      {loading === "failed" && error && (
        <div className="error_box">
          <p>Error fetching market overview:</p>
          <p className="error_text">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        </div>
      )}

      {loading === "succeeded" && !currentOverview && (
        <div className="no_data_box">
          <p>No market overview data available for today.</p>
        </div>
      )}

      {loading === "succeeded" && currentOverview && (
        <div className="market_info">
          {orderedFields.map((field) =>
            renderMarketInfoRow(field.label, currentOverview[field.key])
          )}
        </div>
      )}
    </div>


  );
};
