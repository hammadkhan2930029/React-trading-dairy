import React, { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Formik, ErrorMessage } from 'formik';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import './userImports.css';
import { Box, Button, TextField, TablePagination } from '@mui/material';
import { useDispatch, useSelector } from "react-redux";
import { fetchimports, selectAllimports, createimports, deleteimports } from "../../Redux/importSlice";
import { fetchUserBrokers, selectAllUserBrokers } from "../../Redux/userBrokerSlice";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import * as Yup from "yup";
import VisibilityIcon from '@mui/icons-material/Visibility';
import IconButton from '@mui/material/IconButton';
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

const userImport = () => {

    const TransactionSchema = Yup.object().shape({
        broker_id: Yup.number()
            .required('Please select a broker')
            .typeError('Please select a broker'),
        import_file: Yup.mixed()
            .required('Please upload a file')
            .test(
                "fileFormat",
                "Only PDF or XLSX files are allowed",
                value => {
                    if (!value) return false; // required
                    return ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(value.type);
                }
            )
    });

    const handleDeleteImport = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                // Hit your delete API here
                // Assuming you have a deleteimports action in Redux
                await dispatch(deleteimports(id)).unwrap(); 

                setSnackbarMessage("Import deleted successfully");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

            } catch (error) {
                setSnackbarMessage(`Deletion failed: ${error.message || JSON.stringify(error.data || error)}`);
                setSnackbarSeverity("error");
                setSnackbarOpen(true);
            }
        }
    };

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };
    const STATUS_MAP = {
        0: 'Pending',
        1: 'Processing',
        2: 'Completed',
        3: 'Failed',
    };

    const navigate = useNavigate()
    const dispatch = useDispatch();
    const brokers = useSelector(selectAllUserBrokers);
    const imports = useSelector(selectAllimports);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // Fetch broker list from Backend 
    useEffect(() => {
        const fetchData = async () => {
            if (brokers.length === 0) {
                try {
                    await dispatch(fetchUserBrokers());
                } catch (error) {
                }
            }
        };
        fetchData();
    }, [dispatch, brokers.length]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });

    useEffect(() => {
        dispatch(fetchimports());
    }, [dispatch]);

    // const paginatedimports = fetchimports.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';

        const date = new Date(dateStr.replace(' ', 'T'));
        return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    const handlecreateTransaction = async (values, { setSubmitting, resetForm }) => {
        try {
            const submissionValues = {
                broker: values.broker_id,
                import_file: values.import_file,
            };

            await dispatch(createimports(submissionValues)).unwrap();
            
            setSnackbarMessage("Import added successfully");
            setSnackbarSeverity("success"); // Set success severity
            setSnackbarOpen(true);
            resetForm({
                values: {
                    broker_id: '',
                    import_file: null,
                    user_id: '',
                },
            });
        } catch (error) {
            setSnackbarMessage(`Something went wrong`);
            setSnackbarMessage(`Creation failed: ${error.message || JSON.stringify(error.data || error)}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (

        <motion.div className="import_crud"
            ref={refOne}
            initial={{ opacity: 0, y: -100 }}
            animate={inViewOne ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: .8 }}
        >
            {/* CREATE FORM */}
            <Formik
                initialValues={{
                    broker_id: '',
                    import_file: null,
                    user_id: '',
                }}
                validationSchema={TransactionSchema}
                onSubmit={handlecreateTransaction}
            >

                {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>

                        <div className='importform'>
                            <div>
                                <span className='heading-oneTime'>Imports</span>
                            </div>
                                
                            <div className='import_form_oneTime'>
                                <div className='total_import_input_div'>
                                    <TextField
                                        select
                                        label="Broker Name"
                                        name="broker_id"
                                        value={values.broker_id}
                                        onChange={(e) => {
                                            setFieldValue("broker_id", Number(e.target.value));
                                        }}
                                        onBlur={handleBlur}
                                        fullWidth
                                        error={touched.broker_id && Boolean(errors.broker_id)}
                                        helperText={touched.broker_id && errors.broker_id}
                                    >
                                        <MenuItem value="">
                                            <em>Select a Broker</em>
                                        </MenuItem>

                                        {brokers
                                            .filter(broker => broker.status === "Active")
                                            .map((broker) => (
                                                <MenuItem key={broker.broker} value={broker.broker}>
                                                    {broker.broker_name}
                                                </MenuItem>
                                            ))}
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        type="file"
                                        name="import_file"
                                        onChange={(event) => {
                                            const file = event.currentTarget.files[0];
                                            setFieldValue("import_file", file);
                                        }}
                                        onBlur={handleBlur}
                                        error={touched.import_file && Boolean(errors.import_file)}
                                        helperText={touched.import_file && errors.import_file}
                                    />

                                </div>
                            </div>

                            <Box sx={{ '& > :not(style)': { m: 1 } }}>
                                <Fab variant="extended" color="primary" type="submit" sx={{ borderRadius: '10px' }}>
                                    <SendIcon sx={{ mr: 1.5 }} />
                                    Submit
                                </Fab>
                            </Box>
                        </div>
                    </form>
                )}
            </Formik>

            <div className="import_crud_main">

                <div>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="import table">
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Broker</StyledTableCell>
                                    <StyledTableCell>File</StyledTableCell>
                                    <StyledTableCell>Import Date</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Actions</StyledTableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {[...imports].sort((a, b) => b.id - a.id).map((item) => {
                                    
                                    const brokerName = item.broker_detail?.broker_name || "N/A";
                                    return (
                                        <StyledTableRow key={item.id}>
                                            <StyledTableCell>{brokerName}</StyledTableCell>
                                            {/* <StyledTableCell>{item.import_file}</StyledTableCell> */}
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
                                                <button
                                                    className="editebtn"
                                                    type="button"
                                                    onClick={() => handleDeleteImport(item.id)}
                                                >
                                                    Delete
                                                </button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    );
                                })}

                                {imports.length === 0 && (
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={5} align="center" style={{ padding: "20px" }}>
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
                    count={imports.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[10, 25, 50]}
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
        </motion.div>
    );
};

export default userImport;