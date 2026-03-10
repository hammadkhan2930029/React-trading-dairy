import "./FooterSettings.css";
import React, { useState, useEffect } from "react";
import api from "../../../api/axios";


const FooterSettings = () => {
    const [formData, setFormData] = useState({
    
  });

  const [editingField, setEditingField] = useState(null);
   const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
   const [headerLogo, setHeaderLogo] = useState(null);

  //  Fetch footer data
  useEffect(() => {
    api
      .get("/adminpanel/footer_settings/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (field) => {
    setEditingField(null);
    // yahan API ya Redux dispatch call kar ke field update karna
    api
      .put("/adminpanel/footer_settings/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setMessage(" Footer updated successfully!");
        setSaving(false);
      })
      .catch((err) => {
        setMessage(" Failed to update footer. Check console.");
        setSaving(false);
      });
  };


    return (
        <div className="footer-form">
      <h2>Edit Footer Content</h2>

      {Object.keys(formData).filter((field) => field !== "id").map((field) => (
        <div className="form-row" key={field}>
          <label className="form-label">
            {field.charAt(0).toUpperCase() + field.slice(1)}:
          </label>

          {editingField === field ? (
            <>
              {field === "address" ? (
                <textarea
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              ) : (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                />
              )}

              <button
                className="save-btn"
                onClick={() => handleSave(field)}
              >
                Save
              </button>
            </>
          ) : (
            <>
              <span className="form-value">{formData[field]}</span>
              <button
                className="edit-btn"
                onClick={() => setEditingField(field)}
              >
                Edit
              </button>
            </>
          )}
          
        </div>
      ))}
     
    </div>
    );
};

export default FooterSettings;