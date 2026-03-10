import * as React from 'react';
import  { useEffect, useState} from 'react';
import './closedTradeDashboard.css';
import { Card_1 } from './card_1/card_1';
import { Card_2 } from './card_2/card_2';
import Card_3 from './card_3/card_3';
import Card_4 from './card_4/card_4';
import { motion, useInView } from "framer-motion"; 
import { useSelector, useDispatch } from "react-redux";
import { fetchTradeSummaryClosedTrade } from '../../Redux/tradeSummarySlice';
import { TablePagination } from '@mui/material';
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

export const ClosedTradeDashboard = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);

    const dispatch = useDispatch();
    const [page, setpage] = useState(0);
    const [rowPerPage, setRowperPage] = useState(25);
    const { summaryClosedTrade, loading, error } = useSelector((state) => state.tradeSummary);

    const handleChangePage = (event, newPage) => {
        setpage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowperPage(parseInt(event.target.value, 10));
        setpage(0);
    };

    // -----------------------------------

    const [anchorEl2, setAnchorEl2] = React.useState(null);
    React.useEffect(() => {
        window.scrollTo(0, 0)
    },[])

    // -----------------------------------

     useEffect(() => {
        dispatch(fetchTradeSummaryClosedTrade())
     }, []); 

    useEffect(() => {
        setpage(0);
    }, []);

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

    const paginatedSummary = summaryClosedTrade.slice(page * rowPerPage, (page + 1) * rowPerPage);
   
    return (
        <div className='dashboard_main_ct'>
            <div className='heading_div_buy'>
                <span className='heading'>Closed Trades</span>
            </div>
            {/* ------------------------------------------Larg card----------------------------------------------- */}
            <div className="larg_cards_ct">
                <div className="larg_cards_data_ct">
                    <Card_4 />
                </div>
               <div className="larg_cards_data_ct">
                    <Card_3 />
                </div>
                <div className="larg_cards_data_ct">
                    <Card_2 />
                </div>
                <div className="larg_cards_data_ct">
                    <Card_1 />
                </div>
            </div>

            <motion.div
                className='closed_container'
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <div className="closed_tradlist">    
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
                                        <StyledTableRow
                                            key={index}
                                            sx={{
                                                color:
                                                item.roi > 0
                                                    ? 'green'
                                                    : item.roi < 0
                                                    ? 'rgba(220, 38, 38, 0.12)'
                                                    : 'inherit',

                                                '& td, & th': {
                                                color:
                                                    item.roi > 0
                                                    ? 'green'
                                                    : item.roi < 0
                                                    ? '#7f1d1d'
                                                    : 'inherit',
                                                fontWeight: 500,
                                                },
                                            }}
                                        >
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
                                count={summaryClosedTrade.length}
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
            
        </div>
    )
}
