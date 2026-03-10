import React, { useEffect, useState } from "react";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './closedTradeslist.css';
import { motion, useInView } from "framer-motion";
import { TextField, TablePagination, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchTradeSummary } from '../../Redux/tradeSummarySlice';
import { useNavigate } from 'react-router-dom';
import styles from '../CrudSystem/crud.module.css'
import Box from '@mui/material/Box';
// =========================================================
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: 'bold'

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

// ==============================================================

const tradeRecords = [];

const filterMain = [
    {
        value: '1',
        label: 'All',
    },
    {
        value: '2',
        label: 'Day Trade',
    },
    {
        value: '3',
        label: 'Normal Trade',
    },
];

const filterDateType = [
    {
        value: '1',
        label: 'Entry Date',
    },
    {
        value: '2',
        label: 'Exit Date',
    },
];

export const ClosedTrades = () => {

    const navigate = useNavigate()
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);
    const dispatch = useDispatch();
    const [page, setpage] = useState(0);
    const [rowPerPage, setRowperPage] = useState(25);
    const { summary, loading, error } = useSelector((state) => state.tradeSummary);
    
    // filter
    const [selectTypeMain, setSelectedTypeMain] = useState('1')
    const [searchTerm, setSearchTerm] = useState('');
    const [selectDateType, setSelectedDateType] = useState('1')
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleChangePage = (event, newPage) => {
        setpage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowperPage(parseInt(event.target.value, 10));
        setpage(0);
    };

    useEffect(() => {
        dispatch(fetchTradeSummary());
    }, [dispatch]);

    useEffect(() => {
        setpage(0);
    }, [searchTerm, selectTypeMain, selectDateType, fromDate, toDate]);

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    const intlNumFormatNoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    });

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const extractDate = (dateStr) => {
        if (!dateStr) return null;
        return dateStr.split(' ')[0]; // "2025-09-22"
    };
    
    const filteredSummary = summary.filter((item) => {
        const term = searchTerm.toLowerCase();

        if (
            searchTerm &&
            !item.stock_symbol?.toLowerCase().includes(term)
        ) {
            return false;
        }

        if (
            selectTypeMain === '2' && item.day_trade !== 1
        ) {
            return false;
        }

        if (
            selectTypeMain === '3' && item.day_trade !== 0
        ) {
            return false;
        }

        if (fromDate || toDate) {
            const rawDate =
                selectDateType === '1'
                    ? item.entry_date
                    : item.exit_date;

            if (!rawDate) return false;

            const itemEntryDate = extractDate(item.entry_date);
            const itemToDate = extractDate(item.exit_date);

            if (fromDate && itemEntryDate < fromDate) return false;
            if (toDate && itemToDate > toDate) return false;
        }

        return true;
    });

    const paginatedSummary = filteredSummary.slice(page * rowPerPage, (page + 1) * rowPerPage);

    return (
        <motion.div
            className='closed_container'
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
        >
            <div className="closed_tradlist">
                <button className='backBtn' onClick={() => {
                    navigate(-1)
                }}>
                    Back
                </button>

                <div className='closed_header'>
                    <ShowChartIcon className='closed_chart_icon' />
                    <span className='closed_title'>Closed Trades</span>
                </div>

                <div className={styles.top_input_fields}>
                    <div className={styles.filter_div}>
                        <Box sx={{ '& .MuiTextField-root': { m: 1, width: isMobile ? '35ch' : '35ch', } }}>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="View Records"
                                placeholder="Broker Name"
                                value={selectTypeMain}
                                onChange={(e) => setSelectedTypeMain(e.target.value)}
                            >
                                {filterMain.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </div>

                    <div className={styles.filter_div}>
                        <TextField
                            label="Search Scrip"
                            variant="outlined"
                            placeholder="Search Scrip"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                m: 1, width: isMobile ? '35ch' : '35ch',
                            }}
                        />
                    </div>
                    {/* <div className={styles.filter_div}>
                        <Box sx={{ '& .MuiTextField-root': { m: 1, width: isMobile ? '35ch' : '25ch', } }}>
                            <TextField
                                id="outlined-select-currency"
                                select
                                label="Date Type"
                                placeholder="Date Type"
                                value={selectDateType}
                                onChange={(e) => setSelectedDateType(e.target.value)}
                            >
                                {filterDateType.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </div> */}
                    <div className={styles.filter_div}>
                        <TextField
                            label="Entry Date"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                m: 1, width: isMobile ? '35ch' : '35ch',
                            }}
                        />
                    </div>
                    <div className={styles.filter_div}>
                        <TextField
                            label="Exit Date"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{
                                m: 1, width: isMobile ? '35ch' : '35ch',
                            }}
                        />
                    </div>
                </div>

                <div className="closed_table_wrapper">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                <StyledTableCell>Scrip</StyledTableCell>
                                <StyledTableCell align="center">Entry Date</StyledTableCell>
                                <StyledTableCell align="center">Exit Date</StyledTableCell>
                                <StyledTableCell align="center">Avg Buying</StyledTableCell>
                                <StyledTableCell align="center">Avg Selling</StyledTableCell>
                                <StyledTableCell align="center">Quantity</StyledTableCell>
                                <StyledTableCell align="center">Total INV</StyledTableCell>
                                <StyledTableCell align="center">P/L</StyledTableCell>
                                <StyledTableCell align="center">ROI</StyledTableCell>
                                <StyledTableCell align="center">Win / loss</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedSummary.map((item, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell component="th" scope="row">
                                        {item.stock_symbol}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{formatDate(item.entry_date)}</StyledTableCell>
                                    <StyledTableCell align="center">{formatDate(item.exit_date)}</StyledTableCell>
                                    <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.avg_buying)}</StyledTableCell>
                                    <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.avg_selling)}</StyledTableCell>
                                    <StyledTableCell align="center">{intlNumFormatNoDecimal.format(item.quantity)}</StyledTableCell>
                                    <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.total_investment)}</StyledTableCell>
                                    <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.pl)}</StyledTableCell>
                                    <StyledTableCell align="center">{item.roi}%</StyledTableCell>
                                    <StyledTableCell align="center">{item.win_loss}</StyledTableCell>
                                </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className='close_trde_pagination'>
                        <TablePagination
                            component="div"
                            count={filteredSummary.length}
                            page={page}
                            rowsPerPage={rowPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[25, 50, 100]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{
                                '& .MuiTablePagination-actions button': {
                                color: '#fff',
                                backgroundColor: '#1d00d8'
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
