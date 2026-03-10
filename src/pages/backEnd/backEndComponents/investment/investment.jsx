import React, { useEffect, useState } from 'react';
import "./investment.css"
import "react-datepicker/dist/react-datepicker.css";
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import SouthWestIcon from '@mui/icons-material/SouthWest'; // Deposit
import NorthEastIcon from '@mui/icons-material/NorthEast'; // Withdrawal
import { TablePagination } from '@mui/material';
import { selectAllTransaction, fetchTransactions } from "../../Redux/transactionSlice";
import { setTotalInvestment } from "../../Redux/formTypeSlice";
import { fetchTransactionsReport, selectTransactionsReport } from "../../Redux/transactionSlice";
import { Link } from 'react-router-dom';
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

export const Investment = () => {

    const dispatch = useDispatch()
    const TotalInvestmentList = useSelector(selectAllTransaction)
    const investmentList = TotalInvestmentList;
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);

    const report = useSelector(selectTransactionsReport) || {
        total_deposit: 0,
        total_withdrawn: 0,
        net_investment: 0,
    };

    const handleOpenTotalInvestment = () => {
        dispatch(setTotalInvestment());
    };

    useEffect(() => {
        if (TotalInvestmentList.length === 0) {
            dispatch(fetchTransactions());
        }

        dispatch(fetchTransactionsReport());
    }, [dispatch, TotalInvestmentList.length]);

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Fetch transactions on component mount
    useEffect(() => {
        if (TotalInvestmentList.length === 0) {
            dispatch(fetchTransactions())
                .unwrap()
                .catch(error => {
            });
        }
    }, [dispatch, TotalInvestmentList.length]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const intlNumFormatNoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0
    });

    const intlNumFormatTwoDecimal = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // -------------------------------------------------------------
    return (
        
        <motion.div
            ref={refOne}
            initial={{ opacity: 0, y: 100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}
            className='investment_main'
        >

            <div className='investmentform'>
                <div>
                    <span className='heading-oneTime'>Account Balance</span>
                </div>
            </div>

            <div className='inv_card_main'>
                <div>
                    <div className='inv_card_view'>
                        <Link className="inv_card" to="/deposit">
                            <div className='card_1_data'>
                                <div className='card_icon'>
                                    <SouthWestIcon style={{ width: 50, height: 50, textAlign:'center',color:'blue'}}/>
                                </div>
                                <div className='price'>
                                    <span className='h_6'>Deposit</span>
                                    <span className="h_1">
                                        Rs.{intlNumFormatTwoDecimal.format(report.total_deposit)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <Link className="inv_card" to="/withdrawal" >
                            <div className='card_1_data'>
                                <div className='card_icon'>
                                    <NorthEastIcon style={{ width: 50, height: 50, textAlign:'center',color:'blue'}}/>
                                </div>
                                <div className='price'>
                                    <span className='h_6'>Withdrawal</span>
                                    <span className="h_1">
                                        Rs.{intlNumFormatTwoDecimal.format(report.total_withdrawn)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        <div className="inv_card">
                            <div className='card_1_data'>
                                <div className='card_icon'>
                                    <CurrencyExchangeIcon style={{ width: 50, height: 50, textAlign:'center',color:'blue'}}/>
                                </div>
                                <div className='price'>
                                    <span className='h_6'>Account Balance</span>
                                    <span className="h_1">
                                        Rs.{intlNumFormatTwoDecimal.format(report.net_investment)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE SECTION */}
            <motion.div className="investment_crud_onetime"
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>

                <div className="investment_crud_main_onetime">
                    <TableContainer component={Paper} sx={{ borderRadius: '10px', marginTop: '15px' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell align='center'>Fore</StyledTableCell>
                                    <StyledTableCell align='center'>Date</StyledTableCell>
                                    <StyledTableCell align='center'>Amount</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {investmentList
                                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                                    .map((item, index) => (
                                        <StyledTableRow key={item.id || index}>
                                            <StyledTableCell align='center'>{item.fore}</StyledTableCell>
                                            <StyledTableCell align='center'>{formatDate(item.date)}</StyledTableCell>
                                            <StyledTableCell align='center'>{intlNumFormatNoDecimal.format(item.amount)}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}

                                {investmentList.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={3} align="center">No Data Found</StyledTableCell>
                                    </StyledTableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <TablePagination
                        component="div"
                        count={investmentList.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[10, 25, 50]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
            </motion.div>
        </motion.div>
    )
}
