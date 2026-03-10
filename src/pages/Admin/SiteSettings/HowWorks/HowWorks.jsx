import React, { useEffect, useState } from "react";
import "./HowWorks.css";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import api from "../../../../api/axios";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const HowWorks = () => {
  const [existingData, setExistingData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');   

   useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/adminpanel/howworks/");
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setExistingData(data || {});
      } catch (err) {
        
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const res = await api.post("/adminpanel/howworks/", values, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setSnackbarMessage("Data save successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setExistingData(res.data);
    } catch (error) {
      setSnackbarMessage("Error Saving Data!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  if (!existingData) return <p></p>;


  return (
    <div className="chooseus-wrapper">
      <h2 className="chooseus-title">How its work!</h2>
      <Formik
        initialValues={{
            heading: existingData.heading || "",
          sub_heading_1: existingData.sub_heading_1 || "",
          description_1: existingData.description_1 || "",
          sub_heading_2: existingData.sub_heading_2 || "",
          description_2: existingData.description_2 || "",
          sub_heading_3: existingData.sub_heading_3 || "",
          description_3: existingData.description_3 || "",
        }}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="chooseus-form">
            <TextField
              name="heading"
              label="Main Heading"
              className="chooseus-input"
              onChange={handleChange}
              value={values.heading}
              onBlur={handleBlur}
              fullWidth
            />

            {/* ================= Section 1 ================= */}
            {[1, 2, 3].map((num) => (
            <div className="chooseus-section" key={num}>
              <h2>Section {num}</h2>
              <TextField
                name={`sub_heading_${num}`}
                label={`Sub Heading ${num}`}
                className="chooseus-input"
                onChange={handleChange}
                value={values[`sub_heading_${num}`]}
                onBlur={handleBlur}
                fullWidth
              />
              <TextField
                name={`description_${num}`}
                label={`Description ${num}`}
                className="chooseus-input"
                onChange={handleChange}
                value={values[`description_${num}`]}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={3}
              />              
            </div>
            ))}            

            <button type="submit" className="chooseus-submit-btn">
              Save Changes
            </button>
          </form>
        )}
      </Formik>
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
  );
};

export default HowWorks;
