import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartbeat, faUserMd, faHandHoldingHeart, faAward, faHospital } from '@fortawesome/free-solid-svg-icons';
import './AboutPage.css'; 

function AboutPage() {
  return (
    <div className="about-page">
      {/* 1. HERO BANNER */}
      <section className="about-hero text-center text-white">
        <Container>
          <h1 className="display-4 fw-bold">Về Health Care</h1>
          <p className="lead">Hành trình mang lại cuộc sống khỏe mạnh và hạnh phúc cho cộng đồng.</p>
        </Container>
      </section>

      {/* 2. CÂU CHUYỆN & SỨ MỆNH */}
      <Container className="py-5">
        <Row className="align-items-center mb-5">
          <Col lg={6}>
            <img 
              src="https://img.freepik.com/free-photo/medical-banner-with-doctor-working-laptop_23-2149611211.jpg" 
              alt="Our Story" 
              className="img-fluid rounded-3 shadow-lg mb-4 mb-lg-0"
            />
          </Col>
          <Col lg={6}>
            <h5 className="text-primary fw-bold">CÂU CHUYỆN CỦA CHÚNG TÔI</h5>
            <h2 className="fw-bold mb-3">Kết nối Y tế - Xóa nhòa khoảng cách</h2>
            <p className="text-muted">
              Được thành lập vào năm 2023, Health Care ra đời với sứ mệnh đơn giản nhưng mạnh mẽ: 
              Làm cho việc chăm sóc sức khỏe trở nên dễ dàng tiếp cận hơn với mọi người dân Việt Nam.
            </p>
            <p className="text-muted">
              Chúng tôi hiểu rằng việc xếp hàng chờ đợi tại bệnh viện là nỗi ám ảnh. 
              Vì vậy, nền tảng Health Care giúp bạn đặt lịch khám, tư vấn từ xa và 
              theo dõi hồ sơ sức khỏe chỉ với vài cú click chuột.
            </p>
            
            {/* 3 Icons */}
            <div className="d-flex mt-4 gap-4">
                <div className="text-center">
                    <div className="icon-box bg-light text-danger rounded-circle mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: 50, height: 50}}>
                        <FontAwesomeIcon icon={faHeartbeat} />
                    </div>
                    <small className="fw-bold">Tận tâm</small>
                </div>
                <div className="text-center">
                    <div className="icon-box bg-light text-primary rounded-circle mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: 50, height: 50}}>
                        <FontAwesomeIcon icon={faUserMd} />
                    </div>
                    <small className="fw-bold">Chuyên gia</small>
                </div>
                <div className="text-center">
                    <div className="icon-box bg-light text-success rounded-circle mb-2 mx-auto d-flex align-items-center justify-content-center" style={{width: 50, height: 50}}>
                        <FontAwesomeIcon icon={faHandHoldingHeart} />
                    </div>
                    <small className="fw-bold">Sẻ chia</small>
                </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* 3. THỐNG KÊ (STATS) */}
      <section className="bg-light py-5">
        <Container>
            <Row className="text-center g-4">
                <Col md={3} sm={6}>
                    <h2 className="fw-bold text-primary display-5">50+</h2>
                    <p className="text-muted fw-bold">Bác sĩ Chuyên khoa</p>
                </Col>
                <Col md={3} sm={6}>
                    <h2 className="fw-bold text-primary display-5">10k+</h2>
                    <p className="text-muted fw-bold">Lượt tư vấn</p>
                </Col>
                <Col md={3} sm={6}>
                    <h2 className="fw-bold text-primary display-5">24/7</h2>
                    <p className="text-muted fw-bold">Hỗ trợ trực tuyến</p>
                </Col>
                <Col md={3} sm={6}>
                    <h2 className="fw-bold text-primary display-5">100%</h2>
                    <p className="text-muted fw-bold">Hài lòng</p>
                </Col>
            </Row>
        </Container>
      </section>

      {/* 4. GIÁ TRỊ CỐT LÕI */}
      <Container className="py-5">
        <div className="text-center mb-5">
            <h2 className="fw-bold">Giá trị cốt lõi</h2>
            <p className="text-muted">Kim chỉ nam cho mọi hoạt động của chúng tôi</p>
        </div>
        <Row>
            <Col md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm text-center p-4 card-hover">
                    <FontAwesomeIcon icon={faAward} size="3x" className="text-warning mb-3" />
                    <Card.Title className="fw-bold">Chất lượng hàng đầu</Card.Title>
                    <Card.Text className="text-muted small">
                        Hợp tác với các bác sĩ giỏi từ các bệnh viện tuyến đầu. Quy trình tuyển chọn khắt khe.
                    </Card.Text>
                </Card>
            </Col>
            <Col md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm text-center p-4 card-hover">
                    <FontAwesomeIcon icon={faHospital} size="3x" className="text-info mb-3" />
                    <Card.Title className="fw-bold">Công nghệ tiên tiến</Card.Title>
                    <Card.Text className="text-muted small">
                        Áp dụng AI trong chẩn đoán sơ bộ và bảo mật hồ sơ bệnh án theo tiêu chuẩn quốc tế.
                    </Card.Text>
                </Card>
            </Col>
            <Col md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm text-center p-4 card-hover">
                    <FontAwesomeIcon icon={faHandHoldingHeart} size="3x" className="text-danger mb-3" />
                    <Card.Title className="fw-bold">Lấy người bệnh làm trung tâm</Card.Title>
                    <Card.Text className="text-muted small">
                        Mọi quyết định đều dựa trên lợi ích và sự an toàn của người bệnh.
                    </Card.Text>
                </Card>
            </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutPage;