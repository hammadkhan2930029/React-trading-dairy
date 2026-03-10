import React, { useEffect, useState } from 'react';
import "./stockName.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import { motion, useInView } from "framer-motion";
import api from "../../../api/axios"; 
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Typography, Modal, TextField, Grid, TablePagination, MenuItem } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
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

export const StockName = () => {

    const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    const [searchTerm, setSearchTerm] = useState('');
    const [stocks, setStocks] = useState([]);
    const [open, setOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [formCreateData, setFormCreateData] = useState({
        symbol: '',
        name: '', 
        full_name: '',
        sector: '',
        sector_code: '',
        status: '',
        face_value: '',
    });

    const [formData, setFormData] = useState({
        id: null,
        symbol: '',
        name: '', 
        full_name: '',
        sector: '',
        sector_code: '',
        status: '',
        face_value: '',
    });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    useEffect(() => {
        api.get("/stocks/admin/view-list/")
            .then((res) => {
                setStocks(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
                console.error(err);
                setStocks([]);
            });
    }, []);

    const handleOpen = (item) => {

        setFormData({
            id: item.id, // Store the bonus's ID
            symbol: item.symbol,
            name: item.name,
            full_name: item.full_name,
            sector: item.sector,
            sector_code: item.sector_code,
            status: item.status,
            face_value: item.face_value,
        });

        setOpen(true);
    };

    const handleClose = () => setOpen(false);

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setFormCreateData(prev => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let newFormData = { ...formData, [name]: value };

        setFormData(newFormData);
    };

    const handleSubmitCreate = async (e) => {
        e.preventDefault();

        try {
            await api.post('/stocks/stocks/', {
                symbol: formCreateData.symbol.trim(),
                name: formCreateData.name.trim(),
                full_name: formCreateData.full_name.trim(),
                sector: formCreateData.sector.trim(),
                sector_code: Number(formCreateData.sector_code),
                face_value: Number(formCreateData.face_value),
            });

            setSnackbarMessage('Stock created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();

            setFormCreateData({
                symbol: '',
                name: '',
                full_name: '',
                sector: '',
                sector_code: '',
                face_value: '',
            });

            // Refresh stock list
            const res = await api.get("/stocks/admin/view-list/");
            setStocks(res.data);

        } catch (error) {
            console.error(error.response?.data || error);
            setSnackbarMessage('Something went wrong');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `/stocks/stocks/${formData.id}/`,
                {
                    symbol: formData.symbol.trim(),
                    name: formData.name.trim(),
                    full_name: formData.full_name.trim(),
                    sector: formData.sector.trim(),
                    sector_code: Number(formData.sector_code),
                    face_value: Number(formData.face_value),
                    status: formData.status,
                }
            );

            setSnackbarMessage('Stock updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();

            // Refresh stock list
            const res = await api.get("/stocks/admin/view-list/");
            setStocks(res.data);

        } catch (error) {
            console.error(error.response?.data || error);
            setSnackbarMessage('Something went wrong');
            setSnackbarSeverity('error');
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

    const filteredStocks = stocks.filter((item) => {
        const term = searchTerm.toLowerCase();

        return (
            item.symbol?.toLowerCase().includes(term) ||
            item.name?.toLowerCase().includes(term) ||
            item.full_name?.toLowerCase().includes(term) ||
            item.sector?.toLowerCase().includes(term) ||
            String(item.sector_code)?.includes(term) ||
            String(item.face_value)?.includes(term) ||
            (item.status === 1 ? 'active' : 'deactive').includes(term)
        );
    });

    const paginatedStocks = filteredStocks.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (

        <motion.div 
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}
        >
            
            <form onSubmit={handleSubmitCreate}>
                <div className='form-main-stock'>
                    <div>
                        <span className='heading'>Stocks</span>
                    </div>
                    <div >
                        <Box sx={{ '& .MuiTextField-root': { m: 2, width: isMobile ? '32ch': '60ch' } }}
                            autoComplete="off"
                            className='form'>
                            <div>
                                <TextField
                                    id="outlined-required"
                                    label="Symbol"
                                    type="text"
                                    placeholder="Symbol..."
                                    name='symbol'
                                    onChange={handleCreateChange}
                                    value={formCreateData.symbol}
                                />
                                <TextField
                                    id="outlined-required"
                                    label="Summary Name"
                                    type="text"
                                    placeholder="Summary Name..."
                                    name='name'
                                    onChange={handleCreateChange}
                                    value={formCreateData.name}
                                />
                                <TextField
                                    id="outlined-required"
                                    label="Full Name"
                                    type="text"
                                    placeholder="Full Name..."
                                    name='full_name'
                                    onChange={handleCreateChange}
                                    value={formCreateData.full_name}
                                />
                                <TextField
                                    id="outlined-required"
                                    label="Face Value"
                                    type="number"
                                    placeholder="Face Value..."
                                    name='face_value'
                                    onChange={handleCreateChange}
                                    value={formCreateData.face_value}
                                />
                                <TextField
                                    id="outlined-required"
                                    label="Sector"
                                    type="text"
                                    placeholder="Sector..."
                                    name='sector'
                                    onChange={handleCreateChange}
                                    value={formCreateData.sector}
                                />
                                <TextField
                                    id="outlined-required"
                                    label="Code"
                                    type="number"
                                    placeholder="Code..."
                                    name='sector_code'
                                    onChange={handleCreateChange}
                                    value={formCreateData.sector_code}
                                />
                            </div>
                        </Box>
                    </div>

                    <Box sx={{ '& > :not(style)': { m: 1 } }}>
                        <Fab variant="extended" color="primary" type="submit">
                            <SendIcon sx={{ mr: 1.5 }} />
                            Submit
                        </Fab>
                    </Box>

                </div>
            </form>


            <div className="stocks_list_container">
                <div className="stocks_list">
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
                    <div>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 700 }} aria-label="bonus table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>#</StyledTableCell>
                                        <StyledTableCell>Symbol</StyledTableCell>
                                        <StyledTableCell>Summary Name</StyledTableCell>
                                        <StyledTableCell>Full Name</StyledTableCell>
                                        <StyledTableCell>Face Value</StyledTableCell>
                                        <StyledTableCell>Sector</StyledTableCell>
                                        <StyledTableCell>Code</StyledTableCell>
                                        <StyledTableCell>Status</StyledTableCell>
                                        <StyledTableCell>Actions</StyledTableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedStocks.map((item, index) => {
                                        return (
                                            <StyledTableRow key={item.id || index}>
                                                <StyledTableCell>{index + 1}</StyledTableCell>
                                                <StyledTableCell>{item.symbol}</StyledTableCell>
                                                <StyledTableCell>{item.name}</StyledTableCell>
                                                <StyledTableCell>{item.full_name}</StyledTableCell>
                                                <StyledTableCell>{item.face_value}</StyledTableCell>
                                                <StyledTableCell>{item.sector}</StyledTableCell>
                                                <StyledTableCell>{item.sector_code}</StyledTableCell>
                                                <StyledTableCell>{item.status === 1 ? 'Active' : 'Deactive'}</StyledTableCell>
                                                <StyledTableCell>
                                                    <button className="editebtn" type="button" onClick={() => handleOpen(item)}>
                                                        Edit
                                                    </button>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        );
                                    })}

                                    {stocks.length === 0 && (
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
                        count={stocks.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[25, 50, 100]}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />

                    <Modal open={open} onClose={handleClose}>
                        <Box className='stock_model_edit'>
                            <Typography variant="h6">Edit Stock Details</Typography>
                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Symbol" name="symbol" type="text" value={formData.symbol} onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Summary Name" name="name" type="text" value={formData.name} onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Full Name" name="full_name" type="text" value={formData.full_name} onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Face Value" name="face_value" type="text" value={formData.face_value} onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Sector" name="sector" type="text" value={formData.sector} onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <TextField fullWidth label="Code" name="sector_code" type="text" value={formData.sector_code} onChange={handleChange} required />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField fullWidth select label="Status" name="status" value={formData.status} onChange={handleChange} required >
                                            <MenuItem value={1}>Active</MenuItem>
                                            <MenuItem value={0}>Deactive</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
                                <Box mt={2} display="flex" justifyContent="space-between">
                                    <Button type="submit" variant="contained" color="primary">Update</Button>
                                    <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                                </Box>
                            </form>
                        </Box>
                    </Modal>
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
