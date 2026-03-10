import React, { useEffect, useState } from "react";
import "./Header.css";
import api from "../../../../api/axios";  
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Header = () => {

    const [headerLogo, setHeaderLogo] = useState(null); // file
    const [footerLogo, setFooterLogo] = useState(null); // file
    const [previewHeader, setPreviewHeader] = useState(null); // preview url
    const [previewFooter, setPreviewFooter] = useState(null); // preview url
    const [loading, setLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 
  
  //  Fetch existing logos
    useEffect(() => {
        const fetchLogos = async () => {
            try {
            const res = await api.get("/adminpanel/header_settings/", {
                headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            const data = res.data;
            const BASE_URL = (api.defaults.baseURL)
            .replace(/\/api\/?$/, "")
            .replace(/\/$/, "");
            
            const getFullImageUrl = (path) => {
                if (!path) return null;
                if (path.startsWith("http")) return path;
                if (path.startsWith("/media/")) return `${BASE_URL}${path}`;
                return `${BASE_URL}/media/${path}`;
            };
            const headerUrl = getFullImageUrl(data.header_logo);
            const footerUrl = getFullImageUrl(data.footer_logo);

            setPreviewHeader(headerUrl);
            setPreviewFooter(footerUrl);
            } catch (err) {

            } finally {
            setLoading(false);
            }
        };

        fetchLogos();

    }, []); 

    // Handle file input
    const handleChange = (e, setFile, setPreview) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file); // store file for upload
            setPreview(URL.createObjectURL(file)); // show preview
        }
    };

    //  Remove selected file
    const handleRemove = async (type) => {
        try {
            const formData = new FormData();
            if (type === "header") {
                formData.append("remove_header_logo", "true");
                setPreviewHeader(null);
                setHeaderLogo(null);
            } else if (type === "footer") {
                formData.append("remove_footer_logo", "true");
                setPreviewFooter(null);
                setFooterLogo(null);
            }

            await api.put("/adminpanel/header_settings/", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setSnackbarMessage(`${type === "header" ? "Header" : "Footer"} logo removed successfully!`);
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

        } catch (err) {
            
            setSnackbarMessage("Failed to remove logo.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        }
    };


    
  //  Save changes to backend
    const handleSave = async () => {
        const formData = new FormData();
        if (headerLogo) formData.append("header_logo", headerLogo);
        if (footerLogo) formData.append("footer_logo", footerLogo);

        try {
            await api.put("/adminpanel/header_settings/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });
            setSnackbarMessage("Logos updated successfully!");
            setSnackbarSeverity("success"); 
            setSnackbarOpen(true); 
        } catch (error) {
            setSnackbarMessage("Failed to update logos.");
            setSnackbarSeverity("error"); 
            setSnackbarOpen(true);  
        }
      
    };

        if (loading) {
        return <div className="loading-text">Loading header settings...</div>;
    }

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
                    onChange={(e) => handleChange(e, setHeaderLogo, setPreviewHeader)}
                    className="fileInput"
                />
                <div className="previewBox">
                    {previewHeader ? (
                        <>
                        <img src={previewHeader} alt="Header Logo" className="selectedImg" />
                        <button
                            className="removeBtn"
                            onClick={() => handleRemove("header")}
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
                    onChange={(e) => handleChange(e, setFooterLogo, setPreviewFooter)}
                    className="fileInput"
                />
                <div className="previewBox">
                    {previewFooter ? (
                        <>
                        <img src={previewFooter} alt="Footer Logo" className="selectedImg" />
                        <button
                            className="removeBtn"
                            onClick={() => handleRemove("footer")}
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

            {/*  Save Button */}
            <div className="save_btn_div">
                <button className="SaveBtn" onClick={handleSave}>
                Save Changes
                </button>
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <MuiAlert
                        onClose={() => setSnackbarOpen(false)}
                        severity={snackbarSeverity}
                        sx={{
                            width: '100%',
                            backgroundColor: 'rgba(15, 134, 231, 0.94)',
                            color: '#fff',                    
                        }}
                        elevation={6}
                        variant="filled"
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </div>
        </div>
        
    );
};

export default Header;
