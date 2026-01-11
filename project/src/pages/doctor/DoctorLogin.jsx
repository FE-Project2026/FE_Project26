import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function DoctorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Đăng nhập Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Kiểm tra Role trong Firestore
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'doctor' || userData.role === 'admin') {
          // Đúng là bác sĩ -> Cho vào Dashboard
          navigate('/doctor/dashboard');
        } else {
          // Là bệnh nhân mà đăng nhập nhầm chỗ
          setError("Tài khoản này không có quyền truy cập cổng Bác sĩ.");
          auth.signOut(); // Đăng xuất ngay
        }
      } else {
        setError("Không tìm thấy dữ liệu người dùng.");
      }
    } catch (err) {
      console.error(err);
      setError("Email hoặc mật khẩu không đúng.");
    }
    setLoading(false);
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-primary bg-opacity-10">
      <Container style={{ maxWidth: '450px' }}>
        <Card className="shadow border-0 p-4">
          <div className="text-center mb-4">
             <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" width="80" alt="Doctor" className="mb-2"/>
             <h3 className="fw-bold text-primary">Portal Bác Sĩ</h3>
             <p className="text-muted small">Đăng nhập để quản lý lịch khám</p>
          </div>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 fw-bold" disabled={loading}>
              Đăng nhập
            </Button>
          </Form>

          <div className="mt-4 text-center border-top pt-3">
            <small className="text-muted">Bạn là bệnh nhân? <Link to="/login">Đăng nhập tại đây</Link></small> <br/>
            <small className="text-muted">Chưa là đối tác? <Link to="/doctor/register" className="fw-bold">Đăng ký bác sĩ mới</Link></small>
          </div>
        </Card>
      </Container>
    </div>
  );
}

export default DoctorLogin;