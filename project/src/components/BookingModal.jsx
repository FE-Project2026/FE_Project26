// src/components/BookingModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
// IMPORT FIREBASE
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Lưu ý: Thêm prop doctorId vào đây để biết đặt cho ai
function BookingModal({ show, handleClose, doctorId, doctorName }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    date: '', time: '', phone: '', notes: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Vui lòng đăng nhập để đặt lịch!");

    // Kiểm tra xem có doctorId chưa (quan trọng)
    if (!doctorId) {
        alert("Lỗi: Không tìm thấy ID bác sĩ. Vui lòng tải lại trang.");
        return;
    }

    setLoading(true);
    try {
      // --- THAY ĐỔI QUAN TRỌNG ---
      // Lưu vào collection "appointments" ở thư mục gốc (Root Collection)
      // Để cả Bác sĩ và Bệnh nhân đều dễ dàng truy xuất
      const appointmentsRef = collection(db, 'appointments');
      
      await addDoc(appointmentsRef, {
        // Thông tin người đặt (Bệnh nhân)
        patientId: currentUser.uid, 
        patientName: currentUser.displayName || currentUser.email,
        patientPhone: formData.phone,
        
        // Thông tin người nhận (Bác sĩ)
        doctorId: doctorId,         
        doctorName: doctorName,

        // Chi tiết lịch hẹn
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        
        status: 'pending', // Trạng thái chờ
        createdAt: serverTimestamp()
      });

      alert("Đặt lịch thành công! Vui lòng theo dõi trạng thái trong Hồ sơ cá nhân.");
      handleClose();
      // Chuyển hướng về trang Hồ sơ cá nhân để xem lịch vừa đặt
      navigate('/profile'); 

    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      // In lỗi chi tiết ra để dễ debug
      alert("Có lỗi xảy ra: " + error.message);
    }
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
        <Modal.Title>Đặt lịch khám</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div className="alert alert-info py-2 small">
             Đặt lịch với Bác sĩ: <strong>{doctorName}</strong>
          </div>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Ngày khám</Form.Label>
                <Form.Control type="date" name="date" required onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Giờ khám</Form.Label>
                <Form.Control type="time" name="time" required onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại liên hệ</Form.Label>
            <Form.Control 
                type="tel" 
                name="phone" 
                required 
                placeholder="Nhập số điện thoại của bạn"
                onChange={handleChange} 
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Triệu chứng / Ghi chú</Form.Label>
            <Form.Control 
                as="textarea" 
                rows={3} 
                name="notes" 
                placeholder="Mô tả sơ qua tình trạng sức khỏe..."
                onChange={handleChange} 
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Hủy bỏ</Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Xác nhận'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookingModal;