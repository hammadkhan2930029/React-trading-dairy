import React, { useEffect, useState, useRef } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './summaryIndex.css';
import { motion, useInView } from "framer-motion";
import { setMarketSummaryDetails } from '../../../Redux/summarySlice';
import { useNavigate } from "react-router-dom"
import {
  Button,
  TextField,
  TablePagination,
  InputLabel,
  MenuItem,
  FormControl,
  Select
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { fetchSummary, selectAllsummary, setSelectedSummary } from '../../../Redux/summarySlice';
import withSkeleton from "../../../../component/Skeletons/withSkeleton.jsx";

// ======================================================================
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#1976d2",
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 16,

  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd) td, &:nth-of-type(odd) th': {
    backgroundColor: '#F1F5F9',
  },
  // last border remove etc
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

// ======================================================================

export const SummaryIndex = () => {
  const [select, setSelect] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [searchScript, setSearchScript] = useState('');
  const [page, setpage] = useState(0);
  const [rowPerPage, setRowperPage] = useState(25); // Keep 25 as default
  const refOne = React.useRef(null);
  const inViewOne = useInView(refOne, { triggerOnce: true });
  const dispatch = useDispatch();
  const summaryData = useSelector(selectAllsummary);
  const loading = useSelector(state => state.summary.loading);
  const error = useSelector(state => state.summary.error);
  const navigate = useNavigate();
  const location = useLocation();
  const [displayedData, setDisplayedData] = useState({});

  // Enhanced relevance scoring function
  const calculateRelevanceScore = (scrip, searchTerm) => {
    let score = 0;
    const scripLower = scrip.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    // Exact match gets highest score
    if (scripLower === searchTermLower) {
      score += 100;
    }

    // Starts with search term
    if (scripLower.startsWith(searchTermLower)) {
      score += 50;
    }

    // Contains all search words (for multi-word searches)
    const searchWords = searchTermLower.split(' ').filter(word => word.length > 0);

    if (searchWords.length > 1 && searchWords.every(word => scripLower.includes(word))) {
      score += 40;
    }

    // Word boundary matches (matches complete words)
    searchWords.forEach(word => {
      if (word.length < 2) return;

      const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
      if (wordRegex.test(scrip)) {
        score += 25;
      }
    });

    // Contains search term as substring
    if (scripLower.includes(searchTermLower)) {
      score += 15;
    }

    // Contains individual search words
    searchWords.forEach(word => {
      if (scripLower.includes(word)) {
        score += 10;
      }
    });

    // Position bonus - matches earlier in the string are better
    const positionIndex = scripLower.indexOf(searchTermLower);
    if (positionIndex !== -1) {
      score += Math.max(0, 10 - positionIndex);
    }

    // Length bonus - shorter names are usually more relevant
    score += Math.max(0, 20 - scripLower.length / 2);

    return score;
  };

  // Enhanced filtering with relevance scoring
  const applyFiltersAndGroupData = () => {
    let filteredSummary = summaryData.filter(item => {
      // Your existing zero-value filter
      const hasData = !(item.open === 0 && item.high === 0 && item.low === 0 &&
        item.current === 0 && item.change === 0 && item.volume === 0);
      if (!hasData) return false;

      // Date filter
      if (select === "Date" && dateRange.from && dateRange.to) {
        const itemDate = new Date(item.date);
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        return itemDate >= fromDate && itemDate <= toDate;
      }

      // Script filter
      if (select === "Script" && searchScript) {
        return item.scrip.toLowerCase().includes(searchScript.toLowerCase());
      }

      return true; // No filter applied
    });

    // Enhanced: Sort by relevance when searching by script
    if (select === "Script" && searchScript) {
      filteredSummary = filteredSummary.sort((a, b) => {
        const scoreA = calculateRelevanceScore(a.scrip, searchScript);
        const scoreB = calculateRelevanceScore(b.scrip, searchScript);
        return scoreB - scoreA; // Higher scores first
      });
    } else {
      // Default sorting for non-search cases
      filteredSummary.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // newer first
      });
    }

    const newGroupedData = filteredSummary.reduce((acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = [];
      }
      acc[item.date].push(item);
      return acc;
    }, {});

    setDisplayedData(newGroupedData);
    setpage(0); // Reset to the first page after a new search
  };

  // Call the search logic when the button is clicked
  const handleSearchClick = () => {
    applyFiltersAndGroupData();
  };

  // This single useEffect handles both data fetching and filtering
  useEffect(() => {
    if (summaryData.length === 0) {
      dispatch(fetchSummary());
    } else {
      applyFiltersAndGroupData(summaryData);
    }
  }, [dispatch, location.pathname, summaryData.length, select, dateRange, searchScript]);

  const handleMoreClick = (date) => {
    console.log('summary date',date)
    const selected = displayedData[date];
    dispatch(setSelectedSummary(selected));
    dispatch(setMarketSummaryDetails());
    navigate('/Summary/Details-Page') // save data
  };

  const toggleDate = (date) => {
    setExpandedDates((prev) =>
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    );
  };

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

        <Button variant="contained" color="primary" className='search_btn' onClick={handleSearchClick}>
          Search
          <SearchIcon />
        </Button>
      </div>

      <div className="summary_table_wrapper">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell align="center">Date</StyledTableCell>
                <StyledTableCell align="center">Scrip</StyledTableCell>
                <StyledTableCell align="center">Ldcp</StyledTableCell>
                <StyledTableCell align="center">Low</StyledTableCell>
                <StyledTableCell align="center">High</StyledTableCell>
                <StyledTableCell align="center">Current</StyledTableCell>
                <StyledTableCell align="center">Change</StyledTableCell>
                <StyledTableCell align="center">Volume</StyledTableCell>
                <StyledTableCell align="center">Action</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {Object.keys(displayedData).length > 0 ? (
                Object.keys(displayedData)
                  .slice(page * rowPerPage, (page + 1) * rowPerPage)
                  .map((date) => {
                    const firstItem = displayedData[date][0];
                    return (
                      <StyledTableRow key={date}>
                        <StyledTableCell align="center">{firstItem.date}</StyledTableCell>
                        <StyledTableCell align="center">{firstItem.scrip}</StyledTableCell>
                        <StyledTableCell align="center">{firstItem.ldcp}</StyledTableCell>
                        <StyledTableCell align="center">{firstItem.low}</StyledTableCell>
                        <StyledTableCell align="center">{firstItem.high}</StyledTableCell>
                        <StyledTableCell align="center">{firstItem.current}</StyledTableCell>
                        <StyledTableCell align="center">{firstItem.change}</StyledTableCell>
                        <StyledTableCell align="center">{firstItem.volume}</StyledTableCell>
                        <StyledTableCell align="center">
                          {displayedData[date].length > 1 && (
                            <button
                              onClick={() => handleMoreClick(date)} 
                              className='moreBtn'>
                              More
                            </button>
                          )}
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={9} align="center" style={{ padding: "20px" }}>
                    {select === 'Script' && searchScript ?
                      `No results found for "${searchScript}"` :
                      select === 'Date' && dateRange.from && dateRange.to ?
                        `No results found for the selected date range` :
                        'Market Summary is being loaded...'}
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        

        {Object.keys(displayedData).length > 0 && (
          <TablePagination
            component="div"
            count={Object.keys(displayedData).length}
            page={page}
            rowsPerPage={rowPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20, 25]}
          />
        )}
      </div>
    </motion.div>
  );
};

export default withSkeleton(SummaryIndex, 'summary');

