import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';

// Import Layouts
import AdminLayout from './components/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; 

// THÊM LẠI: Import Navbar và Footer (giả sử chúng ở trong 'src/components/')
import MainNavbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Import Các Trang (Pages)
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import BookDoc from './pages/BookDoc.jsx';
import TestIndex from './pages/TestIndex.jsx';
import Test from './pages/Test.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PrivateDoctors from './pages/PrivateDoctors.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx'; 
import PsychologyPage from './pages/PsychologyPage';
import TelemedicinePage from './pages/TelemedicinePage.jsx';
import ExpertListPage from './pages/ExpertListPage';
import ExpertConsultPage from './pages/ExpertConsultPage';
import CommunityPage from './pages/CommunityPage';
import AboutPage from './pages/AboutPage';
// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 


const PublicLayoutWrapper = () => {
  return (
    <div className="App">
      <MainNavbar />
      <main>
        <Outlet /> {/* Đây là nơi các trang con (HomePage, ...) sẽ render */}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      {/* === 1. TUYẾN ĐƯỜNG XÁC THỰC (KHÔNG CÓ NAVBAR/FOOTER) === */}
      {/* Đặt các trang Auth ở ngoài cùng để chúng không kế thừa layout */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />


      {/* === 2. TUYẾN ĐƯỜNG CÔNG KHAI (Dùng Layout) === */}
      <Route element={<PublicLayoutWrapper />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/privatedoctors" element={<PrivateDoctors />} />
        <Route path="/services/TestIndex" element={<TestIndex />} />
        <Route path="/services/Test" element={<Test />} />
        <Route path="/services/psychology" element={<PsychologyPage />} />
        <Route path="/services/telemedicine" element={<TelemedicinePage />} />
        <Route path="/experts/list" element={<ExpertListPage />} />
        <Route path="/experts/consult" element={<ExpertConsultPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dat-lich/:id" element={<BookDoc />} />
      </Route>
      <Route path="/community/forum" element={<CommunityPage />} />
      <Route path="/community/support" element={<CommunityPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/about/mission" element={<AboutPage />} />
      {/* === 3. TUYẾN ĐƯỜNG ADMIN (ĐƯỢC BẢO VỆ) === */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} /> 
          {/* ... các tuyến admin con khác ... */}
        </Route>
      </Route>

      {/* === 4. ROUTE 404 (KHÔNG TÌM THẤY) === */}
      <Route path="*" element={
        <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
          <h2>404 - Không tìm thấy trang</h2>
          <Link to="/">Về Trang chủ</Link>
        </div>
      } />
    </Routes>
  );
}   

export default App;