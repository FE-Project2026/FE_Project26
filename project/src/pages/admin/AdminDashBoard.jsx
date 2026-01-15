import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { db } from '../../firebaseConfig';
import { 
  collection, query, doc, updateDoc, getDoc,
  deleteDoc, orderBy, where, onSnapshot 
} from "firebase/firestore";
import { 
  Calendar, MoreVertical, X, RefreshCw, 
  ShieldCheck, Search, Eye, Award
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('appointments'); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDetail, setSelectedDetail] = useState(null); 

  // --- 1. Tải dữ liệu ---
  useEffect(() => {
    setLoading(true);
    setData([]); 
    
    let q;
    try {
      if (activeTab === 'appointments') {
        q = query(collection(db, 'appointments'), orderBy('createdAt', 'desc'));
      } else {
        q = query(collection(db, 'users'), where('role', '==', 'doctor'));
      }

      const unsub = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(items);
        setLoading(false);
      }, (err) => {
        console.error("Firebase Error:", err);
        setLoading(false);
      });
      
      return () => unsub();
    } catch (error) {
      console.error("Setup Error:", error);
      setLoading(false);
    }
  }, [activeTab]);

  // --- 2. HÀM GỬI EMAIL CHO BỆNH NHÂN (Khi duyệt lịch) ---
  const sendApprovalEmail = async (appointmentData) => {
    let emailToSend = appointmentData.patientEmail || appointmentData.email;

    if (!emailToSend && appointmentData.patientId) {
      try {
        const userDocRef = doc(db, 'users', appointmentData.patientId);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          emailToSend = userSnap.data().email;
        }
      } catch (err) { console.error(err); }
    }

    if (!emailToSend) {
      toast.error("Không tìm thấy email của bệnh nhân!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3002/api/send-approval-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientEmail: emailToSend,
          patientName: appointmentData.patientName || "Khách hàng",
          doctorName: appointmentData.doctorName || "Bác sĩ",
          time: appointmentData.time,
          date: appointmentData.date,
        }),
      });
      if (response.ok) toast.success(`Đã gửi mail lịch khám tới: ${emailToSend}`);
    } catch (error) { console.error("Lỗi API mail:", error); }
  };

  // --- 3. HÀM GỬI EMAIL CHO BÁC SĨ ---
  const sendDoctorEmail = async (docData, status) => {
    try {
      await fetch("http://localhost:3002/api/send-doctor-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: docData.email,
          name: docData.displayName || docData.name || "Bác sĩ",
          status: status, // 'approved' hoặc 'rejected'
          reason: "Hồ sơ chưa đủ thông tin xác thực hoặc không hợp lệ."
        }),
      });
      console.log(`Đã gửi mail ${status} cho bác sĩ: ${docData.email}`);
    } catch (error) {
      console.error("Lỗi gọi API mail bác sĩ:", error);
      toast.error("Không gửi được email thông báo cho bác sĩ.");
    }
  };

  // --- 4. Xử lý hành động ---
  const handleAction = async (type, id, extraData) => {
    setOpenMenuId(null);
    const collectionName = activeTab === 'appointments' ? 'appointments' : 'users';
    const docRef = doc(db, collectionName, id);

    // Lấy thông tin đối tượng đang thao tác để lấy email/tên gửi mail
    const currentItem = data.find(item => item.id === id);

    try {
      // --- DUYỆT BÁC SĨ ---
      if (type === 'APPROVE_DOC') {
        await updateDoc(docRef, { isVerified: true, status: 'active' });
        toast.success("Hồ sơ bác sĩ đã được duyệt trên hệ thống!");

        // Gửi mail Approved và thông báo Toast
        if (currentItem) {
          await sendDoctorEmail(currentItem, 'approved');
          toast.success(`Đã gửi mail chúc mừng tới bác sĩ: ${currentItem.email}`);
        }
      } 
      // --- TỪ CHỐI BÁC SĨ ---
      else if (type === 'REJECT_DOC') {
        if (window.confirm("Bạn có chắc muốn từ chối và XÓA hồ sơ này? Email thông báo sẽ được gửi đi.")) {
            // Xóa bác sĩ khỏi database
            await deleteDoc(docRef);
            toast.success("Đã từ chối và xóa hồ sơ bác sĩ!");
            
            // Gửi mail Rejected và thông báo Toast
            if (currentItem) {
              await sendDoctorEmail(currentItem, 'rejected');
              toast.success(`Đã gửi mail thông báo từ chối tới: ${currentItem.email}`);
            }

            // Nếu đang mở Modal chi tiết thì đóng lại sau khi xóa
            if (selectedDetail && selectedDetail.id === id) setSelectedDetail(null);
        }
      }
      // --- KHÓA/MỞ KHÓA TÀI KHOẢN ---
      else if (type === 'TOGGLE_STATUS') {
        const newStatus = extraData === 'banned' ? 'active' : 'banned';
        await updateDoc(docRef, { status: newStatus });
        toast.success(newStatus === 'banned' ? "Đã khóa tài khoản thành công" : "Đã mở khóa tài khoản thành công");
      } 
      // --- XÓA DỮ LIỆU CHUNG ---
      else if (type === 'DELETE') {
        if (window.confirm("Xác nhận xóa vĩnh viễn dữ liệu này?")) {
          await deleteDoc(docRef);
          toast.success("Đã xóa dữ liệu vĩnh viễn!");
          if (selectedDetail && selectedDetail.id === id) setSelectedDetail(null);
        }
      } 
      // --- CẬP NHẬT TRẠNG THÁI LỊCH HẸN ---
      else if (type === 'UPDATE_APPT') {
        await updateDoc(docRef, { status: extraData });
        toast.success(`Đã cập nhật trạng thái lịch hẹn thành: ${extraData}`);

        // Gửi mail nếu duyệt lịch khám cho bệnh nhân
        if (extraData === 'confirmed' && currentItem) {
          await sendApprovalEmail(currentItem);
        }
      }
    } catch (err) { 
      toast.error("Lỗi thao tác: " + err.message); 
    }
  };
  const filteredData = data.filter(item => 
    (item.patientName || item.displayName || item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.email || item.phone || "").includes(searchTerm)
  );

  return (
    <div className="admin-container">
      <Toaster position="top-right" />
      
      <aside className="sidebar">
        <div className="sidebar-brand">
          <ShieldCheck size={28} color="#60a5fa" />
          <span>HealthCare Admin</span>
        </div>
        <nav className="nav-menu">
          <button className={activeTab === 'appointments' ? 'active' : ''} onClick={() => setActiveTab('appointments')}>
            <Calendar size={20} /> Lịch khám & Hồ sơ
          </button>
          <button className={activeTab === 'doctors' ? 'active' : ''} onClick={() => setActiveTab('doctors')}>
            <Award size={20} /> Duyệt Bác sĩ
          </button>
        </nav>
      </aside>

      <main className="main-panel">
        <header className="top-nav">
          <div className="search-bar">
            <Search size={18} color="#94a3b8" />
            <input 
              type="text" placeholder="Tìm kiếm nhanh..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="icon-btn" onClick={() => window.location.reload()}><RefreshCw size={18} /></button>
        </header>

        <section className="content-body">
          <div className="section-header">
            <h1>{activeTab === 'appointments' ? 'Quản lý Lịch khám' : 'Danh sách Bác sĩ'}</h1>
          </div>

          <div className="data-card">
            <table className="custom-table">
              <thead>
                <tr>
                  {activeTab === 'appointments' ? (
                    <>
                      <th>Bệnh nhân</th>
                      <th>Nội dung khám</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                    </>
                  ) : (
                    <>
                      <th>Bác sĩ</th>
                      <th>Chuyên khoa / SĐT</th>
                      <th>Kinh nghiệm</th>
                      <th>Trạng thái</th>
                    </>
                  )}
                  <th className="text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px'}}>Đang tải dữ liệu...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan="5" style={{textAlign: 'center', padding: '30px', color: '#64748b'}}>Không có dữ liệu</td></tr>
                ) : filteredData.map((item) => (
                  <tr key={item.id}>
                    {/* VIEW LỊCH KHÁM */}
                    {activeTab === 'appointments' ? (
                      <>
                        <td>
                          <span className="cell-main">{item.patientName}</span>
                          <span className="cell-sub">BS: {item.doctorName}</span>
                        </td>
                        <td>
                          <span className="cell-sub" style={{maxWidth: '180px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                          {item.notes || item.symptoms || "Không có mô tả"}                          
                          </span>
                          <span style={{color: '#3b82f6', fontSize: '12px', cursor: 'pointer'}} onClick={() => setSelectedDetail(item)}>Xem chi tiết</span>
                        </td>
                        <td>{item.time}<br/><span className="cell-sub">{item.date}</span></td>
                        <td><span className={`status-tag ${item.status}`}>{item.status}</span></td>
                      </>
                    ) : (
                      /* VIEW BÁC SĨ */
                      <>
                        <td>
                          <span className="cell-main">{item.displayName || item.name}</span>
                          <span className="cell-sub">{item.email}</span>
                        </td>
                        <td>
                          <span className="cell-main" style={{color: '#0369a1'}}>{item.specialty}</span>
                          <span className="cell-sub">{item.phone}</span>
                        </td>
                        <td>{item.experience ? `${item.experience} năm` : '---'}</td>
                        <td><span className={`status-tag ${item.isVerified ? 'active' : 'pending'}`}>{item.isVerified ? 'Đã duyệt' : 'Chờ duyệt'}</span></td>
                      </>
                    )}

                    <td className="text-right">
                      <div className="action-group">
                        <button className="icon-btn view" onClick={() => setSelectedDetail(item)}><Eye size={18} /></button>
                        <div style={{position: 'relative'}}>
                          <button className="icon-btn" onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}>
                            <MoreVertical size={18} />
                          </button>
                          
                          {/* MENU HÀNH ĐỘNG */}
                          {openMenuId === item.id && (
                            <div style={{
                              position: 'absolute', right: 0, top: '40px', background: 'white', 
                              border: '1px solid #e2e8f0', borderRadius: '8px', 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 10, minWidth: '150px'
                            }}>
                              {/* NÚT DUYỆT & TỪ CHỐI BÁC SĨ */}
                              {activeTab === 'doctors' && !item.isVerified && (
                                <>
                                    <button onClick={() => handleAction('APPROVE_DOC', item.id)} style={{padding: '10px', width: '100%', border:'none', background:'white', textAlign:'left', cursor:'pointer', color:'#16a34a', fontWeight:'600'}}>
                                        ✅ Duyệt hồ sơ
                                    </button>
                                    <button onClick={() => handleAction('REJECT_DOC', item.id)} style={{padding: '10px', width: '100%', border:'none', background:'white', textAlign:'left', cursor:'pointer', color:'#dc2626', fontWeight:'600'}}>
                                        ❌ Từ chối
                                    </button>
                                    <hr style={{margin:'4px 0', borderTop:'1px solid #f1f5f9'}}/>
                                </>
                              )}

                              {activeTab === 'appointments' && (
                                <>
                                  <button onClick={() => handleAction('UPDATE_APPT', item.id, 'confirmed')} style={{padding: '10px', width: '100%', border:'none', background:'white', textAlign:'left', cursor:'pointer'}}>Duyệt lịch</button>
                                  <button onClick={() => handleAction('UPDATE_APPT', item.id, 'completed')} style={{padding: '10px', width: '100%', border:'none', background:'white', textAlign:'left', cursor:'pointer'}}>Hoàn thành</button>
                                </>
                              )}
                              <button onClick={() => handleAction('TOGGLE_STATUS', item.id, item.status)} style={{padding: '10px', width: '100%', border:'none', background:'white', textAlign:'left', cursor:'pointer'}}>{item.status === 'banned' ? 'Mở khóa' : 'Khóa TK'}</button>
                              <button onClick={() => handleAction('DELETE', item.id)} style={{padding: '10px', width: '100%', border:'none', background:'white', textAlign:'left', cursor:'pointer', color:'#ef4444'}}>Xóa</button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* --- POP-UP CHI TIẾT --- */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={() => setSelectedDetail(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{activeTab === 'doctors' ? 'Hồ sơ Bác sĩ' : 'Chi tiết Phiếu khám'}</h3>
              <button className="btn-header-close" onClick={() => setSelectedDetail(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="info-grid">
                {activeTab === 'appointments' ? (
                  <>
                    <div className="info-item"><label>Bệnh nhân</label><div>{selectedDetail.patientName}</div></div>
                    <div className="info-item"><label>Bác sĩ</label><div>{selectedDetail.doctorName}</div></div>
                    <div className="info-item"><label>Thời gian</label><div>{selectedDetail.time} - {selectedDetail.date}</div></div>
                    <div className="info-item"><label>Trạng thái</label><div><span className={`status-tag ${selectedDetail.status}`}>{selectedDetail.status}</span></div></div>
                    <div className="info-item full"><label>Lý do khám</label><div className="content-box">{selectedDetail.symptoms || 'Không có mô tả'}</div></div>
                  </>
                ) : (
                  <>
                    <div className="info-item full" style={{display:'flex', alignItems:'center', gap:'15px', marginBottom:'5px'}}>
                      {selectedDetail.photoURL ? (
                        <img src={selectedDetail.photoURL} alt="" style={{width:'60px', height:'60px', borderRadius:'50%', objectFit:'cover', border:'2px solid #e2e8f0'}} />
                      ) : (
                        <div style={{width:'60px', height:'60px', borderRadius:'50%', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center'}}>BS</div>
                      )}
                      <div>
                        <div style={{fontWeight:'bold', fontSize:'16px', color:'#1e293b'}}>{selectedDetail.displayName || "Chưa đặt tên"}</div>
                        <div style={{fontSize:'13px', color:'#64748b'}}>UID: {selectedDetail.uid || selectedDetail.id}</div>
                      </div>
                    </div>
                    <div className="info-item"><label>Email</label><div>{selectedDetail.email || "---"}</div></div>
                    <div className="info-item"><label>Số điện thoại</label><div>{selectedDetail.phone || "---"}</div></div>
                    <div className="info-item"><label>Chuyên khoa</label><div>{selectedDetail.specialty}</div></div>
                    <div className="info-item"><label>Kinh nghiệm</label><div>{selectedDetail.experience} năm</div></div>
                    <div className="info-item"><label>Nơi công tác</label><div>{selectedDetail.hospital || 'Tự do'}</div></div>
                    <div className="info-item full"><label>Giới thiệu</label><div className="content-box">{selectedDetail.bio}</div></div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-footer-close" onClick={() => setSelectedDetail(null)}>Đóng</button>
              {activeTab === 'doctors' && !selectedDetail.isVerified && (
                  <>
                    <button className="btn-action" style={{backgroundColor: '#dc2626', marginRight: '10px'}} onClick={() => handleAction('REJECT_DOC', selectedDetail.id)}>Từ chối</button>
                    <button className="btn-action" onClick={() => handleAction('APPROVE_DOC', selectedDetail.id)}>Phê duyệt</button>
                  </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}