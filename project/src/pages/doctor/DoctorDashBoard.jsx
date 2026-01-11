import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Nav, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faUserInjured, faClock, faVideo, 
  faCheck, faTimes, faFilePrescription, faSignOutAlt, faStethoscope 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// --- FIREBASE IMPORTS ---
import { useAuth } from '../../context/AuthContext'; 
import { db } from '../../firebaseConfig'; 
import { doc, getDoc, collection, query, where, getDocs, updateDoc, orderBy } from 'firebase/firestore';

function DoctorDashBoard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // State lưu dữ liệu thật
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. LẤY DỮ LIỆU TỪ FIREBASE KHI LOAD TRANG
  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // A. Lấy thông tin Bác sĩ (từ collection 'users')
        const doctorRef = doc(db, "users", currentUser.uid);
        const doctorSnap = await getDoc(doctorRef);
        if (doctorSnap.exists()) {
          setDoctorData(doctorSnap.data());
        }

        // B. Lấy danh sách lịch hẹn (từ collection 'appointments')
        // Điều kiện: doctorId == ID của người đang đăng nhập
        const q = query(
          collection(db, "appointments"),
          where("doctorId", "==", currentUser.uid),
          orderBy("date", "desc") // Sắp xếp ngày mới nhất lên đầu
        );
        
        const querySnapshot = await getDocs(q);
        const apptList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAppointments(apptList);

      } catch (error) {
        console.error("Lỗi lấy dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser]);

  // 2. XỬ LÝ CẬP NHẬT TRẠNG THÁI (Lưu thẳng lên Firebase)
  const handleStatusChange = async (apptId, newStatus) => {
    try {
      // Cập nhật Firestore
      const apptRef = doc(db, "appointments", apptId);
      await updateDoc(apptRef, { status: newStatus });

      // Cập nhật giao diện ngay lập tức (đỡ phải load lại trang)
      const updatedList = appointments.map(appt => 
        appt.id === apptId ? { ...appt, status: newStatus } : appt
      );
      setAppointments(updatedList);

    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại.");
    }
  };

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/doctor/login'); 
    } catch (error) {
      console.error("Lỗi đăng xuất:", error);
    }
  };

  // Tính toán thống kê nhanh
  const countPending = appointments.filter(a => a.status === 'pending').length;
  const countToday = appointments.length; // Tạm thời đếm tổng (bạn có thể lọc theo ngày hiện tại)

  if (loading) {
    return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <div className="doctor-dashboard py-5 bg-light min-vh-100">
      <Container>
        {/* HEADER: HIỂN THỊ TÊN THẬT */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-primary">Bàn làm việc Bác sĩ</h2>
            <p className="text-muted mb-0 fs-5">
              Xin chào, <span className="fw-bold text-dark">{doctorData?.displayName || "Bác sĩ"}</span>
              {doctorData?.specialty && <Badge bg="info" className="ms-2">{doctorData.specialty}</Badge>}
            </p>
          </div>
          <Button variant="danger" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Đăng xuất
          </Button>
        </div>

        {/* 1. THỐNG KÊ NHANH */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm text-center p-3 text-primary h-100">
              <h3 className="fw-bold">{countToday}</h3>
              <span className="text-muted">Tổng lịch hẹn</span>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm text-center p-3 text-warning h-100">
              <h3 className="fw-bold">{countPending}</h3>
              <span className="text-muted">Đang chờ xác nhận</span>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm text-center p-3 text-success h-100">
              <div className="mb-2"><FontAwesomeIcon icon={faStethoscope} size="2x" /></div>
              <span className="text-muted">{doctorData?.hospital || "Chưa cập nhật nơi công tác"}</span>
            </Card>
          </Col>
        </Row>

        {/* 2. DANH SÁCH LỊCH HẸN TỪ FIREBASE */}
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-white py-3">
            <Nav variant="tabs" defaultActiveKey="appointments">
              <Nav.Item>
                <Nav.Link eventKey="appointments" href="#" className="fw-bold text-primary">Quản lý Lịch hẹn</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="records" href="#" className="text-muted">Hồ sơ Bệnh nhân</Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>
          <Card.Body>
            <h5 className="mb-3 fw-bold">Danh sách bệnh nhân</h5>
            
            {appointments.length > 0 ? (
              <Table hover responsive className="align-middle">
                <thead className="bg-light text-secondary">
                  <tr>
                    <th>Bệnh nhân</th>
                    <th>Thời gian</th>
                    <th>Dịch vụ</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appt) => (
                    <tr key={appt.id}>
                      <td className="fw-bold">
                        <FontAwesomeIcon icon={faUserInjured} className="me-2 text-secondary" /> 
                        {appt.patientName || "Khách vãng lai"}
                      </td>
                      <td>
                        {appt.date} <br/> 
                        <small className="text-muted">{appt.time}</small>
                      </td>
                      <td><Badge bg="info" text="dark">{appt.service || "Khám bệnh"}</Badge></td>
                      <td>
                        {appt.status === 'pending' && <Badge bg="warning" text="dark">Chờ xác nhận</Badge>}
                        {appt.status === 'confirmed' && <Badge bg="primary">Đã xác nhận</Badge>}
                        {appt.status === 'done' && <Badge bg="success">Hoàn thành</Badge>}
                        {appt.status === 'cancelled' && <Badge bg="danger">Đã hủy</Badge>}
                      </td>
                      <td>
                        {appt.status === 'pending' && (
                          <>
                            <Button 
                              variant="success" size="sm" className="me-2"
                              onClick={() => handleStatusChange(appt.id, 'confirmed')}
                            >
                              <FontAwesomeIcon icon={faCheck} /> Nhận
                            </Button>
                            <Button 
                              variant="outline-danger" size="sm"
                              onClick={() => handleStatusChange(appt.id, 'cancelled')}
                            >
                              <FontAwesomeIcon icon={faTimes} /> Hủy
                            </Button>
                          </>
                        )}
                        
                        {appt.status === 'confirmed' && (
                          <Button variant="primary" size="sm" href={appt.meetLink || "#"} target="_blank">
                            <FontAwesomeIcon icon={faVideo} className="me-2" /> Vào khám
                          </Button>
                        )}

                        {appt.status === 'done' && (
                          <Button variant="outline-secondary" size="sm">
                            <FontAwesomeIcon icon={faFilePrescription} className="me-2" /> Xem toa
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5 text-muted">
                <p>Hiện chưa có lịch hẹn nào.</p>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default DoctorDashBoard;