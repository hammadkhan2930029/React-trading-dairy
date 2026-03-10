import React, { useState , useEffect} from "react";
import "./AddVideo.css";
import TextField from "@mui/material/TextField";
import api from "../../../../api/axios";  
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AddVideo = () => {
  const [file, setFile] = useState(null);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  
  //  Fetch existing logos
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get("/adminpanel/addvideo/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,

        },
      });
         const data = Array.isArray(res.data) ? res.data[0] : res.data; 

        setHeading(data.heading || "");
        setDescription(data.description || "");

        if (data.video) {
          const BASE_URL = (api.defaults.baseURL)
          setPreview(
            data.video.startsWith("http")
              ? data.video
              : `${BASE_URL}${data.video}`
          );
        }
      } catch (err) {
        
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);




  // Handle file input
  const handleChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file); // store file for upload
      setPreview(URL.createObjectURL(file)); // show preview
    }
  };

    
  //  Save changes to backend
   const handleSave = async () => {
    const formData = new FormData();
    formData.append("heading", heading);
    formData.append("description", description);
    if (file) formData.append("video", file); 

    try {
      await api.put("/adminpanel/addvideo/1/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setSnackbarMessage("Video updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      
      setSnackbarMessage("Failed to update video.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };



  const handleFileChange = (e) => {
  const f = e.target.files[0];
  if (!f) return;

  const maxSize = 30 * 1024 * 1024; // 30 MB limit
  const allowedType = "video/webm";

  // Check file format
  if (f.type !== allowedType) {
    setStatus(" Only .webm format videos are allowed.");
    e.target.value = null;
    return;
  }

  //  Check file size
  if (f.size > maxSize) {
    setStatus("File size must be under 30 MB.");
    e.target.value = null;
    return;
  }

  // If valid, show preview
  setFile(f);
  setPreview(URL.createObjectURL(f));
  setStatus("");
  setProgress(0);
};


  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setStatus("");
    setProgress(0);
  };
  if (loading) {
    return <div className="loading-text">Loading Video...</div>;
  }
  return (
    <div className="video-card-container">
      <h2 className="video-card-title">Add / Edit Video Card</h2>

      <div className="video-card-main">
        {/* left side video upload */}
        <div className="video-upload-section">
          <label className="video-label">Upload / Change Video</label>

          <input
            id="video-upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="video-input"
          />

          <div className="video-preview-box">
            {preview ? (
              <>
                <video src={preview} controls className="video-preview" />
                <button className="btn-remove" onClick={handleRemove}>
                  Remove
                </button>
              </>
            ) : (
              <label htmlFor="video-upload" className="btn-upload">
                Select a Video
              </label>
            )}

            {progress > 0 && <div className="video-progress">Progress: {progress}%</div>}
            {status && (
  <div className="video-status" style={{ color: 'red', fontWeight: '500', marginTop: '8px' }}>
    {status}
  </div>
)}
          </div>
        </div>

        {/* right side text fields */}
        <div className="video-fields">
          <TextField
            name="heading"
            value={heading}
            label="Heading"
            onChange={(e) => setHeading(e.target.value)}
            fullWidth
            className="video-input-field"
            sx={{ marginTop: "10px" }}
          />
          <TextField
            name="description"
            value={description}
            label="Description"
            multiline
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            fullWidth
            className="video-input-field"
            sx={{ marginTop: "10px" }}
          />
        </div>
      </div>

      <button className="btn-save" onClick={handleSave}>Save Changes</button>
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

export default AddVideo;
