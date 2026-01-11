// src/components/Navbar.jsx

import React from 'react';
<<<<<<< HEAD
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faSignOutAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';

// Import Context
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// --- CẤU HÌNH MENU DATA (Đã chỉnh sửa đường dẫn chuẩn) ---
=======
import { Navbar, Nav, NavDropdown, Container, Button, Dropdown, Image } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faSignOutAlt, faUser, faUserMd } from '@fortawesome/free-solid-svg-icons';
import { faStethoscope } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
// Import Context
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// --- CẤU HÌNH MENU DATA (GIỮ NGUYÊN NHƯ BẠN YÊU CẦU) ---
>>>>>>> f1afa857 ( 11-1)
const menuData = [
  { id: 'home', labelKey: 'title', href: '/' },
  {
    id: 'services',
    labelKey: 'services',
    href: '/services',
    children: [
      { id: 'service1', labelKey: 'service1', href: '/services/privatedoctors' }, 
      { id: 'service2', labelKey: 'service2', href: '/services/psychology' }, 
      { id: 'service3', labelKey: 'service3', href: '/services/telemedicine' },
<<<<<<< HEAD
      { id: 'service4', labelKey: 'service4', href: '/services/TestIndex' }, // Đã sửa link bài test
=======
      { id: 'service4', labelKey: 'service4', href: '/services/TestIndex' }, 
>>>>>>> f1afa857 ( 11-1)
    ],
  },
  {
    id: 'expert',
    labelKey: 'expert',
    href: '/experts/list',
    children: [
      { id: 'expert1', labelKey: 'expert1', href: '/experts/list' },
      { id: 'expert2', labelKey: 'expert2', href: '/experts/consult' },
    ],
  },
  {
    id: 'community',
    labelKey: 'community',
    href: '/community/forum',
    children: [
      { id: 'forum', labelKey: 'forum', href: '/community/forum' },
<<<<<<< HEAD
     
=======
>>>>>>> f1afa857 ( 11-1)
    ],
  },
  {
    id: 'about',
    labelKey: 'about_us',
    href: '/about',
    children: [
      { id: 'mission', labelKey: 'mission', href: '/about/mission' },
<<<<<<< HEAD
     
=======
>>>>>>> f1afa857 ( 11-1)
    ],
  },
];

<<<<<<< HEAD
// --- COMPONENT RENDER MENU ĐỆ QUY ---
=======
// --- COMPONENT RENDER MENU ĐỆ QUY (GIỮ NGUYÊN) ---
>>>>>>> f1afa857 ( 11-1)
function RenderMenuItemRecursive({ item }) {
  const { t } = useLanguage();
  const label = t(item.labelKey);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <NavDropdown title={label} id={`dropdown-${item.id}`}>
        {item.children.map((child) => (
          <RenderMenuItemRecursive key={child.id} item={child} />
        ))}
      </NavDropdown>
    );
  }

<<<<<<< HEAD
  // Dùng as={Link} để không reload trang
=======
>>>>>>> f1afa857 ( 11-1)
  return (
    <NavDropdown.Item as={Link} to={item.href}>{label}</NavDropdown.Item>
  );
}

<<<<<<< HEAD
// --- COMPONENT CHUYỂN ĐỔI NGÔN NGỮ ---
=======
// --- COMPONENT CHUYỂN ĐỔI NGÔN NGỮ (GIỮ NGUYÊN) ---
>>>>>>> f1afa857 ( 11-1)
function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const currentLanguageText = {
    'vi': 'Tiếng Việt',
    'en': 'English',
    'jp': '日本語'
  }[language];

  return (
    <NavDropdown 
      title={(
        <span><FontAwesomeIcon icon={faGlobe} /> {currentLanguageText}</span>
      )} 
      id="language-dropdown"
      className="me-3"
    >
      <NavDropdown.Item onClick={() => setLanguage('vi')}>Tiếng Việt</NavDropdown.Item>
      <NavDropdown.Item onClick={() => setLanguage('en')}>English</NavDropdown.Item>
      <NavDropdown.Item onClick={() => setLanguage('jp')}>日本語</NavDropdown.Item>
    </NavDropdown>
  );
}

// --- COMPONENT NAVBAR CHÍNH ---
function MainNavbar() {
  const { t } = useLanguage();
<<<<<<< HEAD
  const { currentUser, isLoggedIn, logout, isAdmin } = useAuth(); // Lấy cả isAdmin
=======
  // Lấy thêm userRole từ AuthContext
  const { currentUser, logout, userRole } = useAuth(); 
>>>>>>> f1afa857 ( 11-1)
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

<<<<<<< HEAD
  // Lấy tên hiển thị (Ưu tiên displayName, nếu không có thì lấy email)
  const username = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'User');
=======
  // Xác định đường dẫn Dashboard dựa trên vai trò
  const dashboardLink = userRole === 'doctor' ? '/doctor/dashboard' : '/dashboard';
>>>>>>> f1afa857 ( 11-1)

  return (
    <Navbar expand="lg" className="bg-white shadow-sm sticky-top py-2">
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/">
            <img src="/Media/logo.png" alt="Health Care Logo" width="50px" />
<<<<<<< HEAD
            
=======
>>>>>>> f1afa857 ( 11-1)
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* --- MENU CHÍNH (CĂN GIỮA) --- */}
<<<<<<< HEAD
          <Nav className="mx-auto align-items-center">
=======
          <Nav className="mx-auto align-items-center fw-bold">
>>>>>>> f1afa857 ( 11-1)
            {menuData.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const label = t(item.labelKey);

                if (hasChildren) {
                    return (
                        <NavDropdown title={label} id={`dropdown-${item.id}`} key={item.id}>
<<<<<<< HEAD
                            {/* Render các mục con */}
=======
>>>>>>> f1afa857 ( 11-1)
                            {item.children.map((child) => (
                                <RenderMenuItemRecursive key={child.id} item={child} />
                            ))}
                        </NavDropdown>
                    );
                } else {
                    return (
                        <Nav.Link as={Link} to={item.href} key={item.id}>{label}</Nav.Link>
                    );
                }
            })}
          </Nav>
          
          {/* --- PHẦN BÊN PHẢI (NGÔN NGỮ + USER) --- */}
<<<<<<< HEAD
          <Nav className="align-items-center">
            <LanguageSwitcher />
            
            {/* Wrapper này giữ layout ổn định (CSS nav-action-button) */}
            <div className="nav-action-button">
              {isLoggedIn ? (
                // 1. TRẠNG THÁI: ĐÃ ĐĂNG NHẬP
                <NavDropdown title={`Xin chào, ${username}`} id="profile-dropdown">
                  
                  {/* Link đến Hồ sơ */}
                  <NavDropdown.Item as={Link} to="/profile">Hồ sơ cá nhân</NavDropdown.Item>
                  
                  {/* Link Admin (Chỉ hiện nếu là Admin) */}
                  {isAdmin && (
                    <NavDropdown.Item as={Link} to="/admin" className="text-danger fw-bold">
                      <FontAwesomeIcon icon={faUserShield} className="me-2" />
                      Trang quản trị
                    </NavDropdown.Item>
                  )}

                  <NavDropdown.Divider />
                  
                  {/* Nút Đăng xuất */}
                  <NavDropdown.Item onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} /> Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                // 2. TRẠNG THÁI: CHƯA ĐĂNG NHẬP
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
=======
          <Nav className="align-items-center d-flex gap-2">
            <LanguageSwitcher />
            
            <div className="nav-action-button d-flex align-items-center">
              {currentUser ? (
                // 1. TRẠNG THÁI: ĐÃ ĐĂNG NHẬP (Hiện Avatar + Tên)
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent text-dark fw-bold px-0">
                    <Image 
                      src={currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                      roundedCircle 
                      width="40" 
                      height="40" 
                      className="me-2 border shadow-sm"
                      style={{objectFit: 'cover'}}
                    />
                    <div className="d-flex flex-column text-start" style={{lineHeight: '1.2'}}>
                      <span className="text-primary">{currentUser.displayName || currentUser.email?.split('@')[0]}</span>
                      <small className="text-muted" style={{fontSize: '10px', textTransform: 'uppercase'}}>
                        {userRole === 'doctor' ? 'Bác sĩ' : 'Thành viên'}
                      </small>
                    </div>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow border-0 mt-2">
                    <Dropdown.Item as={Link} to="/profile">
                      <FontAwesomeIcon icon={faUser} className="me-2 text-primary" /> Hồ sơ cá nhân
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item onClick={handleLogout} className="text-danger fw-bold">
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Đăng xuất
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                // 2. TRẠNG THÁI: CHƯA ĐĂNG NHẬP (Hiện nút Login/Register)
                <>
                  <Button variant="outline-primary" className="fw-bold px-3 rounded-pill me-2" as={Link} to="/login">
                    Đăng nhập
                  </Button>
                  <Button variant="primary" className="fw-bold px-3 rounded-pill" as={Link} to="/register">
                    Đăng ký
                  </Button>
                </>
>>>>>>> f1afa857 ( 11-1)
              )}
            </div>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;