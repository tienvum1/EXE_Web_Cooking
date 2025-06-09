import React, { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../api/user';

const AdminProtectedRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false); // Assume not admin on error
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Đang kiểm tra quyền truy cập...</div>; // Or a loading spinner
  }

  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminProtectedRoute; 