import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, TablePagination, Modal, Box, Grid } from '@mui/material';
import './rules.css';
import { motion, useInView } from "framer-motion";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchRules, deleteRule, addRule, updateRule } from '../../../Redux/rulesSlice';
import { useDispatch, useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Swal from 'sweetalert2';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const RuleForm = () => {
    const [rules, setRules] = useState(['']);
    const dispatch = useDispatch();
    const rulesData = useSelector((state) => state.rules.rules);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [editRuleId, setEditRuleId] = useState(null);  // used for dispatch later

    useEffect(() => {
        dispatch(fetchRules());
    }, [dispatch]);

    // -----------------------------------------------------------
    const handleAddRule = () => {
        setRules(prevRules => [...prevRules, '']);
    };

    const handleChangeRules = (index, value) => {
        const updatedRules = [...rules];
        updatedRules[index] = value;
        setRules(updatedRules);

        setFormData(prev => ({
            ...prev,
            rule_text: value
        }));
    };
    // -----------------------------------------------------------    

    const handleSubmitAll = () => {
        
    };

    const handleCancelRule = (index) => {
        if (rules.length > 1) {

            const updatedRules = rules.filter((_, i) => i !== index);
            setRules(updatedRules);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        try {
            dispatch(updateRule({
                ruleId: editRuleId,
                rule_text: formData.rule_text
            })).unwrap();

            setSnackbarMessage('Rule updated successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setOpen(false);
            dispatch(fetchRules());  // Refresh the list after updating
        } catch (err) {
            setSnackbarMessage('Update failed');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleEditClick = (rule) => {
        setFormData({ rule_text: rule.rule_text });
        setEditRuleId(rule.id);
        setOpen(true);

    };


    // -----------------------------------------------------------
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        id: 0,
        rule_no: '',
        rule_text: '',
    });


    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleOpen = (item) => {
        setFormData({
            id: item.id,
            rule_no: item.rule_no,
            rule_text: item.rule_text,
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
    // ---------------------------------------------------------
    const refOne = React.useRef(null);

    const inViewOne = useInView(refOne, { triggerOnce: true });
    // --------------------------------------------------------------------

    const handleDeleteRule = async (id) => {
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
                await dispatch(deleteRule(id)).unwrap();

                setSnackbarMessage("Rules deleted successfully");
                setSnackbarSeverity("success");
                setSnackbarOpen(true);

            } catch (error) {
                if (error?.detail === "This rule is in use and cannot be deleted!") {
                    setSnackbarMessage(`This rule is in use and cannot be deleted!`);
                    setSnackbarSeverity("warning");
                }else{
                    setSnackbarMessage(`Deletion failed: ${error.message || JSON.stringify(error.data || error)}`);
                    setSnackbarSeverity("error");
                }
                
                setSnackbarOpen(true);
            }
        }
    };

    return (
          
            <div >

                <div className="rule-form-container">
                    <div style={{ marginBottom: '10px' }}>
                        <span className="rule-heading">
                            Create Your Rules List
                        </span>
                    </div>

                    {rules.map((rule, index) => (
                        <div className="rule-item" key={index}>
                            <TextField
                                label={`Type your rules here`}
                                multiline
                                fullWidth
                                rows={4}
                                value={rule}
                                onChange={(e) => handleChangeRules(index, e.target.value)}
                            />
                            <div className={`rule-actions ${rules.length === 1 && 'hidden'}`}>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    className="cancel-btn"
                                    onClick={() => handleCancelRule(index)}
                                    disabled={rules.length === 1}
                                >
                                    <DeleteIcon />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <div className="rule-buttons">
                        <Button variant="contained" onClick={handleAddRule}>
                            Add Rule
                        </Button>
                        <Button variant="contained"
                            color="success"
                            onClick={async () => { // ⭐ Made async to await dispatches ⭐
                                let allSuccess = true;
                                for (const ruleText of rules) {
                                    if (ruleText.trim() !== '') {
                                        try {
                                            await dispatch(addRule(ruleText)).unwrap();
                                        } catch (err) {
                                            allSuccess = false;
                                            setSnackbarMessage(`Failed to add rule: ${err.message || 'Unknown error'}`);
                                            setSnackbarSeverity('error');
                                            setSnackbarOpen(true);
                                            // Stop adding more if one fails, or continue and show multiple alerts
                                            break;
                                        }
                                    }
                                }
                                if (allSuccess) {
                                    setSnackbarMessage('Rules submitted successfully!');
                                    setSnackbarSeverity('success');
                                    setSnackbarOpen(true);
                                    setRules(['']); // Reset the form on overall success
                                }
                            }}
                        >
                            Submit
                        </Button>
                    </div>
                </div>
                {/* --------------------------- */}
                <motion.div className="rules_crud_wrapper"
                    ref={refOne}
                    initial={{ opacity: 0, y: -100 }}
                    animate={inViewOne ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}>
                    <div className="rules_crud_container">

                        <table className="rules_table">
                            <thead className="rules_table_head">
                                <tr className="rules_table_head_row">
                                    <th>Rule No</th>
                                    <th>Rule</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="rules_table_body">
                                {rulesData.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((item, index) => (
                                    <tr key={index} className="rules_table_body_row">
                                        <td>{index + 1}</td>
                                        <td>{item.rule_text}</td>
                                        <td>
                                            <button className="rules_edit_btn" onClick={() => {
                                                setEditRuleId(item.id);
                                                setFormData({ rule_text: item.rule_text });
                                                setOpen(true);
                                            }}>
                                                <EditIcon style={{ fontSize: '16px' }} /> Edit
                                            </button>
                                            <button className='rules_delet_btn'  onClick={() => handleDeleteRule(item.id)} 
                                            >
                                                <DeleteIcon style={{ fontSize: '16px' }} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <TablePagination
                            component="div"
                            count={rulesData.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            onPageChange={handleChangePage}
                            rowsPerPageOptions={[5, 10, 20]}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />

                        <Modal open={open} onClose={handleClose}>
                            <Box sx={style}>
                                <Typography variant="h6" sx={{ margin: '5px', padding: '5px' }}>Edit Rule</Typography>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label='Rule'
                                                multiline
                                                fullWidth
                                                rows={4}
                                                name="rule_text"
                                                value={formData.rule_text}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Box mt={2} display="flex" justifyContent="space-between">
                                        <Button type="submit" variant="contained" color="primary">Submit</Button>
                                        <Button variant="outlined" color="secondary" onClick={handleClose}>Cancel</Button>
                                    </Box>
                                </form>
                            </Box>
                        </Modal>
                    </div>
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
                                backgroundColor:snackbarSeverity === 'error' ? '#e91612ff' : snackbarSeverity === 'warning' ? '#f57c00' : '#066309ff'
                            }}
                            elevation={6}
                            variant="filled"
                        >
                            {snackbarMessage}
                        </MuiAlert>
                    </Snackbar>

                </motion.div>


            </div>
    );
};
