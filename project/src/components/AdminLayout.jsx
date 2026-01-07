import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import MainNavbar from './Navbar.jsx';
import { Navbar } from 'react-bootstrap';
/**
 * Layout này bao bọc tất cả các trang ADMIN.
 * Nó tạo ra cấu trúc Sidebar + Nội dung chính.
 */
const AdminLayout = () => {
  return (
    // Hiển thị navbar cố định ở trên cùng
    <>
      <MainNavbar />
      {/* Toàn bộ màn hình (h-screen) dùng flexbox */}
      <div className="flex h-screen" style={{ backgroundColor: '#f3f4f6', paddingTop: '64px' }}>
      
     

  {/* Vùng Nội dung Chính */}
  <main className="flex-1 p-8 overflow-y-auto" style={{ backgroundColor: 'transparent' }}>
        {/* AdminDashboard.jsx sẽ được render TẠI ĐÂY */}
        <Outlet /> 
      </main>
      </div>
    </>
  );
};

export default AdminLayout;