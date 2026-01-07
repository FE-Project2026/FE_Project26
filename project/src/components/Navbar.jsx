// src/components/Navbar.jsx

import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faSignOutAlt, faUserShield } from '@fortawesome/free-solid-svg-icons';

// Import Context
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// --- CẤU HÌNH MENU DATA (Đã chỉnh sửa đường dẫn chuẩn) ---
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
      { id: 'service4', labelKey: 'service4', href: '/services/TestIndex' }, // Đã sửa link bài test
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
     
    ],
  },
  {
    id: 'about',
    labelKey: 'about_us',
    href: '/about',
    children: [
      { id: 'mission', labelKey: 'mission', href: '/about/mission' },
     
    ],
  },
];

// --- COMPONENT RENDER MENU ĐỆ QUY ---
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

  // Dùng as={Link} để không reload trang
  return (
    <NavDropdown.Item as={Link} to={item.href}>{label}</NavDropdown.Item>
  );
}

// --- COMPONENT CHUYỂN ĐỔI NGÔN NGỮ ---
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
  const { currentUser, isLoggedIn, logout, isAdmin } = useAuth(); // Lấy cả isAdmin
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Lấy tên hiển thị (Ưu tiên displayName, nếu không có thì lấy email)
  const username = currentUser?.displayName || (currentUser?.email ? currentUser.email.split('@')[0] : 'User');

  return (
    <Navbar expand="lg" className="bg-body-tertiary" fixed="top">
      <Container>
        {/* LOGO */}
        <Navbar.Brand as={Link} to="/">
            <img src="/Media/logo.svg" alt="Health Care Logo" width="50px" />
             Health Care
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* --- MENU CHÍNH (CĂN GIỮA) --- */}
          <Nav className="mx-auto align-items-center">
            {menuData.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const label = t(item.labelKey);

                if (hasChildren) {
                    return (
                        <NavDropdown title={label} id={`dropdown-${item.id}`} key={item.id}>
                            {/* Render các mục con */}
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
              )}
            </div>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MainNavbar;