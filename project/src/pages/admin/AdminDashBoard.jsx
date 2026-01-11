// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; 
import { db } from '../../firebaseConfig';
// SỬA: Dùng collection, orderBy thay vì collectionGroup
import { collection, getDocs, query, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { 
  Users, Calendar, CheckCircle, MoreVertical, 
  Clock, XCircle, CheckSquare, FileText, RefreshCw 
} from "lucide-react";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

  // --- 1. LẤY DỮ LIỆU TỪ BẢNG CHUNG APPOINTMENTS ---
  const fetchAllAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Truy vấn vào collection 'appointments' ở gốc, sắp xếp mới nhất
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const apptList = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        apptList.push({
          id: docSnap.id,
          ...data,
          status: data.status || 'pending' 
        });
      });

      setAppointments(apptList);
    } catch (err) {
      console.error("Lỗi lấy dữ liệu:", err);
      if (err.message.includes("permissions")) {
        setError("Lỗi quyền truy cập: Bạn cần cập nhật Firestore Rules (Bước 1).");
      } else if (err.message.includes("index")) {
        setError("Đang tạo Index... Vui lòng đợi vài phút.");
      } else {
        setError("Không thể tải dữ liệu: " + err.message);
      }
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

  // --- 2. XỬ LÝ DUYỆT / HỦY ---
  const handleAction = async (actionType, apptId) => {
    setOpenMenuId(null);
    if (!apptId) return;

    try {
      // Trỏ thẳng vào document trong collection 'appointments'
      const docRef = doc(db, 'appointments', apptId);
      
      if (actionType === 'APPROVE') {
        await updateDoc(docRef, { status: 'approved' });
        alert("✅ Đã duyệt lịch!");
      } 
      else if (actionType === 'COMPLETE') {
        await updateDoc(docRef, { status: 'completed' });
        alert("✅ Đã hoàn thành!");
      } 
      else if (actionType === 'CANCEL') {
        if (!window.confirm("Bạn chắc chắn muốn xóa lịch này?")) return;
        await deleteDoc(docRef);
        alert("🗑️ Đã xóa lịch!");
      }
      fetchAllAppointments(); // Tải lại bảng
    } catch (err) {
      console.error("Lỗi thao tác:", err);
      alert("❌ Lỗi: " + err.message);
    }
  };

  // --- 3. HELPER GIAO DIỆN ---
  const renderStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    switch (s) {
      case 'approved': return <span className="status-badge approved"><CheckCircle size={14} /> Đã duyệt</span>;
      case 'completed': return <span className="status-badge completed"><CheckSquare size={14} /> Hoàn thành</span>;
      default: return <span className="status-badge pending"><Clock size={14} /> Chờ duyệt</span>;
    }
  };

  const formatDateTime = (date, time) => {
    if (!date) return "---";
    return time ? `${time} - ${date}` : date;
  };

  // Tính toán số liệu
  const pendingCount = appointments.filter(app => (!app.status || app.status === 'pending')).length;

  return (
    <div className="dashboard-layout">
      <main className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Quản lý đặt lịch khám bệnh</p>
          </div>
          <button className="btn-refresh" onClick={fetchAllAppointments}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
        </header>

        {/* THỐNG KÊ */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon"><Users /></div>
            <div className="stat-info">
              <h3>Người dùng</h3>
              <p>1,200+</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon"><Calendar /></div>
            <div className="stat-info">
              <h3>Tổng lịch hẹn</h3>
              <p>{appointments.length}</p>
            </div>
          </div>
          <div className="stat-card orange">
            <div className="stat-icon"><FileText /></div>
            <div className="stat-info">
              <h3>Cần xử lý</h3>
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
                    <th>Bệnh nhân / Bác sĩ</th>
                    <th>Liên hệ / Ghi chú</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-4">Chưa có dữ liệu.</td></tr>
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="font-bold text-primary">
                          {/* Hỗ trợ cả tên biến mới (patientName) và cũ (tenBenhNhan) */}
                          {appt.patientName || appt.tenBenhNhan || "Bệnh nhân"}
                          <div className="text-xs text-gray-500 font-normal mt-1">
                            BS: {appt.doctorName || appt.bacSi || "---"}
                          </div>
                        </td>
                        <td>
                          <div className="text-sm fw-bold">{appt.patientPhone || appt.soDienThoai || "---"}</div>
                          <div className="text-xs text-gray-400 truncate" style={{maxWidth: '200px'}} title={appt.notes}>
                            {appt.notes || appt.ghiChu || "Không có ghi chú"}
                          </div>
                        </td>
                        <td>{formatDateTime(appt.date || appt.ngayKham, appt.time || appt.gioKham)}</td>
                        <td>{renderStatusBadge(appt.status)}</td>
                        
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
                              <button className="menu-item text-success" onClick={() => handleAction('APPROVE', appt.id)}>
                                <CheckCircle size={16} /> Duyệt
                              </button>
                              <button className="menu-item text-primary" onClick={() => handleAction('COMPLETE', appt.id)}>
                                <CheckSquare size={16} /> Hoàn thành
                              </button>
                              <hr className="my-1 border-gray-200"/>
                              <button className="menu-item text-danger" onClick={() => handleAction('CANCEL', appt.id)}>
                                <XCircle size={16} /> Xóa
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