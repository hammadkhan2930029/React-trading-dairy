import React, { useEffect, useState } from "react";
import "./whyChooseUs.css";
import TextField from '@mui/material/TextField';
import api from "../../../../api/axios";  
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';



const WhyChooseUs_crud = () => {
  const [logo1, setLogo1] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [data, setData] = useState({
    heading: "",
    sub_heading: "",
    point_1: "",
    point_2: "",
    point_3: "",
    point_4: "",
  });
  const [recordId, setRecordId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');   
  
  useEffect(() => {
    api
      .get("/adminpanel/whychooseus/")
      .then((res) => {
        if (res.data.length > 0) {
          const item = res.data[0];
          setRecordId(item.id);
          setData({
            heading: item.heading || "",
            sub_heading: item.sub_heading || "",
            point_1: item.point_1 || "",
            point_2: item.point_2 || "",
            point_3: item.point_3 || "",
            point_4: item.point_4 || "",
          });
          const BASE_URL = (api.defaults.baseURL)
          if (item.image) 
            if (item.image.startsWith("http")) {
              setLogo1(item.image);
            } else {
              setLogo1(`${baseURL}${item.image}`);
            }    
        
        }
      })
      .catch((err) => console.error(" Fetch failed:", err));
  }, []);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (logoFile) {
        formData.append("image", logoFile);
      } else if (logo1 === null) {
        // Tell backend to remove image
        formData.append("image", "");
      }

      if (recordId) {
        await api.put(`/adminpanel/whychooseus/${recordId}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/adminpanel/whychooseus/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setSnackbarMessage("Changes saved successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage("Failed to save changes.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
     setLogoFile(file);
    setLogo1(URL.createObjectURL(file));     
    }
  };


  const handleRemove = (setLogo) => {
    setLogo(null);
  };
  return (
    <div className="Card_Container">
      <h2>Choose Us Section</h2>
      <div className="card_main_container">
        <div className="edit_card_image">
          <label className="card_label">Change Image</label>
          <input
            id="CardImage"
            name="image"
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(e)}
            className="card_fileInput"
          />
          <div className="card_previewBox">
            {logo1 ? (
              <>
                <img src={logo1} alt="Card image" className="selected_card_Img" />
                <button className="removeBtn" onClick={() => setLogo1(null)}>
                  Remove
                </button>
              </>
            ) : (
              <label htmlFor="CardImage" className="uploadBtn">
                Upload image
              </label>
            )}
          </div>
        </div>
        <div className="cards_fields_div">
          <TextField name="heading" label="Heading "  className="input"  value={data.heading} onChange={handleInputChange} fullWidth/>
          <TextField  name="sub_heading" label="heading " multiline={true}    value={data.sub_heading}  onChange={handleInputChange} rows={4} className="input" fullWidth/>
          <TextField  name="point_1" label="point 1 "  className="input"  value={data.point_1} onChange={handleInputChange} fullWidth/>
          <TextField  name="point_2" label="Point 2 "  className="input"  value={data.point_2} onChange={handleInputChange} fullWidth/>
          <TextField  name="point_3" label="point 3 "  className="input"  value={data.point_3} onChange={handleInputChange} fullWidth/>
          <TextField  name="point_4" label="point 4 "  className="input"  value={data.point_4} onChange={handleInputChange} fullWidth/>


        </div>
        <div className="save_btn_div">

        <button className="saveBtn" onClick={handleSubmit}>Save Changes </button>
        </div>
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

export default WhyChooseUs_crud;
