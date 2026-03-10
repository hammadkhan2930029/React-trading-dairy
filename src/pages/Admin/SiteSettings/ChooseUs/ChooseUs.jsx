import React, { useState, useEffect } from "react";
import "./ChooseUs.css";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";
import api from "../../../../api/axios";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ChooseUs = () => {
  // State for images per section (3 sections)
  const [sectionImages, setSectionImages] = useState([[], [], []]);
  const [existingData, setExistingData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
    

  // Fetch existing data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/adminpanel/chooseus/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        // ✅ handle both list and single object response
        
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (!data) {
          setExistingData({
            heading: "",
            sub_heading_1: "",
            description_1: "",
            sub_heading_2: "",
            description_2: "",
            sub_heading_3: "",
            description_3: "",
          });
          return;
        }

        setExistingData(data);
        const BASE_URL = (api.defaults.baseURL)
        const MEDIA_URL = `${BASE_URL}/media/`;

      setSectionImages([
        data.image_1 ? [{ preview: data.image_1.startsWith("http") ? data.image_1 : `${MEDIA_URL}${data.image_1}` }] : [],
        data.image_2 ? [{ preview: data.image_2.startsWith("http") ? data.image_2 : `${MEDIA_URL}${data.image_2}` }] : [],
        data.image_3 ? [{ preview: data.image_3.startsWith("http") ? data.image_3 : `${MEDIA_URL}${data.image_3}` }] : [],
        
        ]);
      } catch (error) {
     // ✅ IMPORTANT: Set dummy data on failure to exit the loading screen
              setExistingData({ 
              heading: "", 
              sub_heading_1: "", 
              description_1: "", 
              sub_heading_2: "", 
              description_2: "", 
              sub_heading_3: "", 
              description_3: "", 
              });
              setSnackbarMessage(`Fetch failed: ${error.message || 'Check server logs/CORS'}`);
              setSnackbarSeverity("error");
              setSnackbarOpen(true);
              }      
    };
     
    
    fetchData();
  }, []);

  //  Handle new image upload
  const handleImageChange = (e, sectionIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      
     setSnackbarMessage("⚠️ Please select a valid image file.")
     setSnackbarSeverity("error")
     setSnackbarOpen(true)
      return;
    }

    const preview = URL.createObjectURL(file);
    const updated = [...sectionImages];
    updated[sectionIndex] = [{ file, preview }];
    setSectionImages(updated);
  };

  //  Handle image remove
  const handleRemove = (sectionIndex, imgIndex) => {
    const updated = [...sectionImages];
    updated[sectionIndex] = updated[sectionIndex].filter((_, i) => i !== imgIndex);
    setSectionImages(updated);
  };

  //  Submit form
  const handleSubmit = async (values) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key] || "");
    });

    //  Handle images for 3 sections
    const handleImageAppend = (index, fieldName) => {
      if (sectionImages[index][0]?.file) {
        formData.append(fieldName, sectionImages[index][0].file);
      } else if (!sectionImages[index][0] && existingData?.[fieldName]) {
        formData.append(fieldName, null);
      }
    };

    handleImageAppend(0, "image_1");
    handleImageAppend(1, "image_2");
    handleImageAppend(2, "image_3");

    try {
      const res = await api.post("/adminpanel/chooseus/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      
      setSnackbarMessage(" Data saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setExistingData(res.data);
    } catch (error) {    
      setSnackbarMessage(" Data saved successfully!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };
  const cleanURL = (url) => {
  if (!url) return null;
    return url.replace("http://localhost:8000", "https://api.tradingdiary.pk/");
};

  //  Wait until data is fetched
  if (!existingData) return <p>Loading...</p>;

  return (
    <div className="chooseus-wrapper">
      <h2 className="chooseus-title">Why Choose Us</h2>

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

            {/* ✅ Loop through 3 sections */}
            {[1, 2, 3].map((num, index) => (
              <div className="chooseus-section" key={num}>
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

                {/*  Image upload section */}
                <div className="chooseus-upload">
                  <label className="upload-label">Image for Section {num}</label>

                  {sectionImages[index].length === 0 ? (
                    <button
                      type="button"
                      className="upload-btn"
                      onClick={() =>
                        document.getElementById(`file-input-${index}`).click()
                      }
                    >
                      Upload Image
                    </button>
                  ) : (
                    <div className="upload-preview">
                      {sectionImages[index].map((img, i) => (
                        <div key={i} className="upload-item">
                          <img
                            src={img.preview}
                            alt={`Preview ${num}-${i}`}
                            className="upload-img"
                          />
                          <button
                            type="button"
                            className="upload-remove-btn"
                            onClick={() => handleRemove(index, i)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    id={`file-input-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="upload-input"
                  />
                </div>
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

export default ChooseUs;
