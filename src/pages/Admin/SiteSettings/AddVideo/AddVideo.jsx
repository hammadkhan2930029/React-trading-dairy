import React, { useState } from "react";
import "./AddVideo.css";
import TextField from "@mui/material/TextField";

const AddVideo = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (!f.type.startsWith("video/")) {
      setStatus("⚠️ Please sirf video file select karein.");
      return;
    }

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
            {status && <div className="video-status">{status}</div>}
          </div>
        </div>

        {/* right side text fields */}
        <div className="video-fields">
          <TextField
            label="Heading"
            fullWidth
            className="video-input-field"
            sx={{ marginTop: "10px" }}
          />
          <TextField
            label="Description"
            multiline
            rows={4}
            fullWidth
            className="video-input-field"
            sx={{ marginTop: "10px" }}
          />
        </div>
      </div>

      <button className="btn-save">Save Changes</button>
    </div>
  );
};

export default AddVideo;
