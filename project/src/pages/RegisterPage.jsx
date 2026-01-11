// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { Container, Form, Button, Alert, FloatingLabel } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext'; // Hook Auth của chúng ta
import { useNavigate, Link } from 'react-router-dom';
import { updateProfile } from "firebase/auth"; // Import hàm cập nhật profile

function RegisterPage() {
  // --- State cho form ---
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // --- State cho logic ---
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Lấy hàm từ Context và Router ---
  const { register, currentUser } = useAuth(); // 'register' là hàm createUserWithEmailAndPassword
  const navigate = useNavigate();

  // --- Xử lý Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt tải lại trang

    // 1. Kiểm tra mật khẩu
    if (password !== confirmPassword) {
      return setError('Mật khẩu không trùng khớp'); // Dừng lại nếu lỗi
    }

    setError('');
    setLoading(true);

    try {
      // 2. Tạo User bằng email và password
      const userCredential = await register(email, password);
      
      // 3. Cập nhật Tên hiển thị (Username) cho user vừa tạo
      await updateProfile(userCredential.user, {
        displayName: username 
      });

      // 4. Đăng ký thành công, điều hướng về trang chủ
      navigate('/'); 
    } catch (err) {
      // Xử lý lỗi từ Firebase
      if (err.code === 'auth/email-already-in-use') {
        setError('Email này đã được sử dụng.');
      } else if (err.code === 'auth/weak-password') {
        setError('Mật khẩu phải có ít nhất 6 ký tự.');
      } else {
        setError('Đăng ký thất bại. Vui lòng thử lại.');
      }
      console.error(err); // In lỗi ra console để debug
    }
    
    setLoading(false); // Xong việc, tắt loading
  };

  return (
    // Dùng Container của Bootstrap và đẩy xuống dưới Navbar
    <Container 
      className="border p-3" 
      style={{ width: '400px', marginTop: '100px', marginBottom: '100px' }}
    >
      <h4 className="text-center">Sign Up</h4>

      {/* Hiển thị lỗi nếu có */}
      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}

      {/* --- FORM ĐÃ CHUYỂN SANG REACT-BOOTSTRAP --- */}
      <Form onSubmit={handleSubmit}>
        
        {/* Dùng FloatingLabel để có style giống file HTML của bạn */}
        <FloatingLabel controlId="username" label="UserName" className="mt-4 mb-4">
          <Form.Control 
            type="text" 
            placeholder="UserName" 
            name="txtname"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
          />
        </FloatingLabel>

        <FloatingLabel controlId="email" label="Email" className="mt-4 mb-4">
          <Form.Control 
            type="email" 
            placeholder="Email" 
            name="txtmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </FloatingLabel>

        <FloatingLabel controlId="txtpass" label="Password" className="mt-4 mb-4">
          <Form.Control 
            type="password" 
            placeholder="Password" 
            name="txtpass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </FloatingLabel>
        
        <FloatingLabel controlId="txtconfirm" label="Confirm Password" className="mt-4 mb-4">
          <Form.Control 
            type="password" 
            placeholder="Confirm Password" 
            name="txtconfirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required 
          />
        </FloatingLabel>
        
        <div className="text-center mt-3">
          <Button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Sign Up'}
          </Button>
          
          <p className="d-inline mt-2">Have an account? </p> 
          {/* Dùng <Link> của React Router */}
          <Link to="/login" className="text-decoration-none">Sign in</Link>
        </div>
      </Form>
    </Container>
  );
}

export default RegisterPage;