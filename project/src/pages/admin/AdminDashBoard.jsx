// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import './AdminDashboard.css'; 
import { db } from '../../firebaseConfig';
<<<<<<< HEAD
import { collectionGroup, getDocs, query, doc, updateDoc, deleteDoc } from "firebase/firestore";
=======
// SỬA: Dùng collection, orderBy thay vì collectionGroup
import { collection, getDocs, query, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
>>>>>>> f1afa857 ( 11-1)
import { 
  Users, Calendar, CheckCircle, MoreVertical, 
  Clock, XCircle, CheckSquare, FileText, RefreshCw 
} from "lucide-react";

<<<<<<< HEAD
const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

=======
>>>>>>> f1afa857 ( 11-1)
export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);

<<<<<<< HEAD
  // --- 1. LẤY DỮ LIỆU TỪ FIREBASE ---
=======
  // --- 1. LẤY DỮ LIỆU TỪ BẢNG CHUNG APPOINTMENTS ---
>>>>>>> f1afa857 ( 11-1)
  const fetchAllAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      const q = query(collectionGroup(db, 'appointments'));
=======
      // Truy vấn vào collection 'appointments' ở gốc, sắp xếp mới nhất
      const q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
>>>>>>> f1afa857 ( 11-1)
      const querySnapshot = await getDocs(q);
      
      const apptList = [];
      querySnapshot.forEach((docSnap) => {
<<<<<<< HEAD
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
=======
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
>>>>>>> f1afa857 ( 11-1)
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

<<<<<<< HEAD
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
=======
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
>>>>>>> f1afa857 ( 11-1)
    } catch (err) {
      console.error("Lỗi thao tác:", err);
      alert("❌ Lỗi: " + err.message);
    }
  };

<<<<<<< HEAD
  // --- 3. HELPER RENDERING ---
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return <span className="status-badge approved"><CheckCircle size={14} /> Đã duyệt</span>;
      case 'Completed': return <span className="status-badge completed"><CheckSquare size={14} /> Hoàn thành</span>;
=======
  // --- 3. HELPER GIAO DIỆN ---
  const renderStatusBadge = (status) => {
    const s = status ? status.toLowerCase() : 'pending';
    switch (s) {
      case 'approved': return <span className="status-badge approved"><CheckCircle size={14} /> Đã duyệt</span>;
      case 'completed': return <span className="status-badge completed"><CheckSquare size={14} /> Hoàn thành</span>;
>>>>>>> f1afa857 ( 11-1)
      default: return <span className="status-badge pending"><Clock size={14} /> Chờ duyệt</span>;
    }
  };

  const formatDateTime = (date, time) => {
<<<<<<< HEAD
    if (!date) return "Chưa rõ";
    return time ? `${time} - ${date}` : date;
  };

  // --- 4. TÍNH TOÁN SỐ LIỆU (MỚI) ---
  // Đếm số lượng lịch đang ở trạng thái 'Pending'
  const pendingCount = appointments.filter(app => app.status === 'Pending').length;
  
  // Số lượng người dùng (ẢO): Giả sử hệ thống có 1,245 user + số người đã đặt lịch
  const fakeUserCount = 1245 + appointments.length; 
=======
    if (!date) return "---";
    return time ? `${time} - ${date}` : date;
  };

  // Tính toán số liệu
  const pendingCount = appointments.filter(app => (!app.status || app.status === 'pending')).length;
>>>>>>> f1afa857 ( 11-1)

  return (
    <div className="dashboard-layout">
      <main className="main-content">
<<<<<<< HEAD
        {/* HEADER */}
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Quản lý hệ thống đặt lịch khám</p>
=======
        <header className="dashboard-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Quản lý đặt lịch khám bệnh</p>
>>>>>>> f1afa857 ( 11-1)
          </div>
          <button className="btn-refresh" onClick={fetchAllAppointments}>
            <RefreshCw size={18} className={loading ? "spin" : ""} /> Làm mới
          </button>
        </header>

<<<<<<< HEAD
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
=======
        {/* THỐNG KÊ */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-icon"><Users /></div>
            <div className="stat-info">
              <h3>Người dùng</h3>
              <p>1,200+</p>
            </div>
          </div>
>>>>>>> f1afa857 ( 11-1)
          <div className="stat-card green">
            <div className="stat-icon"><Calendar /></div>
            <div className="stat-info">
              <h3>Tổng lịch hẹn</h3>
              <p>{appointments.length}</p>
            </div>
          </div>
<<<<<<< HEAD

          {/* Card Chờ Xử Lý (THẬT - Dựa vào Pending) */}
          <div className="stat-card orange">
            <div className="stat-icon"><FileText /></div>
            <div className="stat-info">
              <h3>Chờ xử lý</h3>
=======
          <div className="stat-card orange">
            <div className="stat-icon"><FileText /></div>
            <div className="stat-info">
              <h3>Cần xử lý</h3>
>>>>>>> f1afa857 ( 11-1)
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
<<<<<<< HEAD
                    <th>Bệnh nhân</th>
                    <th>Thông tin liên hệ</th>
=======
                    <th>Bệnh nhân / Bác sĩ</th>
                    <th>Liên hệ / Ghi chú</th>
>>>>>>> f1afa857 ( 11-1)
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th className="text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
<<<<<<< HEAD
                    <tr><td colSpan="5" className="text-center py-4">Chưa có lịch hẹn nào.</td></tr>
=======
                    <tr><td colSpan="5" className="text-center py-4">Chưa có dữ liệu.</td></tr>
>>>>>>> f1afa857 ( 11-1)
                  ) : (
                    appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td className="font-bold text-primary">
<<<<<<< HEAD
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
=======
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
                        
>>>>>>> f1afa857 ( 11-1)
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
<<<<<<< HEAD
                              <button className="menu-item text-success" onClick={() => handleAction('APPROVE', appt.userId, appt.id)}>
                                <CheckCircle size={16} /> Duyệt lịch
                              </button>
                              <button className="menu-item text-primary" onClick={() => handleAction('COMPLETE', appt.userId, appt.id)}>
                                <CheckSquare size={16} /> Hoàn thành
                              </button>
                              <hr className="my-1 border-gray-200"/>
                              <button className="menu-item text-danger" onClick={() => handleAction('CANCEL', appt.userId, appt.id)}>
                                <XCircle size={16} /> Hủy lịch
=======
                              <button className="menu-item text-success" onClick={() => handleAction('APPROVE', appt.id)}>
                                <CheckCircle size={16} /> Duyệt
                              </button>
                              <button className="menu-item text-primary" onClick={() => handleAction('COMPLETE', appt.id)}>
                                <CheckSquare size={16} /> Hoàn thành
                              </button>
                              <hr className="my-1 border-gray-200"/>
                              <button className="menu-item text-danger" onClick={() => handleAction('CANCEL', appt.id)}>
                                <XCircle size={16} /> Xóa
>>>>>>> f1afa857 ( 11-1)
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