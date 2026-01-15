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
import PsychologyPage from './pages/PsychologyPage.jsx';
import TelemedicinePage from './pages/TelemedicinePage.jsx';
import ExpertListPage from './pages/ExpertListPage.jsx';
import ExpertConsultPage from './pages/ExpertConsultPage.jsx';
import CommunityPage from './pages/CommunityPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import Dashboard from './pages/doctor/DoctorDashBoard.jsx';
import DoctorLogin from './pages/doctor/DoctorLogin.jsx';
import DoctorRegister from './pages/doctor/DoctorRegister.jsx';
import WaitingApproval from './pages/WaitingApproval'; 
// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 
import AIChatBot from './components/AIChat.jsx'

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
    <> {/* <--- QUAN TRỌNG: Thẻ bao ngoài (Fragment) để bọc ChatBot và Routes */}
      
      {/* Hiển thị ChatBot trên mọi trang */}
      <AIChatBot />

      <Routes>
        {/* === 1. TUYẾN ĐƯỜNG AUTH & RIÊNG BIỆT (KHÔNG NAVBAR) === */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Tuyến đường cho Bác sĩ (Không dùng Navbar của bệnh nhân) */}
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/dashboard" element={<Dashboard />} />
        <Route path="/waiting-approval" element={<WaitingApproval />} />

        {/* === 2. TUYẾN ĐƯỜNG CÔNG KHAI (CÓ NAVBAR + FOOTER) === */}
        {/* Tôi đã đưa About và Community vào đây để chúng có Navbar */}
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
          
          {/* Đưa các trang này vào trong Layout để có Menu đẹp hơn */}
          <Route path="/community/forum" element={<CommunityPage />} />
          <Route path="/community/support" element={<CommunityPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about/mission" element={<AboutPage />} />
        </Route>

        {/* === 3. TUYẾN ĐƯỜNG ADMIN (LAYOUT RIÊNG) === */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/*" element={<AdminLayout />}> {/* Thêm dấu * để hỗ trợ nested routes */}
            <Route index element={<AdminDashboard />} /> 
          </Route>
        </Route>

        {/* === 4. ROUTE 404 === */}
        <Route path="*" element={
          <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
            <h2>404 - Không tìm thấy trang</h2>
            <Link to="/">Về Trang chủ</Link>
          </div>
        } />
      </Routes>
    </>
  );
} 

export default App;