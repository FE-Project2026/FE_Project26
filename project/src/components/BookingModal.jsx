// src/components/BookingModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
// 1. IMPORT TOAST
import toast from 'react-hot-toast';

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
    
    // 2. SỬ DỤNG TOAST CHO KIỂM TRA ĐĂNG NHẬP
    if (!currentUser) {
        toast.error("Vui lòng đăng nhập để đặt lịch!");
        return;
    }

    if (!doctorId) {
        toast.error("Lỗi: Không tìm thấy ID bác sĩ. Vui lòng tải lại trang.");
        return;
    }

    setLoading(true);
    // 3. TẠO MỘT TOAST CHỜ (LOADING)
    const loadingToast = toast.loading("Đang xử lý đặt lịch...");

    try {
      const appointmentsRef = collection(db, 'appointments');
      
      await addDoc(appointmentsRef, {
        patientId: currentUser.uid, 
        patientName: currentUser.displayName || currentUser.email,
        patientPhone: formData.phone,
        doctorId: doctorId,         
        doctorName: doctorName,
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // 4. CẬP NHẬT TOAST THÀNH THÀNH CÔNG
      toast.success("Đặt lịch thành công!", { id: loadingToast });
      
      handleClose();
      navigate('/profile'); 

    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      // 5. CẬP NHẬT TOAST THÀNH THẤT BẠI
      toast.error("Có lỗi xảy ra: " + error.message, { id: loadingToast });
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