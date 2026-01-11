import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'; // Sửa lỗi: Đã thêm đuôi .jsx

/**
 * Component này kiểm tra quyền Admin.
 * Nó bảo vệ các route (ví dụ: /admin) khỏi người dùng không có quyền.
 */
const ProtectedRoute = () => {
    // Lấy data từ Context (Bao gồm currentUser và loading)
    const { currentUser, loading } = useAuth(); 

    // Kiểm tra quyền Admin
    const isAdmin = currentUser && currentUser.role === 'admin';

  if (loading) {
    // Nếu đang loading, hiển thị một thông báo
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p className="text-lg text-indigo-600">Đang tải thông tin xác thực...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // Nếu không phải admin (hoặc chưa đăng nhập), chuyển hướng về trang login
    return <Navigate to="/login" replace />;
  }

  // Nếu là admin, cho phép truy cập các route con
  return <Outlet />;
};

export default ProtectedRoute;