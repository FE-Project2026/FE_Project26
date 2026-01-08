

import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUserMd, faGraduationCap, faBriefcase, faLanguage } from '@fortawesome/free-solid-svg-icons';

function DoctorDetailModal({ show, handleClose, doctor }) {
  // Nếu chưa chọn bác sĩ nào (doctor = null) thì không render gì cả
  if (!doctor) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="border-0">
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
            </div>
          </Col>

          {/* Cột Phải: Chi tiết tiểu sử */}
          <Col md={7}>
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
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center">
        <Button variant="secondary" onClick={handleClose} className="px-4">
          Đóng lại
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DoctorDetailModal;