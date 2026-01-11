// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import { Container, Card, Table, Badge, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// FIREBASE
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ PROFILE STATE
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    birthday: "",
    gender: "",
    address: ""
  });

  // ================= APPOINTMENTS =================
  const fetchAppointments = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, 'artifacts', appId, 'users', currentUser.uid, 'appointments'),
        orderBy('createdAt', 'desc')
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

  // ================= PROFILE =================
  const fetchProfile = async () => {
    if (!currentUser) return;
    try {
      const ref = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'info');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setProfile(snap.data());
      }
    } catch (err) {
      console.error("Lỗi lấy profile:", err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const ref = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'info');
      await setDoc(ref, profile);
      alert("Lưu thông tin thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi lưu thông tin");
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchProfile();
  }, [currentUser]);

  // ================= ACTIONS =================
  const handleUserCancel = async (id) => {
    if (!window.confirm("Bạn muốn hủy lịch này?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'appointments', id));
      fetchAppointments();
    } catch {
      alert("Lỗi khi hủy lịch");
=======
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
>>>>>>> f1afa857 ( 11-1)
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

<<<<<<< HEAD
  const renderStatus = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge bg="success">Đã xác nhận</Badge>;
      case 'Completed':
        return <Badge bg="primary">Hoàn thành</Badge>;
      default:
        return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
=======
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
>>>>>>> f1afa857 ( 11-1)
    }
  };

  return (
    <Container style={{ marginTop: '100px', marginBottom: '50px' }}>
      <Row>
<<<<<<< HEAD

        {/* ============ PROFILE CARD ============ */}
        <Col md={4} className="mb-4">
          <Card className="p-4 shadow-sm border-0">
            <div className="text-center mb-3">
              <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" width="100" alt="avatar" />
            </div>

            <input
              className="form-control mb-2"
              placeholder="Họ tên"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
            />

            <input
              className="form-control mb-2"
              placeholder="Số điện thoại"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
            />

            <input
              type="date"
              className="form-control mb-2"
              value={profile.birthday}
              onChange={e => setProfile({ ...profile, birthday: e.target.value })}
            />

            <select
              className="form-control mb-2"
              value={profile.gender}
              onChange={e => setProfile({ ...profile, gender: e.target.value })}
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>

            <input
              className="form-control mb-3"
              placeholder="Địa chỉ"
              value={profile.address}
              onChange={e => setProfile({ ...profile, address: e.target.value })}
            />

            <Button onClick={handleSaveProfile} variant="primary" size="sm" className="mb-2">
              Lưu thông tin
            </Button>

            <Button onClick={handleLogout} variant="danger" size="sm">
              Đăng xuất
            </Button>
          </Card>
        </Col>

        {/* ============ APPOINTMENTS ============ */}
        <Col md={8}>
          <div className="d-flex justify-content-between mb-4">
            <h2>Lịch hẹn của tôi</h2>
            <Button size="sm" variant="outline-primary" onClick={fetchAppointments}>Làm mới</Button>
          </div>

          {loading ? <p>Đang tải...</p> : (
            appointments.length > 0 ? (
              <Card>
                <Table hover responsive>
                  <thead>
                    <tr>
                      <th>Bác sĩ</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(app => (
                      <tr key={app.id}>
                        <td>{app.bacSi}</td>
                        <td>{app.ngayKham} - {app.gioKham}</td>
                        <td>{renderStatus(app.status)}</td>
                        <td>
                          {app.status !== "Completed" &&
                            <Button size="sm" variant="outline-danger" onClick={() => handleUserCancel(app.id)}>Hủy</Button>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            ) : (
              <div className="alert alert-info">Bạn chưa có lịch hẹn nào</div>
            )
          )}
        </Col>

=======
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
>>>>>>> f1afa857 ( 11-1)
      </Row>
    </Container>
  );
}

<<<<<<< HEAD
export default ProfilePage;
=======
export default ProfilePage;
>>>>>>> f1afa857 ( 11-1)
