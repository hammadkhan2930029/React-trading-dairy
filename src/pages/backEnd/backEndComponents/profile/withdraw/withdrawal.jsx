import React, { useEffect, useState } from 'react';
import { Formik, ErrorMessage } from 'formik';
import "./withdrawal.css"
import "react-datepicker/dist/react-datepicker.css";
import SendIcon from '@mui/icons-material/Send';
import Fab from '@mui/material/Fab';
import TextField from '@mui/material/TextField';
import { motion, useInView } from "framer-motion";
import { useDispatch, useSelector } from 'react-redux';
// import { setChargesList } from '../../Redux/extrachargesSlice';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Typography, Modal, Grid, TablePagination } from '@mui/material';
import { selectAllTransaction, createTransactions, fetchTransactions, updateTransactions_withdrawal } from "../../../Redux/transactionSlice";
import * as Yup from 'yup';
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

const TransactionSchema = Yup.object().shape({
    date: Yup.date()
        .required('Please select a date')
        .typeError('Please enter a valid date'),
    amount: Yup.number()
        .typeError('Please enter a valid amount')
        .min(0.01, 'Amount must be greater than 0')
        .required('Please put an amount here'),
});

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

export const Withdrawal = () => {
    const dispatch = useDispatch()
    const TotalInvestmentList = useSelector(selectAllTransaction)
    const withdrawalList = TotalInvestmentList.filter(item => item.fore === 'Withdrawal'); 
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 430);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    const refOne = React.useRef(null);
    const inViewOne = useInView(refOne, { triggerOnce: true });
    
    // State for modal and editing
    const [open, setOpen] = useState(false);
    const [editingTransactionId, setEditingTransactionId] = useState(null); // FIXED: Added missing state
    const [editFormData, setEditFormData] = useState({
        date: '',
        amount: 0,
    });
    
    // Pagination state
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    // FIXED: Updated handleOpen to properly set editing data
    const handleOpen = (item) => {
        console.log('handleOpen called with item:', item);
        
        if (!item || !item.id) {
            console.error('Invalid item passed to handleOpen:', item);
            return;
        }
        
        try {
            // Convert date format from dd/mm/yyyy to yyyy-mm-dd for input field
            let formattedDate = '';
            if (item.date) {
                if (item.date.includes('/')) {
                    const [day, month, year] = item.date.split('/');
                    formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                } else {
                    // If date is already in yyyy-mm-dd format
                    formattedDate = item.date;
                }
            }

            console.log('Setting edit data:', {
                id: item.id,
                date: formattedDate,
                amount: item.amount
            });

            setEditingTransactionId(item.id);
            setEditFormData({
                date: formattedDate,
                amount: item.amount || 0,
            });
            setOpen(true);
        } catch (error) {
            console.error('Error in handleOpen:', error);
        }
    };

    // FIXED: Updated handleClose to properly reset state
    const handleClose = () => {
        setOpen(false);
        setEditingTransactionId(null);
        setEditFormData({ date: '', amount: 0 });
    };

    // FIXED: Updated handleChange for edit form
    const handleEditFormChange = (e) => {
        setEditFormData({ 
            ...editFormData, 
            [e.target.name]: e.target.value 
        });
    };

    // Pagination handlers
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Create new transaction
    const handlecreateTransaction = async (values, { setSubmitting, resetForm }) => {
        try {
            await dispatch(createTransactions(values)).unwrap();
            //alert("Transaction successfully added to DB")
            setSnackbarMessage("Transaction successfully added to DB");
            setSnackbarSeverity("success"); 
            setSnackbarOpen(true)
            resetForm();
        } catch (error) {
            console.error("Trade creation failed:", error);
            setSnackbarMessage(`Trade creation failed '${error.message}'`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);   
        } finally {
            setSubmitting(false);
        }
    };

    // Fetch transactions on component mount
    useEffect(() => {
        if (TotalInvestmentList.length === 0) {
            console.log("Fetching transactions...");
            dispatch(fetchTransactions())
                .unwrap()
                .catch(error => {
                    console.error("Failed to fetch Investments:", error);
                });
        }
    }, [dispatch, TotalInvestmentList.length]);

    // FIXED: Updated handleUpdateTransaction withdrawal with proper form submission
    const handleupdateTransactions_withdrawal = async (e) => {
        e.preventDefault();
        
        if (!editingTransactionId) {
            console.error("No transaction ID available for update.");
            return;
        }

        console.log('Updating transaction:', editingTransactionId, editFormData); // Debug log

        try {
            // Convert date back to dd/mm/yyyy format if needed by your backend
            const [year, month, day] = editFormData.date.split('-');
            //const formattedDate = `${day}/${month}/${year}`;
            const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            const updateData = {
                ...editFormData,
                user_id: editFormData.user_id,
                fore: 'Withdrawal',
                date: formattedDate, // Send in the format your backend expects
                amount: parseFloat(editFormData.amount), // Ensure it's a number
            };

            await dispatch(updateTransactions_withdrawal({ 
                id: editingTransactionId, 
                updatedData: updateData 
            })).unwrap();
            
            //alert("Transaction successfully updated in DB");
            setSnackbarMessage("Transaction successfully updated in DB");
            setSnackbarSeverity("success"); 
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            console.error("Transaction update failed:", error);
            setSnackbarMessage(`Transaction update failed: ${error.message || JSON.stringify(error.data || error.response?.data || error)}`);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };
    // -------------------------------------------------------------
    return (

        <motion.div
      ref={refOne}
      initial={{ opacity: 0, y: 100 }}
      animate={inViewOne ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .8 }}
      className='withdrawalMain'
    >
      {/* CREATE FORM */}
      <Formik
        initialValues={{
          amount: 0,
          date: '',
          fore: 'Withdrawal',
          user_id: '',
        }}
        validationSchema={TransactionSchema}
        onSubmit={handlecreateTransaction}
      >
        {({ handleBlur, handleChange, handleSubmit, values, errors, touched }) => (
          <form onSubmit={handleSubmit} className="withdrawalFormWrapper">
            <div className='withdrawalFormMainOneTime'>
              <div>
                <span className='withdrawalHeading'>Withdrawal</span>
              </div>

              <div>
                <Box component="form"
                  sx={{ '& .MuiTextField-root': { m: 1, width: isMobile ? '32ch' : '36ch' } }}
                  noValidate
                  autoComplete="off"
                  className='withdrawalFormOneTime'>
                  <div className="withdrawalFormInputs">
                    <TextField
                      type='date'
                      id="outlined-required"
                      label="Date"
                      name="date"
                      value={values.date}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      InputLabelProps={{ shrink: true }}
                      error={touched.date && Boolean(errors.date)}
                      helperText={touched.date && errors.date}
                    />
                    <TextField
                      id="outlined-required"
                      label="Withdrawal"
                      type="number"
                      placeholder="Withdrawal..."
                      name='amount'
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.amount}
                      error={touched.amount && Boolean(errors.amount)}
                      helperText={touched.amount && errors.amount}
                    />
                  </div>
                </Box>
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

      {/* TABLE SECTION */}
      <motion.div
        className="withdrawalCrudMainOneTime"
        initial={{ opacity: 0, y: -100 }}
        animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: .8 }}
      >
        <div className="withdrawalCrudInner">
          <TableContainer component={Paper} className="withdrawalTableContainer">
            <Table sx={{ minWidth: 650 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">Date</StyledTableCell>
                  <StyledTableCell align="center">Withdrawal</StyledTableCell>
                  <StyledTableCell align="center">Actions</StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {withdrawalList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, index) => (
                  <StyledTableRow key={item.id || index} className="withdrawalTableRow">
                    <StyledTableCell component="th" scope="row" align="center">
                      {item.date}
                    </StyledTableCell>
                    <StyledTableCell align="center">{Number(item.amount)}</StyledTableCell>
                    <StyledTableCell align="center">
                      <button
                        type="button"
                        className="withdrawalEditBtnOneTime"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpen(item);
                        }}
                        style={{
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          zIndex: 1000
                        }}
                      >
                        <EditIcon style={{ fontSize: '16px', marginRight: 6 }} /> Edit
                      </button>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
                {withdrawalList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No records found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={withdrawalList.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 20]}
            onRowsPerPageChange={handleChangeRowsPerPage}
            className="withdrawalTablePagination"
          />

          {/* EDIT MODAL */}
          <Modal open={open} onClose={handleClose}>
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}>
              <Typography variant="h6">Edit Transaction</Typography>
              <form onSubmit={handleupdateTransactions_withdrawal}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Date"
                      name="date"
                      type="date"
                      value={editFormData.date}
                      onChange={handleEditFormChange}
                      required
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Withdrawal"
                      name="amount"
                      value={editFormData.amount}
                      onChange={handleEditFormChange}
                      required
                    />
                  </Grid>
                </Grid>
                <Box mt={2} display="flex" justifyContent="space-between">
                  <Button type="submit" variant="contained" color="primary">
                    Update
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={handleClose}>
                    Cancel
                  </Button>
                </Box>
              </form>
            </Box>
          </Modal>

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
    </motion.div>
        // <motion.div
        //     ref={refOne}
        //     initial={{ opacity: 0, y: 100 }}
        //     animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        //     transition={{ duration: .8 }}
        //     className='withdrawal_main'>

          
        //     <Formik
        //         initialValues={{
        //             amount: 0,
        //             date: '',
        //             fore: 'Withdrawal',
        //             user_id: '',
        //         }}
        //         validationSchema={TransactionSchema}
        //         onSubmit={handlecreateTransaction}
        //     >
        //         {({ handleBlur, handleChange, handleSubmit, values, errors, isValid, touched, setFieldValue }) => (
        //             <form onSubmit={handleSubmit}>
        //                 <div className='withdrawal_form-main-oneTime'>
        //                     <div>
        //                         <span className='withdrawal_heading'>Withdrawal</span>
        //                     </div>

        //                     <div>
        //                         <Box component="form"
        //                             sx={{ '& .MuiTextField-root': { m: 1, width: isMobile ? '32ch' : '36ch' } }}
        //                             noValidate
        //                             autoComplete="off"
        //                             className='withdrawal_form-oneTime'>
        //                             <div>
        //                                 <TextField
        //                                     type='date'
        //                                     id="outlined-required"
        //                                     label="Date"
        //                                     name="date"
        //                                     value={values.date}
        //                                     onChange={handleChange}
        //                                     onBlur={handleBlur}
        //                                     InputLabelProps={{ shrink: true }}
        //                                     error={touched.date && Boolean(errors.date)}
        //                                     helperText={touched.date && errors.date}
        //                                 />
        //                                 <TextField
        //                                     id="outlined-required"
        //                                     label="Withdrawal"
        //                                     type="number"
        //                                     placeholder="Withdrawal..."
        //                                     name='amount'
        //                                     onChange={handleChange}
        //                                     onBlur={handleBlur}
        //                                     value={values.amount}
        //                                     error={touched.amount && Boolean(errors.amount)}
        //                                     helperText={touched.amount && errors.amount}
        //                                 />
        //                             </div>
        //                         </Box>
        //                     </div>

        //                     <Box sx={{ '& > :not(style)': { m: 1 } }}>
        //                         <Fab variant="extended" color="primary" type="submit" sx={{borderRadius:'10px'}}>
        //                             <SendIcon sx={{ mr: 1.5 }} />
        //                             Submit
        //                         </Fab>
        //                     </Box>
        //                 </div>
        //             </form>
        //         )}
        //     </Formik>

          
        //     <motion.div className="investment_crud_onetime"
        //         ref={refOne}
        //         initial={{ opacity: 0, y: -100 }}
        //         animate={inViewOne ? { opacity: 1, y: 0 } : {}}
        //         transition={{ duration: .8 }}>

        //         <div className="investment_crud_main_onetime">
        //             <table className="investment_table_onetime">
        //                 <thead className='investment_t_head_onetime'>
        //                     <tr className='investment_t_head_row_onetime'>
        //                         <th>Date</th>
        //                         <th>Withdrawal</th>
        //                         <th>Actions</th>
        //                     </tr>
        //                 </thead>
        //                 <tbody className='investment_t_body_onetime'>
        //                     {withdrawalList.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, index) => (
        //                         <tr key={item.id || index} className='investment_t_body_row_onetime'>
        //                             <td>{item.date}</td>
        //                             <td>{Number(item.amount)}</td>
        //                             <td>
        //                                 <button
        //                                     type="button"
        //                                     className="investment_editbtn_onetime"
        //                                     onClick={(e) => {
        //                                         e.preventDefault();
        //                                         e.stopPropagation();
        //                                         console.log('Edit button clicked for item:', item);
        //                                         handleOpen(item);
        //                                     }}
        //                                     style={{ 
        //                                         cursor: 'pointer',
        //                                         pointerEvents: 'auto',
        //                                         zIndex: 1000
        //                                     }}
        //                                 >
        //                                     <EditIcon style={{ fontSize: '16px' }} /> Edit
        //                                 </button>
        //                             </td>
        //                         </tr>
        //                     ))}
        //                 </tbody>
        //             </table>

        //             <TablePagination
        //                 component="div"
        //                 count={withdrawalList.length}
        //                 page={page}
        //                 rowsPerPage={rowsPerPage}
        //                 onPageChange={handleChangePage}
        //                 rowsPerPageOptions={[5, 10, 20]}
        //                 onRowsPerPageChange={handleChangeRowsPerPage}
        //             />

                    
        //             <Modal open={open} onClose={handleClose}>
        //                 <Box sx={style}>
        //                     <Typography variant="h6">Edit Transaction</Typography>
        //                     <form onSubmit={handleupdateTransactions_withdrawal}>
        //                         <Grid container spacing={2}>
        //                             <Grid item xs={12}>
        //                                 <TextField
        //                                     fullWidth
        //                                     label="Date"
        //                                     name="date"
        //                                     type="date"
        //                                     value={editFormData.date}
        //                                     onChange={handleEditFormChange}
        //                                     required
        //                                     InputLabelProps={{ shrink: true }}
        //                                 />
        //                             </Grid>
        //                             <Grid item xs={12}>
        //                                 <TextField
        //                                     fullWidth
        //                                     type="number"
        //                                     label="Withdrawal"
        //                                     name="amount"
        //                                     value={editFormData.amount}
        //                                     onChange={handleEditFormChange}
        //                                     required
        //                                 />
        //                             </Grid>
        //                         </Grid>
        //                         <Box mt={2} display="flex" justifyContent="space-between">
        //                             <Button type="submit" variant="contained" color="primary">
        //                                 Update
        //                             </Button>
        //                             <Button variant="outlined" color="secondary" onClick={handleClose}>
        //                                 Cancel
        //                             </Button>
        //                         </Box>
        //                     </form>
        //                 </Box>
        //             </Modal>
        //              <Snackbar
        //                 open={snackbarOpen}
        //                 autoHideDuration={3000}
        //                 onClose={() => setSnackbarOpen(false)}
        //                 anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
        //                 >
        //                 <MuiAlert
        //                 onClose={() => setSnackbarOpen(false)}
        //                     severity={snackbarSeverity}
        //                     sx={{
        //                         width: '100%',
        //                         backgroundColor: 'rgba(15, 134, 231, 0.94)',
        //                         color: '#fff',
                                
        //                     }}
        //                 elevation={6}
        //                 variant="filled"
        //                 >
        //                 {snackbarMessage}
        //                 </MuiAlert>
        //                 </Snackbar>
        //         </div>
        //     </motion.div>
        // </motion.div>
    )
}