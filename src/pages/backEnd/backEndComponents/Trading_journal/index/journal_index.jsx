import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import './journal_index.css';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    fetchTradingJournal, setTradingJournal_from, setTradingJournal_View, getTradingJournalById,
    setTradingJournal_EditForm, selectAllTradingJournal, setSelectedJournalId
} from "../../../Redux/tradingJournalSlice";
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { setJournal_from } from '../../../Redux/tradingJournalSlice';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, CircularProgress, Typography, Box, TextField, InputAdornment, TablePagination
} from '@mui/material';
import { fetchStocks, selectAllStocks } from "../../../Redux/stockSlice"; // ⭐ Import stock actions/selectors ⭐
import { useMemo } from "react";

export const JournalIndex = () => {

    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);
    const dispatch = useDispatch();
    const allStocks = useSelector(selectAllStocks);
    const tradingJournals = useSelector(selectAllTradingJournal);
    const loading = useSelector(state => state.tradingJournal.loading);
    const error = useSelector(state => state.tradingJournal.error);
    const formType = useSelector(state => state.tradingJournal.formType);
    const [searchTerm, setSearchTerm] = useState('');


    useEffect(() => {
        dispatch(fetchTradingJournal());
        if (allStocks.length === 0) {
            dispatch(fetchStocks());
        }
    }, [dispatch]);

    const stockIdToNameMap = useMemo(() => {

        const map = {};
        allStocks.forEach(stock => {
            map[stock.id] = stock.name;
        });
        return map;
    }, [allStocks]);

    const getStockName = (stockId) => {
        return stockIdToNameMap[stockId] || `ID: ${stockId} (Unknown)`;
    };
    const handleEditClick = (id) => {
        dispatch(getTradingJournalById(id));
        dispatch(setSelectedJournalId(id));
        navigate('/Trding-journal/edit')
        // dispatch(setTradingJournal_EditForm());
    };


    const handleViewClick = (id) => {
        dispatch(getTradingJournalById(id));
        dispatch(setSelectedJournalId(id));
        // dispatch(setTradingJournal_View());
        navigate('/Trding-journal/view')

    };

    const handleAddClick = () => {
        dispatch(setSelectedJournalId(null));
        dispatch(setTradingJournal_from());
    };

    const refOne = useRef(null);
    const refTwo = useRef(null);

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

    const [selectType, setSelectedType] = useState(3)

    const filteredJournals = tradingJournals.filter(journal =>
        journal.stock && getStockName(journal.stock).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedData = filteredJournals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const Edit_JournalForm = () => <div>Edit Journal Form Placeholder</div>;
    const JournalForm = () => <div>Add Journal Form Placeholder</div>;

    if (formType === 8) {
        return <Edit_JournalForm />;
    }
    if (formType === 7) {
        return <Edit_JournalForm />;
    }
    if (formType === 6) {
        return <JournalForm />;
    }

    if (loading === 'pending') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
                <Typography sx={{ ml: 2 }}>Loading trading journals...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="error" variant="h6">Error loading journals:</Typography>
                <Typography color="error">{error.message || "An unknown error occurred."}</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={() => dispatch(fetchTradingJournal())}>
                    Retry Fetch
                </Button>
            </Box>
        );
    }

    return (
        <motion.div
            ref={refOne}
            initial={{ opacity: 0, x: -100 }}
            animate={inViewOne ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="index_crud"
        >
            <div className="index_crud_main">
                <div className="index_top_input_fields">
                    <div className="index_top_btn" onClick={()=> navigate('/Trding-journal/form')}>
                        <button className="index_top_btn_buy">Add </button>
                    </div>

                    <div className="index_search_div">
                        <input
                            placeholder="Search Stock Name"
                            className="index_search_input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <SearchIcon />
                    </div>
                </div>

                <div className="index_table_wrapper">
                    <Table sx={{ minWidth: 650 }} aria-label="trading journal table">
                        <TableHead>
                            <TableRow>
                                <TableCell>STOCK NAME</TableCell>
                                <TableCell>ENTRY DATE</TableCell>
                                <TableCell align="right">NO. OF SHARES</TableCell>
                                <TableCell align="right">ENTRY PRICE</TableCell>
                                <TableCell align="center">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.length > 0 ? (
                                paginatedData.map((journal) => (
                                    <TableRow
                                        key={journal._id || journal.id} // Ensure you use 'id' if '_id' is not present
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {getStockName(journal.stock)}
                                        </TableCell>
                                        <TableCell>
                                            {/* ⭐ USE journal.entry_date ⭐ */}
                                            {journal.entry_date}
                                        </TableCell>
                                        <TableCell align="right">
                                            {/* ⭐ USE journal.no_of_shares ⭐ */}
                                            {journal.no_of_shares || 'N/A'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {/* ⭐ USE journal.entry_price ⭐ */}
                                            {parseFloat(journal.entry_price).toFixed(2) || 'N/A'}
                                        </TableCell>
                                        <TableCell  className="tableCellBTN">

                                            <button className="journal_index_edit_btn" onClick={() => handleEditClick(journal._id || journal.id)}>
                                                <EditIcon sx={{color:'#fff' ,fontSize:'14px'}}/>
                                                Edit
                                            </button>
                                            <button className="journal_index_view_btn"  onClick={() => handleViewClick(journal._id || journal.id)} >
                                                <VisibilityIcon sx={{color:'#1976d2' ,fontSize:'14px'}}/>
                                                View
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        No trading journal entries found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <TablePagination
                    component="div"
                    count={filteredJournals.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[5, 10, 20, 25]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </div>
        </motion.div>
    );
};