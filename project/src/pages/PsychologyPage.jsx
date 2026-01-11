// src/pages/PsychologyPage.jsx

import React from 'react';
import { Container, Row, Col, Card, Button, Accordion } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBrain, faUsers, faPhone } from '@fortawesome/free-solid-svg-icons';
import './PsychologyPage.css';

function PsychologyPage() {
  return (
    <div className="psychology-page">
      
      {/* 1. HERO BANNER */}
      <section className="psy-hero">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold">Chăm sóc sức khỏe <br/> <span className="highlight-text">Tâm thần & Cảm xúc</span></h1>
              <p className="lead mt-3">
                Chúng tôi lắng nghe, thấu hiểu và đồng hành cùng bạn vượt qua những rào cản tâm lý để tìm lại sự cân bằng trong cuộc sống.
              </p>
              <div className="mt-4">
                <Button as={Link} to="/experts/book" variant="primary" size="lg" className="me-3 btn-booking">
                  Đặt lịch ngay
                </Button>
                <Button variant="outline-light" size="lg">Tìm hiểu thêm</Button>
              </div>
            </Col>
            <Col lg={6} className="text-center d-none d-lg-block">
              {/* Ảnh minh họa: Bạn hãy thay bằng ảnh thật trong thư mục Media */}
              <img 
                src="https://img.freepik.com/free-vector/mental-health-awareness-concept_23-2148531011.jpg" 
                alt="Psychology Support" 
                className="img-fluid hero-img"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. VÌ SAO CHỌN CHÚNG TÔI */}
      <section className="psy-features py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Tại sao chọn Health Care?</h2>
            <p className="text-muted">Không gian an toàn, bảo mật và chuyên nghiệp</p>
          </div>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 text-center p-4">
                <div className="icon-wrapper mb-3">
                  <FontAwesomeIcon icon={faHeart} className="psy-icon" />
                </div>
                <Card.Title>Thấu cảm & Sẻ chia</Card.Title>
                <Card.Text>
                  Chúng tôi tạo ra môi trường không phán xét, nơi bạn có thể thoải mái chia sẻ mọi suy nghĩ.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 text-center p-4">
                <div className="icon-wrapper mb-3">
                  <FontAwesomeIcon icon={faBrain} className="psy-icon" />
                </div>
                <Card.Title>Phương pháp Khoa học</Card.Title>
                <Card.Text>
                  Áp dụng các liệu pháp tâm lý hiện đại (CBT, Mindfulness) đã được chứng minh hiệu quả.
                </Card.Text>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100 text-center p-4">
                <div className="icon-wrapper mb-3">
                  <FontAwesomeIcon icon={faUsers} className="psy-icon" />
                </div>
                <Card.Title>Bảo mật tuyệt đối</Card.Title>
                <Card.Text>
                  Thông tin cá nhân và nội dung cuộc trò chuyện của bạn được bảo mật theo tiêu chuẩn y tế.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 3. CÁC GÓI DỊCH VỤ */}
      <section className="psy-services py-5 bg-light">
        <Container>
          <h2 className="section-title text-center mb-5">Dịch vụ chuyên sâu</h2>
          <Row>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/psychologist-taking-notes-therapy-session_23-2148759089.jpg" />
                <Card.Body>
                  <Card.Title>Trầm cảm & Lo âu</Card.Title>
                  <Card.Text>Hỗ trợ vượt qua các rối loạn cảm xúc và căng thẳng kéo dài.</Card.Text>
                  <Button variant="outline-primary" size="sm">Chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/young-couple-having-argument-conflict-bad-relationships_1163-5246.jpg" />
                <Card.Body>
                  <Card.Title>Tư vấn Hôn nhân</Card.Title>
                  <Card.Text>Giải quyết mâu thuẫn, hàn gắn mối quan hệ vợ chồng/cặp đôi.</Card.Text>
                  <Button variant="outline-primary" size="sm">Chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/sad-boy-sitting-floor-while-mother-consoling-him_23-2148143242.jpg" />
                <Card.Body>
                  <Card.Title>Tâm lý Học đường</Card.Title>
                  <Card.Text>Hỗ trợ trẻ em và thanh thiếu niên gặp áp lực học tập, bắt nạt.</Card.Text>
                  <Button variant="outline-primary" size="sm">Chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6} lg={3} className="mb-4">
              <Card className="service-card h-100">
                <Card.Img variant="top" src="https://img.freepik.com/free-photo/close-up-doctor-holding-hands_23-2149191416.jpg" />
                <Card.Body>
                  <Card.Title>Trị liệu Nhóm</Card.Title>
                  <Card.Text>Kết nối với những người cùng hoàn cảnh để cùng nhau chữa lành.</Card.Text>
                  <Button variant="outline-primary" size="sm">Chi tiết</Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="psy-cta text-center py-5">
        <Container>
          <h3>Bạn chưa biết bắt đầu từ đâu?</h3>
          <p className="mb-4">Đừng ngần ngại, hãy để lại thông tin hoặc gọi ngay cho chúng tôi để được tư vấn sơ bộ miễn phí.</p>
          <Button variant="light" size="lg" className="me-3">
             <FontAwesomeIcon icon={faPhone} /> 1900 1234
          </Button>
          <Button variant="warning" size="lg" as={Link} to="/register">Đăng ký thành viên</Button>
        </Container>
      </section>
    </div>
  );
}

export default PsychologyPage;