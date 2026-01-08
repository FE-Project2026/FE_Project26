import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { 
  Stethoscope, 
  CalendarCheck, 
  UserPlus, 
  Activity, 
  ArrowRight 
} from 'lucide-react';

const HomePage = () => {
  return (
    <div className="homepage-wrapper">
      {/* 1. HERO SECTION - Banner chính */}
      <section className="bg-primary text-white py-5 text-center position-relative">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-3">
                Chăm Sóc Sức Khỏe Toàn Diện
              </h1>
              <p className="lead mb-4 opacity-75">
                Kết nối với đội ngũ bác sĩ chuyên khoa hàng đầu. 
                Đặt lịch khám nhanh chóng, tư vấn từ xa an toàn và bảo mật.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Link to="/services/privatedoctors">
                  <Button variant="light" size="lg" className="fw-bold text-primary shadow">
                    <CalendarCheck className="me-2" size={20} />
                    Đặt Lịch Ngay
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline-light" size="lg">
                    Tìm Hiểu Thêm
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 2. SERVICES SECTION - Các dịch vụ nổi bật */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase ls-2">Dịch vụ của chúng tôi</h6>
            <h2 className="fw-bold">Giải Pháp Y Tế Thông Minh</h2>
          </div>

          <Row className="g-4">
            {/* Card 1 */}
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center hover-top">
                <div className="mb-3 d-inline-block p-3 rounded-circle bg-primary bg-opacity-10 text-primary mx-auto">
                  <UserPlus size={32} />
                </div>
                <Card.Title className="fw-bold">Bác Sĩ Riêng</Card.Title>
                <Card.Text className="text-muted small">
                  Chọn bác sĩ theo chuyên khoa (Nội, Nhi, Tim mạch...) và theo dõi sức khỏe dài hạn.
                </Card.Text>
              </Card>
            </Col>

            {/* Card 2 */}
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center hover-top">
                <div className="mb-3 d-inline-block p-3 rounded-circle bg-success bg-opacity-10 text-success mx-auto">
                  <Stethoscope size={32} />
                </div>
                <Card.Title className="fw-bold">Tư Vấn Từ Xa</Card.Title>
                <Card.Text className="text-muted small">
                  Video call trực tiếp với chuyên gia để nhận lời khuyên y tế mà không cần đến bệnh viện.
                </Card.Text>
              </Card>
            </Col>

            {/* Card 3 */}
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center hover-top">
                <div className="mb-3 d-inline-block p-3 rounded-circle bg-warning bg-opacity-10 text-warning mx-auto">
                  <Activity size={32} />
                </div>
                <Card.Title className="fw-bold">Xét Nghiệm</Card.Title>
                <Card.Text className="text-muted small">
                  Đăng ký lấy mẫu xét nghiệm tại nhà và nhận kết quả trực tuyến nhanh chóng.
                </Card.Text>
              </Card>
            </Col>

            {/* Card 4 */}
            <Col md={6} lg={3}>
              <Card className="h-100 border-0 shadow-sm p-4 text-center hover-top">
                <div className="mb-3 d-inline-block p-3 rounded-circle bg-danger bg-opacity-10 text-danger mx-auto">
                  <CalendarCheck size={32} />
                </div>
                <Card.Title className="fw-bold">Quản Lý Lịch Hẹn</Card.Title>
                <Card.Text className="text-muted small">
                  Dễ dàng đặt, dời hoặc hủy lịch khám. Nhắc nhở tự động qua thông báo.
                </Card.Text>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* 3. CTA SECTION - Kêu gọi hành động */}
      <section className="py-5">
        <Container>
          <div className="bg-white border rounded-3 p-5 shadow text-center">
            <h3 className="fw-bold mb-3">Sức Khỏe Của Bạn Là Ưu Tiên Hàng Đầu</h3>
            <p className="text-muted mb-4 mx-auto" style={{maxWidth: '600px'}}>
              Đăng ký tài khoản ngay hôm nay để trải nghiệm dịch vụ y tế 4.0 và nhận ưu đãi cho lần khám đầu tiên.
            </p>
            <Link to="/register">
              <Button variant="primary" size="lg" className="rounded-pill px-5">
                Đăng Ký Ngay <ArrowRight size={20} className="ms-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default HomePage;