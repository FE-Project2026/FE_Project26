// src/pages/ExpertListPage.jsx

<<<<<<< HEAD
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

=======
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faStar, faStethoscope, faUserMd, faHeartPulse, faBrain, faBaby, faSyringe } from '@fortawesome/free-solid-svg-icons';
import './ExpertListPage.css';

// IMPORT MODAL
import BookingModal from '../components/BookingModal';
import DoctorDetailModal from '../components/DoctorDetailModal';

// IMPORT FIREBASE
import { db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

// --- DỮ LIỆU GỢI Ý (Giữ nguyên vì là static) ---
const symptomSuggestions = [
  { label: "Đau đầu / Mất ngủ", specialty: "Thần kinh", icon: faBrain, color: "info" },
  { label: "Tim đập nhanh", specialty: "Tim mạch", icon: faHeartPulse, color: "danger" },
  { label: "Stress / Trầm cảm", specialty: "Tâm lý", icon: faUserMd, color: "warning" },
  { label: "Trẻ em ốm sốt", specialty: "Nhi khoa", icon: faBaby, color: "success" },
  { label: "Mụn / Ngứa da", specialty: "Da liễu", icon: faSyringe, color: "secondary" },
  { label: "Đau dạ dày", specialty: "Tiêu hóa", icon: faStethoscope, color: "primary" },
];

function ExpertListPage() {
  const [expertsData, setExpertsData] = useState([]); // Dữ liệu thật từ Firebase
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Lưu cả Object Doctor để truyền ID và Tên vào Modal
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null); 
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState(null);

  // 1. LẤY DANH SÁCH BÁC SĨ TỪ FIREBASE
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Lấy tất cả user trong collection 'doctors'
        // Bạn có thể thêm điều kiện where('isVerified', '==', true) nếu muốn chỉ hiện bác sĩ đã duyệt
        const q = collection(db, "users");
        const querySnapshot = await getDocs(q);
        
        const doctorsList = querySnapshot.docs.map(doc => ({
          id: doc.id, // UID của bác sĩ
          ...doc.data()
        }));
        
        setExpertsData(doctorsList);
      } catch (error) {
        console.error("Lỗi lấy danh sách bác sĩ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // 2. LOGIC LỌC
  const filteredExperts = expertsData.filter(expert => {
    // Tìm kiếm theo tên hoặc mô tả (nếu có)
    const nameMatch = expert.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = expert.bio?.toLowerCase().includes(searchTerm.toLowerCase()); // bio là giới thiệu
    
    // Lọc theo chuyên khoa
    const specialtyMatch = selectedSpecialty === "All" || expert.specialty === selectedSpecialty;
    
    return (nameMatch || descMatch) && specialtyMatch;
  });

  // Mở Modal Đặt lịch
  const handleShowBooking = (doctor) => {
    setSelectedDoctorForBooking(doctor); // Lưu bác sĩ được chọn
    setShowBookingModal(true);
  };

  // Mở Modal Chi tiết
  const handleShowDetail = (doctor) => {
    setSelectedDoctorDetail(doctor);
    setShowDetailModal(true);
  };

  const handleSuggestionClick = (specialty) => {
    setSelectedSpecialty(specialty);
  };

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div className="expert-list-page">
      {/* Header & Tìm kiếm */}
      <div className="expert-header py-5 text-center text-white bg-primary">
        <Container>
          <h1 className="display-5 fw-bold mb-3">Đội ngũ Chuyên gia</h1>
          <p className="lead mb-4">Kết nối trực tiếp với các bác sĩ hàng đầu.</p>
          
          {/* Box Tìm kiếm */}
          <div className="search-box mx-auto p-3 rounded bg-white shadow mb-4" style={{maxWidth: '900px'}}>
            <Row className="g-2">
              <Col md={6}>
                <InputGroup>
                  <InputGroup.Text className="bg-white border-end-0"><FontAwesomeIcon icon={faSearch} className="text-muted" /></InputGroup.Text>
                  <Form.Control 
                    placeholder="Tìm tên bác sĩ..." 
                    className="border-start-0" 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
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
                    <option value="Đa khoa">Đa khoa</option>
                  </Form.Select>
                </InputGroup>
              </Col>
              <Col md={2}><Button variant="dark" className="w-100 fw-bold">Tìm kiếm</Button></Col>
            </Row>
          </div>

          {/* Gợi ý */}
          <div className="suggestions-container">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Button 
                variant={selectedSpecialty === "All" ? "light" : "outline-light"} 
                size="sm" 
                className="rounded-pill"
                onClick={() => setSelectedSpecialty("All")}
              >
                Tất cả
              </Button>
              {symptomSuggestions.map((item, index) => (
                <Button 
                  key={index}
                  variant={selectedSpecialty === item.specialty ? "warning" : "outline-light"}
                  size="sm"
                  className="rounded-pill px-3"
                  onClick={() => handleSuggestionClick(item.specialty)}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Danh sách bác sĩ */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="fw-bold text-primary border-start border-4 border-primary ps-3">
            {selectedSpecialty === "All" ? "Tất cả bác sĩ" : `Bác sĩ chuyên khoa: ${selectedSpecialty}`}
          </h4>
          <span className="text-muted">Tìm thấy {filteredExperts.length} bác sĩ</span>
        </div>

        <Row>
          {filteredExperts.length > 0 ? (
            filteredExperts.map((expert) => (
              <Col lg={4} md={6} className="mb-4" key={expert.id}>
                <Card className="expert-card h-100 border-0 shadow-sm hover-up">
                  <div className="expert-img-wrapper position-relative text-center bg-light pt-3">
                    <Card.Img 
                        variant="top" 
                        src={expert.photoURL || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                        alt={expert.displayName} 
                        style={{height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto'}} 
                    />
                    <Badge bg="primary" className="position-absolute top-0 end-0 m-2 py-2 px-3 shadow-sm">
                      {expert.specialty || "Bác sĩ"}
                    </Badge>
                  </div>
                  <Card.Body className="text-center pt-4">
                    <h5 className="fw-bold text-dark">{expert.displayName}</h5>
                    <p className="text-primary small fw-bold mb-2">{expert.hospital || "Chưa cập nhật nơi làm việc"}</p>
                    
                    <div className="mb-3 text-warning small">
                        <FontAwesomeIcon icon={faStar} /> 5.0
                    </div>
                    <Card.Text className="text-muted small px-2">
                      {expert.bio || "Chưa có thông tin giới thiệu thêm."}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-top-0 pb-4 text-center">
                    <Button 
                      variant="outline-primary" 
                      className="me-2 rounded-pill px-4 btn-sm"
                      onClick={() => handleShowBooking(expert)} // Truyền cả object bác sĩ vào
                    >
                      Đặt lịch
                    </Button>
                    <Button 
                        variant="primary" 
                        className="rounded-pill px-4 btn-sm"
                        onClick={() => handleShowDetail(expert)}
                    >
                      Chi tiết
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))
          ) : (
            <div className="text-center py-5">
              <div className="display-1 text-muted mb-3"><FontAwesomeIcon icon={faStethoscope} /></div>
              <h4 className="text-muted">Chưa có bác sĩ nào thuộc chuyên khoa này.</h4>
              <Button variant="link" onClick={() => setSelectedSpecialty("All")}>Xem tất cả</Button>
            </div>
          )}
        </Row>
      </Container>

      {/* --- HIỂN THỊ CÁC MODAL --- */}
      
      {/* Truyền đúng ID và Tên bác sĩ vào Modal đặt lịch */}
      {selectedDoctorForBooking && (
        <BookingModal 
            show={showBookingModal} 
            handleClose={() => setShowBookingModal(false)} 
            doctorId={selectedDoctorForBooking.id}
            doctorName={selectedDoctorForBooking.displayName}
        />
      )}

      {selectedDoctorDetail && (
        <DoctorDetailModal 
            show={showDetailModal}
            handleClose={() => setShowDetailModal(false)}
            doctor={selectedDoctorDetail}
        />
      )}
    </div>
  );
}
>>>>>>> f1afa857 ( 11-1)
export default ExpertListPage;