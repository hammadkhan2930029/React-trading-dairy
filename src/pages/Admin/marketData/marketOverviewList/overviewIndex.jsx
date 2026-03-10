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
import { fetchOverview, selectAllOverview } from "../../../backEnd/Redux/overviewSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress, Alert } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import api from "../../../../api/axios"; 

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

    const handleClose = () => setOpen(false);

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
    
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [formData, setFormData] = useState({
        id: null,
        date: '',
        market_status: '',
        current_index: '',
        index_change: '',
        index_percent_change: '',
        index_high: '',
        index_low: '',
        volume: '',
        previous_close: '',
        value: '',
    });

    const handleOpen = (item) => {

        setFormData({
            id: item.id, // Store the bonus's ID
            date: item.date,
            market_status: item.market_status,
            current_index: item.current_index,
            index_change: item.index_change,
            index_percent_change: item.index_percent_change,
            index_high: item.index_high,
            index_low: item.index_low,
            volume: item.volume,
            previous_close: item.previous_close,
            value: item.value,
        });

        setOpen(true);
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `/marketoverview/marketoverview/${formData.id}/`,
                {
                    date: formData.date,
                    market_status: formData.market_status,
                    current_index: Number(formData.current_index),
                    index_change: Number(formData.index_change),
                    index_percent_change: Number(formData.index_percent_change),
                    index_high: Number(formData.index_high),
                    index_low: Number(formData.index_low),
                    volume: Number(formData.volume),
                    previous_close: Number(formData.previous_close),
                    value: Number(formData.value),
                }
            );

            setSnackbarMessage('Overview updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();

            // Refresh stock list
            dispatch(fetchOverview());

        } catch (error) {
            console.error(error.response?.data || error);
            setSnackbarMessage('Something went wrong');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
        
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
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
            {/* <div className="overview_header">
                <ShowChartIcon className="overview_icon" />
                <h2 className="overview_title">Market Overview Index</h2>
            </div> */}

            {/* Filters */}
            <div className="overview_filters">
                <FormControl fullWidth className="filter_field">
                    <InputLabel>Select Field</InputLabel>
                    <Select value={select} label="Select Field" onChange={handleChange}>
                        {/* {['Date', 'Current Index', 'Change', 'Percent Change', 'Low / High'].map((item, i) => ( */}
                        {['Date'].map((item, i) => (
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

                {/* {select === 'Current Index' && (
                    <>
                        <TextField label="From Index" type="number" className="filter_field"
                            value={currentIndex.from} onChange={(e) => setCurrentIndex({ ...currentIndex, from: e.target.value })} />
                        <TextField label="To Index" type="number" className="filter_field"
                            value={currentIndex.to} onChange={(e) => setCurrentIndex({ ...currentIndex, to: e.target.value })} />
                    </>
                )} */}

                {/* {select === 'Change' && (
                    <>
                        <TextField label="From Change" type="number" className="filter_field"
                            value={change.from} onChange={(e) => setChange({ ...change, from: e.target.value })} />
                        <TextField label="To Change" type="number" className="filter_field"
                            value={change.to} onChange={(e) => setChange({ ...change, to: e.target.value })} />
                    </>
                )} */}

                {/* {select === 'Percent Change' && (
                    <>
                        <TextField label="From % Change" type="number" className="filter_field"
                            value={percentChange.from} onChange={(e) => setPercentChange({ ...percentChange, from: e.target.value })} />
                        <TextField label="To % Change" type="number" className="filter_field"
                            value={percentChange.to} onChange={(e) => setPercentChange({ ...percentChange, to: e.target.value })} />
                    </>
                )} */}

                {/* {select === 'Low / High' && (
                    <>
                        <TextField label="Low" type="number" className="filter_field"
                            value={lowAndHigh.from} onChange={(e) => setLowAndHigh({ ...lowAndHigh, from: e.target.value })} />
                        <TextField label="High" type="number" className="filter_field"
                            value={lowAndHigh.to} onChange={(e) => setLowAndHigh({ ...lowAndHigh, to: e.target.value })} />
                    </>
                )} */}

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
                                        {['Date', 'Market Status', 'Current Index', 'Change', '% Change', 'High', 'Low', 'Volume', 'Previous Close', 'Value', 'Action'].map((h, i) => (
                                            <StyledTableCell key={i} align="center">{h}</StyledTableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell align="center">{formatDate(item.date)}</StyledTableCell>
                                            <StyledTableCell align="center">{item.market_status}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.current_index, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center" className={getChangeColorClass(item.index_change)}>{formatValue(item.index_change, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center" className={getChangeColorClass(item.index_percent_change)}>{formatValue(item.index_percent_change, 'percent')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.index_high, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.index_low, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.volume, 'volume')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.previous_close, 'currency')}</StyledTableCell>
                                            <StyledTableCell align="center">{formatValue(item.value, 'value')}</StyledTableCell>
                                            <StyledTableCell>
                                                <button className="editebtn" type="button" onClick={() => handleOpen(item)}>
                                                    Edit
                                                </button>
                                            </StyledTableCell>
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
                        rowsPerPageOptions={[25, 50, 100]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <Modal open={open} onClose={handleClose}>
                        <Box className='overview_model_edit'>
                            <Typography variant="h6">Edit Overview Details</Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Date" name="date" type="date" value={formData.date} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth select label="Market Status" name="market_status" value={formData.market_status} onChange={handleFormChange} required >
                                            <MenuItem value={'Open'}>Open</MenuItem>
                                            <MenuItem value={'Closed'}>Closed</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Current Index" name="current_index" type="number" value={formData.current_index} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Change" name="index_change" type="number" value={formData.index_change} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="% Change" name="index_percent_change" type="number" value={formData.index_percent_change} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="High" name="index_high" type="number" value={formData.index_high} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Low" name="index_low" type="number" value={formData.index_low} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Volume" name="volume" type="number" value={formData.volume} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Previous Close" name="previous_close" type="number" value={formData.previous_close} onChange={handleFormChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Value" name="value" type="number" value={formData.value} onChange={handleFormChange} required />
                                    </Grid>
                                </Grid>
                                <Box mt={2} display="flex" justifyContent="space-between">
                                    <Button type="submit" variant="contained" color="primary">Update</Button>
                                    <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                                </Box>
                            </form>
                        </Box>
                    </Modal>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <MuiAlert
                            onClose={() => setSnackbarOpen(false)}
                            severity={snackbarSeverity}
                            sx={{
                                width: '100%',
                                backgroundColor: 'rgba(15, 134, 231, 0.94)',
                                color: '#fff',

                            }}
                            elevation={6}
                            variant="filled"
                        >
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>
                </>
            )}
        </motion.div>
       
    );
};
export default OverviewIndex;