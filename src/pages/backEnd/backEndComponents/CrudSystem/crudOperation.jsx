import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
// import sty'./crudOperation.css';
import styles from './crud.module.css'
import Box from '@mui/material/Box';
import {
    Button,
    TextField,
    InputLabel,
    MenuItem,
    FormControl,
    Select
} from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBuyForm, setSellForm, reset } from "../../Redux/formTypeSlice";
import TablePagination from "@mui/material/TablePagination";
import SearchIcon from '@mui/icons-material/Search';
import { fetchTrades, selectAllTrades, updateTrade } from "../../Redux/stockSlice";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import api from '../../../../api/axios';
import { fetchUserHoldings } from '../../Redux/userHoldingSlice';

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

const buydata = [];
const selldata = [];
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

const CrudOperation = () => {

    const trades = useSelector(selectAllTrades);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTrade, setSelectedTrade] = useState(null)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 430);
    // -----------------------------------Redux------------------------------------------------------
    const dispatch = useDispatch();
    // -----------------------------------modal------------------------------------------------------
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [select, setSelect] = useState('');
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [searchScript, setSearchScript] = useState('');
    const [modalTitle, setModalTitle] = useState('Enter Stock Details');
    const [maxSellQuantity, setMaxSellQuantity] = useState(null);
    const { holdings, loading } = useSelector((state) => state.userHolding);



    useEffect(() => {
        dispatch(fetchUserHoldings());

    }, [dispatch]);


    const [formData, setFormData] = useState({

        stock_id: '',
        broker_id: 2,
        trade_type: "BUY",
        stockName: '',
        sett_date: '',
        trade_date: '',
        broker_name: '',
        buy_QTY: 0,
        buy_rate: 0,
        buy_amount: 0,
        buy_broker_amount: 0,
        buy_cdc_amount: 0,
        buy_sst_amount: 0,
        buy_net_amount: 0,
        avg_buying: 0,

    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedForm = { ...formData, [name]: value };

        // Safely parse numbers
        let qty = parseFloat(name === "buy_QTY" ? value : formData.buy_QTY) || 0;
        let rate = parseFloat(name === "buy_rate" ? value : formData.buy_rate) || 0;
        let broker = parseFloat(name === "buy_broker_amount" ? value : formData.buy_broker_amount) || 0;
        let cdc = parseFloat(name === "buy_cdc_amount" ? value : formData.buy_cdc_amount) || 0;
        let sst = parseFloat(name === "buy_sst_amount" ? value : formData.buy_sst_amount) || 0;

        if (name === "buy_QTY" || name === "buy_rate" || name === "buy_broker_amount" || name === "buy_cdc_amount" || name === "buy_sst_amount") {
            let amount = qty * rate;
            let net = amount + broker + cdc + sst;
            updatedForm.buy_amount = amount.toFixed(2);
            updatedForm.buy_net_amount = net.toFixed(2);
            updatedForm.avg_buying = qty > 0 ? (net / qty).toFixed(2) : 0;
        }
        if (name === "buy_QTY" && updatedForm.trade_type === "SELL" && updatedForm.holding_quantity !== null) {
            if (qty > updatedForm.holding_quantity) {
                // If this logic is running, it might override the arrow-key update.
                updatedForm.buy_QTY = updatedForm.holding_quantity;
            }
        }



        setFormData(updatedForm);
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
            stock_id: formData.stock_id,
            broker_id: formData.broker_id || 1,
            trade_type: formData.trade_type,
            trade_date: formData.trade_date,
            quantity: formData.buy_QTY || 0,
            rate: formData.buy_rate,
            amount: formData.buy_amount,
            broker_commission: formData.buy_broker_amount,
            cdc_amount: formData.buy_cdc_amount,
            sst_amount: formData.buy_sst_amount,
            net_amount: formData.buy_net_amount,
            avg_buying: formData.avg_buying,
        };

        try {
            await dispatch(updateTrade({ id: selectedTrade.id, updatedData }));
            await dispatch(fetchTrades());
            setSnackbarMessage("Data updated successfully!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setOpen(false);
            setSelectedTrade(null);
            setFormData({  // Reset form
                stock_id: '',
                broker_id: '',
                trade_type: "BUY",
                stockName: '',
                sett_date: '',
                trade_date: '',
                broker_name: '',
                buy_QTY: 0,
                buy_rate: 0,
                buy_amount: 0,
                buy_broker_amount: 0,
                buy_cdc_amount: 0,
                buy_sst_amount: 0,
                buy_net_amount: 0,
                avg_buying: 0,
            });

        } catch (err) {
            console.error("Update failed:", err);
            setSnackbarMessage(`Update failed: ${err.message || JSON.stringify(err.data || err)}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const calculateHoldingForEdit = (tradeToEdit) => {
        // 1. Get all trades for the same stock and cycle
        const relatedTrades = trades.filter(
            (t) =>
                t.stock?.id === tradeToEdit.stock?.id &&
                t.cycle_id === tradeToEdit.cycle_id
        );

        let currentHolding = 0;
        relatedTrades.forEach(trade => {
            // 2. Sum up quantities, ignoring the trade being edited
            if (trade.id !== tradeToEdit.id) {
                if (trade.trade_type === "BUY") {
                    currentHolding += trade.quantity;
                } else if (trade.trade_type === "SELL") {
                    currentHolding -= trade.quantity;
                }
            }
        });
        const maxQty = currentHolding + tradeToEdit.quantity;
        // Safety check: maxQty shouldn't be negative, but it's essential for the user.
        return Math.max(0, maxQty);
    };

    const handleOpen = async (item) => {


        const type = item.trade_type;
        const selectedHolding = holdings.find(
            (holding) => holding.stock_id === item.stock?.id
        );
        const holdingQty = selectedHolding?.holding_quantity || 0;
        let formQty = item.quantity;

        if (type === "BUY") {
            setModalTitle("Edit Buy Details");
        } else if (type === "SELL") {
            formQty = holdingQty;
            setMaxSellQuantity(holdingQty);
            setModalTitle("Edit Sell Details");

        }
        setSelectedTrade(item);
        setFormData({
            stock_id: item.stock?.id || '',
            broker_id: item.broker?.id || '',
            trade_type: item.trade_type || "BUY",
            stockName: item.stock?.name || '',
            sett_date: item.settlement_date || '',
            trade_date: item.trade_date || '',
            broker_name: item.broker?.name || '',
            buy_QTY: item.quantity || 0,
            buy_rate: item.rate || 0,
            buy_amount: item.amount || 0,
            buy_broker_amount: item.broker_commission || 0,
            buy_cdc_amount: item.cdc_amount || 0,
            buy_sst_amount: item.sst_amount || 0,
            buy_net_amount: item.net_amount || 0,
            avg_buying: item.avg_buying || 0,

        });

        setOpen(true);
    };


    // --------------------------------------------------------------------------------------------
    const refOne = useRef(null);
    const refTwo = useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    const inViewTwo = useInView(refTwo, { triggerOnce: true });
    // ----------------------------------------------------------------------------------------------
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditClick = (trade) => {
        setSelectedTrade(trade);
    };
    const handleChange1 = (event) => setSelect(event.target.value);


    // -------------------------filter----------------------------------------------------------------
    const [selectType, setSelectedType] = useState(3)
    console.log('select type', selectType)
    //------------------------------------------------------------------------------------------------

    const mergedData = [...buydata, ...selldata]; // Combine buy & sell data    


    //------------------------------Load trades on component mount------------------------------------

    useEffect(() => {
        dispatch(fetchTrades());

    }, [dispatch]);
    console.log("Redux Trades:", trades);

    const handleSearchClick = () => {
        setPage(0); // jump back to page 1 on search
    };

    // ------------------------------Filtering and pagination (Corrected Logic) ----------------------------------------
    let filteredData = trades;

    // 1. Filter by 'Type' (Buy/Sell/All)
    if (Array.isArray(trades)) {
        if (selectType === '1') {
            filteredData = trades.filter((trade) => trade.trade_type === "BUY");
        } else if (selectType === '2') {
            filteredData = trades.filter((trade) => trade.trade_type === "SELL");
        } else {
            // If 'All Data' is selected, no filtering by type is needed.
            filteredData = trades;
        }
    }

    // 2. Filter the result by the search term (This block was moved inside the button click)
    // Now, let's re-integrate this logic to be part of a single, coherent filter chain.
    if (select === 'Script' && searchScript) {
        filteredData = filteredData.filter((trade) =>
            (trade.stock?.name || "").toLowerCase().includes(searchScript.toLowerCase())
        );
    } else if (select === 'Date' && dateRange.from && dateRange.to) {
        filteredData = filteredData.filter((trade) => {
            const tradeDate = new Date(trade.trade_date);
            const fromDate = new Date(dateRange.from);
            const toDate = new Date(dateRange.to);
            return tradeDate >= fromDate && tradeDate <= toDate;
        });
    }

    const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    const navigate = useNavigate()
    //------------------------------------------------------------------------------------------------
    return (
        <motion.div
            ref={refOne}
            initial={{ opacity: 0, x: -100 }}
            animate={inViewOne ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className={styles.crud}
        >
            <div className={styles.crud_main}>
                <div className={styles.top_input_fields}>
                    <div className={styles.top_btn}>
                        <button className={styles.top_btn_buy} onClick={() => navigate('/buyForm')}>
                            Buy
                        </button>
                        <button className={styles.top_btn_buy} onClick={() => navigate('/sellForm')}>
                            Sell
                        </button>
                    </div>

                    <div className={styles.search_div}>
                        <input placeholder="Search Stock Name" className={styles.search_input} />
                        <SearchIcon />
                    </div>

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
                                    <StyledTableCell>Type</StyledTableCell>
                                    <StyledTableCell align="center">Stock Name</StyledTableCell>
                                    <StyledTableCell align="center">Trade Date</StyledTableCell>
                                    <StyledTableCell align="center">QTY</StyledTableCell>
                                    <StyledTableCell align="center">Rate</StyledTableCell>
                                    <StyledTableCell align="center">Amount</StyledTableCell>
                                    <StyledTableCell align="center">Broker Amount</StyledTableCell>
                                    <StyledTableCell align="center">CDC Amount</StyledTableCell>
                                    <StyledTableCell align="center">SST Amount</StyledTableCell>

                                    <StyledTableCell align="center">AVG BUYING</StyledTableCell>
                                    <StyledTableCell align="center">Actions</StyledTableCell>


                                </TableRow>


                            </TableHead>
                            <TableBody>
                                {paginatedData.map((item, index) => (
                                    <StyledTableRow key={index}>
                                        <StyledTableCell component="th" scope="row">{item.trade_type}</StyledTableCell>
                                        <StyledTableCell align="center">{item.stock?.name}</StyledTableCell>
                                        <StyledTableCell align="center">{item.trade_date}</StyledTableCell>
                                        <StyledTableCell align="center">{item.quantity}</StyledTableCell>
                                        <StyledTableCell align="center">{item.rate}</StyledTableCell>
                                        <StyledTableCell align="center">{item.amount}</StyledTableCell>
                                        <StyledTableCell align="center">{item.broker_commission}</StyledTableCell>
                                        <StyledTableCell align="center">{item.cdc_amount}</StyledTableCell>
                                        <StyledTableCell align="center">{item.sst_amount}</StyledTableCell>
                                        <StyledTableCell align="center">{item.avg_buying}</StyledTableCell>
                                        <StyledTableCell>
                                            <button className={styles.editebtn} onClick={() => handleOpen(item)}>
                                                Edit
                                            </button>
                                            <div>

                                                <Modal open={open} onClose={handleClose}

                                                    BackdropProps={{
                                                        style: {
                                                            backgroundColor: 'rgba(131, 131, 131, 0)',
                                                            backdropFilter: 'blur(2px)',
                                                        },
                                                    }}
                                                >
                                                    <Box sx={style}>
                                                        <Typography variant="h6" component="h2" gutterBottom>
                                                            {modalTitle}
                                                        </Typography>
                                                        <form onSubmit={handleSubmit}>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Stock Name"
                                                                        name="stockName"
                                                                        value={formData.stockName}
                                                                        onChange={handleChange}
                                                                        slotProps={{
                                                                            input: {
                                                                                readOnly: true,
                                                                            },
                                                                        }}
                                                                        required
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        type="date"
                                                                        label="Trade Date"
                                                                        name="trade_date"
                                                                        value={formData.trade_date}
                                                                        onChange={handleChange}
                                                                        InputLabelProps={{ shrink: true }}
                                                                        slotProps={{
                                                                            input: {
                                                                                readOnly: true,
                                                                            },
                                                                        }}
                                                                        required
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Quantity"
                                                                        name="buy_QTY"
                                                                        type="number"
                                                                        InputProps={{
                                                                            inputProps: { step: 1, min: 0, max: maxSellQuantity },
                                                                        }}
                                                                        value={formData.buy_QTY}
                                                                        onChange={handleChange}
                                                                        required
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Rate"
                                                                        name="buy_rate"
                                                                        type="number"
                                                                        value={formData.buy_rate}
                                                                        onChange={handleChange}
                                                                        inputProps={{ step: 0.01, min: 0 }}
                                                                        required
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Amount"
                                                                        name="buy_amount"
                                                                        type="number"
                                                                        value={formData.buy_amount}
                                                                        onChange={handleChange}
                                                                        InputProps={{ readOnly: true }}
                                                                        required
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Broker Amount"
                                                                        name="buy_broker_amount"
                                                                        type="number"
                                                                        value={formData.buy_broker_amount}
                                                                        onChange={handleChange}
                                                                        inputProps={{ step: 0.01, min: 0 }}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="CDC Amount"
                                                                        name="buy_cdc_amount"
                                                                        type="number"
                                                                        value={formData.buy_cdc_amount}
                                                                        onChange={handleChange}
                                                                        inputProps={{ step: 0.01, min: 0 }}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="SST Amount"
                                                                        name="buy_sst_amount"
                                                                        type="number"
                                                                        value={formData.buy_sst_amount}
                                                                        onChange={handleChange}
                                                                        inputProps={{ step: 0.01, min: 0 }}
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={6}>
                                                                    <TextField
                                                                        fullWidth
                                                                        label="Avg Buying"
                                                                        name="avg_buying"
                                                                        type="number"
                                                                        value={formData.avg_buying}
                                                                        onChange={handleChange}
                                                                        InputProps={{ readOnly: true }}
                                                                        required
                                                                    />
                                                                </Grid>
                                                            </Grid>

                                                            <Box mt={2} display="flex" justifyContent="space-between">
                                                                <Button type="submit" variant="contained" color="primary">
                                                                    Submit
                                                                </Button>
                                                                <Button variant="outlined" color="secondary" onClick={handleClose}>
                                                                    Cancel
                                                                </Button>
                                                            </Box>
                                                        </form>
                                                    </Box>
                                                </Modal>
                                            </div>
                                        </StyledTableCell>

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

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            >
                <MuiAlert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        backgroundColor: 'hsla(216, 91%, 48%, 0.94)',
                        color: '#fff',
                    }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </motion.div>


    );
};

export default CrudOperation;