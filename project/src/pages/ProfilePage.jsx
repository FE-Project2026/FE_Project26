// src/pages/ProfilePage.jsx

import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AIChat from '../components/AIChat';

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
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderStatus = (status) => {
    switch (status) {
      case 'Approved':
        return <Badge bg="success">Đã xác nhận</Badge>;
      case 'Completed':
        return <Badge bg="primary">Hoàn thành</Badge>;
      default:
        return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
    }
  };

  return (
    <Container style={{ marginTop: '100px', marginBottom: '50px' }}>
      <Row>

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

      </Row>
    </Container>
  );
}

export default ProfilePage;
