import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { CheckCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Import các biến Firebase đã khởi tạo
import { db, auth, appId } from '../firebaseConfig'; 

// --- (Giữ nguyên MOCK_DOCTORS và styles) ---
const MOCK_DOCTORS = [
  { id: 1, Ten: "Bác sĩ Nguyễn Văn A", description: "Chuyên khoa Tâm lý.", Hinh: "https://placehold.co/400x400/a2d2ff/333?text=BS.+A" },
  { id: 2, Ten: "Bác sĩ Trần Thị B", description: "Tư vấn gia đình.", Hinh: "https://placehold.co/400x400/bde0fe/333?text=BS.+B" },
  { id: 3, Ten: "Giáo sư Lê Văn C", description: "Trưởng khoa.", Hinh: "https://placehold.co/400x400/caffbf/333?text=GS.+C" },
  { id: 4, Ten: "Bác sĩ Phạm Thị D", description: "Tâm lý trẻ em.", Hinh: "https://placehold.co/400x400/ffc8dd/333?text=BS.+D" },
  { id: 5, Ten: "Bác sĩ Phan Thị E", description: "Tư vấn trầm cảm.", Hinh: "https://placehold.co/400x400/ffd8a8/333?text=BS.+E" },
];
const containerStyle = { paddingTop: '100px', maxWidth: '1200px', margin: 'auto', padding: '0 16px', };
const formStyle = { maxWidth: '400px', margin: 'auto', background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd' };
const inputStyle = { width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' };
const labelStyle = { display: 'block', marginBottom: '4px' };
const groupStyle = { marginBottom: '12px' };
const buttonStyle = { width: '100%', padding: '10px', background: '#1976f2', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };
const notificationStyle = { position: 'fixed', top: '16px', right: '16px', background: '#4caf50', color: 'white', padding: '12px 16px', borderRadius: '8px', zIndex: 2000, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', transition: 'opacity 0.5s, transform 0.5s', opacity: 1, transform: 'translateX(0)', };
// --- (Hết styles) ---


function BookDoc() {
  const { id } = useParams();
  const doctor = MOCK_DOCTORS.find(d => d.id === parseInt(id));

  const [formData, setFormData] = useState({ ngay: "", gio: "", hoten: "", email: "", sdt: "" });
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  
  // 1. Lắng nghe trạng thái đăng nhập để lấy userId
  useEffect(() => {
    // Thêm check để đảm bảo 'auth' tồn tại
    if (typeof auth === 'undefined' || !auth) {
        console.error("Firebase Auth không khả dụng. Vui lòng kiểm tra import '../firebaseConfig'.");
        setAuthReady(false);
        return;
    }
  let mounted = true;
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    try {
      if (!mounted) return;
      if (user) {
        setUserId(user.uid);

        // Thử lấy document profile từ Firestore và tiền điền form
        try {
          const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            setFormData(prev => ({
              ...prev,
              hoten: data.displayName || data.name || prev.hoten,
              email: data.email || user.email || prev.email,
              sdt: data.phone || data.sdt || prev.sdt
            }));
          } else {
            // Nếu không có doc, tiền điền email từ auth
            setFormData(prev => ({ ...prev, email: user.email || prev.email }));
          }
        } catch (err) {
          console.error('Không thể lấy hồ sơ người dùng:', err);
        }

      } else {
        // Nếu chưa đăng nhập, dùng ID ẩn danh tạm thời
        setUserId(crypto.randomUUID());
      }
    } finally {
      if (mounted) setAuthReady(true);
    }
  });
  return () => { mounted = false; unsubscribe(); };
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Thêm check để đảm bảo các biến config tồn tại
    if (typeof db === 'undefined' || typeof appId === 'undefined') {
        setNotification("Lỗi: Cấu hình Firebase không đầy đủ.");
        setTimeout(() => setNotification(null), 3000);
        return;
    }

    if (!authReady || !userId) {
        setNotification("Hệ thống đang xác thực. Vui lòng thử lại sau giây lát.");
        setTimeout(() => setNotification(null), 3000);
        return;
    }

    setLoading(true);

    // Dữ liệu lịch khám mới (an toàn khi doctor có thể undefined)
    const appointmentData = {
      doctorId: doctor?.id ?? null,
      tenBacSi: doctor?.Ten ?? `Bác sĩ ID ${id}`,
      ngayKham: formData.ngay,
      gioKham: formData.gio,
      tenBenhNhan: formData.hoten,
      emailBenhNhan: formData.email,
      sdtBenhNhan: formData.sdt,
      // Dùng serverTimestamp cho ngày tạo trên Firestore
      createdAt: serverTimestamp(), 
      userId: userId
    };

    try {
      // 1. Xác định tham chiếu collection modular-safe
      const appointmentsCol = collection(db, 'artifacts', appId, 'users', userId, 'appointments');

      // 2. Thêm tài liệu vào Firestore
      const docRef = await addDoc(appointmentsCol, appointmentData);
      
      setNotification(`Đặt lịch thành công với: ${doctor ? doctor.Ten : `Bác sĩ ID ${id}`}!`);
      setFormData({ ngay: "", gio: "", hoten: "", email: "", sdt: "" });

    } catch (error) {
      console.error("Lỗi khi lưu lịch khám vào Firestore: ", error);
      setNotification("Lỗi: Không thể lưu lịch khám. Vui lòng kiểm tra console.");
    }

    setLoading(false);
    setTimeout(() => setNotification(null), 3000);
  };

  const isFormValid = formData.ngay && formData.gio && formData.hoten && formData.email && formData.sdt;
  const buttonText = loading 
    ? 'Đang xử lý...' 
    : (authReady ? 'Xác nhận Đặt lịch' : 'Đang tải...');

  return (
    <>
      {notification && ReactDOM.createPortal(
        <div style={notificationStyle}>
          <CheckCircle size={20} /> {notification}
        </div>,
        document.body
      )}

      <div style={containerStyle}>
        <h2 style={{ textAlign: 'center' }}>Đặt lịch khám</h2>
        <p style={{ textAlign: 'center' }}>
          Bạn đang đặt lịch cho bác sĩ: <strong>{doctor ? doctor.Ten : `ID ${id}`}</strong>
        </p>
        
        <form onSubmit={handleSubmit} style={formStyle}>
          {/* ... (Các trường input giữ nguyên) ... */}
          <div style={groupStyle}>
            <label style={labelStyle}>Ngày khám</label>
            <input type="date" name="ngay" value={formData.ngay} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={groupStyle}>
            <label style={labelStyle}>Giờ khám</label>
            <input type="time" name="gio" value={formData.gio} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={groupStyle}>
            <label style={labelStyle}>Họ tên</label>
            <input type="text" name="hoten" value={formData.hoten} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={groupStyle}>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
          </div>
          <div style={groupStyle}>
            <label style={labelStyle}>Số điện thoại</label>
            <input type="tel" name="sdt" value={formData.sdt} onChange={handleChange} required style={inputStyle} />
          </div>
          <button 
            type="submit" 
            style={{...buttonStyle, background: (loading || !isFormValid || !authReady) ? '#ccc' : '#1976f2'}} 
            disabled={loading || !isFormValid || !authReady}
          >
            {buttonText}
          </button>
        </form>
      </div>
    </>
  );
}

export default BookDoc;