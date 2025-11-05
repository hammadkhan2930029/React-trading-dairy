import React, { useState, useEffect } from "react";
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
import { fetchOverview, selectAllOverview } from "../../../Redux/overviewSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Alert } from '@mui/material';
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


export const OverviewIndex = () => {

    const dispatch = useDispatch();
    const [select, setSelect] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [lowAndHigh, setLowAndHigh] = useState({ from: '', to: '' });
    const [currentIndex, setCurrentIndex] = useState({ from: '', to: '' });
    const [change, setChange] = useState({ from: '', to: '' });
    const [percentChange, setPercentChange] = useState({ from: '', to: '' });
    const [page, setpage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const [filteredData, setFilteredData] = useState([]);

    const handleChange = (event) => setSelect(event.target.value);
    const handleChangePage = (event, newPage) => setpage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setpage(0);
    };

    const overviewData = useSelector(selectAllOverview);
    const loading = useSelector(state => state.overview.loading);
    const error = useSelector(state => state.overview.error);
    const [selectedDate, setSelectedDate] = useState('');

    useEffect(() => {
        dispatch(fetchOverview()); // Fetch all data initially
    }, [dispatch]);

    useEffect(() => {
        // Set filteredData to all data when it's first loaded
        if (loading === 'succeeded') {
            setFilteredData(overviewData);
        }
    }, [overviewData, loading]);

    // Helper function to format numeric values for display
    const formatValue = (value, type) => {
        if (value === null || value === undefined || value === '') {
            return 'N/A';
        }
        let numValue = parseFloat(value);
        if (isNaN(numValue)) {
            return String(value); // Return as string if not a valid number
        }

        if (type === 'percent') {
            return `${numValue.toFixed(2)}%`;
        } else if (type === 'volume' || type === 'value') {
            return numValue.toLocaleString(undefined, { maximumFractionDigits: 0 });
        } else if (type === 'currency') {
            return numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return numValue.toFixed(2);
    };

    // Helper function to determine text color for change
    const getChangeColorClass = (value) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'text-gray-700'; // Default color
        if (numValue > 0) return 'text-green-600';
        if (numValue < 0) return 'text-red-600';
        return 'text-gray-700';
    };

    const filterData = () => {
        const dataToFilter = overviewData;
        const result = dataToFilter.filter(item => {
            // 1. Date Filter
            if (dateRange.from && dateRange.to) {
                const itemDate = new Date(item.date);
                const fromDate = new Date(dateRange.from);
                const toDate = new Date(dateRange.to);
                if (!(itemDate >= fromDate && itemDate <= toDate)) {
                    return false;
                }
            }

            // 2. Current Index Filter
            if (currentIndex.from && parseFloat(item.current_index) < parseFloat(currentIndex.from)) return false;
            if (currentIndex.to && parseFloat(item.current_index) > parseFloat(currentIndex.to)) return false;

            // 3. Change Filter
            if (change.from && parseFloat(item.index_change) < parseFloat(change.from)) return false;
            if (change.to && parseFloat(item.index_change) > parseFloat(change.to)) return false;

            // 4. Percent Change Filter
            if (percentChange.from && parseFloat(item.index_percent_change) < parseFloat(percentChange.from)) return false;
            if (percentChange.to && parseFloat(item.index_percent_change) > parseFloat(percentChange.to)) return false;

            // 5. Low/High Filter
            if (lowAndHigh.from && parseFloat(item.index_low) < parseFloat(lowAndHigh.from)) return false;
            if (lowAndHigh.to && parseFloat(item.index_high) > parseFloat(lowAndHigh.to)) return false;

            return true;
        });
        setFilteredData(result);
        setpage(0); // Reset to the first page on a new search
    };

    return (
        <motion.div
            className="overview_container"
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
        >
            {/* Header */}
            <div className="overview_header">
                <ShowChartIcon className="overview_icon" />
                <h2 className="overview_title">Market Overview Index</h2>
            </div>

            {/* Filters */}
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
                        <TextField type="date" label="From Date" InputLabelProps={{ shrink: true }} className="filter_field"
                            value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })} />
                        <TextField type="date" label="To Date" InputLabelProps={{ shrink: true }} className="filter_field"
                            value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })} />
                    </>
                )}

                {select === 'Current Index' && (
                    <>
                        <TextField label="From Index" type="number" className="filter_field"
                            value={currentIndex.from} onChange={(e) => setCurrentIndex({ ...currentIndex, from: e.target.value })} />
                        <TextField label="To Index" type="number" className="filter_field"
                            value={currentIndex.to} onChange={(e) => setCurrentIndex({ ...currentIndex, to: e.target.value })} />
                    </>
                )}

                {select === 'Change' && (
                    <>
                        <TextField label="From Change" type="number" className="filter_field"
                            value={change.from} onChange={(e) => setChange({ ...change, from: e.target.value })} />
                        <TextField label="To Change" type="number" className="filter_field"
                            value={change.to} onChange={(e) => setChange({ ...change, to: e.target.value })} />
                    </>
                )}

                {select === 'Percent Change' && (
                    <>
                        <TextField label="From % Change" type="number" className="filter_field"
                            value={percentChange.from} onChange={(e) => setPercentChange({ ...percentChange, from: e.target.value })} />
                        <TextField label="To % Change" type="number" className="filter_field"
                            value={percentChange.to} onChange={(e) => setPercentChange({ ...percentChange, to: e.target.value })} />
                    </>
                )}

                {select === 'Low / High' && (
                    <>
                        <TextField label="Low" type="number" className="filter_field"
                            value={lowAndHigh.from} onChange={(e) => setLowAndHigh({ ...lowAndHigh, from: e.target.value })} />
                        <TextField label="High" type="number" className="filter_field"
                            value={lowAndHigh.to} onChange={(e) => setLowAndHigh({ ...lowAndHigh, to: e.target.value })} />
                    </>
                )}

                <Button variant="contained"  className="search_btn" onClick={filterData}>
                    <SearchIcon /> Search
                </Button>
            </div>

            {/* Loading State */}
            {loading === 'pending' && (
                <div className="loading_box">
                    <CircularProgress />
                    <Typography className="loading_text">Loading Market Overview Data...</Typography>
                </div>
            )}

            {/* Error */}
            {loading === 'failed' && error && (
                <div className="error_box">
                    <Alert severity="error">Error fetching market overview: {error.toString()}</Alert>
                </div>
            )}

            {/* Empty Data */}
            {loading === 'succeeded' && filteredData.length === 0 && (
                <div className="empty_box">
                    <Typography>No market overview data available {selectedDate && `for ${selectedDate}`}.</Typography>
                </div>
            )}

            {/* Data Table */}
            {loading === 'succeeded' && filteredData.length > 0 && (
                <>
                    <div className="market_table_container_overview">
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        {['Date', 'Market Status', 'Current Index', 'Change', 'Percent Change', 'High', 'Low', 'Volume', 'Previous Close', 'Value'].map((h, i) => (
                                            <StyledTableCell key={i} align="center">{h}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="center">{item.date}</StyledTableCell>
                                            <StyledTableCell align="center">{item.market_status}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.current_index, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center" className={getChangeColorClass(item.index_change)}>{formatValue(item.index_change, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center" className={getChangeColorClass(item.index_percent_change)}>{formatValue(item.index_percent_change, 'percent')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.index_high, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.index_low, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.volume, 'volume')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.previous_close, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.value, 'value')}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                       
                    </div>

                    <TablePagination
                        component="div"
                        count={filteredData.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[5, 10, 20]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </>
            )}
        </motion.div>
       
    );
};
export default withSkeleton(OverviewIndex, 'overview');