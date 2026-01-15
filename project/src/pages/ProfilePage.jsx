import React, { useEffect, useState } from 'react';
import { Container, Card, Table, Badge, Button, Row, Col, Form, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AIChat from '../components/AIChat';
import toast, { Toaster } from 'react-hot-toast';

// FIREBASE
import { db } from '../firebaseConfig';
import { 
  collection, query, where, orderBy, deleteDoc, 
  doc, getDoc, setDoc, onSnapshot 
} from "firebase/firestore";

const appId = "1:890631919643:web:de12fd43d3a24e4fa500be";

function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Trạng thái ẩn/hiện form sửa

  // ✅ Cấu trúc Profile
  const [profile, setProfile] = useState({
    name: "", phone: "", birthday: "", gender: "", address: ""
  });

  // ================= 1. THEO DÕI LỊCH HẸN (KHỚP DATABASE THẬT) =================
  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(
      collection(db, 'appointments'),
      where('patientId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      setAppointments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      console.error("Lỗi lấy dữ liệu:", err);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  // ================= 2. LẤY THÔNG TIN HỒ SƠ =================
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser?.uid) return;
      try {
        const ref = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'info');
        const snap = await getDoc(ref);
        if (snap.exists()) setProfile(snap.data());
      } catch (err) {
        console.error("Lỗi lấy profile:", err);
      }
    };
    fetchProfile();
  }, [currentUser]);

  // ================= 3. LƯU HỒ SƠ & ẨN FORM =================
  const handleSaveProfile = async () => {
    if (!profile.name) return toast.error("Vui lòng nhập họ tên");
    setIsSaving(true);
    try {
      const ref = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'info');
      await setDoc(ref, profile);
      toast.success("Cập nhật thành công!");
      setIsEditing(false); // TỰ ĐỘNG ẨN BẢNG SAU KHI LƯU
    } catch (err) {
      toast.error("Lỗi khi lưu thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Container style={{ marginTop: '100px', marginBottom: '50px' }}>
      <Toaster />
      <Row>
        {/* ============ CỘT TRÁI: PROFILE & AI CHAT ============ */}
        <Col md={4} className="mb-4">
          <Card className="p-4 shadow-sm border-0 mb-4">
            <div className="text-center mb-3">
              <img 
                src={currentUser?.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                width="100" className="rounded-circle border p-1" alt="avatar" 
              />
              <p className="text-muted small mt-2">{currentUser?.email}</p>
            </div>

            {!isEditing ? (
              // HIỂN THỊ THÔNG TIN (KHI KHÔNG SỬA)
              <div className="text-center">
                <h4 className="fw-bold">{profile.name || "Chưa cập nhật tên"}</h4>
                <div className="text-start small mt-3">
                  <p className="mb-1"><strong>SĐT:</strong> {profile.phone || "---"}</p>
                  <p className="mb-1"><strong>Ngày sinh:</strong> {profile.birthday || "---"}</p>
                  <p className="mb-3"><strong>Địa chỉ:</strong> {profile.address || "---"}</p>
                </div>
                <Button variant="outline-primary" size="sm" className="w-100" onClick={() => setIsEditing(true)}>
                  Chỉnh sửa hồ sơ
                </Button>
              </div>
            ) : (
              // BẢNG NHẬP LIỆU (KHI BẤM SỬA)
              <div className="text-start">
                <Form.Control size="sm" className="mb-2" placeholder="Họ tên" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                <Form.Control size="sm" className="mb-2" placeholder="Số điện thoại" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                <Form.Control size="sm" className="mb-2" type="date" value={profile.birthday} onChange={e => setProfile({...profile, birthday: e.target.value})} />
                <Form.Select size="sm" className="mb-2" value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value})}>
                  <option value="">Giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </Form.Select>
                <Form.Control size="sm" className="mb-3" placeholder="Địa chỉ" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} />
                
                <div className="d-flex gap-2">
                  <Button onClick={handleSaveProfile} variant="success" size="sm" className="flex-grow-1" disabled={isSaving}>
                    {isSaving ? <Spinner size="sm" /> : "Lưu"}
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="light" size="sm" className="flex-grow-1 border">Hủy</Button>
                </div>
              </div>
            )}
            
            <hr />
            <Button onClick={handleLogout} variant="link" className="text-danger w-100 btn-sm text-decoration-none">Đăng xuất</Button>
          </Card>

          {/* TRỢ LÝ AI */}
          <AIChat />
        </Col>

        {/* ============ CỘT PHẢI: LỊCH SỬ ĐẶT LỊCH  ============ */}
        <Col md={8}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Lịch hẹn của tôi</h2>
            <Badge bg="primary">{appointments.length} lịch hẹn</Badge>
          </div>

          {loading ? (
            <div className="text-center p-5"><Spinner animation="border" variant="primary" /></div>
          ) : appointments.length > 0 ? (
            <Card className="border-0 shadow-sm overflow-hidden">
              <Table hover responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Bác sĩ</th>
                    <th>Ngày khám</th>
                    <th>Giờ</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id}>
                      {/* Tên trường khớp hoàn toàn với ảnh Database của bạn */}
                      <td className="fw-bold text-primary">{app.doctorName}</td>
                      <td>{app.date}</td>
                      <td>{app.time}</td>
                      <td>
                        <Badge bg={app.status === 'confirmed' ? 'success' : 'warning'}>
                          {app.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>
          ) : (
            <Card className="text-center p-5 border-0 shadow-sm">
              <p className="text-muted mb-0">Bạn chưa có lịch hẹn nào.</p>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;