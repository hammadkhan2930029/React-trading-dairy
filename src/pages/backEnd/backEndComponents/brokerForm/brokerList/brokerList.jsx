import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import './brokerList.css';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  Grid,
  TablePagination,
  MenuItem,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { BrokerForm } from "../brokerForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBrokers,selectAllUserBrokers, updateUserBroker} from "../../../Redux/userBrokerSlice";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const BrokerList = () => {
  const dispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  const userBrokers = useSelector(selectAllUserBrokers);
  const createStatus = useSelector((state) => state.userBrokers.createStatus);
  const createError = useSelector((state) => state.userBrokers.createError);
  const status = useSelector((state) => state.userBrokers.status); 

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    broker_name: '',
    status: 'Active',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // When error changes, show snackbar
  useEffect(() => {
  if (createStatus === "failed" && createError) {
    setSnackbarMessage(
      createError === "This broker is already added for this user."
        ? createError
        : "Failed to add broker."
    );
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  }

  if (createStatus === "succeeded") {
    setSnackbarMessage("Broker added successfully!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  }
}, [createStatus, createError]);


 

  // Fetch list when component mounts
  useEffect(() => {
      if (createStatus === "idle" || createStatus === "succeeded") {
    dispatch(fetchUserBrokers());
  }
}, [createStatus, dispatch]);

  const handleOpen = (broker) => {
    setFormData({
      id: broker.id,
      broker_name: broker.broker_name || '',
      status: broker.status || 'Active',
    });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleSubmit = (e) => {
      
    e.preventDefault();

    // Check if status actually changed
    const broker = userBrokers.find(b => b.id === formData.id);
    if (broker && broker.status === formData.status) {
      setSnackbarMessage("No change updated");
      setSnackbarSeverity("info");
      setSnackbarOpen(true);
      handleClose();
      return; // Don't even call API
    }

    dispatch(updateUserBroker({ id: formData.id, status: formData.status }))
      .unwrap()
      .then(() => {
        setSnackbarMessage("Broker updated successfully!");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        if (err === "No change updated") {
          setSnackbarMessage("No change updated");
          setSnackbarSeverity("info");
        } else {
          setSnackbarMessage("Failed to update broker");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      });

    handleClose();
  };

  

 
  const refOne = useRef(null);
  const inViewOne = useInView(refOne, { triggerOnce: true });

  return (
    <motion.div
      className="brokerList_container"
      ref={refOne}
      initial={{ opacity: 0, y: -100 }}
      animate={inViewOne ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: .8 }}
    >
      <div className="brokerList_wrapper">
        {/* Form to add new brokers */}
        <BrokerForm />

        {/* Table */}
        <table className="brokerList_table">
          <thead className="brokerList_head">
            <tr>
              <th>Broker Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="brokerList_body">
            {userBrokers
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((item) => (
                <tr key={item.id}>
                  <td>{item.broker_name}</td>
                  <td>
                    <span
                      className={`status ${item.status === "Active" ? "active" : "inactive"}`}
                      >
                      {item.status}     
                    </span>
                  </td>
                  <td className="brokerList_actions">
                    <button
                      className="brokerList_editBtn"
                      onClick={() => handleOpen(item)}
                    >
                      <EditIcon style={{ fontSize: '16px' }} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <TablePagination
          component="div"
          count={userBrokers.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[5, 10, 20]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

        {/* Edit Modal */}
        <Modal open={open} onClose={handleClose}>
          <Box sx={style}>
            <Typography
              variant="h6"
              sx={{ padding: '10px', marginBottom: '5px' }}
            >
              Edit Broker
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Broker Name"
                    name="broker_name"
                    value={formData.broker_name}
                    //onChange={handleChange}
                    readOnly
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <RadioGroup
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        value="Active"
                        control={<Radio />}
                        label="Active"
                      />
                      <FormControlLabel
                        value="Inactive"
                        control={<Radio />}
                        label="Inactive"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button type="submit" variant="contained" color="primary">
                  Submit
                </Button>
                <Button
                  variant="outlined"
                  sx={{ color: 'red', borderColor: 'red' }}
                  onClick={handleClose}
                >
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
  );
};

export default BrokerList;
