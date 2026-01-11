import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';

// Import Layouts
import AdminLayout from './components/AdminLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Layout components
import MainNavbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

// Pages
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

// ✅ IMPORT CHAT AI
import AIChat from './components/AIChat';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


// Layout cho các trang công khai
const PublicLayoutWrapper = () => {
  return (
    <div className="App">
      <MainNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <>
      {/* ================= ROUTES ================= */}
      <Routes>

        {/* 1. AUTH ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 2. PUBLIC ROUTES (WITH LAYOUT) */}
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

        {/* Other public */}
        <Route path="/community/forum" element={<CommunityPage />} />
        <Route path="/community/support" element={<CommunityPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/about/mission" element={<AboutPage />} />

        {/* 3. ADMIN ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* 4. 404 */}
        <Route
          path="*"
          element={
            <div className="container" style={{ marginTop: '100px', textAlign: 'center' }}>
              <h2>404 - Không tìm thấy trang</h2>
              <Link to="/">Về Trang chủ</Link>
            </div>
          }
        />
      </Routes>

      {/* ================= CHAT AI LUÔN HIỂN THỊ ================= */}
      <AIChat />
    </>
  );
}

export default App;
