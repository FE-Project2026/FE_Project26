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
  
  // Lấy các hàm từ AuthContext
  // Lưu ý: handleFacebookLogin sẽ gọi loginWithFacebook (dùng Popup) để vượt lỗi HTTP
  const { login, loginWithGoogle, loginWithFacebook } = useAuth(); 
  const navigate = useNavigate();

  // 1. Đăng nhập Email/Password
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(email, password);
      if (userData && userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.');
    }
    setLoading(false);
  };

  // 2. Đăng nhập Google
  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/'); 
    } catch (err) {
      setError('Đăng nhập bằng Google thất bại.');
    }
    setLoading(false);
  };

  // 3. Đăng nhập Facebook (Dùng Popup thay cho SDK thủ công)
  // Cách này sửa lỗi "FB.login can no longer be called from http pages"
  const handleFacebookLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithFacebook();
      navigate('/'); 
    } catch (err) {
      // Xử lý lỗi trùng email thường gặp trong ảnh của bạn
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError('Email này đã được dùng với Google. Vui lòng liên kết hoặc dùng Google để đăng nhập.');
      } else {
        setError('Đăng nhập bằng Facebook thất bại.');
      }
      console.error(err);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="login-container"> 
      <div className="container"> 
        <div className="containerContent">
          <h3>Welcome back!</h3>
          <h1>Log In</h1>
          
          {/* Hiển thị lỗi đỏ như trong console của bạn */}
          {error && <p className="error-alert" style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label> 
            <div className="inputRow">
              <input 
                type="email" id="email"
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
                {isPasswordVisible ? <i className="ri-eye-line"></i> : <i className="ri-eye-off-line"></i>}
              </span>
            </div>
            <div className="inputFP">
              <a href="#">Forgot Password?</a>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Login Now'}
            </button>
          </form>

          <h6>Or continue with</h6>
          <div className="logins">
            <button onClick={handleGoogleLogin} disabled={loading} className="social-btn">
              <img src="/Media/search.png" alt="google" />
            </button>
            <button className="social-btn"><img src="/Media/github.png" alt="github" /></button>
            <button onClick={handleFacebookLogin} disabled={loading} className="social-btn">
              <img src="/Media/facebook.png" alt="facebook" />
            </button>
          </div>
          <p>Don't have an account yet? <Link to="/register">Sign up</Link></p>
        </div>
        <div id="quaylai"><Link to="/">Get back</Link></div>
        <div className="containerImg"><img src="/Media/1.1.png" alt="header" /></div>
      </div>
    </div>
  );
}

export default LoginPage;