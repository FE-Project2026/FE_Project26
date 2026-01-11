<<<<<<< HEAD
// src/pages/CommunityPage.jsx

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faComment, faEye, faHeart, faTag, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import './CommunityPage.css';

// DỮ LIỆU GIẢ (MOCK DATA) - CÁC BÀI ĐĂNG
const mockPosts = [
  {
    id: 1,
    author: "Nguyễn Thu Hà",
    avatar: "https://img.freepik.com/free-photo/young-beautiful-woman-pink-warm-sweater-natural-look-smiling-portrait-isolated-long-hair_285396-896.jpg",
    time: "2 giờ trước",
    title: "Mọi người cho em hỏi về chế độ ăn Eat Clean giảm cân với ạ?",
    content: "Em đang muốn giảm 5kg trong 1 tháng. Có bác sĩ hay chuyên gia nào tư vấn giúp em thực đơn mẫu không ạ? Em cảm ơn nhiều!",
    tags: ["Dinh dưỡng", "Giảm cân"],
    likes: 45,
    comments: 12,
    views: 120,
    isHot: true
  },
  {
    id: 2,
    author: "Trần Văn Nam",
    avatar: "https://img.freepik.com/free-photo/handsome-confident-smiling-man-with-hands-crossed-chest_176420-18743.jpg",
    time: "5 giờ trước",
    title: "Đau lưng dưới khi ngồi văn phòng quá lâu",
    content: "Chào các bác sĩ, tôi làm IT ngồi máy tính 10 tiếng/ngày. Dạo này hay bị đau thắt lưng lan xuống mông. Có bài tập nào cải thiện không?",
    tags: ["Cơ xương khớp", "Văn phòng"],
    likes: 23,
    comments: 5,
    views: 89,
    isHot: false
  },
  {
    id: 3,
    author: "Lê Thị Bích",
    avatar: "https://img.freepik.com/free-photo/portrait-expressive-young-woman_1258-48167.jpg",
    time: "1 ngày trước",
    title: "Review khám tổng quát tại Health Care - Rất hài lòng!",
    content: "Hôm qua mình vừa đưa mẹ đi khám gói tầm soát ung thư. Bác sĩ nhiệt tình, cơ sở vật chất sạch sẽ. Mọi người nên đặt lịch trước qua web cho nhanh nhé.",
    tags: ["Review", "Trải nghiệm"],
    likes: 156,
    comments: 34,
    views: 540,
    isHot: true
  },
  {
    id: 4,
    author: "Phạm Minh Tuấn",
    avatar: "https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg",
    time: "2 ngày trước",
    title: "Stress vì áp lực công việc, hay bị mất ngủ",
    content: "Dạo này mình hay bị thức giấc lúc 3h sáng và không ngủ lại được. Có phải dấu hiệu trầm cảm không ạ?",
    tags: ["Tâm lý", "Mất ngủ"],
    likes: 12,
    comments: 8,
    views: 67,
    isHot: false
  }
];

function CommunityPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="community-page">
      {/* 1. HERO BANNER */}
      <section className="forum-hero text-white text-center">
        <Container>
          <h1 className="fw-bold display-5">Cộng đồng Sức khỏe</h1>
          <p className="lead">Nơi chia sẻ kiến thức, kinh nghiệm và kết nối với chuyên gia</p>
          
          {/* Thanh tìm kiếm */}
          <div className="forum-search mx-auto mt-4">
            <InputGroup size="lg">
              <Form.Control 
                placeholder="Tìm kiếm chủ đề thảo luận..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="warning" className="fw-bold">
                <FontAwesomeIcon icon={faSearch} /> Tìm kiếm
              </Button>
=======
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faComment, faEye, faHeart, faTag, faBullhorn, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import './CommunityPage.css';

// --- IMPORT FIREBASE ---
import { db } from '../firebaseConfig'; 
// QUAN TRỌNG: Thêm arrayUnion, arrayRemove
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

import CommentSection from '../components/CommentSection';

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTag, setNewTag] = useState("Thảo luận chung");

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);

  const { currentUser } = useAuth();

  // 1. LẤY DỮ LIỆU
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    });
    return () => unsubscribe();
  }, []);

  const activePost = posts.find(p => p.id === selectedPostId);

  // 2. XỬ LÝ LIKE / UNLIKE (LOGIC MỚI)
  const handleLike = async (e, post) => {
    if (e) e.stopPropagation(); 

    if (!currentUser) return alert("Vui lòng đăng nhập để thả tim!");

    try {
      const postRef = doc(db, "posts", post.id);
      
      // Kiểm tra xem người này đã like chưa
      const isLiked = post.likedBy?.includes(currentUser.uid);

      if (isLiked) {
        // ĐÃ LIKE RỒI -> BỎ LIKE (UNLIKE)
        await updateDoc(postRef, {
          likes: increment(-1), // Giảm số lượng
          likedBy: arrayRemove(currentUser.uid) // Xóa tên khỏi danh sách
        });
      } else {
        // CHƯA LIKE -> THẢ LIKE
        await updateDoc(postRef, {
          likes: increment(1), // Tăng số lượng
          likedBy: arrayUnion(currentUser.uid) // Thêm tên vào danh sách
        });
      }
    } catch (error) {
      console.error("Lỗi like:", error);
    }
  };

  // 3. MỞ BÀI VIẾT & TĂNG VIEW
  const handleOpenPost = async (post) => {
    setSelectedPostId(post.id); 
    setShowDetailModal(true);

    if (currentUser && currentUser.uid !== post.authorId) {
      try {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, { views: increment(1) });
      } catch (error) { console.error(error); }
    }
  };

  // 4. ĐĂNG BÀI MỚI (CẬP NHẬT THÊM TRƯỜNG likedBy)
  const handleCreatePost = async () => {
    if (!currentUser) return alert("Bạn cần đăng nhập!");
    if (!newTitle.trim() || !newContent.trim()) return alert("Thiếu thông tin!");

    try {
      await addDoc(collection(db, "posts"), {
        title: newTitle,
        content: newContent,
        tags: [newTag],
        author: currentUser.displayName || currentUser.email.split('@')[0],
        authorId: currentUser.uid,
        avatar: currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        likes: 0,
        likedBy: [], // <--- QUAN TRỌNG: Mảng chứa danh sách người đã like
        comments: 0,
        views: 0,
        isHot: false,
        createdAt: serverTimestamp()
      });
      setNewTitle(""); setNewContent(""); setShowCreateModal(false);
    } catch (error) { console.error(error); }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Vừa xong";
    return timestamp.toDate().toLocaleString('vi-VN');
  };

  // Hàm kiểm tra xem mình đã like bài này chưa để tô màu đỏ
  const checkIsLiked = (post) => {
    return currentUser && post.likedBy?.includes(currentUser.uid);
  };

  return (
    <div className="community-page">
      <section className="forum-hero bg-primary text-white text-center py-5">
        <Container>
          <h1 className="fw-bold">Cộng đồng Sức khỏe</h1>
          <p>Kết nối và chia sẻ kiến thức y khoa</p>
          <div className="mx-auto mt-3" style={{maxWidth: '600px'}}>
            <InputGroup>
              <Form.Control placeholder="Tìm kiếm..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <Button variant="warning"><FontAwesomeIcon icon={faSearch} /></Button>
>>>>>>> f1afa857 ( 11-1)
            </InputGroup>
          </div>
        </Container>
      </section>

<<<<<<< HEAD
      {/* 2. NỘI DUNG CHÍNH */}
      <Container className="py-5">
        <Row>
          {/* CỘT TRÁI: DANH SÁCH BÀI VIẾT */}
          <Col lg={8}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-primary m-0">Thảo luận mới nhất</h3>
              <div className="forum-filters">
                <Button variant="outline-primary" size="sm" className="me-2 active">Tất cả</Button>
                <Button variant="outline-secondary" size="sm" className="me-2">Nổi bật</Button>
                <Button variant="outline-secondary" size="sm">Chưa giải quyết</Button>
              </div>
            </div>

            {/* List bài viết */}
            <div className="forum-feed">
              {mockPosts.map((post) => (
                <Card className="forum-card mb-3 shadow-sm border-0" key={post.id}>
                  <Card.Body>
                    {/* Header bài viết: Avatar + Tên */}
                    <div className="d-flex align-items-center mb-3">
                      <img src={post.avatar} alt="Avatar" className="rounded-circle me-3" width="50" height="50" style={{objectFit:'cover'}} />
                      <div>
                        <h6 className="fw-bold mb-0 text-dark">{post.author}</h6>
                        <small className="text-muted">{post.time}</small>
                      </div>
                      {post.isHot && <Badge bg="danger" className="ms-auto"><FontAwesomeIcon icon={faBullhorn} /> Hot</Badge>}
                    </div>

                    {/* Nội dung bài viết */}
                    <h5 className="post-title fw-bold text-primary">{post.title}</h5>
                    <p className="post-content text-secondary">{post.content}</p>

                    {/* Tags */}
                    <div className="mb-3">
                      {post.tags.map((tag, index) => (
                        <Badge bg="light" text="dark" className="me-2 border" key={index}>
                          # {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Footer bài viết: Like, Comment, View */}
                    <div className="d-flex gap-4 text-muted small border-top pt-3">
                      <span className="cursor-pointer hover-text-danger"><FontAwesomeIcon icon={faHeart} /> {post.likes} Thích</span>
                      <span className="cursor-pointer hover-text-primary"><FontAwesomeIcon icon={faComment} /> {post.comments} Thảo luận</span>
                      <span><FontAwesomeIcon icon={faEye} /> {post.views} Lượt xem</span>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>

          {/* CỘT PHẢI: SIDEBAR */}
          <Col lg={4}>
            {/* Nút tạo bài viết */}
            <Button variant="primary" size="lg" className="w-100 mb-4 fw-bold shadow-sm">
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Tạo bài viết mới
            </Button>

            {/* Box: Chủ đề nổi bật */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white fw-bold border-bottom">
                <FontAwesomeIcon icon={faTag} className="text-warning me-2" />
                Chủ đề đang Hot
              </Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item action>🏥 Review Bệnh viện</ListGroup.Item>
                <ListGroup.Item action>🥗 Dinh dưỡng & Eat Clean</ListGroup.Item>
                <ListGroup.Item action>🧠 Sức khỏe tâm thần</ListGroup.Item>
                <ListGroup.Item action>👶 Chăm sóc mẹ và bé</ListGroup.Item>
                <ListGroup.Item action>COVID-19 & Hậu COVID</ListGroup.Item>
              </ListGroup>
            </Card>

            {/* Box: Quy tắc */}
            <Card className="border-0 shadow-sm bg-light">
              <Card.Body>
                <h6 className="fw-bold">Quy tắc cộng đồng</h6>
                <ul className="small text-muted ps-3 mb-0">
                  <li>Tôn trọng lẫn nhau, không ngôn từ đả kích.</li>
                  <li>Không quảng cáo trái phép.</li>
                  <li>Chia sẻ thông tin y khoa chính xác.</li>
                  <li>Admin có quyền xóa bài vi phạm.</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
=======
      <Container className="py-5">
        <Row>
          <Col lg={8}>
            <div className="d-flex justify-content-between mb-3">
              <h4 className="fw-bold text-primary">Thảo luận mới nhất</h4>
              <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                <FontAwesomeIcon icon={faPlus} className="me-2" /> Đăng bài
              </Button>
            </div>

            <div className="forum-feed">
              {posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((post) => {
                const isLiked = checkIsLiked(post); // Kiểm tra trạng thái like

                return (
                  <Card 
                    className="forum-card mb-3 shadow-sm border-0" 
                    key={post.id}
                    onClick={() => handleOpenPost(post)}
                    style={{cursor: 'pointer'}}
                  >
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <img src={post.avatar} className="rounded-circle me-2 border" width="40" height="40" style={{objectFit:'cover'}} />
                        <div>
                          <h6 className="fw-bold mb-0">{post.author}</h6>
                          <small className="text-muted">{formatDate(post.createdAt)}</small>
                        </div>
                        {post.isHot && <Badge bg="danger" className="ms-auto">Hot</Badge>}
                      </div>
                      
                      <h5 className="fw-bold text-primary">{post.title}</h5>
                      <p className="text-muted text-truncate">{post.content}</p>
                      
                      <div className="d-flex gap-3 text-muted small mt-2">
                        {/* --- NÚT LIKE THÔNG MINH --- */}
                        <span 
                          className={`cursor-pointer ${isLiked ? "text-danger fw-bold" : ""}`} 
                          onClick={(e) => handleLike(e, post)} // Truyền cả object post vào
                          title={isLiked ? "Bỏ thích" : "Thích"}
                          style={{zIndex: 10}}
                        >
                          <FontAwesomeIcon icon={faHeart} /> {post.likes}
                        </span>
                        {/* --------------------------- */}
                        
                        <span><FontAwesomeIcon icon={faComment} /> {post.comments}</span>
                        <span><FontAwesomeIcon icon={faEye} /> {post.views}</span>
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </Col>

          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white fw-bold">Chủ đề Hot</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item action>🏥 Review Bệnh viện</ListGroup.Item>
                <ListGroup.Item action>🥗 Dinh dưỡng</ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* MODAL TẠO BÀI */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>Đăng bài mới</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Control className="mb-3" placeholder="Tiêu đề..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
          <Form.Select className="mb-3" value={newTag} onChange={e => setNewTag(e.target.value)}>
            <option>Thảo luận chung</option><option>Dinh dưỡng</option>
          </Form.Select>
          <Form.Control as="textarea" rows={5} placeholder="Nội dung..." value={newContent} onChange={e => setNewContent(e.target.value)} />
        </Modal.Body>
        <Modal.Footer><Button onClick={handleCreatePost}>Đăng ngay</Button></Modal.Footer>
      </Modal>

      {/* MODAL CHI TIẾT BÀI VIẾT */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered scrollable>
        {activePost && (
          <>
            <Modal.Header closeButton>
              <div className="d-flex align-items-center">
                <img src={activePost.avatar} className="rounded-circle me-2" width="40" height="40" style={{objectFit:'cover'}} />
                <div>
                  <h6 className="mb-0 fw-bold">{activePost.author}</h6>
                  <small className="text-muted">{formatDate(activePost.createdAt)}</small>
                </div>
              </div>
            </Modal.Header>
            <Modal.Body>
              <h4 className="fw-bold text-primary">{activePost.title}</h4>
              <div className="mb-3">
                {activePost.tags?.map((t, i) => <Badge bg="light" text="dark" className="me-1 border" key={i}>#{t}</Badge>)}
              </div>
              <p style={{whiteSpace: 'pre-line', fontSize: '1.1rem'}}>{activePost.content}</p>
              
              <div className="d-flex gap-4 text-muted mb-3 border-top pt-3">
                 {/* Nút Like trong Modal */}
                 <span 
                    className={`cursor-pointer ${checkIsLiked(activePost) ? "text-danger fw-bold" : ""}`}
                    onClick={(e) => handleLike(e, activePost)}
                 >
                    <FontAwesomeIcon icon={faHeart} /> {activePost.likes} Thích
                 </span>
                 <span><FontAwesomeIcon icon={faEye} /> {activePost.views} Lượt xem</span>
              </div>

              <div className="bg-light p-3 rounded">
                 <CommentSection postId={activePost.id} />
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>
>>>>>>> f1afa857 ( 11-1)
    </div>
  );
}

export default CommunityPage;