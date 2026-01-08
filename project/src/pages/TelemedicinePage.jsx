// src/pages/TelemedicinePage.jsx

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faUserMd, faClock, faFilePrescription, faMobileAlt } from '@fortawesome/free-solid-svg-icons';
import './TelemedicinePage.css';

function TelemedicinePage() {
  return (
    <div className="tele-page">
      
      {/* 1. HERO BANNER */}
      <section className="tele-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold">Bác sĩ trực tuyến <br/> <span className="highlight-text-tele">Kết nối mọi lúc</span></h1>
              <p className="lead mt-3">
                Không cần đi xa, không cần chờ đợi. Kết nối với bác sĩ chuyên khoa qua Video Call ngay tại nhà của bạn chỉ với một chạm.
              </p>
              <div className="mt-4">
                <Button as={Link} to="/experts/book" variant="light" size="lg" className="me-3 btn-tele-booking">
                  <FontAwesomeIcon icon={faVideo} className="me-2" /> Gọi bác sĩ ngay
                </Button>
                <Button variant="outline-light" size="lg">Quy trình khám</Button>
              </div>
            </Col>
            <Col lg={6} className="text-center d-none d-lg-block">
              {/* Ảnh minh họa công nghệ/bác sĩ cầm máy tính bảng */}
              <img 
                src="https://img.freepik.com/free-photo/doctor-consulting-patient-online_23-2148868619.jpg" 
                alt="Telemedicine" 
                className="img-fluid hero-img-tele"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. LỢI ÍCH (Features) */}
      <section className="tele-features py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Ưu điểm khám từ xa</h2>
            <p className="text-muted">Công nghệ y tế 4.0 mang lại sự tiện lợi tối đa</p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 text-center p-4">
                <div className="icon-wrapper-tele mb-3">
                  <FontAwesomeIcon icon={faClock} className="tele-icon" />
                </div>
                <Card.Title>Tiết kiệm thời gian</Card.Title>
                <Card.Text>
                  Loại bỏ hoàn toàn thời gian di chuyển và chờ đợi tại phòng khám. Khám đúng giờ hẹn.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 text-center p-4">
                <div className="icon-wrapper-tele mb-3">
                  <FontAwesomeIcon icon={faUserMd} className="tele-icon" />
                </div>
                <Card.Title>Bác sĩ hàng đầu</Card.Title>
                <Card.Text>
                  Mạng lưới bác sĩ chuyên khoa giỏi từ các bệnh viện lớn sẵn sàng tư vấn cho bạn.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 text-center p-4">
                <div className="icon-wrapper-tele mb-3">
                  <FontAwesomeIcon icon={faFilePrescription} className="tele-icon" />
                </div>
                <Card.Title>Toa thuốc điện tử</Card.Title>
                <Card.Text>
                  Nhận toa thuốc ngay trên ứng dụng và mua thuốc giao tận nhà dễ dàng.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 3. CÁC GÓI DỊCH VỤ */}
      <section className="tele-services py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-5">Dịch vụ nổi bật</h2>
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/pediatrician-examining-baby-online_23-2148759083.jpg" />
                <Card.Body>
                  <Card.Title>Tư vấn Nhi khoa</Card.Title>
                  <Card.Text>Dành cho trẻ nhỏ, tư vấn dinh dưỡng và các bệnh lý thường gặp.</Card.Text>
                  <Button variant="outline-info" size="sm">Đặt lịch</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/senior-woman-having-video-call-with-doctor_23-2148962325.jpg" />
                <Card.Body>
                  <Card.Title>Bệnh mạn tính</Card.Title>
                  <Card.Text>Theo dõi tiểu đường, huyết áp định kỳ mà không cần đến viện.</Card.Text>
                  <Button variant="outline-info" size="sm">Đặt lịch</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/dermatologist-looking-skin-problem-video-call_23-2148868625.jpg" />
                <Card.Body>
                  <Card.Title>Da liễu từ xa</Card.Title>
                  <Card.Text>Chẩn đoán các vấn đề về da qua hình ảnh HD và video call.</Card.Text>
                  <Button variant="outline-info" size="sm">Đặt lịch</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/medical-team-working-computer_23-2148868627.jpg" />
                <Card.Body>
                  <Card.Title>Đọc kết quả XN</Card.Title>
                  <Card.Text>Giải thích ý nghĩa các chỉ số xét nghiệm và đưa ra lời khuyên.</Card.Text>
                  <Button variant="outline-info" size="sm">Đặt lịch</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="tele-cta text-center py-5">
        <Container>
          <h3>Tải ứng dụng Health Care ngay hôm nay</h3>
          <p className="mb-4">Trải nghiệm khám bệnh mượt mà trên điện thoại của bạn.</p>
          <Button variant="light" size="lg" className="me-3">
             <FontAwesomeIcon icon={faMobileAlt} /> App Store
          </Button>
          <Button variant="outline-light" size="lg">
             <FontAwesomeIcon icon={faMobileAlt} /> Google Play
          </Button>
        </Container>
      </section>
    </div>
  );
}

export default TelemedicinePage;