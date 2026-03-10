import React, { useRef, useEffect, useState, useMemo } from 'react';
import './tradeCardView.css';
import { motion, useInView } from "framer-motion";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { useDispatch, useSelector } from 'react-redux';
import {
    setJournal_from,
    selectCurrentJournalEntry, // This selects the single journal entry to display
    getTradingJournalById, // Import the thunk to fetch a single journal entry
} from '../../../Redux/tradingJournalSlice';
import { selectAllStocks, fetchStocks } from "../../../Redux/stockSlice"; // Import stock actions/selectors
import { useNavigate } from 'react-router-dom';
import { fetchTrades, selectAllTrades} from "../../../Redux/stockSlice";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from '../../CrudSystem/crud.module.css'
import Box from '@mui/material/Box';
import TablePagination from "@mui/material/TablePagination";
import SearchIcon from '@mui/icons-material/Search';
import {
    TextField,
    MenuItem,
} from '@mui/material';

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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '95%',
    bgcolor: 'background.paper',
    borderRadius: 6,
    boxShadow: 12,
    p: 4,
};

const filterMain = [
    {
        value: '1',
        label: 'All',
    },
    {
        value: '2',
        label: 'Day Trade',
    },
];

const filter = [
    {
        value: '1',
        label: 'Buy',
    },
    {
        value: '2',
        label: 'Sell',
    },
    {
        value: '3',
        label: 'All data',
    },
];

export const TradeCard = () => {

    // --------------trades--------------------
    const trades = useSelector(selectAllTrades);
    // ---------------filter---------------------
    const [selectTypeMain, setSelectedTypeMain] = useState('1')
    const [searchText, setSearchText] = useState('');
    const [selectType, setSelectedType] = useState('3') 
    const refOne = useRef(null);
    const refTwo = useRef(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const navigate = useNavigate()
    const dispatch = useDispatch();

    // Select the current journal entry that was fetched by getTradingJournalById
    const journal = useSelector(selectCurrentJournalEntry);

    // Select the selectedJournalId from Redux state. This ID tells TradeCard which journal to display.
    const selectedJournalId = useSelector(state => state.tradingJournal.selectJournalById);

    // Select loading state to provide feedback to the user
    const loading = useSelector(state => state.tradingJournal.loading);
    const error = useSelector(state => state.tradingJournal.error);

    // Fetch all stocks (if not already fetched globally)
    useEffect(() => {
        dispatch(fetchStocks());
    }, [dispatch]);

    const allStocks = useSelector(selectAllStocks);

    const stockIdToNameMap = useMemo(() => {
        const map = {};
        allStocks.forEach(stock => {
            map[stock.id] = stock.symbol;
        });
        return map;
    }, [allStocks]);

    const getStockName = (stockId) => {
        // Assuming journal.stock might be an ID. Adjust if it's already the stock name.
        return stockIdToNameMap[stockId] || `ID: ${stockId} (Unknown)`;
    };

    useEffect(() => {
        if (selectedJournalId) {
            dispatch(getTradingJournalById(selectedJournalId));
        } else {
        }
    }, [dispatch, selectedJournalId]);
    
    useEffect(() => {
    
        dispatch(fetchTrades());

    }, [dispatch]);

    useEffect(() => {
        setPage(0);
    }, [trades, searchText, selectTypeMain, selectType]);

    // -------------Filtering and pagination---------------
    const journalStockId = useMemo(() => {
        if (!journal) return null;
        return typeof journal.stock === 'object'
            ? journal.stock.id
            : journal.stock;
    }, [journal]);

    const journalUserId = useMemo(() => {
        if (!journal) return null;
        return typeof journal.user === 'object'
            ? journal.user.id
            : journal.user;
    }, [journal]);
    
    const filteredData = useMemo(() => {

        if (!Array.isArray(trades) || !journal) return [];

        return trades.filter(item => {

            // console.log('j stock ID : '+journalStockId);
            // console.log('j cycle ID : '+journal.cycle_id);
            // console.log('j user ID : '+journalUserId);
            // console.log('t stock ID : '+item.stock?.id);
            // console.log('t cycle ID : '+item.cycle_id);
            // console.log('t user ID : '+item.user?.id);
            const baseMatch =
                item.stock?.id === journalStockId  &&
                item.cycle_id === journal.cycle_id &&
                item.user?.id === journalUserId;

            if (!baseMatch) return false;

            const symbolMatch = (item.stock?.symbol || '')
                .toLowerCase()
                .includes(searchText.toLowerCase());

            const dayTradeMatch =
                selectTypeMain === '1' ||
                (selectTypeMain === '2' && item.day_trade === 1);

            const tradeTypeMatch =
                selectType === '3' ||
                (selectType === '1' && item.trade_type === 'BUY') ||
                (selectType === '2' && item.trade_type === 'SELL');

            return symbolMatch && dayTradeMatch && tradeTypeMatch;
        });
    }, [trades, journal, searchText, selectTypeMain, selectType]);

    
    // --- Conditional Rendering for Loading, Error, and No Data ---
    if (loading === 'pending' && !journal) {
        return <div className="loading-state">Loading journal entry...</div>;
    }

    if (error) {
        return <div className="error-state">Error: {error}</div>;
    }

    if (!journal) {
        // This handles cases where no journal is selected or if the fetch resulted in no data
        return <div className="no-data-state">No journal entry selected or found.</div>;
    }

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    
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

    // --- Render the Trade Card with dynamic data ---
    return (
        <>
            <div className="trade-card-table_main">
                <div className='back_btn' onClick={() => navigate(-1)}>
                    <NavigateBeforeIcon />
                    <span>Back</span>
                </div>

                <div className="trade-card-table">
                    <table className='trdingCard_table'>
                        {/* <thead className='t_head'>
                            <tr>
                                <th>Label</th>
                                <th>Value</th>
                                <th> </th>
                            </tr>
                        </thead> */}
                        <tbody className='t_body'>
                            <tr>
                                <td>Scrip :</td>
                                <td>{getStockName(journal.stock)}</td>
                                <td className='third-child'>Date :</td>
                                <td>{formatDate(journal.entry_date) || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Entry Price :</td>
                                <td>{journal.entry_price || 'N/A'}</td>
                                <td className='third-child'>No of Shares :</td>
                                <td>{journal.no_of_shares || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Average Price :</td>
                                <td>{journal.average_price || 'N/A'}</td>
                                <td className='third-child'>Total Investment</td>
                                <td>
                                    {/* Total {journal.no_of_shares || 0} Shares @ {journal.average_price || 0} = */}
                                    <span className="">
                                        {(journal.no_of_shares * journal.average_price || 0).toLocaleString()}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td>Market Conditions :</td>
                                <td colSpan={3}>{journal.market_conditions || 'N/A'}</td>                            
                            </tr>
                            <tr>
                                <td className="red-text">Entry Reasons :</td>
                                <td colSpan={3}>{journal.entry_reasons || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="blue-text">Source of Trade :</td>
                                <td colSpan={3}>{journal.source_of_trade || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Trade Type :</td>
                                <td colSpan={3}>{journal.trade_type || "N/A"}</td>
                            </tr>
                            <tr>
                                <td>Exit Date:</td>
                                <td>{formatDate(journal.exit_date) || 'N/A'}</td>
                                <td className='third-child'>Exit Price :</td>
                                <td>{journal.exit_price || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>Exit Total :</td>
                                <td>
                                    {/* Sold @ {journal.exit_price || 0} = */}
                                    <span className="">
                                        {(journal.no_of_shares * journal.exit_price || 0).toLocaleString()}
                                    </span>
                                </td>
                                <td className='third-child'>Profit / Loss :</td>
                                <td>
                                    <span className={journal.profit_loss !== undefined && journal.profit_loss >= 0 ? "profit" : "loss"}>
                                        {journal.profit_loss !== undefined ? journal.profit_loss : 'N/A'} ({journal.profit_loss !== undefined ? (journal.profit_loss >= 0 ? "Profit" : "Loss") : ''})
                                    </span>
                                </td>
                            </tr>
                            
                            <tr>
                                <td>Total Duration :</td>
                                <td>{journal.total_duration || 'N/A'} days</td>
                                <td className='third-child'>Status</td>
                                <td>{journal.status || 'N/A'}</td>
                            </tr>   
                            <tr>
                                <td>Scrip Behaviour :</td>
                                <td colSpan={3}>{journal.scrip_behaviour || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="red-text">Reasons for Exit :</td>
                                <td colSpan={3}>{journal.reasons_of_exit || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="blue-text">Lesson Learnt :</td>
                                <td colSpan={3}>{journal.lesson_learnt || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td>IF ? :</td>
                                <td colSpan={3}>{journal.iff || 'N/A'}</td>
                            </tr>                     
                            <tr>
                                <td>Comments :</td>
                                <td colSpan={3}>{journal.comments || 'N/A'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <motion.div
                // ref={refOne}
                initial={{ opacity: 1 }}
                animate={inViewOne ? { opacity: 1, x: 0 } : {}}
                // animate={{ opacity: 1, y: 0 }}
                // transition={{ duration: 0.6, ease: "easeOut" }}
                transition={{ duration: 0.8 }}
                className={styles.crud}
            >
                <div className={styles.crud_main}>
                    <div className={styles.top_input_fields}> 
                        <div className={styles.filter_div}>
                            <Box sx={{ '& .MuiTextField-root': { m: 1, width: isMobile ? '35ch' : '25ch', } }}>
                                <TextField
                                    id="outlined-select-currency"
                                    select
                                    label="Type"
                                    placeholder="Broker Name"
                                    value={selectType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                >
                                    {filter.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </div>
                    </div>
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="center">Type</StyledTableCell>
                                        {/* <StyledTableCell align="center">Stock Name</StyledTableCell> */}
                                        <StyledTableCell align="center">Trade Date</StyledTableCell>
                                        <StyledTableCell align="center">QTY</StyledTableCell>
                                        <StyledTableCell align="center">Rate</StyledTableCell>
                                        <StyledTableCell align="center">Amount</StyledTableCell>
                                        <StyledTableCell align="center">Charges</StyledTableCell>
                                        {/* <StyledTableCell align="center">Broker Amount</StyledTableCell> */}
                                        {/* <StyledTableCell align="center">CDC Amount</StyledTableCell> */}
                                        {/* <StyledTableCell align="center">SST Amount</StyledTableCell> */}
                                        <StyledTableCell align="center">AVG BUYING</StyledTableCell>
                                    </TableRow>
    
                                </TableHead>
                                <TableBody>
                                    {paginatedData.map((item, index) => (
                                        <StyledTableRow key={index}>
                                            <StyledTableCell  align="center" component="th" scope="row">{item.trade_type}</StyledTableCell>
                                            {/* <StyledTableCell align="center">{item.stock?.symbol}</StyledTableCell> */}
                                            <StyledTableCell align="center">{formatDate(item.trade_date)}</StyledTableCell>
                                            <StyledTableCell align="center">{intlNumFormatNoDecimal.format(item.quantity)}</StyledTableCell>
                                            <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.rate)}</StyledTableCell>
                                            <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.amount)}</StyledTableCell>
                                            <StyledTableCell align="center">
                                                {((parseFloat(item.broker_commission) || 0) + (parseFloat(item.cdc_amount) || 0) + (parseFloat(item.sst_amount) || 0)).toFixed(2)}
                                            </StyledTableCell>
                                            {/* <StyledTableCell align="center">{item.broker_commission}</StyledTableCell> */}
                                            {/* <StyledTableCell align="center">{item.cdc_amount}</StyledTableCell> */}
                                            {/* <StyledTableCell align="center">{item.sst_amount}</StyledTableCell> */}
                                            <StyledTableCell align="center">{intlNumFormatTwoDecimal.format(item.avg_buying)}</StyledTableCell>        
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
                        sx={{
                            '& .MuiTablePagination-actions button': {
                                color: '#fff',
                                backgroundColor: '#1976d2'
                            }
                        }}
                    />
                </div>
    
            </motion.div>
        </>
    );
};