// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
// IMPORT FIREBASE
import { db } from '../firebaseConfig';
import { collection, query, getDocs, orderBy, deleteDoc, doc } from "firebase/firestore";

const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- LẤY DỮ LIỆU TỪ FIREBASE ---
  const fetchAppointments = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'artifacts', appId, 'users', currentUser.uid, 'appointments'),
        orderBy('createdAt', 'desc') // Sắp xếp mới nhất lên đầu
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(list);
    } catch (err) {
      console.error("Lỗi lấy lịch sử khám:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentUser]);

  // Hủy lịch từ phía người dùng
  const handleUserCancel = async (id) => {
    if(!window.confirm("Bạn muốn hủy lịch này?")) return;
    try {
        await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'appointments', id));
        fetchAppointments(); // Tải lại danh sách
    } catch (err) {
        alert("Lỗi khi hủy lịch");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // --- HÀM HIỂN THỊ TRẠNG THÁI (MAPPING) ---
  const renderStatus = (status) => {
    switch (status) {
        case 'Approved':
            return <Badge bg="success">Đã xác nhận</Badge>; // Admin đã bấm "Đặt hẹn"
        case 'Completed':
            return <Badge bg="primary">Hoàn thành</Badge>; // Admin đã bấm "Hoàn thành"
        case 'Pending':
        default:
            return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>; // Mới đặt
    }
  };

  return (
    <Container style={{ marginTop: '100px', marginBottom: '50px' }}>
      <Row>
        <Col md={4} className="mb-4">
            <Card className="text-center p-4 shadow-sm border-0">
                <div className="mb-3 mx-auto">
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Avatar" width="100" />
                </div>
                <h3 className="fw-bold">{currentUser?.displayName || "Người dùng"}</h3>
                <p className="text-muted">{currentUser?.email}</p>
                <Button variant="danger" size="sm" onClick={handleLogout}>Đăng xuất</Button>
            </Card>
        </Col>

        <Col md={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold m-0">Lịch hẹn của tôi</h2>
                <Button variant="outline-primary" size="sm" onClick={fetchAppointments}>Làm mới</Button>
            </div>

            {loading ? <p>Đang tải...</p> : (
                appointments.length > 0 ? (
                    <Card className="shadow-sm border-0 overflow-hidden">
                        <Table hover responsive className="mb-0 align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Bác sĩ</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map((app) => (
                                    <tr key={app.id}>
                                        <td className="ps-4 fw-bold text-primary">{app.bacSi}</td>
                                        <td>
                                            <div>{app.ngayKham}</div>
                                            <small className="text-muted">{app.gioKham}</small>
                                        </td>
                                        
                                        {/* HIỂN THỊ TRẠNG THÁI */}
                                        <td>{renderStatus(app.status)}</td>
                                        
                                        <td>
                                            {/* Chỉ cho phép hủy khi chưa hoàn thành */}
                                            {app.status !== 'Completed' && (
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
                    <div className="alert alert-info text-center">Bạn chưa có lịch hẹn nào.</div>
                )
            )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;