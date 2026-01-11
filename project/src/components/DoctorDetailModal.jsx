<<<<<<< HEAD

=======
// src/components/DoctorDetailModal.jsx
>>>>>>> f1afa857 ( 11-1)

import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
<<<<<<< HEAD
import { faStar, faUserMd, faGraduationCap, faBriefcase, faLanguage } from '@fortawesome/free-solid-svg-icons';
=======
import { 
  faStar, 
  faUserMd, 
  faMapMarkerAlt, 
  faInfoCircle, 
  faEnvelope,
  faPhone 
} from '@fortawesome/free-solid-svg-icons';
>>>>>>> f1afa857 ( 11-1)

function DoctorDetailModal({ show, handleClose, doctor }) {
  // Nếu chưa chọn bác sĩ nào (doctor = null) thì không render gì cả
  if (!doctor) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="border-0">
<<<<<<< HEAD
        <Modal.Title className="fw-bold text-primary">Thông tin Bác sĩ</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Row>
          {/* Cột Trái: Ảnh và Thông tin tóm tắt */}
          <Col md={5} className="text-center border-end">
            <div className="mb-3">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="img-fluid rounded-circle shadow-sm" 
                style={{ width: '180px', height: '180px', objectFit: 'cover' }}
              />
            </div>
            <h4 className="fw-bold text-success">{doctor.name}</h4>
            <Badge bg="info" className="mb-2 p-2">{doctor.level}</Badge>
            
            <div className="mt-3 text-start px-3">
               <p className="mb-2"><FontAwesomeIcon icon={faUserMd} className="text-muted me-2" /> <strong>Chuyên khoa:</strong> {doctor.specialty}</p>
               <p className="mb-2"><FontAwesomeIcon icon={faBriefcase} className="text-muted me-2" /> <strong>Kinh nghiệm:</strong> {doctor.experience}</p>
               <p className="mb-2"><FontAwesomeIcon icon={faStar} className="text-warning me-2" /> <strong>Đánh giá:</strong> {doctor.rating}/5.0</p>
=======
        <Modal.Title className="fw-bold text-primary">
          <FontAwesomeIcon icon={faUserMd} className="me-2" />
          Hồ sơ Bác sĩ
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="p-4">
        <Row>
          {/* Cột Trái: Ảnh và Thông tin tóm tắt */}
          <Col md={5} className="text-center border-end">
            <div className="mb-3 position-relative d-inline-block">
              <img 
                /* SỬA 1: Dùng photoURL thay vì image */
                src={doctor.photoURL || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                alt={doctor.displayName} 
                className="img-fluid rounded-circle shadow" 
                style={{ width: '160px', height: '160px', objectFit: 'cover', border: '4px solid white' }}
              />
            </div>

            {/* SỬA 2: Dùng displayName thay vì name */}
            <h4 className="fw-bold text-success mb-1">{doctor.displayName}</h4>
            
            {/* SỬA 3: Logic hiển thị chức danh */}
            <Badge bg="primary" className="mb-3 px-3 py-2">
               {doctor.role === 'doctor' ? 'Bác sĩ chuyên khoa' : 'Thành viên'}
            </Badge>
            
            <div className="text-start px-2 mt-2 bg-light p-3 rounded">
               <p className="mb-2">
                 <FontAwesomeIcon icon={faUserMd} className="text-primary me-2" /> 
                 <strong>Chuyên khoa:</strong> {doctor.specialty || "Đa khoa"}
               </p>
               {/* Thêm nơi công tác từ DB */}
               <p className="mb-2">
                 <FontAwesomeIcon icon={faMapMarkerAlt} className="text-danger me-2" /> 
                 <strong>Công tác:</strong> {doctor.hospital || "Chưa cập nhật"}
               </p>
               <p className="mb-0">
                 <FontAwesomeIcon icon={faStar} className="text-warning me-2" /> 
                 <strong>Đánh giá:</strong> 5.0/5.0
               </p>
>>>>>>> f1afa857 ( 11-1)
            </div>
          </Col>

          {/* Cột Phải: Chi tiết tiểu sử */}
          <Col md={7}>
<<<<<<< HEAD
            <h5 className="fw-bold mb-3 border-bottom pb-2">Giới thiệu chuyên gia</h5>
            <p className="text-muted fst-italic">"{doctor.description}"</p>

            <h6 className="fw-bold mt-4"><FontAwesomeIcon icon={faGraduationCap} className="text-primary me-2" /> Quá trình đào tạo</h6>
            <ul className="small text-secondary">
                <li>Tốt nghiệp Đại học Y Dược TP.HCM.</li>
                <li>Chứng chỉ hành nghề chuyên khoa {doctor.specialty} quốc tế.</li>
                <li>Tu nghiệp 2 năm tại bệnh viện lớn ở Singapore.</li>
            </ul>

            <h6 className="fw-bold mt-4"><FontAwesomeIcon icon={faLanguage} className="text-primary me-2" /> Ngôn ngữ</h6>
            <div className="d-flex gap-2">
                <Badge bg="light" text="dark" className="border">Tiếng Việt</Badge>
                <Badge bg="light" text="dark" className="border">Tiếng Anh</Badge>
                <Badge bg="light" text="dark" className="border">Tiếng Pháp</Badge>
            </div>
=======
            <h5 className="fw-bold mb-3 text-primary border-bottom pb-2">
              <FontAwesomeIcon icon={faInfoCircle} className="me-2"/>
              Giới thiệu & Kinh nghiệm
            </h5>
            
            {/* SỬA 4: Dùng bio thay vì description */}
            <div className="text-secondary" style={{ whiteSpace: 'pre-line', lineHeight: '1.6', minHeight: '100px' }}>
              {doctor.bio ? (
                doctor.bio
              ) : (
                <em className="text-muted">Bác sĩ chưa cập nhật thông tin giới thiệu chi tiết.</em>
              )}
            </div>

            {/* Thông tin liên hệ (Lấy từ DB) */}
            <h6 className="fw-bold mt-4 text-dark border-bottom pb-2">
              Thông tin liên hệ
            </h6>
            <ul className="list-unstyled mt-2">
                <li className="mb-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-muted me-2" /> 
                    {doctor.email}
                </li>
                {doctor.phone && (
                    <li>
                        <FontAwesomeIcon icon={faPhone} className="text-muted me-2" /> 
                        {doctor.phone}
                    </li>
                )}
            </ul>
>>>>>>> f1afa857 ( 11-1)
          </Col>
        </Row>
      </Modal.Body>

<<<<<<< HEAD
      <Modal.Footer className="border-0 justify-content-center">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          Đóng lại
        </Button>
=======
      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button variant="secondary" onClick={handleClose} className="px-4 rounded-pill me-2">
          Đóng lại
        </Button>
        <Button variant="primary" className="px-4 rounded-pill shadow-sm">
          Đặt lịch ngay
        </Button>
>>>>>>> f1afa857 ( 11-1)
      </Modal.Footer>
    </Modal>
  );
}

export default DoctorDetailModal;