
import React, { useEffect, useState } from "react";
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './closedTradeslist.css';
import { motion, useInView } from "framer-motion";
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination, TableFooter } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchTradeSummary } from '../../Redux/tradeSummarySlice';
import { setDashboardView } from '../../Redux/formTypeSlice';
import { useNavigate } from 'react-router-dom';

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


export const ClosedTrades = () => {
  const navigate = useNavigate()

  const dispatch = useDispatch();
  const [page, setpage] = useState(0);
  const [rowPerPage, setRowperPage] = useState(25);
  const { summary, loading, error } = useSelector((state) => state.tradeSummary);
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


  const refOne = React.useRef(null);
  const inViewOne = useInView(refOne, { triggerOnce: true });

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
        <div className="closed_table_wrapper">
          {/* <div className="mui_table"> */}
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
                {summary.slice(page * rowPerPage, (page + 1) * rowPerPage).map((item, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell component="th" scope="row">
                      {item.stock_symbol}
                    </StyledTableCell>
                    <StyledTableCell align="center">{item.entry_date}</StyledTableCell>
                    <StyledTableCell align="center">{item.exit_date}</StyledTableCell>
                    <StyledTableCell align="center">{item.avg_buying}</StyledTableCell>
                    <StyledTableCell align="center">{item.avg_selling}</StyledTableCell>
                    <StyledTableCell align="center">{item.quantity}</StyledTableCell>
                    <StyledTableCell align="center">{item.total_investment}</StyledTableCell>
                    <StyledTableCell align="center">{item.pl}</StyledTableCell>
                    <StyledTableCell align="center">{item.roi}%</StyledTableCell>
                    <StyledTableCell align="center">{item.win_loss}</StyledTableCell>

                  </StyledTableRow>

                ))}
              </TableBody>

            </Table>
          </TableContainer>
          {/* </div> */}

          <div className='close_trde_pagination'>
            <TablePagination
              component="div"
              count={summary.length}
              page={page}
              rowsPerPage={rowPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 20]}
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
