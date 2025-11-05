import React, { useState } from "react";
import "./Blogs.css";
import TextField from "@mui/material/TextField";
import { Formik } from "formik";

const Blogs = () => {
  const [blogImage, setBlogImage] = useState(null)
  const blogsHandleImg = (e, set_blog_image) => {
    const file = e.target.files[0]
    if (file) {
      set_blog_image(URL.createObjectURL(file))

    }
    console.log(file)

  }
  const handleimg = () => {
    setBlogImage(null)
  }
  return (
    <div className="blogs_container">
      <h2>Blogs Section</h2>
      <Formik initialValues={{
        blogs_heading: '',
        blogs_details: ''
      }}
        onSubmit={(values) => {
          console.log(values)
        }}>
        {({ values, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>


            <div className="blogs_main">
              <TextField
                name="blogs_heading"
                label="Blog Heading"
                className="blogs_input"
                onChange={handleChange}
                value={values.blogs_heading}
                onBlur={handleBlur}
                fullWidth
              />
              <TextField
                name="blogs_details"
                label="Blog Details"
                className="blogs_input"
                onChange={handleChange}
                value={values.blogs_details}
                onBlur={handleBlur}
                fullWidth
                multiline={true}
                rows={6}
              />
              <div className="blog_img">
                {/* <label className="label">Upload Blog Image</label> */}
                <input
                  id="BlogsImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) => blogsHandleImg(e, setBlogImage)}
                  className="blogs_file_input"
                />
                <div className="img_preview">
                  {blogImage ? (
                    <>
                      <img src={blogImage} alt="Header Logo" className="selected_blog_Img" />
                      <label
                        className="remove_Btn"
                        onClick={handleimg}
                      >
                        Remove
                      </label>
                    </>
                  ) : (
                    <label htmlFor="BlogsImage" className="blogs_uploadBtn">
                      Upload image
                    </label>
                  )}
                </div>

              </div>
            </div>
            <button type="submit" className="blogs_save_btn">
              Save Changes
            </button>
          </form>
        )}

      </Formik>

    </div>
  );
};

export default Blogs;
