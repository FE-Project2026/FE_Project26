// src/components/BookingModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Lấy thông tin user
// IMPORT FIREBASE
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const appId = "1:890631919643:web:de12fd43d3a24e4fa500be"; // ID dự án của bạn

function BookingModal({ show, handleClose, doctorName }) {
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

    setLoading(true);
    try {
      // --- THAY ĐỔI: LƯU VÀO FIREBASE ---
      // Path: artifacts/{appId}/users/{userId}/appointments
      const appointmentsRef = collection(db, 'artifacts', appId, 'users', currentUser.uid, 'appointments');
      
      await addDoc(appointmentsRef, {
        tenBenhNhan: currentUser.displayName || currentUser.email,
        bacSi: doctorName,
        ngayKham: formData.date,
        gioKham: formData.time,
        soDienThoai: formData.phone,
        ghiChu: formData.notes,
        status: 'Pending', // <--- TRẠNG THÁI MẶC ĐỊNH: CHỜ
        createdAt: serverTimestamp()
      });

      alert("Đặt lịch thành công! Vui lòng chờ Admin xác nhận.");
      handleClose();
      navigate('/profile');
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
    setLoading(false);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-success text-white">
        <Modal.Title>Đặt lịch khám</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <p className="fw-bold text-success">Bác sĩ: {doctorName}</p>
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
            <Form.Label>Số điện thoại</Form.Label>
            <Form.Control type="tel" name="phone" required onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ghi chú</Form.Label>
            <Form.Control as="textarea" rows={3} name="notes" onChange={handleChange} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Hủy</Button>
          <Button variant="success" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookingModal;