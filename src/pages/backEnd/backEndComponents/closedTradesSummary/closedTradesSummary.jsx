import React, { useEffect, useState } from "react";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './closedTradesSummary.css';
import { motion, useInView } from "framer-motion";
import { TextField, TablePagination, MenuItem, Autocomplete, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styles from '../CrudSystem/crud.module.css';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import api from '../../../../api/axios';

// ====================== Styled Table ======================
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#1976d2",
        color: "#fff",
        fontWeight: 'bold'
    },
    [`&.${tableCellClasses.body}`]: { fontSize: 14 },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd) td, &:nth-of-type(odd) th': { backgroundColor: '#F1F5F9' },
    '&:last-child td, &:last-child th': { border: 0 },
}));

// ====================== Filter Options ======================
const filterMain = [
    { value: '1', label: 'Account Overview' },
    { value: '2', label: 'Trade Summary' },
    { value: '3', label: 'Trade Breakdown' },
    { value: '4', label: 'Trade History' },
];

// ====================== Column Mapping ======================
const columnsMap = {
    "1": [
        { label: "Scrip", key: "stock" },
        { label: "Buy Qty.", key: "buy_qty" },
        { label: "Sell Qty.", key: "sell_qty" },
        { label: "Buying Total", key: "buy_total" },
        { label: "Selling Total", key: "sell_total" },
        { label: "P/L", key: "pl" },
        { label: "ROI", key: "roi" },
    ],
    "2": [
        { label: "Scrip", key: "stock" },
        { label: "Buy Qty.", key: "buy_qty" },
        { label: "Sell Qty.", key: "sell_qty" },
        { label: "Buying Total", key: "buy_total" },
        { label: "Selling Total", key: "sell_total" },
        { label: "Duration", key: "cycle_days" },
        { label: "P/L", key: "pl" },
        { label: "ROI", key: "roi" },
    ],
    "3": [ // Trade Breakdown
        { label: "Scrip", key: "stock" },
        // { label: "Cycle ID", key: "cycle_id" },
        { label: "Trade Date", key: "trade_date" },
        { label: "Buy Qty.", key: "buy_qty" },
        { label: "Sell Qty.", key: "sell_qty" },
        { label: "Rate", key: "rate" },
        { label: "Buy Amount", key: "buy_amount" },
        { label: "Sell Amount", key: "sell_amount" },
    ],
    "4": [ // Trade History
        { label: "Scrip", key: "stock" },
        // { label: "Cycle ID", key: "cycle_id" },
        { label: "Trade Date", key: "trade_date" },
        { label: "Buy Qty.", key: "buy_qty" },
        { label: "Sell Qty.", key: "sell_qty" },
        { label: "Rate", key: "rate" },
        { label: "Buy Amount", key: "buy_amount" },
        { label: "Sell Amount", key: "sell_amount" },
    ],
};

// ====================== Component ======================
export const ClosedTradesSummary = () => {
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);

    // Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    // Data
    const [accountOverview, setAccountOverview] = useState([]);
    const [stockList, setStockList] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);

    // Filters
    const [selectTypeMain, setSelectedTypeMain] = useState('1');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (selectTypeMain === '1') {
        setSelectedStock(null);
        setFromDate('');
        setToDate('');
        }
    }, [selectTypeMain]);

    useEffect(() => {
        fetchStockList();
        fetchData();
    }, []);

    const fetchStockList = async () => {
        const res = await api.get("stocks/list/user-stocks/");
        setStockList(res.data);
    };

    const getEndpoint = () => {
        switch (selectTypeMain) {
            case '1': return "stocks/account/overview/";
            case '2': return "stocks/trade/summary/";
            case '3': return "stocks/trade/breakdown/";
            case '4': return "stocks/trade/history/";
            default: return "stocks/account/overview/";
        }
    };

    const fetchData = async () => {
        const endpoint = getEndpoint();
        const res = await api.get(endpoint, {
            params: {
                stock_id: selectedStock?.id || "",
                from_date: fromDate || "",
                to_date: toDate || "",
            }
        });
        setAccountOverview(res.data);
    };

    const handleSearch = () => fetchData();
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    const intlNumFormatNoDecimal = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 });
    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const paginatedOverview = accountOverview.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
    const columns = columnsMap[selectTypeMain] || [];

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
            <div className="closed_tradlist">
                <button className='backBtn' onClick={() => navigate(-1)}>Back</button>

                <div className='closed_header'>
                    <ShowChartIcon className='closed_chart_icon' />
                    <span className='closed_title'>Summary</span>
                </div>

                {/* Filters */}
                <div className={styles.top_input_fields}>
                    <Box sx={{ '& .MuiTextField-root': { m: 1, width: isMobile ? '35ch' : '35ch' } }}>
                        <TextField
                        select
                        label="View Records"
                        value={selectTypeMain}
                        onChange={(e) => setSelectedTypeMain(e.target.value)}
                        >
                        {filterMain.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                        </TextField>
                    </Box>

                    <Autocomplete
                        options={stockList}
                        getOptionLabel={(option) => option.symbol || ""}
                        value={selectedStock}
                        onChange={(event, newValue) => setSelectedStock(newValue)}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        renderInput={(params) => (
                        <TextField {...params} label="Stock Name" sx={{ m: 2, width: isMobile ? '35ch' : '35ch' }} />
                        )}
                    />

                    <TextField
                        label="From Date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ m: 1, width: isMobile ? '35ch' : '35ch' }}
                    />

                    <TextField
                        label="To Date"
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        sx={{ m: 1, width: isMobile ? '35ch' : '35ch' }}
                    />

                    <button className="top_btn_buy" type="button" onClick={handleSearch}>
                        <SearchIcon sx={{ fontSize: '32px', color: '#fff' }} /> Search
                    </button>
                </div>

                {/* Table */}
                <div className="closed_table_wrapper">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    {columns.map(col => (
                                        <StyledTableCell key={col.key} align={col.key === "stock" ? "left" : "center"}>
                                            {col.label}
                                        </StyledTableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginatedOverview.map((item, index) => (
                                    <StyledTableRow key={index}>
                                        {columns.map(col => {
                                            let value = item[col.key];

                                            // Formatting
                                            if (["buy_qty", "sell_qty"].includes(col.key)) {
                                                value = value != null ? intlNumFormatNoDecimal.format(value) : "";
                                            }

                                            if (["buy_total", "sell_total", "pl", "buy_amount", "sell_amount", "rate", "roi"].includes(col.key)) {
                                                value = value != null ? intlNumFormatTwoDecimal.format(value) : "";
                                                if (col.key === "roi" && value) value += "%";
                                            }
                                            
                                            if (col.key === "cycle_days") {
                                                value = value != null ? value + " days" : "";
                                            }
                                            if (col.key === "trade_date" && value) {
                                                const dateObj = new Date(value);
                                                const day = String(dateObj.getDate()).padStart(2, '0');
                                                const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                                                const year = dateObj.getFullYear();
                                                value = `${day}-${month}-${year}`;
                                            }

                                            return (
                                                <StyledTableCell key={col.key} align={col.key === "stock" ? "left" : "center"}>
                                                    {value}
                                                </StyledTableCell>
                                            );
                                        })}
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    <div className='close_trde_pagination'>
                        <TablePagination
                            component="div"
                            count={accountOverview.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[25, 50, 100]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            sx={{ '& .MuiTablePagination-actions button': { color: '#fff', backgroundColor: '#1d00d8' } }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};