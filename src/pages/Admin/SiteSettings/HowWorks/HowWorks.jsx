import React from "react";
import "./HowWorks.css";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";

const HowWorks = () => {


  return (
    <div className="chooseus-wrapper">
      <h2 className="chooseus-title">How its work!</h2>
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
              <h2>Section 1</h2>
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

              
            </div>

            {/* ================= Section 2 ================= */}
            <div className="chooseus-section">
              <h2>Section 2</h2>

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

             
            </div>

            {/* ================= Section 3 ================= */}
            <div className="chooseus-section">
              <h2>Section 3</h2>

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

export default HowWorks;
