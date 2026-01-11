// src/components/DoctorDetailModal.jsx

import React from 'react';
import { Modal, Button, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faUserMd, 
  faMapMarkerAlt, 
  faInfoCircle, 
  faEnvelope,
  faPhone 
} from '@fortawesome/free-solid-svg-icons';

function DoctorDetailModal({ show, handleClose, doctor }) {
  // Nếu chưa chọn bác sĩ nào (doctor = null) thì không render gì cả
  if (!doctor) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton className="border-0">
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
            </div>
          </Col>

          {/* Cột Phải: Chi tiết tiểu sử */}
          <Col md={7}>
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
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button variant="secondary" onClick={handleClose} className="px-4 rounded-pill me-2">
          Đóng lại
        </Button>
        <Button variant="primary" className="px-4 rounded-pill shadow-sm">
          Đặt lịch ngay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DoctorDetailModal;