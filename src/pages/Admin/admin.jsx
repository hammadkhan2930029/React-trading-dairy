import React, { useEffect, useState } from 'react';
import { AdminMain } from "./appBar/adminMain.jsx";
import { Loader_f } from '../component/loader/loader.jsx';
import { Adminlogin } from './loginPage/adminlogin.jsx';


export const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);

      // ✅ Check if admin is already logged in (from localStorage)
      const userRole = localStorage.getItem("userRole");
      if (userRole === "Admin") {
        setIsAdminLoggedIn(true);
      }
    }, 2000);
  }, []);

  if (loading) return <Loader_f />;

  return (
    <div>
      {isAdminLoggedIn ? <AdminMain /> : <Adminlogin />}
    </div>
  );
};
