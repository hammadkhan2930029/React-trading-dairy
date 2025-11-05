import React, { useState } from 'react';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import './summaryDetailsPage.css';
import { motion, useInView } from "framer-motion";
import { TablePagination, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setBackToSummary } from '../../../../Redux/summarySlice.js';
import withSkeleton from "../../../../../component/Skeletons/withSkeleton.jsx";
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

export const SummaryDetailsPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const selectedSummary = useSelector(state => state.summary.selectedSummary) || [];
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = selectedSummary.filter(item =>
        item.scrip.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // animation
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    // Note: rowPerPage should be based on the data, or a fixed value, not the entire summary data
    const [rowPerPage, setRowperPage] = useState(1);
    console.log('summary details :', filteredData)

    return (
        <div className='summary_details_page_main'>
            <button className='backBtn' onClick={() => {
                navigate(-1)
            }}>
                Back
            </button>
            <motion.div className='summary_details_page'
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: .8 }}>

                <div className='search_main'>
                    <div className="search_div">
                        <input
                            placeholder="Search by Scrip..."
                            className="search_input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon
                            style={{ cursor: "pointer" }}
                        />
                    </div>
                </div>

                <div className='overview_heading_index_div'>
                    <ShowChartIcon sx={{color:'#1976d2',fontSize:'34px'}} />
                    <span className='overview_heading'>Market Summary Details</span>
                </div>

                <div className="market_table_container_summary">

                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Date</StyledTableCell>
                                    <StyledTableCell>Scrip</StyledTableCell>
                                    <StyledTableCell>Ldcp</StyledTableCell>
                                    <StyledTableCell>High</StyledTableCell>
                                    <StyledTableCell>Low</StyledTableCell>
                                    <StyledTableCell>Current</StyledTableCell>
                                    <StyledTableCell>Change</StyledTableCell>
                                    <StyledTableCell>Volume</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                
                                {filteredData.map((item, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell component="th" scope="row">{item.date}</StyledTableCell>
                                        <StyledTableCell>{item.scrip}</StyledTableCell>
                                        <StyledTableCell>{item.ldcp}</StyledTableCell>
                                        <StyledTableCell>{item.high}</StyledTableCell>
                                        <StyledTableCell>{item.low}</StyledTableCell>
                                        <StyledTableCell>{item.current}</StyledTableCell>
                                        <StyledTableCell>{item.change}</StyledTableCell>
                                        <StyledTableCell>{item.volume}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>

                        </Table>
                    </TableContainer>

                   
                </div>
            </motion.div>
        </div>
    );
};
export default withSkeleton(SummaryDetailsPage, 'summary');