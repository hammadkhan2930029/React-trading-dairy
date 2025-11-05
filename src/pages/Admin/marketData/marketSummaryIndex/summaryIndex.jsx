
import React, { useState } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './summaryIndex.css'; // Update this file name too
import { motion, useInView } from "framer-motion";
import { setMarketSummaryDetails } from '../../Redux/summarySlice';

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
import { useDispatch } from 'react-redux';

const marketSummaryData = [
  {
    scrip: "Cogent dev software solution",
    ldcp: "100.50",
    open: "98.00",
    high: "102.00",
    low: "97.50",
    current: "100.00",
    change: "+2.00",
    volume: "15000",
    date: "2025-03-22"
  },
  {
    scrip: "XYZ",
    ldcp: "200.75",
    open: "195.50",
    high: "205.00",
    low: "194.00",
    current: "198.25",
    change: "-2.50",
    volume: "25000",
    date: "2025-03-21"
  },
  {
    scrip: "LMN",
    ldcp: "300.30",
    open: "290.00",
    high: "310.00",
    low: "285.00",
    current: "295.50",
    change: "+5.50",
    volume: "18000",
    date: "2025-03-20"
  },
  {
    scrip: "Cogent dev software solution",
    ldcp: "100.50",
    open: "98.00",
    high: "102.00",
    low: "97.50",
    current: "100.00",
    change: "+2.00",
    volume: "15000",
    date: "2025-03-22"
  },
  {
    scrip: "XYZ",
    ldcp: "200.75",
    open: "195.50",
    high: "205.00",
    low: "194.00",
    current: "198.25",
    change: "-2.50",
    volume: "25000",
    date: "2025-03-21"
  },
  {
    scrip: "LMN",
    ldcp: "300.30",
    open: "290.00",
    high: "310.00",
    low: "285.00",
    current: "295.50",
    change: "+5.50",
    volume: "18000",
    date: "2025-03-20"
  },
  {
    scrip: "Cogent dev software solution",
    ldcp: "100.50",
    open: "98.00",
    high: "102.00",
    low: "97.50",
    current: "100.00",
    change: "+2.00",
    volume: "15000",
    date: "2025-03-22"
  },
  {
    scrip: "XYZ",
    ldcp: "200.75",
    open: "195.50",
    high: "205.00",
    low: "194.00",
    current: "198.25",
    change: "-2.50",
    volume: "25000",
    date: "2025-03-21"
  },
  {
    scrip: "Cogent dev software solution Cogent dev software solution",
    ldcp: "300.30",
    open: "290.00",
    high: "310.00",
    low: "285.00",
    current: "295.50",
    change: "+5.50",
    volume: "18000",
    date: "2025-03-20"
  }
];

export const SummaryIndex = () => {
  const [select, setSelect] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [searchScript, setSearchScript] = useState('');
  const [page, setpage] = useState(0);
  const [rowPerPage, setRowperPage] = useState(5);
  const refOne = React.useRef(null);
  const inViewOne = useInView(refOne, { triggerOnce: true });
  const dispatch = useDispatch();
  const handleChange = (event) => setSelect(event.target.value);
  const handleChangePage = (event, newPage) => setpage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowperPage(parseInt(event.target.value, 10));
    setpage(0);
  };

  return (
    <motion.div
      className='summary_container'
      ref={refOne}
      initial={{ opacity: 0, y: -100 }}
      animate={inViewOne ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      <div className='summary_header'>
        <ShowChartIcon className='summary_icon' />
        <h2 className='summary_title'>Market Summary Index</h2>
      </div>

      <div className="summary_filters">
        <FormControl fullWidth className="filter_field">
          <InputLabel>Select Field</InputLabel>
          <Select value={select} label="Select Field" onChange={handleChange}>
            {['Date', 'Script'].map((item, i) => (
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

        {select === 'Script' && (
          <>
            <TextField
              label="Script"
              type="text"
              className="filter_field"
              placeholder='Search...'
              value={searchScript}
              onChange={(e) => setSearchScript(e.target.value)}
            />

          </>
        )}







        <Button variant="contained" color="primary" className='search_btn'>
          Search
          <SearchIcon />
        </Button>
      </div>

      <div className="summary_table_wrapper">
        <table className='summary_table'>
          <thead>
            <tr>
              <th>Date</th>
              <th>SCRIP</th>
              <th>LDCP</th>
              <th>LOW</th>
              <th>HIGH</th>
              <th>CURRENT</th>
              <th>CHANGE</th>
              <th>VOLUME</th>
              <th>Action</th>
            </tr>
          </thead>
       
          <tbody>
            {marketSummaryData.slice(page * rowPerPage, (page + 1) * rowPerPage).map((item, i) => (
              <tr key={i}>
                <td>{item.date}</td>
                <td>{item.scrip}</td>
                <td>{item.ldcp}</td>
                <td>{item.low}</td>
                <td>{item.high}</td>
                <td>{item.current}</td>
                <td>{item.change}</td>
                <td>{item.volume}</td>
                <td>
                  <button onClick={() => dispatch(setMarketSummaryDetails())} className='moreBtn'>More</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <TablePagination
          component="div"
          count={marketSummaryData.length}
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

