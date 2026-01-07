// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; 
import { db } from '../../firebaseConfig';
import { collectionGroup, getDocs, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  Users, Calendar, CheckCircle, MoreVertical, 
  Clock, XCircle, CheckSquare, FileText, RefreshCw 
} from "lucide-react";

const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- 1. LẤY DỮ LIỆU TỪ FIREBASE ---
  const fetchAllAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collectionGroup(db, 'appointments'));
      const querySnapshot = await getDocs(q);
      
      const apptList = [];
      querySnapshot.forEach((docSnap) => {
        const pathParts = docSnap.ref.path.split('/');
        const userId = pathParts[3]; 
        const data = docSnap.data();

        apptList.push({
          id: docSnap.id,
          userId: userId, 
          ...data,
          // Đảm bảo status luôn có giá trị mặc định là Pending nếu thiếu
          status: data.status || 'Pending' 
        });
      });

      // Sắp xếp: Mới nhất lên đầu
      setAppointments(apptList.reverse());
      
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      setError("Không thể tải dữ liệu.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllAppointments();
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // --- 2. CÁC HÀM XỬ LÝ ---
  const handleAction = async (actionType, userId, apptId) => {
    setOpenMenuId(null);

    if (!userId || !apptId) return alert("Lỗi: Thiếu ID!");

    try {
      const docRef = doc(db, 'artifacts', appId, 'users', userId, 'appointments', apptId);
      
      if (actionType === 'APPROVE') {
        await updateDoc(docRef, { status: 'Approved' });
        alert("✅ Đã xác nhận lịch hẹn!");
      } 
      else if (actionType === 'COMPLETE') {
        await updateDoc(docRef, { status: 'Completed' });
        alert("✅ Đã hoàn thành lịch hẹn!");
      } 
      else if (actionType === 'CANCEL') {
        if (!window.confirm("Bạn chắc chắn muốn hủy (xóa) lịch này?")) return;
        await deleteDoc(docRef);
        alert("🗑️ Đã hủy lịch hẹn!");
      }
      fetchAllAppointments();
    } catch (err) {
      console.error("Lỗi thao tác:", err);
      alert("❌ Lỗi: " + err.message);
    }
  };

  // --- 3. HELPER RENDERING ---
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return <span className="status-badge approved"><CheckCircle size={14} /> Đã duyệt</span>;
      case 'Completed': return <span className="status-badge completed"><CheckSquare size={14} /> Hoàn thành</span>;
      default: return <span className="status-badge pending"><Clock size={14} /> Chờ duyệt</span>;
    }
  };

  const formatDateTime = (date, time) => {
    if (!date) return "Chưa rõ";
    return time ? `${time} - ${date}` : date;
  };

  // --- 4. TÍNH TOÁN SỐ LIỆU (MỚI) ---
  // Đếm số lượng lịch đang ở trạng thái 'Pending'
  const pendingCount = appointments.filter(app => app.status === 'Pending').length;
  
  // Số lượng người dùng (ẢO): Giả sử hệ thống có 1,245 user + số người đã đặt lịch
  const fakeUserCount = 1245 + appointments.length; 

  return (
    <div className="dashboard-layout">
      <main className="main-content">
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Quản lý hệ thống đặt lịch khám</p>
          </div>
          <button className="btn-refresh" onClick={fetchAllAppointments}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
        </header>

        {/* THỐNG KÊ (ĐÃ CẬP NHẬT) */}
        <div className="stats-grid">
          {/* Card Người Dùng (ẢO) */}
          <div className="stat-card blue">
            <div className="stat-icon"><Users /></div>
            <div className="stat-info">
              <h3>Tổng người dùng</h3>
              <p>{fakeUserCount.toLocaleString()}</p>
            </div>
          </div>

          {/* Card Tổng Lịch Hẹn (THẬT) */}
          <div className="stat-card green">
            <div className="stat-icon"><Calendar /></div>
            <div className="stat-info">
              <h3>Tổng lịch hẹn</h3>
              <p>{appointments.length}</p>
            </div>
          </div>

          {/* Card Chờ Xử Lý (THẬT - Dựa vào Pending) */}
          <div className="stat-card orange">
            <div className="stat-icon"><FileText /></div>
            <div className="stat-info">
              <h3>Chờ xử lý</h3>
              <p>{pendingCount}</p>
            </div>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <div className="table-container">
          <div className="table-header"><h2>Danh sách Lịch hẹn</h2></div>
          
          {loading ? (
            <div className="state-msg">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="state-msg error">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Bệnh nhân</th>
                    <th>Thông tin liên hệ</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4">Chưa có lịch hẹn nào.</td></tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="font-bold text-primary">
                          {appt.tenBenhNhan || "Khách vãng lai"}
                          <div className="text-xs text-gray-500 font-normal mt-1">BS: {appt.bacSi}</div>
                        </td>
                        <td>
                          <div className="text-sm">{appt.soDienThoai || "Không có SĐT"}</div>
                          <div className="text-xs text-gray-400 truncate" style={{maxWidth: '150px'}} title={appt.ghiChu}>{appt.ghiChu}</div>
                        </td>
                        <td>{formatDateTime(appt.ngayKham, appt.gioKham)}</td>
                        <td>{renderStatusBadge(appt.status)}</td>
                        
                        {/* CỘT THAO TÁC */}
                        <td className="text-right relative">
                          <button 
                            className="btn-icon"
                            onClick={(e) => {
                              e.stopPropagation(); 
                              setOpenMenuId(openMenuId === appt.id ? null : appt.id);
                            }}
                          >
                            <MoreVertical size={20} />
                          </button>

                          {openMenuId === appt.id && (
                            <div className="action-menu" onClick={(e) => e.stopPropagation()}>
                              <button className="menu-item text-success" onClick={() => handleAction('APPROVE', appt.userId, appt.id)}>
                                <CheckCircle size={16} /> Duyệt lịch
                              </button>
                              <button className="menu-item text-primary" onClick={() => handleAction('COMPLETE', appt.userId, appt.id)}>
                                <CheckSquare size={16} /> Hoàn thành
                              </button>
                              <hr className="my-1 border-gray-200"/>
                              <button className="menu-item text-danger" onClick={() => handleAction('CANCEL', appt.userId, appt.id)}>
                                <XCircle size={16} /> Hủy lịch
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}