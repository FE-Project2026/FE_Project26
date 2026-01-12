// src/pages/ExpertListPage.jsx

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faStar, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import './ExpertListPage.css';

// IMPORT MODAL
import BookingModal from '../components/BookingModal';
import DoctorDetailModal from '../components/DoctorDetailModal';

// IMPORT FIREBASE
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

function ExpertListPage() {
  const [expertsData, setExpertsData] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All");

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null); 
  
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const q = collection(db, "users");
        const querySnapshot = await getDocs(q);
        
        const doctorsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
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

  const filteredExperts = expertsData.filter(expert => {
    const nameMatch = expert.displayName?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = expert.bio?.toLowerCase().includes(searchTerm.toLowerCase()); 
    const specialtyMatch = selectedSpecialty === "All" || expert.specialty === selectedSpecialty;
    
    return (nameMatch || descMatch) && specialtyMatch;
  });

  const handleShowBooking = (doctor) => {
    setSelectedDoctorForBooking(doctor); 
    setShowBookingModal(true);
  };

  const handleShowDetail = (doctor) => {
    setSelectedDoctorDetail(doctor);
    setShowDetailModal(true);
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
          
          <div className="search-box mx-auto p-3 rounded bg-white shadow" style={{maxWidth: '900px'}}>
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
                  <div className="expert-img-wrapper text-center bg-light pt-4 pb-2">
                    <Card.Img 
                        variant="top" 
                        src={expert.photoURL || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"} 
                        alt={expert.displayName} 
                        style={{height: '180px', width: '180px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto'}} 
                    />
                  </div>
                  <Card.Body className="text-center pt-3">
                    <h5 className="fw-bold text-dark mb-1">{expert.displayName}</h5>
                    <p className="text-primary small fw-bold mb-2">{expert.specialty || "Bác sĩ Chuyên khoa"}</p>
                    <p className="text-muted small mb-2">{expert.hospital || "Bệnh viện Đa khoa"}</p>
                    
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
                      onClick={() => handleShowBooking(expert)}
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

      {/* MODALS */}
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
export default ExpertListPage;