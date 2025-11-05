
import React, { useState } from "react";
import "./Header.css";

const Header = () => {
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
    <div className="header_form">
      <h1 className="header-title">Header Section</h1>

      {/* Header Logo */}
      <div className="editLogo">
        <label className="label">Change Header Logo</label>
        <input
          id="headerLogo"
          type="file"
          accept="image/*"
          onChange={(e) => handleChange(e, setLogo1)}
          className="fileInput"
        />
        <div className="previewBox">
          {logo1 ? (
            <>
              <img src={logo1} alt="Header Logo" className="selectedImg" />
              <button
                className="removeBtn"
                onClick={() => handleRemove(setLogo1)}
              >
                Remove
              </button>
            </>
          ) : (
            <label htmlFor="headerLogo" className="header_uploadBtn">
              Upload Logo
            </label>
          )}
        </div>
      </div>

      {/* Footer Logo */}
      <div className="editLogo">
        <label className="label">Change Footer Logo</label>
        <input
          id="footerLogo"
          type="file"
          accept="image/*"
          onChange={(e) => handleChange(e, setLogo2)}
          className="fileInput"
        />
        <div className="previewBox">
          {logo2 ? (
            <>
              <img src={logo2} alt="Footer Logo" className="selectedImg" />
              <button
                className="removeBtn"
                onClick={() => handleRemove(setLogo2)}
              >
                Remove
              </button>
            </>
          ) : (
            <label htmlFor="footerLogo" className="header_uploadBtn">
              Upload Logo
            </label>
          )}
        </div>
      </div>
      <div className="save_btn_div">
        <button className="SaveBtn">
          Save Changes
        </button>
      </div>

    </div>
  );
};

export default Header;
