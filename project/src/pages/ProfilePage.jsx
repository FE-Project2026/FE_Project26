// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, Form } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc, collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import toast, { Toaster } from 'react-hot-toast';

const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({ name: "", phone: "", address: "" });

  // SỬA LỖI: Thêm kiểm tra currentUser để tránh lỗi dòng 39 và 45
  const fetchProfile = async () => {
    if (!currentUser?.uid) return;
    try {
      const ref = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'info');
      const snap = await getDoc(ref);
      if (snap.exists()) setProfile(snap.data());
    } catch (err) {
      console.error("Lỗi lấy hồ sơ:", err.message);
    }
  };

  const handleSaveProfile = async () => {
    if (!currentUser?.uid) return;
    const loadToast = toast.loading("Đang lưu...");
    try {
      const ref = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'info');
      await setDoc(ref, profile);
      toast.success("Đã lưu!", { id: loadToast });
      setIsEditing(false);
    } catch (err) {
      toast.error("Lỗi lưu dữ liệu", { id: loadToast });
    }
  };

  useEffect(() => {
    if (!currentUser?.uid) return;

    fetchProfile();
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => {
      console.error("Lỗi lấy lịch hẹn:", err.message); // Fix lỗi dòng 79
    });

    return () => unsub();
  }, [currentUser]);

  const renderStatus = (s) => {
    const status = s?.toLowerCase() || 'pending';
    if (status === 'confirmed' || status === 'approved') return <Badge bg="success">Đã xác nhận</Badge>;
    if (status === 'completed') return <Badge bg="primary">Hoàn thành</Badge>;
    return <Badge bg="warning" text="dark">Chờ xác nhận</Badge>;
  };

  return (
    <Container style={{ marginTop: '100px' }}>
      <Toaster />
      <Row>
        <Col md={4}>
          <Card className="p-4 shadow-sm border-0 text-center">
            <img 
              src={currentUser?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
              width="100" className="rounded-circle mb-3 mx-auto" alt="avatar" 
            />
            {!isEditing ? (
              <>
                <h4>{profile.name || currentUser?.displayName || "Người dùng"}</h4>
                <p className="text-muted small">{currentUser?.email}</p>
                <Button variant="outline-primary" size="sm" onClick={() => setIsEditing(true)}>Sửa hồ sơ</Button>
              </>
            ) : (
              <div className="text-start">
                <Form.Control className="mb-2" value={profile.name} placeholder="Tên" onChange={e => setProfile({...profile, name: e.target.value})} />
                <Form.Control className="mb-2" value={profile.phone} placeholder="SĐT" onChange={e => setProfile({...profile, phone: e.target.value})} />
                <Button variant="primary" size="sm" className="w-100 mb-1" onClick={handleSaveProfile}>Lưu</Button>
                <Button variant="light" size="sm" className="w-100" onClick={() => setIsEditing(false)}>Hủy</Button>
              </div>
            )}
            <Button variant="link" className="text-danger mt-3" onClick={logout}>Đăng xuất</Button>
          </Card>
        </Col>
        <Col md={8}>
          <h3 className="fw-bold mb-4">Lịch hẹn của tôi</h3>
          <Card className="border-0 shadow-sm">
            <Table hover responsive className="mb-0">
              <thead><tr><th>Bác sĩ</th><th>Ngày</th><th>Trạng thái</th></tr></thead>
              <tbody>
                {appointments.map(app => (
                  <tr key={app.id}>
                    <td>{app.doctorName}</td>
                    <td>{app.date}</td>
                    <td>{renderStatus(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;