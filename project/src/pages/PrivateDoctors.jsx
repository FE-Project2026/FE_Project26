// src/pages/PrivateDoctorPage.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faStar, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import './PrivateDoctorPage.css';

// IMPORT 2 MODAL
import BookingModal from '../components/BookingModal';
import DoctorDetailModal from '../components/DoctorDetailModal'; // <-- IMPORT MỚI

// Dữ liệu giả (Mock Data)
const doctorsData = [
  {
    id: 1,
    name: "BS. Nguyễn Văn A",
    level: "Cao cấp",
    specialty: "Đa khoa",
    experience: "15 năm",
    rating: 4.9,
    image: "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg",
    description: "Chuyên gia theo dõi sức khỏe toàn diện cho gia đình."
  },
  {
    id: 2,
    name: "ThS. BS. Trần Thị B",
    level: "Chuyên gia",
    specialty: "Dinh dưỡng",
    experience: "10 năm",
    rating: 4.8,
    image: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg",
    description: "Tư vấn chế độ dinh dưỡng và kiểm soát cân nặng."
  },
  {
    id: 3,
    name: "BS. CKII. Lê Văn C",
    level: "Trưởng khoa",
    specialty: "Tim mạch",
    experience: "20 năm",
    rating: 5.0,
    image: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
    description: "Theo dõi chỉ số huyết áp, tim mạch định kỳ tại nhà."
  },
  {
    id: 4,
    name: "BS. Phạm Thị D",
    level: "Cao cấp",
    specialty: "Nội tiết",
    experience: "8 năm",
    rating: 4.7,
    image: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
    description: "Hỗ trợ bệnh nhân tiểu đường và rối loạn nội tiết."
  },
  {
    id: 5,
    name: "BS. Phan Thị E",
    level: "Chuyên gia",
    specialty: "Tâm lý",
    experience: "12 năm",
    rating: 4.6,
    image: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
    description: "Lắng nghe và tư vấn sức khỏe tinh thần riêng tư."
  },
  {
    id: 6,
    name: "BS. Hoàng Văn F",
    level: "Cao cấp",
    specialty: "Vật lý trị liệu",
    experience: "9 năm",
    rating: 4.8,
    image: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg",
    description: "Phục hồi chức năng và massage trị liệu tại gia."
  }
];

function PrivateDoctorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // --- STATE QUẢN LÝ MODAL ---
  // 1. Modal Đặt lịch
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctorName, setSelectedDoctorName] = useState("");

  // 2. Modal Chi tiết (MỚI)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null); // Lưu toàn bộ object bác sĩ

  // Logic lọc bác sĩ
  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Hàm mở Modal Đặt lịch
  const handleShowBooking = (doctorName) => {
    setSelectedDoctorName(doctorName);
    setShowBookingModal(true);
  };

  // Hàm mở Modal Chi tiết (MỚI)
  const handleShowDetail = (doctor) => {
    setSelectedDoctor(doctor);
    setShowDetailModal(true);
  };

  return (
    <div className="private-doctor-page">
      {/* Header & Tìm kiếm */}
      <div className="private-header py-5 text-center text-white">
        <Container>
          <h1 className="display-5 fw-bold mb-3">Dịch vụ Bác sĩ Riêng</h1>
          <p className="lead mb-4">Chăm sóc sức khỏe toàn diện, riêng tư và tận tâm</p>
          <div className="search-box mx-auto p-3 rounded bg-white shadow">
            <Row className="g-2">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></InputGroup.Text>
                  <Form.Control placeholder="Tìm bác sĩ..." className="border-start-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                   <InputGroup.Text className="bg-white border-end-0"><FontAwesomeIcon icon={faFilter} className="text-muted" /></InputGroup.Text>
                  <Form.Select className="border-start-0" value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                    <option value="All">Tất cả chuyên khoa</option>
                    <option value="Đa khoa">Đa khoa</option>
                    <option value="Dinh dưỡng">Dinh dưỡng</option>
                    <option value="Tim mạch">Tim mạch</option>
                    <option value="Tâm lý">Tâm lý</option>
                    <option value="Vật lý trị liệu">Vật lý trị liệu</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}><Button variant="success" className="w-100 fw-bold">Tìm kiếm</Button></Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Danh sách bác sĩ */}
      <Container className="py-5">
        <Row>
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Col lg={4} md={6} className="mb-4" key={doctor.id}>
                <Card className="doctor-card h-100 border-0 shadow-sm">
                  <div className="doctor-img-wrapper">
                    <Card.Img variant="top" src={doctor.image} alt={doctor.name} />
                    <span className="badge-level"><FontAwesomeIcon icon={faCheckCircle} className="me-1" />{doctor.level}</span>
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fw-bold text-success">{doctor.name}</Card.Title>
                    <div className="mb-2 text-warning">
                       <FontAwesomeIcon icon={faStar} /> {doctor.rating} 
                       <span className="text-muted ms-2 small">({doctor.experience})</span>
                    </div>
                    <Card.Text className="text-muted small">{doctor.description}</Card.Text>
                    <div className="specialty-tag mt-2">{doctor.specialty}</div>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 pb-4 text-center">
                    <Button variant="outline-success" className="me-2 rounded-pill px-4" onClick={() => handleShowBooking(doctor.name)}>
                      Đặt lịch
                    </Button>
                    
                    {/* SỬA NÚT CHI TIẾT: Gọi hàm mở Modal Chi tiết */}
                    <Button 
                        variant="success" 
                        className="rounded-pill px-4"
                        onClick={() => handleShowDetail(doctor)}
                    >
                      Chi tiết
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center py-5"><h4 className="text-muted">Không tìm thấy bác sĩ phù hợp.</h4></div>
          )}
        </Row>
      </Container>

      {/* --- HIỂN THỊ CÁC MODAL --- */}
      
      {/* 1. Modal Đặt lịch */}
      <BookingModal 
        show={showBookingModal} 
        handleClose={() => setShowBookingModal(false)} 
        doctorName={selectedDoctorName}
      />

      {/* 2. Modal Chi tiết (MỚI) */}
      <DoctorDetailModal 
        show={showDetailModal}
        handleClose={() => setShowDetailModal(false)}
        doctor={selectedDoctor}
      />

    </div>
  );
}

export default PrivateDoctorPage;