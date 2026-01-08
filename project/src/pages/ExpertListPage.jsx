// src/pages/ExpertListPage.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faStar } from '@fortawesome/free-solid-svg-icons';
import './ExpertListPage.css';

// 1. IMPORT CẢ 2 MODAL
import BookingModal from '../components/BookingModal';
import DoctorDetailModal from '../components/DoctorDetailModal';

// Dữ liệu giả (Mock Data) các bác sĩ
// Đã thêm trường 'level' để hiển thị trong Modal chi tiết
const expertsData = [
  {
    id: 1,
    name: "TS. BS. Nguyễn Văn A",
    level: "Trưởng khoa",
    specialty: "Tim mạch",
    experience: "15 năm kinh nghiệm",
    rating: 4.9,
    image: "https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg",
    description: "Chuyên gia hàng đầu về phẫu thuật tim mạch và can thiệp mạch vành."
  },
  {
    id: 2,
    name: "ThS. BS. Trần Thị B",
    level: "Chuyên gia",
    specialty: "Tâm lý",
    experience: "10 năm kinh nghiệm",
    rating: 4.8,
    image: "https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg",
    description: "Chuyên tư vấn trị liệu trầm cảm, lo âu và các vấn đề tâm lý học đường."
  },
  {
    id: 3,
    name: "BS. CKII. Lê Văn C",
    level: "Phó khoa",
    specialty: "Nhi khoa",
    experience: "20 năm kinh nghiệm",
    rating: 5.0,
    image: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg",
    description: "Nguyên trưởng khoa Nhi bệnh viện Nhi Đồng, rất mát tay với trẻ nhỏ."
  },
  {
    id: 4,
    name: "ThS. BS. Phạm Thị D",
    level: "Bác sĩ chính",
    specialty: "Da liễu",
    experience: "8 năm kinh nghiệm",
    rating: 4.7,
    image: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg",
    description: "Chuyên điều trị mụn, nám và các bệnh lý về da liễu thẩm mỹ."
  },
  {
    id: 5,
    name: "BS. Hoàng Văn E",
    level: "Chuyên gia",
    specialty: "Tiêu hóa",
    experience: "12 năm kinh nghiệm",
    rating: 4.6,
    image: "https://img.freepik.com/free-photo/portrait-hansome-young-male-doctor-man_171337-5068.jpg",
    description: "Chuyên gia nội soi tiêu hóa và điều trị dạ dày, đại tràng."
  },
  {
    id: 6,
    name: "TS. BS. Ngô Thị F",
    level: "Giảng viên ĐH Y",
    specialty: "Thần kinh",
    experience: "18 năm kinh nghiệm",
    rating: 4.9,
    image: "https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg",
    description: "Điều trị đau đầu, mất ngủ, rối loạn tiền đình và các bệnh thần kinh."
  }
];

function ExpertListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  // --- STATE QUẢN LÝ MODAL ---
  // 1. Modal Đặt lịch
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctorName, setSelectedDoctorName] = useState("");

  // 2. Modal Chi tiết (MỚI)
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Logic lọc danh sách bác sĩ
  const filteredExperts = expertsData.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "All" || expert.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  // Hàm mở Modal Đặt lịch
  const handleShowBooking = (doctorName) => {
    setSelectedDoctorName(doctorName);
    setShowBookingModal(true);
  };

  // Hàm mở Modal Chi tiết
  const handleShowDetail = (expert) => {
    setSelectedDoctor(expert);
    setShowDetailModal(true);
  };

  return (
    <div className="expert-list-page">
      {/* Header & Tìm kiếm */}
      <div className="expert-header py-5 text-center text-white">
        <Container>
          <h1 className="display-5 fw-bold mb-3">Đội ngũ Chuyên gia</h1>
          <p className="lead mb-4">Kết nối với những bác sĩ hàng đầu để chăm sóc sức khỏe của bạn</p>
          
          <div className="search-box mx-auto p-3 rounded bg-white shadow">
            <Row className="g-2">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></InputGroup.Text>
                  <Form.Control placeholder="Tìm bác sĩ theo tên..." className="border-start-0" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </InputGroup>
              </Col>
              <Col md={4}>
                <InputGroup>
                   <InputGroup.Text className="bg-white border-end-0"><FontAwesomeIcon icon={faFilter} className="text-muted" /></InputGroup.Text>
                  <Form.Select className="border-start-0" value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}>
                    <option value="All">Tất cả chuyên khoa</option>
                    <option value="Tim mạch">Tim mạch</option>
                    <option value="Tâm lý">Tâm lý</option>
                    <option value="Nhi khoa">Nhi khoa</option>
                    <option value="Da liễu">Da liễu</option>
                    <option value="Tiêu hóa">Tiêu hóa</option>
                    <option value="Thần kinh">Thần kinh</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}><Button variant="primary" className="w-100 fw-bold">Tìm kiếm</Button></Col>
            </Row>
          </div>
        </Container>
      </div>

      {/* Danh sách bác sĩ */}
      <Container className="py-5">
        <Row>
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <Col lg={4} md={6} className="mb-4" key={expert.id}>
                <Card className="expert-card h-100 border-0 shadow-sm">
                  <div className="expert-img-wrapper">
                    <Card.Img variant="top" src={expert.image} alt={expert.name} />
                    <span className="badge-specialty">{expert.specialty}</span>
                  </div>
                  <Card.Body className="text-center">
                    <Card.Title className="fw-bold text-primary">{expert.name}</Card.Title>
                    <div className="mb-2 text-warning">
                       <FontAwesomeIcon icon={faStar} /> {expert.rating} 
                       <span className="text-muted ms-2 small">({expert.experience})</span>
                    </div>
                    <Card.Text className="text-muted small">
                      {expert.description}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 pb-4 text-center">
                    {/* Nút Đặt lịch */}
                    <Button 
                      variant="outline-primary" 
                      className="me-2 rounded-pill px-4"
                      onClick={() => handleShowBooking(expert.name)}
                    >
                      Đặt lịch
                    </Button>
                    
                    {/* Nút Chi tiết (Đã sửa) */}
                    <Button 
                        variant="primary" 
                        className="rounded-pill px-4"
                        onClick={() => handleShowDetail(expert)}
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

export default ExpertListPage;