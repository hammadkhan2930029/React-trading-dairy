import React from "react";
import './verifiedUsers.css';
import { fetchVerifiedUsers, fetchRegisteredUsers } from '../Redux/userListTypeslice';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
// =========================================================
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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

export const VerifiedUsers = () => {

    const dispatch = useDispatch()
    const { verifiedUsers, registeredUsers, loading, error } = useSelector((state) => state.userType);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {            
        dispatch(fetchVerifiedUsers());
        dispatch(fetchRegisteredUsers());
    }, [dispatch]);

    const allUsers = [
        ...verifiedUsers.map((u) => ({ ...u, status: "Verified" })),
        ...registeredUsers.map((u) => ({ ...u, status: u.is_active ? "Verified" : "Pending" })),
    ];

    const filteredUsers = allUsers.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = filteredUsers.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (

        <div className="verified_user_container">
            <h2>Users</h2>
            <div className="verified_user">
                <div className="ex_charges_search_div">
                    <TextField
                        placeholder="Search..."
                        label='Search Stock'
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
                <div className="mobile-table-scroll">
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="users table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Name</StyledTableCell>
                                    <StyledTableCell>Email</StyledTableCell>
                                    <StyledTableCell>Mobile</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedUsers.map((item) => {
                                    return (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell>{item.name}</StyledTableCell>
                                            <StyledTableCell>{item.email}</StyledTableCell>
                                            <StyledTableCell>{item.number}</StyledTableCell>
                                            <StyledTableCell
                                                style={{
                                                    color:
                                                    item.status === "Verified"
                                                        ? "green"
                                                        : item.status === "Pending"
                                                        ? "blue"
                                                        : "red",
                                                    fontWeight: "bold",
                                                }}
                                            >{item.status}</StyledTableCell>                                            
                                        </StyledTableRow>
                                    );
                                })}

                                {paginatedUsers.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={6} align="center" style={{ padding: "20px" }}>
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
                    count={filteredUsers.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[25, 50, 100]}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            </div>
        </div>

    )
}