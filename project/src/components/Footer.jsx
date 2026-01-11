import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'; // Thêm icon cho đẹp

const Footer = () => {
  return (
    // Đổi sang bg-dark text-white để nổi bật và dễ đọc
    <footer className="bg-dark text-white pt-5 pb-3 mt-5">
      <Container>
        <Row>
          {/* CỘT 1: THÔNG TIN CHUNG */}
          <Col md={4} className="mb-4">
            <h5 className="text-uppercase fw-bold text-primary mb-3">Health Care</h5>
            <p className="small text-white-50">
              Hệ thống chăm sóc sức khỏe từ xa hàng đầu. 
              Kết nối bệnh nhân và bác sĩ mọi lúc, mọi nơi.
            </p>
            <div className="d-flex gap-3 mt-3">
              <a href="#" className="text-white"><Facebook size={20} /></a>
              <a href="#" className="text-white"><Instagram size={20} /></a>
              <a href="#" className="text-white"><Youtube size={20} /></a>
            </div>
          </Col>

          {/* CỘT 2: DÀNH CHO BỆNH NHÂN */}
          <Col md={3} className="mb-4">
            <h5 className="fw-bold mb-3">Bệnh Nhân</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/services" className="text-white-50 text-decoration-none">Dịch vụ y tế</Link></li>
              <li className="mb-2"><Link to="/experts/list" className="text-white-50 text-decoration-none">Tìm bác sĩ</Link></li>
              <li className="mb-2"><Link to="/community/forum" className="text-white-50 text-decoration-none">Cộng đồng</Link></li>
            </ul>
          </Col>

          {/* CỘT 3: DÀNH CHO ĐỐI TÁC (PHẦN BẠN CẦN) */}
          <Col md={3} className="mb-4">
            <h5 className="fw-bold mb-3 text-warning">Dành cho Đối tác</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/doctor/login" className="text-white text-decoration-none hover-primary">
                  ➤ Đăng nhập Bác sĩ
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/doctor/register" className="text-white text-decoration-none hover-primary">
                  ➤ Trở thành Bác sĩ
                </Link>
              </li>
            </ul>
          </Col>

          {/* CỘT 4: LIÊN HỆ */}
          <Col md={2} className="mb-4">
            <h5 className="fw-bold mb-3">Liên Hệ</h5>
            <div className="small text-white-50">
              <p className="mb-2"><MapPin size={16} className="me-2" /> Hà Nội, VN</p>
              <p className="mb-2"><Phone size={16} className="me-2" /> 1900 1234</p>
              <p className="mb-2"><Mail size={16} className="me-2" /> help@healthcare.vn</p>
            </div>
          </Col>
        </Row>
<hr className="border-secondary" />

        {/* COPYRIGHT */}
        <div className="text-center pt-2 small text-white-50">
          © {new Date().getFullYear()} Hệ thống Khám sức khỏe từ xa. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;