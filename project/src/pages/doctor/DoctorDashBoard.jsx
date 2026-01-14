import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Nav, Spinner, Form, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, faUserInjured, faClock, faVideo, 
  faCheck, faTimes, faFilePrescription, faSignOutAlt, faStethoscope, faUserEdit, faInfoCircle 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// --- FIREBASE IMPORTS ---
import { useAuth } from '../../context/AuthContext'; 
import { db } from '../../firebaseConfig'; 
import { doc, getDoc, collection, query, where, getDocs, updateDoc, orderBy } from 'firebase/firestore';

function DoctorDashBoard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('appointments'); // Quản lý tab hiện tại
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form State cho hồ sơ
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    specialty: '',
    hospital: '',
    bio: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;
      try {
        setLoading(true);
        const doctorRef = doc(db, "users", currentUser.uid);
        const doctorSnap = await getDoc(doctorRef);
        if (doctorSnap.exists()) {
          const data = doctorSnap.data();
          setDoctorData(data);
          setProfileForm({
            displayName: data.displayName || '',
            specialty: data.specialty || 'Đa khoa',
            hospital: data.hospital || '',
            bio: data.bio || ''
          });
        }

        const q = query(
          collection(db, "appointments"),
          where("doctorId", "==", currentUser.uid),
          orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const apptList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAppointments(apptList);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  // Xử lý cập nhật hồ sơ bác sĩ
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const doctorRef = doc(db, "users", currentUser.uid);
      await updateDoc(doctorRef, {
        ...profileForm,
        lastUpdated: new Date()
      });
      setDoctorData({ ...doctorData, ...profileForm });
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
    } catch (error) {
      setMessage({ type: 'danger', text: 'Lỗi cập nhật: ' + error.message });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleStatusChange = async (apptId, newStatus) => {
    try {
      const apptRef = doc(db, "appointments", apptId);
      await updateDoc(apptRef, { status: newStatus });
      setAppointments(appointments.map(appt => appt.id === apptId ? { ...appt, status: newStatus } : appt));
    } catch (error) {
      alert("Lỗi cập nhật trạng thái.");
    }
  };

  const handleLogout = async () => {
    try { await logout(); navigate('/doctor/login'); } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" variant="primary" /></div>;

  return (
    <div className="doctor-dashboard py-5 bg-light min-vh-100">
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold text-primary">Bàn làm việc Bác sĩ</h2>
            <p className="text-muted mb-0 fs-5">
              Xin chào, <span className="fw-bold text-dark">{doctorData?.displayName}</span>
            </p>
          </div>
          <Button variant="danger" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Đăng xuất</Button>
        </div>

        <Card className="border-0 shadow-sm mb-4">
          <Card.Header className="bg-white py-3">
            <Nav variant="tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav.Item>
                <Nav.Link eventKey="appointments" className="fw-bold">
                  <FontAwesomeIcon icon={faCalendarCheck} className="me-2" /> Lịch hẹn
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="profile" className="fw-bold text-success">
                  <FontAwesomeIcon icon={faUserEdit} className="me-2" /> Hồ sơ chuyên môn
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body className="p-4">
            {activeTab === 'appointments' ? (
              <>
                <h5 className="mb-4 fw-bold">Danh sách bệnh nhân</h5>
                {appointments.length > 0 ? (
                  <Table hover responsive className="align-middle">
                    {/* Giữ nguyên phần Table của bạn ở đây */}
                    <thead className="bg-light text-secondary">
                      <tr>
                        <th>Bệnh nhân</th><th>Thời gian</th><th>Dịch vụ</th><th>Trạng thái</th><th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((appt) => (
                        <tr key={appt.id}>
                          <td className="fw-bold"><FontAwesomeIcon icon={faUserInjured} className="me-2 text-secondary" />{appt.patientName}</td>
                          <td>{appt.date}<br/><small className="text-muted">{appt.time}</small></td>
                          <td><Badge bg="info" text="dark">{appt.service || "Khám bệnh"}</Badge></td>
                          <td>
                             <Badge bg={appt.status === 'pending' ? 'warning' : appt.status === 'confirmed' ? 'primary' : 'success'}>
                               {appt.status}
                             </Badge>
                          </td>
                          <td>
                             {/* ... Các nút bấm hành động của bạn ... */}
                             {appt.status === 'pending' && <Button size="sm" variant="success" onClick={() => handleStatusChange(appt.id, 'confirmed')}><FontAwesomeIcon icon={faCheck} /></Button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : <div className="text-center py-5">Chưa có lịch hẹn nào.</div>}
              </>
            ) : (
              // PHẦN MỚI: FORM CẬP NHẬT THÔNG TIN GIỚI THIỆU
              <Row>
                <Col md={8} className="mx-auto">
                  <h5 className="mb-4 fw-bold text-success"><FontAwesomeIcon icon={faInfoCircle} /> Thông tin giới thiệu</h5>
                  {message.text && <Alert variant={message.type}>{message.text}</Alert>}
                  
                  <Form onSubmit={handleUpdateProfile}>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Tên hiển thị</Form.Label>
                          <Form.Control 
                            type="text" 
                            value={profileForm.displayName}
                            onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="fw-bold">Chuyên khoa</Form.Label>
                          <Form.Select 
                            value={profileForm.specialty}
                            onChange={(e) => setProfileForm({...profileForm, specialty: e.target.value})}
                          >
                            <option>Đa khoa</option><option>Tim mạch</option><option>Nhi khoa</option><option>Tâm thần</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Bệnh viện / Phòng khám công tác</Form.Label>
                      <Form.Control 
                        type="text" 
                        value={profileForm.hospital}
                        onChange={(e) => setProfileForm({...profileForm, hospital: e.target.value})}
                        placeholder="Ví dụ: Bệnh viện Chợ Rẫy"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-bold">Giới thiệu bản thân & Kinh nghiệm</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={5} 
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                        placeholder="Hãy mô tả quá trình học tập, bằng cấp và thế mạnh của bác sĩ..."
                      />
                    </Form.Group>

                    <Button variant="success" type="submit" className="w-100 py-2 fw-bold" disabled={updateLoading}>
                      {updateLoading ? 'Đang lưu...' : 'Lưu thay đổi hồ sơ'}
                    </Button>
                  </Form>
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default DoctorDashBoard;