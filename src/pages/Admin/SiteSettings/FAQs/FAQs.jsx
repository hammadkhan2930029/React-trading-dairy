import React from "react";
import "./FAQs.css";
import { Formik } from "formik";
import TextField from "@mui/material/TextField";


const FAQs = () => {
  return (
    <div className="faqs_container_main">
      <h2>FAQs Section</h2>
      <div >
        <Formik
          initialValues={{
            question: '',
            ans: '',
          }}
          onSubmit={(values)=>{
            console.log("values",values)
          }}>
          {({ handleBlur, handleChange, handleSubmit, values }) => (
            
            <form typeof={handleSubmit}>
              <div className="faq_form">
                <TextField
                  label="Add Question"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.question}
                  name="question"
                  className="faq_input"
                  fullWidth

                />
                <TextField
                  label="Details"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.ans}
                  name="question"
                  multiline
                  fullWidth

                  rows={4}
                  className="faq_input"
                />
                <div>

                  <button type="submit" className="submitBtn">
                    Submit
                  </button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default FAQs;
