// src/components/BookingModal.jsx

import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { useAuth } from '../context/AuthContext'; // Lấy thông tin user
=======
import { useAuth } from '../context/AuthContext'; 
>>>>>>> f1afa857 ( 11-1)
// IMPORT FIREBASE
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

<<<<<<< HEAD
const appId = "1:890631919643:web:de12fd43d3a24e4fa500be"; // ID dự án của bạn

function BookingModal({ show, handleClose, doctorName }) {
=======
// Lưu ý: Thêm prop doctorId vào đây để biết đặt cho ai
function BookingModal({ show, handleClose, doctorId, doctorName }) {
>>>>>>> f1afa857 ( 11-1)
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

<<<<<<< HEAD
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
=======
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
>>>>>>> f1afa857 ( 11-1)
    }
    setLoading(false);
  };

  return (
<<<<<<< HEAD
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-success text-white">
=======
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton className="bg-primary text-white">
>>>>>>> f1afa857 ( 11-1)
        <Modal.Title>Đặt lịch khám</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
<<<<<<< HEAD
          <p className="fw-bold text-success">Bác sĩ: {doctorName}</p>
=======
          <div className="alert alert-info py-2 small">
             Đặt lịch với Bác sĩ: <strong>{doctorName}</strong>
          </div>
          
>>>>>>> f1afa857 ( 11-1)
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
<<<<<<< HEAD
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
=======
          
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
>>>>>>> f1afa857 ( 11-1)
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookingModal;