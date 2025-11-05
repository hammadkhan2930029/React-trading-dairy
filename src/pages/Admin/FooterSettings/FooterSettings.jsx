import "./FooterSettings.css";
import React, { useState, useEffect } from "react";
import api from "../../../api/axios";


const FooterSettings = () => {
    const [formData, setFormData] = useState({
    facebook: "https://facebook.com/yourpage",
    twitter: "https://twitter.com/yourpage",
    linkedin: "https://linkedin.com/in/yourpage",
    youtube: "https://youtube.com/yourpage",
    address: "Mateen Shopping Galaxy, 5th Floor, Karachi Pakistan",
    email: "info@cogentdevs.com",
    phone: "0331 9998780",
  });

  const [editingField, setEditingField] = useState(null);
   const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch footer data
  useEffect(() => {
    api
      .get("/accounts/footer_settings/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setFormData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch footer settings:", err);
        setLoading(false);
      });
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (field) => {
    setEditingField(null);
    console.log("Updated Field:", field, "=", formData[field]);
    // yahan API ya Redux dispatch call kar ke field update karna
    api
      .put("/accounts/footer_settings/", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => {
        setMessage("✅ Footer updated successfully!");
        setSaving(false);
      })
      .catch((err) => {
        console.error("Failed to update footer:", err);
        setMessage("❌ Failed to update footer. Check console.");
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