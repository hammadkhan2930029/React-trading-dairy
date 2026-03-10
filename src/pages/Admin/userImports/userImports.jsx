import React, { useEffect, useState } from 'react';
import "./userImports.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import { motion, useInView } from "framer-motion";
import api from "../../../api/axios"; 
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Swal from 'sweetalert2';
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
        fontWeight: 'bold',
        fontSize: 16

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

export const UserImports = () => {

    const STATUS_MAP = {
        0: 'Pending',
        1: 'Processing',
        2: 'Completed',
        3: 'Failed',
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';

        const date = new Date(dateStr.replace(' ', 'T'));
        return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    const [searchTerm, setSearchTerm] = useState('');
    const [userImports, setUserImports] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        api.get("/userimports/admin/view-list/")
            .then((res) => {
                setUserImports(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error(err);
                setUserImports([]);
            });
    }, []);

    const handleStatusButton = async (id, newStatus) => {
        const statusText = newStatus === 1 ? "Processing" : "Complete";

        const result = await Swal.fire({
            title: `Are you sure?`,
            text: `Change status to "${statusText}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, update it!',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            await api.put(`/userimports/admin/view-list/${id}/`, { status: newStatus });

            setSnackbarMessage("Status updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            // Update local state immediately
            setUserImports(prev =>
                prev.map(item =>
                    item.id === id ? { ...item, status: newStatus } : item
                )
            );

        } catch (error) {
            console.error(error.response?.data || error);
            setSnackbarMessage("Failed to update status");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredUserImports = userImports.filter(item =>
        item.user_detail?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUserImports = filteredUserImports.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (

        <motion.div 
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}
        >
            
            <div className='form-main-stock'>
                <div>
                    <span className='heading'>User Imports</span>
                </div>
            </div>

            <div className="stocks_list_container">
                <div className="stocks_list">
                    <div className="ex_charges_search_div">
                        <TextField
                            placeholder="Search..."
                            label='Search User'
                            className="searchInput"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setPage(0); // reset to first page when searching
                            }} />
                        <div className="ex_charges_search_icon">
                            <span> Search</span>
                            <SearchIcon sx={{ fontSize: '32px', color: '#fff' }} />
                        </div>
                    </div>
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="bonus table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>#</StyledTableCell>
                                        <StyledTableCell>User</StyledTableCell>
                                        <StyledTableCell>Broker</StyledTableCell>
                                        <StyledTableCell>File</StyledTableCell>
                                        <StyledTableCell>Date</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Actions</StyledTableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedUserImports.map((item, index) => {
                                        return (
                                            <StyledTableRow key={item.id || index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>{item.user_detail?.name}</StyledTableCell>
                                                <StyledTableCell>{item.broker_detail?.broker_name}</StyledTableCell>
                                                <StyledTableCell>
                                                    {item.import_file && (
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => window.open(item.import_file, "_blank")}
                                                            title="View File"
                                                        >
                                                            <VisibilityIcon />
                                                        </button>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell>{formatDate(item.created_at)}</StyledTableCell>
                                                <StyledTableCell>{STATUS_MAP[item.status]}</StyledTableCell>
                                                <StyledTableCell>
                                                    {item.status === 0 && (
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            size="small"
                                                            onClick={() => handleStatusButton(item.id, 1)}
                                                        >
                                                            Processing
                                                        </Button>
                                                    )}
                                                    {item.status === 1 && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            onClick={() => handleStatusButton(item.id, 2)}
                                                        >
                                                            Complete
                                                        </Button>
                                                    )}
                                                    {item.status === 2 && (
                                                        <Button
                                                            variant="contained"
                                                            color="success"
                                                            size="small"
                                                            disabled
                                                        >
                                                            Imported
                                                        </Button>
                                                    )}
                                                </StyledTableCell>

                                            </StyledTableRow>
                                        );
                                    })}

                                    {userImports.length === 0 && (
                                        <StyledTableRow>
                                            <StyledTableCell colSpan={7} align="center" style={{ padding: "20px" }}>
                                                No data available.
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>

                    <TablePagination
                        component="div"
                        count={userImports.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[25, 50, 100]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <MuiAlert
                            onClose={() => setSnackbarOpen(false)}
                            severity={snackbarSeverity}
                            sx={{
                                width: '100%',
                                backgroundColor: 'rgba(15, 134, 231, 0.94)',
                                color: '#fff',

                            }}
                            elevation={6}
                            variant="filled"
                        >
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>

                </div>
            </div>
            
        </motion.div>

    )
}
