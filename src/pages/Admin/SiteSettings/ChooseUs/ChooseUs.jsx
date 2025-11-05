import React, { useState } from "react";
import "./ChooseUs.css";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";

const ChooseUs = () => {
  // har section ke liye ek array of images
  const [sectionImages, setSectionImages] = useState([[], [], []]);

  const handleImageChange = (e, sectionIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("⚠️ Please sirf image select karein.");
      return;
    }

    const updated = [...sectionImages];
    updated[sectionIndex] = [
      ...updated[sectionIndex],
      URL.createObjectURL(file),
    ];
    setSectionImages(updated);
  };

  const handleRemove = (sectionIndex, imgIndex) => {
    const updated = [...sectionImages];
    updated[sectionIndex] = updated[sectionIndex].filter(
      (_, i) => i !== imgIndex
    );
    setSectionImages(updated);
  };
  console.log('section images ',sectionImages)

  return (
    <div className="chooseus-wrapper">
      <h2 className="chooseus-title">Why Choose Us</h2>
      <Formik
        initialValues={{
          heading: "",
          sub_heading_1: "",
          description_1: "",
          sub_heading_2: "",
          description_2: "",
          sub_heading_3: "",
          description_3: "",
        }}
        onSubmit={(values) => {
          console.log("Form Data:", values, sectionImages);
        }}
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
            <div className="chooseus-section">
              <TextField
                name="sub_heading_1"
                label="Sub Heading 1"
                className="chooseus-input"
                onChange={handleChange}
                value={values.sub_heading_1}
                onBlur={handleBlur}
                fullWidth
              />
              <TextField
                name="description_1"
                label="Description 1"
                className="chooseus-input"
                onChange={handleChange}
                value={values.description_1}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={3}
              />

              {/* Image Upload for Section 1 */}
              <div className="chooseus-upload">
                <label className="upload-label">Images for Section 1</label>

                {sectionImages[0].length === 0 ? (
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() =>
                      document.getElementById("file-input-0").click()
                    }
                  >
                    Upload Image
                  </button>
                ) : (
                  <div className="upload-preview">
                    {sectionImages[0].map((img, i) => (
                      <div key={i} className="upload-item">
                        <img
                          src={img}
                          alt={`Preview 1-${i}`}
                          className="upload-img"
                        />
                        <button
                          type="button"
                          className="upload-remove-btn"
                          onClick={() => handleRemove(0, i)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  id="file-input-0"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 0)}
                  className="upload-input"
                />
              </div>
            </div>

            {/* ================= Section 2 ================= */}
            <div className="chooseus-section">
              <TextField
                name="sub_heading_2"
                label="Sub Heading 2"
                className="chooseus-input"
                onChange={handleChange}
                value={values.sub_heading_2}
                onBlur={handleBlur}
                fullWidth
              />
              <TextField
                name="description_2"
                label="Description 2"
                className="chooseus-input"
                onChange={handleChange}
                value={values.description_2}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={3}
              />

              {/* Image Upload for Section 2 */}
              <div className="chooseus-upload">
                <label className="upload-label">Images for Section 2</label>

                {sectionImages[1].length === 0 ? (
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() =>
                      document.getElementById("file-input-1").click()
                    }
                  >
                    Upload Image
                  </button>
                ) : (
                  <div className="upload-preview">
                    {sectionImages[1].map((img, i) => (
                      <div key={i} className="upload-item">
                        <img
                          src={img}
                          alt={`Preview 2-${i}`}
                          className="upload-img"
                        />
                        <button
                          type="button"
                          className="upload-remove-btn"
                          onClick={() => handleRemove(1, i)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  id="file-input-1"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 1)}
                  className="upload-input"
                />
              </div>
            </div>

            {/* ================= Section 3 ================= */}
            <div className="chooseus-section">
              <TextField
                name="sub_heading_3"
                label="Sub Heading 3"
                className="chooseus-input"
                onChange={handleChange}
                value={values.sub_heading_3}
                onBlur={handleBlur}
                fullWidth
              />
              <TextField
                name="description_3"
                label="Description 3"
                className="chooseus-input"
                onChange={handleChange}
                value={values.description_3}
                onBlur={handleBlur}
                fullWidth
                multiline
                rows={3}
              />

              {/* Image Upload for Section 3 */}
              <div className="chooseus-upload">
                <label className="upload-label">Images for Section 3</label>

                {sectionImages[2].length === 0 ? (
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() =>
                      document.getElementById("file-input-2").click()
                    }
                  >
                    Upload Image
                  </button>
                ) : (
                  <div className="upload-preview">
                    {sectionImages[2].map((img, i) => (
                      <div key={i} className="upload-item">
                        <img
                          src={img}
                          alt={`Preview 3-${i}`}
                          className="upload-img"
                        />
                        <button
                          type="button"
                          className="upload-remove-btn"
                          onClick={() => handleRemove(2, i)}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  id="file-input-2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, 2)}
                  className="upload-input"
                />
              </div>
            </div>

            <button type="submit" className="chooseus-submit-btn">
              Save Changes
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ChooseUs;
