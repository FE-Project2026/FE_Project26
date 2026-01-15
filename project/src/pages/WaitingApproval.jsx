// src/pages/WaitingApproval.jsx
import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';

export default function WaitingApproval() {
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100 text-center">
      <div style={{ maxWidth: '500px' }}>
        <FontAwesomeIcon icon={faClock} size="5x" className="text-warning mb-4" />
        <h2 className="fw-bold">Hồ sơ đang chờ duyệt</h2>
        <p className="text-muted my-4">
          Cảm ơn bạn đã đăng ký trở thành đối tác. Hồ sơ của bạn đã được gửi đến Ban quản trị. 
          Quá trình xét duyệt thường mất từ <strong>12-24 giờ</strong>.
          <br />
          Chúng tôi sẽ gửi thông báo qua email khi tài khoản được kích hoạt.
        </p>
        <Link to="/">
          <Button variant="outline-primary">Về trang chủ</Button>
        </Link>
      </div>
    </Container>
  );
}