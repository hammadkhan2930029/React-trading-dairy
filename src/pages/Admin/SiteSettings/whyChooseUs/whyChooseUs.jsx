import React, { useState } from "react";
import "./whyChooseUs.css";
import TextField from '@mui/material/TextField';

const WhyChooseUs_crud = () => {
  const [logo1, setLogo1] = useState(null);

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
    <div className="Card_Container">
      <h2>Choose Us Section</h2>
      <div className="card_main_container">
        <div className="edit_card_image">
          <label className="card_label">Change Image</label>
          <input
            id="CardImage"
            type="file"
            accept="image/*"
            onChange={(e) => handleChange(e, setLogo1)}
            className="card_fileInput"
          />
          <div className="card_previewBox">
            {logo1 ? (
              <>
                <img src={logo1} alt="Card image" className="selected_card_Img" />
                <button
                  className="removeBtn"
                  onClick={() => handleRemove(setLogo1)}
                >
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
          <TextField  label="Heading "  className="input" fullWidth/>
          <TextField  label="heading " multiline={true} rows={4} className="input" fullWidth/>
          <TextField  label="point 1 "  className="input" fullWidth/>
          <TextField  label="Point 2 "  className="input" fullWidth/>
          <TextField  label="point 3 "  className="input" fullWidth/>
          <TextField  label="point 4 "  className="input" fullWidth/>


        </div>
        <div className="save_btn_div">

        <button className="saveBtn">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs_crud;
