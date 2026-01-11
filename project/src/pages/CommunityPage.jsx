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
            </InputGroup>
          </div>
        </Container>
      </section>

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
    </div>
  );
}

export default CommunityPage;