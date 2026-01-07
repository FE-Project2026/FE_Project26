// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx'; 
import { useNavigate, Link } from 'react-router-dom';
import './login.css'; 


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // BƯỚC 1: Gọi hàm login và chờ nó trả về data
      const userData = await login(email, password);
      
      // BƯỚC 2: Kiểm tra vai trò (role) từ data trả về
      if (userData && userData.role === 'admin') {
        // Chuyển đến đường dẫn admin gốc. Route index của /admin sẽ render AdminDashboard.
        navigate('/admin');
      } else {
        // Nếu là người dùng thường, chuyển hướng về trang chủ
        navigate('/');
      }

    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.');
      console.error(err);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    // --- SỬA LỖI 1: Thêm class "login-container" làm thẻ cha ---
    <div className="login-container"> 
      {/* Bỏ style inline và sửa class "container" bên trong */}
      <div className="container"> 
        <div className="containerContent">
          <h3>Welcome back!</h3>
          <h1>Log In</h1>
          
          {error && <p className="error-alert">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label> 
            <div className="inputRow">
              <input 
                type="email" 
                id="email"
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <label htmlFor="password">Password</label>
            <div className="inputRow">
              <input 
                type={isPasswordVisible ? "text" : "password"} 
                id="password" 
                placeholder="Enter your Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <span id="password-eye" onClick={togglePasswordVisibility} style={{cursor: 'pointer'}}>
                {isPasswordVisible 
                  ? <i className="ri-eye-line"></i> 
                  : <i className="ri-eye-off-line"></i>
                }
              </span>
            </div>
            <div className="inputFP">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} name="submit_login">
              {loading ? 'Đang đăng nhập...' : 'Login Now'}
            </button>
          </form>
          <h6>Or continue with</h6>
          <div className="logins">
            <a href="#"><img src="/Media/search.png" alt="google" /></a>
            <a href="#"><img src="/Media/github.png" alt="github" /></a>
            <a href="#"><img src="/Media/facebook.png" alt="facebook" /></a>
          </div>
          <p>Don't have an account yet? <Link to="/register">Sign up</Link></p>
        </div>
        <div id="quaylai">
          <Link to="/">Get back</Link>
        </div>
        <div className="containerImg">
          <img src="/Media/1.1.png" alt="header" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;