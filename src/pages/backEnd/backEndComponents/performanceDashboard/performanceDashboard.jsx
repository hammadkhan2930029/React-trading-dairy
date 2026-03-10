import * as React from 'react';
import  { useEffect, useState} from 'react';
import './performanceDashboard.css';
import { Card_1 } from './card_1/card_1';
import { Card_2 } from './card_2/card_2';
import { Card_2_2 } from './card_2/card_2_2';
import { Card_2_3 } from './card_2/card_2_3';
import Card_3 from './card_3/card_3';
import Card_4 from './card_4/card_4';
import { motion, useInView } from "framer-motion"; 
import { useSelector, useDispatch } from "react-redux";
import { TablePagination, Tabs, Tab, Box } from '@mui/material';
import api from '../../../../api/axios';
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

export const PerformanceDashboard = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);

    const dispatch = useDispatch();
    const [page, setpage] = useState(0);
    const [rowPerPage, setRowperPage] = useState(25);
    const [rulesData, setRulesData] = useState();
    const [plRoiData, setPlRoiData] = useState();
    const [rulesFollowedData, setRulesFollowedData] = useState([]);
    const [fullRules, setFullRules] = useState([]);
    const [partialRules, setPartialRules] = useState([]);
    const [noRules, setNoRules] = useState([]);
    const [tabValue, setTabValue] = useState(0);

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

    useEffect(() => {
        fetchRulesData();
        fetchPLROI();
        fetchRulesFollowedData();
    }, []);

    const fetchRulesData = async () => {
        const res = await api.get("stocks/rules/performance/");
        setRulesData(res.data);
    };

    const fetchPLROI = async () => {
        const res = await api.get("stocks/rules/performance/pl-roi/");
        setPlRoiData(res.data);
    };

    const fetchRulesFollowedData = async () => {
        const res = await api.get("stocks/rules/followed/");
        setRulesFollowedData(res.data.full_rules);
        setFullRules(res.data.full_rules);
        setPartialRules(res.data.partial_rules);
        setNoRules(res.data.no_rules);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const extractDate = (dateStr) => {
        if (!dateStr) return null;
        return dateStr.split(' ')[0]; 
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Decide which data to show based on tab
    const getCurrentTabData = () => {
        if (tabValue === 0) return fullRules;
        if (tabValue === 1) return partialRules;
        if (tabValue === 2) return noRules;
        return [];
    };

    const paginatedTabData = getCurrentTabData().slice(page * rowPerPage, (page + 1) * rowPerPage);

    const paginatedRulesFollowed = rulesFollowedData.slice(page * rowPerPage, (page + 1) * rowPerPage);
   
    return (
        <div className='dashboard_main_pd'>
            <div className='heading_div_buy'>
                <span className='heading'>Performance</span>
            </div>
            {/* ------------------------------------------Larg card----------------------------------------------- */}
            <div className="larg_cards_pd">
                <div className="larg_cards_data_pd">
                    <Card_4 data={rulesData} />
                </div>
               <div className="larg_cards_data_pd">
                    <Card_3 data={rulesData} />
                </div>
                <div className="larg_cards_data_pd_tri">
                    <Card_2 data={plRoiData} />
                </div>
                <div className="larg_cards_data_pd_tri">
                    <Card_2_2 data={plRoiData} />
                </div>
                <div className="larg_cards_data_pd_tri">
                    <Card_2_3 data={plRoiData} />
                </div>
                {/* <div className="larg_cards_data_pd">
                    <Card_1 />
                </div> */}
            </div>

            <motion.div
                className='pd_rules_table'
                ref={refOne}
                initial={{ opacity: 0, y: -100 }}
                animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8 }}
            >
                <Box sx={{ width: '100%' }}>
                    {/* Tabs Header */}
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="standard"
                        sx={{
                            width: "100%",
                            '& .MuiTabs-flexContainer': {
                                flexWrap: 'wrap',   // 🔥 allow wrapping
                                justifyContent: 'center'
                            }
                        }}
                    >
                        <Tab label="Full Rules Followed" sx={{ flex: '1 1 auto' }} />
                        <Tab label="Partial Rules Followed" sx={{ flex: '1 1 auto' }} />
                        <Tab label="No Rules Followed" sx={{ flex: '1 1 auto' }} />
                    </Tabs>

                    {/* Tab Panels */}
                    <Box sx={{ marginTop: 2 }}>
                        <div className="rule_base_trade">
                            <div className="closed_table_wrapper">
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650, tableLayout: "auto" }} aria-label="customized table">
                                        <TableHead>
                                            <TableRow>
                                                <StyledTableCell>Scrip</StyledTableCell>
                                                <StyledTableCell align="center">Holding Duration</StyledTableCell>
                                                <StyledTableCell align="center">Quantity</StyledTableCell>
                                                <StyledTableCell align="center">Buying Total</StyledTableCell>
                                                <StyledTableCell align="center">Selling Total</StyledTableCell>
                                                {tabValue === 1 && (
                                                    <StyledTableCell align="center">
                                                        Rules Followed
                                                    </StyledTableCell>
                                                )}
                                                <StyledTableCell align="center">P/L</StyledTableCell>
                                                <StyledTableCell align="center">ROI</StyledTableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {paginatedTabData.map((item, index) => (
                                                <StyledTableRow key={index}>
                                                    <StyledTableCell component="th" scope="row">
                                                        {item.stock_symbol}
                                                    </StyledTableCell>
                                                    <StyledTableCell align="center">{item.holding_days} Days</StyledTableCell>
                                                    <StyledTableCell align="center">{item.quantity}</StyledTableCell>
                                                    <StyledTableCell align="center">{item.total_investment}</StyledTableCell>
                                                    <StyledTableCell align="center">{item.avg_selling}</StyledTableCell>
                                                    {tabValue === 1 && (
                                                        <StyledTableCell align="center">
                                                            {item.rules_followed}/{item.rules_total}
                                                        </StyledTableCell>
                                                    )}
                                                    <StyledTableCell align="center">{item.pl}</StyledTableCell>
                                                    <StyledTableCell align="center">{item.roi}%</StyledTableCell>
                                                </StyledTableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <div className='close_trde_pagination'>
                                    <TablePagination
                                        component="div"
                                        count={getCurrentTabData().length}
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
                    </Box>
                </Box>
            </motion.div>

            
        </div>
    )
}
