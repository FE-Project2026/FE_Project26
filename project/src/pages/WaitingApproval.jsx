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
        <p className="text-muted">
          Admin đang kiểm tra thông tin của bác sĩ. Quá trình này thường mất 24h. 
          Vui lòng quay lại sau khi hồ sơ được phê duyệt.
        </p>
        <Link to="/"><Button variant="primary">Quay về trang chủ</Button></Link>
      </div>
    </Container>
  );
}