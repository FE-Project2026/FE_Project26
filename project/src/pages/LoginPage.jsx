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
  const { login, signInWithGoogle, signInWithFacebook, socialFallbackRegister } = useAuth(); 
  const navigate = useNavigate();

  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualEmail, setManualEmail] = useState('');
  const [manualError, setManualError] = useState('');
  const [manualLoading, setManualLoading] = useState(false);

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
      console.error(err);
      if (err?.code === 'auth/operation-not-allowed') {
        setError('This sign-in method is disabled in Firebase Authentication. Enable Email/Password in the Firebase console.');
      } else if (err?.code === 'auth/wrong-password' || err?.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else {
        setError(err.message || 'Đăng nhập thất bại.');
      }
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      const role = res?.role || 'user';
      if (role === 'admin') navigate('/admin'); else navigate('/');
    } catch (err) {
      console.error(err);
      if (err?.code === 'auth/operation-not-allowed') {
        setError('Google sign-in is disabled in Firebase. Enable Google provider in Firebase Console → Authentication → Sign-in method.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup closed before completing.');
      } else {
        setError(err.message || 'Google sign-in failed.');
      }
    }
    setLoading(false);
  };

  const handleFacebookLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await signInWithFacebook();
      const role = res?.role || 'user';
      if (role === 'admin') navigate('/admin'); else navigate('/');
    } catch (err) {
      console.error(err);
      if (err?.code === 'auth/operation-not-allowed') {
        setError('Facebook sign-in is disabled in Firebase. Enable Facebook provider in Firebase Console → Authentication → Sign-in method.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup closed before completing.');
      } else if (err?.code === 'auth/account-exists-with-different-credential') {
        setError('An account with the same email exists with a different sign-in method.');
      } else {
        setError(err.message || 'Facebook sign-in failed.');
      }
    }
    setLoading(false);
  };

  const handleManualCreate = async (e) => {
    e.preventDefault();
    setManualError('');
    setManualLoading(true);
    try {
      const res = await socialFallbackRegister(manualEmail, manualName || '');
      // user is created and signed in
      const role = res?.role || 'user';
      if (role === 'admin') navigate('/admin'); else navigate('/');
    } catch (err) {
      console.error(err);
      setManualError(err.message || 'Could not create account.');
    }
    setManualLoading(false);
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
            <button onClick={handleGoogleLogin} className="social-btn" disabled={loading} aria-label="Sign in with Google">
              <img src="/Media/google.png" alt="google" />
            </button>
            <button onClick={handleFacebookLogin} className="social-btn" disabled={loading} aria-label="Sign in with Facebook">
              <img src="/Media/facebook.png" alt="facebook" />
            </button>
          </div>
          {/* Manual fallback when OAuth is unavailable */}
          {error && (error.toLowerCase().includes('facebook') || error.toLowerCase().includes('auth/operation-not-allowed')) && (
            <div style={{textAlign: 'center', marginBottom: '1rem'}}>
              <button type="button" className="btn" onClick={() => setShowManual(!showManual)} style={{background: 'transparent', border: 'none', color: '#6a11cb', cursor: 'pointer'}}>
                Can't use social sign-in? Create account manually
              </button>
            </div>
          )}

          {showManual && (
            <div style={{border: '1px solid #eee', padding: '1rem', borderRadius: '8px', marginBottom: '1rem'}}>
              {manualError && <p className="error-alert">{manualError}</p>}
              <form onSubmit={handleManualCreate}>
                <label htmlFor="manualName">Full name</label>
                <div className="inputRow">
                  <input id="manualName" value={manualName} onChange={(e) => setManualName(e.target.value)} placeholder="Your full name" required />
                </div>
                <label htmlFor="manualEmail">Email</label>
                <div className="inputRow">
                  <input id="manualEmail" type="email" value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} placeholder="Your email" required />
                </div>
                <div style={{marginTop: '0.75rem'}}>
                  <button className="btn btn-primary" type="submit" disabled={manualLoading}>{manualLoading ? 'Creating...' : 'Create account'}</button>
                </div>
              </form>
            </div>
          )}
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