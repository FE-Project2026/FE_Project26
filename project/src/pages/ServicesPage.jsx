import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LucideUserCheck, LucideShieldPlus, LucideFlaskConical, LucideStethoscope } from 'lucide-react';

const ServicesPage = () => {
  const services = [
    {
      id: 1,
      title: "Khám Bác Sĩ Riêng",
      desc: "Kết nối trực tiếp với các bác sĩ chuyên khoa hàng đầu.",
      icon: <LucideUserCheck size={40} className="text-primary" />,
      link: "/services/privatedoctors"
    },
    {
      id: 2,
      title: "Tư Vấn Từ Xa",
      desc: "Giải đáp thắc mắc sức khỏe qua cuộc gọi Video trực tuyến.",
      icon: <LucideStethoscope size={40} className="text-success" />,
      link: "/services/telemedicine"
    },
    {
      id: 3,
      title: "Xét Nghiệm Tổng Quát",
      desc: "Đăng ký các gói xét nghiệm máu và chỉ số sức khỏe.",
      icon: <LucideFlaskConical size={40} className="text-warning" />,
      link: "/services/TestIndex"
    },
    {
      id: 4,
      title: "Gói Chăm Sóc Ưu Tiên",
      desc: "Dịch vụ y tế đặc biệt dành cho thành viên VIP của hệ thống.",
      icon: <LucideShieldPlus size={40} className="text-danger" />,
      link: "/services/premium"
    }
  ];

  return (
    <Container className="my-5">
      <h1 className="text-center mb-5 text-primary fw-bold">Dịch Vụ Của Chúng Tôi</h1>
      <Row className="g-4">
        {services.map((item) => (
          <Col key={item.id} md={6} lg={3}>
            <Card className="h-100 border-0 shadow-sm text-center p-3 card-hover">
              <div className="mb-3 d-flex justify-content-center">
                {item.icon}
              </div>
              <Card.Body>
                <Card.Title className="fw-bold">{item.title}</Card.Title>
                <Card.Text className="text-muted small">
                  {item.desc}
                </Card.Text>
                <Link to={item.link}>
                  <Button variant="outline-primary" size="sm" className="mt-2">Chi tiết</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ServicesPage;