// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// IMPORT FIREBASE
import { db } from '../firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, // Dùng cái này để lắng nghe thay đổi
  deleteDoc, 
  doc 
} from "firebase/firestore";

function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. TỰ ĐỘNG LẤY DỮ LIỆU & LẮNG NGHE THAY ĐỔI ---
  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);

    // Tạo câu lệnh truy vấn
    // Lưu ý: Nếu console báo lỗi index, hãy bấm vào link trong console để tạo index
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', currentUser.uid), // Chỉ lấy lịch của mình
      orderBy('createdAt', 'desc') // Mới nhất lên đầu
    );

    // Lắng nghe thời gian thực (Realtime Listener)
    // Hễ database thay đổi (Bác sĩ duyệt) là code này chạy ngay lập tức
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(list);
      setLoading(false);
    }, (error) => {
      console.error("Lỗi lấy dữ liệu:", error);
      setLoading(false);
    });

    // Dọn dẹp listener khi thoát trang (tránh rò rỉ bộ nhớ)
    return () => unsubscribe();
  }, [currentUser]);

  // --- 2. HÀM HỦY LỊCH ---
  const handleUserCancel = async (id) => {
    if(!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này không?")) return;
    
    try {
        // Xóa document khỏi bảng 'appointments'
        await deleteDoc(doc(db, 'appointments', id));
        // Không cần gọi fetch lại vì onSnapshot sẽ tự cập nhật giao diện
        alert("Đã hủy lịch thành công.");
    } catch (err) {
        console.error("Lỗi hủy:", err);
        alert("Lỗi khi hủy lịch. Vui lòng thử lại.");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // --- 3. HÀM HIỂN THỊ TRẠNG THÁI (MAPPING) ---
  const renderStatus = (status) => {
    // Chuyển về chữ thường để so sánh (tránh lỗi Approved vs approved)
    const s = status ? status.toLowerCase() : 'pending';

    switch (s) {
        case 'approved': 
        case 'confirmed': // <--- THÊM DÒNG NÀY (Để khớp với DB của bạn)
        case 'đã xác nhận': 
            return <Badge bg="success">Đã xác nhận</Badge>;
        case 'đã xác nhận': // Phòng trường hợp lưu tiếng Việt
            return <Badge bg="success">Đã xác nhận</Badge>;
        case 'completed':
            return <Badge bg="primary">Hoàn thành</Badge>;
        case 'cancelled':
            return <Badge bg="danger">Đã hủy</Badge>;
        case 'pending':
        default:
            return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
    }
  };

  return (
    <Container style={{ marginTop: '100px', marginBottom: '50px' }}>
      <Row>
        {/* CỘT TRÁI: THÔNG TIN USER */}
        <Col md={4} className="mb-4">
            <Card className="text-center p-4 shadow-sm border-0">
                <div className="mb-3 mx-auto">
                    <img 
                        src={currentUser?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                        alt="Avatar" width="100" 
                        className="rounded-circle border"
                        style={{objectFit: 'cover', height: '100px'}}
                    />
                </div>
                <h3 className="fw-bold">{currentUser?.displayName || "Người dùng"}</h3>
                <p className="text-muted">{currentUser?.email}</p>
                <Button variant="danger" size="sm" onClick={handleLogout} className="mt-2">Đăng xuất</Button>
            </Card>
        </Col>

        {/* CỘT PHẢI: DANH SÁCH LỊCH HẸN */}
        <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0 text-primary">Lịch hẹn của tôi</h2>
                {/* Badge này để báo hiệu tính năng realtime */}
                <Badge bg="info" className="fw-normal"><i className="fas fa-bolt"></i> Tự động cập nhật</Badge>
            </div>

            {loading ? <div className="text-center p-5">Đang tải dữ liệu...</div> : (
                appointments.length > 0 ? (
                    <Card className="shadow-sm border-0 overflow-hidden">
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light text-secondary small text-uppercase">
                                <tr>
                                    <th className="ps-4">Bác sĩ</th>
                                    <th>Thời gian</th>
                                    <th>Ghi chú</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((app) => (
                                    <tr key={app.id}>
                                        <td className="ps-4">
                                            <div className="fw-bold text-dark">{app.doctorName || "Bác sĩ"}</div>
                                            <small className="text-muted">ID: {app.doctorId?.substring(0,6)}...</small>
                                        </td>
                                        <td>
                                            <div className="fw-bold">{app.date}</div>
                                            <small className="text-primary fw-bold">{app.time}</small>
                                        </td>
                                        <td style={{maxWidth: '200px'}}>
                                            <small className="text-muted d-block text-truncate" title={app.notes}>
                                                {app.notes || "Không có ghi chú"}
                                            </small>
                                        </td>
                                        
                                        {/* HIỂN THỊ TRẠNG THÁI */}
                                        <td>{renderStatus(app.status)}</td>
                                        
                                        <td>
                                            {/* Chỉ cho phép hủy khi đang chờ (pending) */}
                                            {(!app.status || app.status.toLowerCase() === 'pending') && (
                                                <Button variant="outline-danger" size="sm" onClick={() => handleUserCancel(app.id)}>
                                                    Hủy
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                ) : (
                    <Alert variant="info" className="text-center border-0 shadow-sm">
                        Bạn chưa có lịch hẹn nào. Hãy vào mục <strong>Chuyên gia</strong> để đặt lịch nhé!
                    </Alert>
                )
            )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;