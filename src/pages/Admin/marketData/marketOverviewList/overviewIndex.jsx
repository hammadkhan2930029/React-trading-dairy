
import React, { useState } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './overviewIndex.css';
import { motion, useInView } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Grid,
  TablePagination,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const marketIndex = [
    {
        marketStatus: 'Open',
        currentIndex: '10.25',
        change: '123.123',
        percentChange: '124%',
        high: '12,1234',
        low: '123,214',
        volume: '25',
        previousClose: '2554,3255',
        value: '542,653',
        date: '2025-03-22'
    },
    {
        marketStatus: 'Closed',
        currentIndex: '9.75',
        change: '-50.75',
        percentChange: '-5%',
        high: '11,000',
        low: '9,500',
        volume: '30',
        previousClose: '10,000',
        value: '600,000',
        date: '2025-03-21'
    },
    {
        marketStatus: 'Open',
        currentIndex: '10.25',
        change: '123.123',
        percentChange: '124%',
        high: '12,1234',
        low: '123,214',
        volume: '25',
        previousClose: '2554,3255',
        value: '542,653',
        date: '2025-03-22'
    },
    {
        marketStatus: 'Closed',
        currentIndex: '9.75',
        change: '-50.75',
        percentChange: '-5%',
        high: '11,000',
        low: '9,500',
        volume: '30',
        previousClose: '10,000',
        value: '600,000',
        date: '2025-03-21'
    },
    {
        marketStatus: 'Open',
        currentIndex: '10.25',
        change: '123.123',
        percentChange: '124%',
        high: '12,1234',
        low: '123,214',
        volume: '25',
        previousClose: '2554,3255',
        value: '542,653',
        date: '2025-03-22'
    },
    {
        marketStatus: 'Closed',
        currentIndex: '9.75',
        change: '-50.75',
        percentChange: '-5%',
        high: '11,000',
        low: '9,500',
        volume: '30',
        previousClose: '10,000',
        value: '600,000',
        date: '2025-03-21'
    },
    {
        marketStatus: 'Open',
        currentIndex: '10.25',
        change: '123.123',
        percentChange: '124%',
        high: '12,1234',
        low: '123,214',
        volume: '25',
        previousClose: '2554,3255',
        value: '542,653',
        date: '2025-03-22'
    },
    {
        marketStatus: 'Closed',
        currentIndex: '9.75',
        change: '-50.75',
        percentChange: '-5%',
        high: '11,000',
        low: '9,500',
        volume: '30',
        previousClose: '10,000',
        value: '600,000',
        date: '2025-03-21'
    },
];

export const OverviewIndex = () => {
  const [select, setSelect] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [lowAndHigh, setLowAndHigh] = useState({ from: '', to: '' });
  const [currentIndex, setCurrentIndex] = useState({ from: '', to: '' });
  const [change, setChange] = useState({ from: '', to: '' });
  const [percentChange, setPercentChange] = useState({ from: '', to: '' });
  const [page, setpage] = useState(0);
  const [rowPerPage, setRowperPage] = useState(5);
  const refOne = React.useRef(null);
  const inViewOne = useInView(refOne, { triggerOnce: true });

  const handleChange = (event) => setSelect(event.target.value);
  const handleChangePage = (event, newPage) => setpage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowperPage(parseInt(event.target.value, 10));
    setpage(0);
  };

  return (
    <motion.div
      className='overview_container'
      ref={refOne}
      initial={{ opacity: 0, y: -100 }}
      animate={inViewOne ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className='overview_header'>
        <ShowChartIcon className='overview_icon' />
        <h2 className='overview_title'>Market Overview Index</h2>
      </div>

      <div className="overview_filters">
        <FormControl fullWidth className="filter_field">
          <InputLabel>Select Field</InputLabel>
          <Select value={select} label="Select Field" onChange={handleChange}>
            {['Date', 'Current Index', 'Change', 'Percent Change', 'Low / High'].map((item, i) => (
              <MenuItem key={i} value={item}>{item}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {select === 'Date' && (
          <>
            <TextField
              type="date"
              label="From Date"
              InputLabelProps={{ shrink: true }}
              className="filter_field"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            />
            <TextField
              type="date"
              label="To Date"
              InputLabelProps={{ shrink: true }}
              className="filter_field"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            />
          </>
        )}

        {select === 'Current Index' && (
          <>
            <TextField
              label="From Index"
              type="number"
              className="filter_field"
              value={currentIndex.from}
              onChange={(e) => setCurrentIndex({ ...currentIndex, from: e.target.value })}
            />
            <TextField
              label="To Index"
              type="number"
              className="filter_field"
              value={currentIndex.to}
              onChange={(e) => setCurrentIndex({ ...currentIndex, to: e.target.value })}
            />
          </>
        )}

        {select === 'Change' && (
          <>
            <TextField
              label="From Change"
              type="number"
              className="filter_field"
              value={change.from}
              onChange={(e) => setChange({ ...change, from: e.target.value })}
            />
            <TextField
              label="To Change"
              type="number"
              className="filter_field"
              value={change.to}
              onChange={(e) => setChange({ ...change, to: e.target.value })}
            />
          </>
        )}

        {select === 'Percent Change' && (
          <>
            <TextField
              label="From % Change"
              type="number"
              className="filter_field"
              value={percentChange.from}
              onChange={(e) => setPercentChange({ ...percentChange, from: e.target.value })}
            />
            <TextField
              label="To % Change"
              type="number"
              className="filter_field"
              value={percentChange.to}
              onChange={(e) => setPercentChange({ ...percentChange, to: e.target.value })}
            />
          </>
        )}

        {select === 'Low / High' && (
          <>
            <TextField
              label="Low"
              type="text"
              className="filter_field"
              value={lowAndHigh.from}
              onChange={(e) => setLowAndHigh({ ...lowAndHigh, from: e.target.value })}
            />
            <TextField
              label="High"
              type="text"
              className="filter_field"
              value={lowAndHigh.to}
              onChange={(e) => setLowAndHigh({ ...lowAndHigh, to: e.target.value })}
            />
          </>
        )}

        <Button variant="contained" color="primary" className='search_btn'>
            Search
          <SearchIcon />
        </Button>
      </div>

      <div className="overview_table_wrapper">
        <table className='overview_table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
              <th>Current</th>
              <th>Change</th>
              <th>% Change</th>
              <th>Low</th>
              <th>High</th>
              <th>Volume</th>
              <th>Prev Close</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {marketIndex.slice(page * rowPerPage, (page + 1) * rowPerPage).map((item, i) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.marketStatus}</td>
                <td>{item.currentIndex}</td>
                <td>{item.change}</td>
                <td>{item.percentChange}</td>
                <td>{item.low}</td>
                <td>{item.high}</td>
                <td>{item.volume}</td>
                <td>{item.previousClose}</td>
                <td>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <TablePagination
          component="div"
          count={marketIndex.length}
          page={page}
          rowsPerPage={rowPerPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </motion.div>
  );
};
