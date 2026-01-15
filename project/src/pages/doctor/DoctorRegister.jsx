import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Row, Col, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserMd, faHospital, faStethoscope, faEnvelope, faLock, faCheckCircle, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Firebase
import { auth, db } from '../../firebaseConfig'; 
import { createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth'; // Thêm signOut
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function DoctorRegister() {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', specialty: 'Đa khoa', hospital: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Tạo tài khoản
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Cập nhật tên
      await updateProfile(user, { displayName: formData.name });

      // 3. Lưu Firestore (isVerified: false)
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        displayName: formData.name,
        email: formData.email,
        role: 'doctor',
        specialty: formData.specialty,
        hospital: formData.hospital,
        isVerified: false, // Quan trọng: Đánh dấu chưa duyệt
        status: 'active',
        createdAt: serverTimestamp(),
        photoURL: "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
      });

      // 4. QUAN TRỌNG: Đăng xuất ngay lập tức để ngăn truy cập
      await signOut(auth);

      // 5. Hiển thị thông báo
      setShowToast(true);

      // 6. Chuyển hướng sang trang chờ duyệt thay vì Dashboard
      setTimeout(() => {
        navigate('../WaitingApproval'); 
      }, 2000);

    } catch (err) {
      console.error(err);
      setError("Email đã tồn tại hoặc có lỗi xảy ra.");
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light position-relative">
      
      {/* Toast thông báo chờ duyệt */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1050, position: 'fixed' }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg="info">
          <Toast.Header>
            <FontAwesomeIcon icon={faInfoCircle} className="text-info me-2" />
            <strong className="me-auto">Hệ thống</strong>
            <small>Vừa xong</small>
          </Toast.Header>
          <Toast.Body className="text-white fw-bold">
            Gửi hồ sơ thành công! Vui lòng chờ Admin phê duyệt.
          </Toast.Body>
        </Toast>
      </ToastContainer>

      <Container style={{ maxWidth: '800px' }}>
        <Card className="shadow-lg border-0 overflow-hidden">
          <Row className="g-0">
            {/* Giữ nguyên giao diện cũ của bạn */}
            <Col md={5} className="bg-primary text-white p-5 d-flex flex-column justify-content-center align-items-center text-center">
              <FontAwesomeIcon icon={faUserMd} size="5x" className="mb-4" />
              <h3 className="fw-bold">Hợp tác cùng Health Care</h3>
              <p>Tham gia mạng lưới y tế số 1 để kết nối với hàng triệu bệnh nhân.</p>
            </Col>

            <Col md={7} className="p-5">
              <h2 className="fw-bold text-primary mb-4">Đăng ký Đối tác</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                {/* ... Các trường nhập liệu giữ nguyên như cũ ... */}
                 <Form.Group className="mb-3"><Form.Label>Họ và tên bác sĩ</Form.Label><Form.Control required name="name" onChange={handleChange} /></Form.Group>
                 <Row>
                   <Col md={6}><Form.Group className="mb-3"><Form.Label>Chuyên khoa</Form.Label><Form.Select name="specialty" onChange={handleChange}><option>Đa khoa</option><option>Tim mạch</option><option>Da liễu</option><option>Nhi khoa</option></Form.Select></Form.Group></Col>
                   <Col md={6}><Form.Group className="mb-3"><Form.Label>Công tác tại</Form.Label><Form.Control required name="hospital" onChange={handleChange} /></Form.Group></Col>
                 </Row>
                 <Form.Group className="mb-3"><Form.Label>Email</Form.Label><Form.Control type="email" required name="email" onChange={handleChange} /></Form.Group>
                 <Form.Group className="mb-4"><Form.Label>Mật khẩu</Form.Label><Form.Control type="password" required name="password" onChange={handleChange} /></Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-2 fw-bold" disabled={loading}>
                  {loading ? 'Đang gửi hồ sơ...' : 'Gửi hồ sơ đăng ký'}
                </Button>
              </Form>
              <div className="mt-3 text-center">
                <small>Đã có tài khoản? <Link to="/doctor/login" className="fw-bold">Đăng nhập tại đây</Link></small>
              </div>
            </Col>
          </Row>
        </Card>
      </Container>
    </div>
  );
}
export default DoctorRegister;