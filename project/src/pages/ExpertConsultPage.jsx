// src/pages/ExpertConsultPage.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faQuestionCircle, faUserMd, faClock } from '@fortawesome/free-solid-svg-icons';
import './ExpertConsultPage.css';

function ExpertConsultPage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: 'Chung',
    question: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Giả lập gửi dữ liệu
    console.log("Dữ liệu tư vấn:", formData);
    setShowSuccess(true);
    // Reset form sau 3 giây
    setTimeout(() => setShowSuccess(false), 5000);
    setFormData({ name: '', email: '', specialty: 'Chung', question: '' });
  };

  return (
    <div className="consult-page">
      {/* 1. HERO BANNER */}
      <section className="consult-hero text-center text-white">
        <Container>
          <h1 className="display-4 fw-bold">Tư vấn trực tuyến cùng Chuyên gia</h1>
          <p className="lead mt-3">
            Gửi câu hỏi của bạn và nhận phản hồi chi tiết từ đội ngũ bác sĩ hàng đầu trong vòng 24 giờ.
          </p>
        </Container>
      </section>

      {/* 2. NỘI DUNG CHÍNH (FORM & INFO) */}
      <Container className="py-5 mt-n5">
        <Row className="justify-content-center">
          {/* Cột Trái: Form Gửi câu hỏi */}
          <Col lg={7} className="mb-4">
            <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
              <Card.Header className="bg-white p-4 border-bottom-0">
                <h3 className="fw-bold text-primary m-0">
                  <FontAwesomeIcon icon={faQuestionCircle} className="me-2" />
                  Gửi câu hỏi miễn phí
                </h3>
              </Card.Header>
              <Card.Body className="p-4">
                
                {showSuccess && (
                  <Alert variant="success">
                    <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                    Câu hỏi của bạn đã được gửi thành công! Bác sĩ sẽ phản hồi qua email sớm nhất.
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formName">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control 
                          type="text" 
                          placeholder="Nhập họ tên..." 
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formEmail">
                        <Form.Label>Email nhận phản hồi</Form.Label>
                        <Form.Control 
                          type="email" 
                          placeholder="name@example.com" 
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formSpecialty">
                    <Form.Label>Chuyên khoa cần tư vấn</Form.Label>
                    <Form.Select 
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                    >
                      <option value="Chung">Tư vấn sức khỏe chung</option>
                      <option value="Tim mạch">Tim mạch</option>
                      <option value="Da liễu">Da liễu</option>
                      <option value="Nhi khoa">Nhi khoa</option>
                      <option value="Tâm lý">Tâm lý</option>
                      <option value="Khác">Khác</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formQuestion">
                    <Form.Label>Nội dung câu hỏi</Form.Label>
                    <Form.Control 
                      as="textarea" 
                      rows={5} 
                      placeholder="Mô tả triệu chứng hoặc vấn đề bạn đang gặp phải..." 
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      required 
                    />
                  </Form.Group>

                  <Button variant="primary" type="submit" size="lg" className="w-100 fw-bold rounded-pill">
                    Gửi câu hỏi ngay
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          {/* Cột Phải: Thông tin bên lề */}
          <Col lg={4}>
            {/* Box 1: Quy trình */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-3">Quy trình tư vấn</h5>
                <ul className="timeline-list">
                  <li>
                    <span className="number">1</span>
                    <div>
                      <strong>Gửi câu hỏi</strong>
                      <p className="small text-muted mb-0">Điền đầy đủ thông tin vào form.</p>
                    </div>
                  </li>
                  <li>
                    <span className="number">2</span>
                    <div>
                      <strong>Bác sĩ tiếp nhận</strong>
                      <p className="small text-muted mb-0">Hệ thống chuyển đến chuyên khoa phù hợp.</p>
                    </div>
                  </li>
                  <li>
                    <span className="number">3</span>
                    <div>
                      <strong>Nhận phản hồi</strong>
                      <p className="small text-muted mb-0">Câu trả lời chi tiết gửi về Email của bạn.</p>
                    </div>
                  </li>
                </ul>
              </Card.Body>
            </Card>

            {/* Box 2: Cam kết */}
            <Card className="bg-primary text-white border-0 shadow-sm">
              <Card.Body className="p-4 text-center">
                <FontAwesomeIcon icon={faUserMd} size="3x" className="mb-3 opacity-50" />
                <h5>Đội ngũ uy tín</h5>
                <p className="small opacity-75">
                  100% Bác sĩ tư vấn đều có chứng chỉ hành nghề và đang công tác tại các bệnh viện lớn.
                </p>
                <hr className="bg-white opacity-25" />
                <div className="d-flex justify-content-center align-items-center gap-2">
                   <FontAwesomeIcon icon={faClock} />
                   <span>Phản hồi trung bình: <strong>30 phút</strong></span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ExpertConsultPage;