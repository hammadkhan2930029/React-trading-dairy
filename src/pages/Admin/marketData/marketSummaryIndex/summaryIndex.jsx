import React, { useEffect, useState, useRef } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './summaryIndex.css';
import { motion, useInView } from "framer-motion";
import {
  Button,
  TextField,
  TablePagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import {  selectAllsummary, fetchRecentMarketSummary, fetchSummaryByFilter } from '../../../backEnd/Redux/summarySlice'; 
// import withSkeleton from "../../../../component/Skeletons/withSkeleton.jsx";
import * as Yup from "yup";
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
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [searchScript, setSearchScript] = useState('');
    const [page, setpage] = useState(0);
    const [rowPerPage, setRowperPage] = useState(100); // Keep 25 as default
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    const dispatch = useDispatch();
    const summaryData = useSelector(selectAllsummary); 
    const filteredData = Array.isArray(summaryData) ? summaryData : []; 

    const today = new Date().toISOString().split("T")[0];

    Yup.object().shape({
        stock_name: Yup.string()
            .typeError("Stock Name is required")
            .required("Please select Stock Name"),

    });
  
    const handleChangePage = (event, newPage) => setpage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowperPage(parseInt(event.target.value, 10));
        setpage(0);
    };

    const intlNumFormatNoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    });

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    useEffect(() => {
        dispatch(fetchRecentMarketSummary());
    }, [dispatch]);
  
    // In SummaryIndex.jsx
    const handleSearch = () => {
        if (!searchScript && !dateRange.from) {
            setSnackbarMessage("Please select Script or Date range");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        dispatch(fetchSummaryByFilter({
            scrip: searchScript || undefined,
            from: dateRange.from || '2025-01-01',
            to: dateRange.to || today                 
        }));
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
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
                <h2 className='summary_title'>Market Summary</h2>
            </div>

        <div className="summary_filters">
            <TextField 
                label="Search Stock" 
                type="text" 
                className="filter_field" 
                InputLabelProps={{ shrink: true }}
                placeholder='Search Stock...' 
                value={searchScript} 
                onChange={(e) => setSearchScript(e.target.value)} 
            />
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

            <Button variant="contained" color="primary" className='search_btn' onClick={handleSearch}>
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
                            <StyledTableCell align="center">LDCP</StyledTableCell>
                            <StyledTableCell align="center">Low</StyledTableCell>
                            <StyledTableCell align="center">High</StyledTableCell>
                            <StyledTableCell align="center">Current</StyledTableCell>
                            <StyledTableCell align="center">Change</StyledTableCell>
                            <StyledTableCell align="center">Volume</StyledTableCell>
                            <StyledTableCell align="center">Sector</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length > 0 ? (
                            filteredData
                                .slice(page * rowPerPage, (page + 1) * rowPerPage)
                                .map((item, index) => (
                                    <StyledTableRow key={item.id || index}>
                                        <StyledTableCell align="center">{formatDate(item.date)}</StyledTableCell>
                                        <StyledTableCell align="center">{item.scrip}</StyledTableCell>
                                        <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.ldcp)}</StyledTableCell>
                                        <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.low)}</StyledTableCell>
                                        <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.high)}</StyledTableCell>
                                        <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.current)}</StyledTableCell>
                                        <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.change)}</StyledTableCell>
                                        <StyledTableCell align="center">{intlNumFormatNoDecimal.format(item.volume)}</StyledTableCell>
                                        <StyledTableCell align="center">{item.sector}</StyledTableCell>
                                    </StyledTableRow>
                                ))
                        ) : (
                            <StyledTableRow>
                                <StyledTableCell colSpan={9} align="center" style={{ padding: "20px" }}>
                                    No market summary data available
                                </StyledTableCell>
                            </StyledTableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            rowsPerPage={rowPerPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[100, 250, 500]}
          />
      </div>
    </motion.div>
  );
};

// export default withSkeleton(SummaryIndex, 'summary');

