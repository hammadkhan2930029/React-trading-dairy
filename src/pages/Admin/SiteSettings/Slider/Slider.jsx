import React, { useState } from "react";
import "./Slider.css";
import TextField from '@mui/material/TextField';

const Slider = () => {
  const [logo1, setLogo1] = useState(null);
  const [logo2, setLogo2] = useState(null);

  const handleChange = (e, setLogo) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
    }
  };

  const handleRemove = (setLogo) => {
    setLogo(null);
  };
  return (
    <div className="slider">
      <h2>Slider Section</h2>
      <form className="slider_container">
        <div className="editCover_image">
          <label className="Cover_label">Change Cover Image</label>
          <input
            id="headerLogo"
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(e, setLogo1)}
            className="cover_fileInput"
          />
          <div className="cover_previewBox">
            {logo1 ? (
              <>
                <img src={logo1} alt="Header Logo" className="selected_cover_Img" />
                <button
                  className="removeBtn"
                  onClick={() => handleRemove(setLogo1)}
                >
                  Remove
                </button>
              </>
            ) : (
              <label htmlFor="headerLogo" className="uploadBtn">
                Upload image
              </label>
            )}
          </div>
        </div>
        <div className="fields_div">
          <TextField
            label="Heading 1"
            className="input"
            fullWidth

          />
          <TextField
            label="heading 2"
            className="input"
            fullWidth
          />

        </div>
        <div className="save_btn_div">

        <button className="saveBtn">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default Slider;
