// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, ListGroup, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPlus, faComment, faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import './CommunityPage.css';

// --- IMPORT NAVBAR CỦA BẠN ---
import Navbar from '../components/Navbar.jsx'; 

// FIREBASE & CONTEXT
import { db } from '../firebaseConfig'; 
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
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

  // 1. LẤY DỮ LIỆU REALTIME
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const activePost = posts.find(p => p.id === selectedPostId);

  // 2. XỬ LÝ LIKE / UNLIKE
  const handleLike = async (e, post) => {
    if (e) e.stopPropagation(); 
    if (!currentUser) return toast.error("Vui lòng đăng nhập để thả tim!");

    try {
      const postRef = doc(db, "posts", post.id);
      const isLiked = post.likedBy?.includes(currentUser.uid);

      if (isLiked) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUser.uid)
        });
        toast.success("Đã thích bài viết!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. ĐĂNG BÀI MỚI
  const handleCreatePost = async () => {
    if (!currentUser) return toast.error("Bạn cần đăng nhập!");
    if (!newTitle.trim() || !newContent.trim()) return toast.error("Vui lòng điền đủ thông tin!");

    const loadToast = toast.loading("Đang đăng bài...");
    try {
      await addDoc(collection(db, "posts"), {
        title: newTitle,
        content: newContent,
        tags: [newTag],
        author: currentUser.displayName || "Người dùng",
        authorId: currentUser.uid,
        avatar: currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        likes: 0,
        likedBy: [],
        comments: 0,
        views: 0,
        createdAt: serverTimestamp()
      });
      toast.success("Đăng bài thành công!", { id: loadToast });
      setNewTitle(""); setNewContent(""); setShowCreateModal(false);
    } catch (error) {
      toast.error("Lỗi: " + error.message, { id: loadToast });
    }
  };

  const formatDate = (ts) => ts ? ts.toDate().toLocaleString('vi-VN') : "Vừa xong";

  return (
    <>
      {/* --- HIỂN THỊ NAVBAR TẠI ĐÂY --- */}
      <Navbar />

      <div className="community-page">
        {/* Khoảng trống paddingTop để nội dung không bị Navbar che mất (điều chỉnh 80px tùy độ cao Navbar của bạn) */}
        <div style={{ paddingTop: '80px' }}> 
          <section className="forum-hero bg-primary text-white text-center py-5">
            <Container>
              <h1 className="fw-bold">Cộng đồng Sức khỏe</h1>
              <p>Chia sẻ kiến thức, kết nối yêu thương</p>
              <div className="mx-auto mt-3" style={{maxWidth: '600px'}}>
                <InputGroup>
                  <Form.Control 
                    placeholder="Tìm kiếm bài viết..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                  />
                  <Button variant="warning"><FontAwesomeIcon icon={faSearch} /></Button>
                </InputGroup>
              </div>
            </Container>
          </section>

          <Container className="py-5">
            <Row>
              <Col lg={8}>
                <div className="d-flex justify-content-between mb-4 align-items-center">
                  <h4 className="fw-bold text-primary mb-0">Thảo luận mới</h4>
                  <Button variant="primary" className="rounded-pill px-4" onClick={() => setShowCreateModal(true)}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" /> Viết bài
                  </Button>
                </div>

                {posts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())).map((post) => (
                  <Card key={post.id} className="forum-card mb-3 shadow-sm border-0" onClick={() => { setSelectedPostId(post.id); setShowDetailModal(true); }}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <img src={post.avatar} className="rounded-circle me-2" width="40" height="40" alt="avatar" />
                        <div>
                          <h6 className="fw-bold mb-0">{post.author}</h6>
                          <small className="text-muted">{formatDate(post.createdAt)}</small>
                        </div>
                      </div>
                      <h5 className="fw-bold text-dark">{post.title}</h5>
                      <p className="text-muted text-truncate">{post.content}</p>
                      <div className="d-flex gap-4 text-muted small mt-3">
                        <span 
                          className={`cursor-pointer ${post.likedBy?.includes(currentUser?.uid) ? "text-danger fw-bold" : ""}`}
                          onClick={(e) => handleLike(e, post)}
                        >
                          <FontAwesomeIcon icon={faHeart} /> {post.likes}
                        </span>
                        <span><FontAwesomeIcon icon={faComment} /> {post.comments}</span>
                        <span><FontAwesomeIcon icon={faEye} /> {post.views}</span>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Col>

              <Col lg={4}>
                <Card className="border-0 shadow-sm sticky-top" style={{ top: '100px' }}>
                  <Card.Header className="bg-white fw-bold border-0 pt-3">Chủ đề phổ biến</Card.Header>
                  <ListGroup variant="flush" className="p-2">
                    <ListGroup.Item action className="border-0 rounded mb-1">🔥 Thảo luận chung</ListGroup.Item>
                    <ListGroup.Item action className="border-0 rounded mb-1">🥗 Chế độ dinh dưỡng</ListGroup.Item>
                    <ListGroup.Item action className="border-0 rounded mb-1">🏃‍♂️ Tập luyện mỗi ngày</ListGroup.Item>
                  </ListGroup>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>

        {/* CÁC MODAL GIỮ NGUYÊN */}
        <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
          <Modal.Header closeButton><Modal.Title>Tạo thảo luận mới</Modal.Title></Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề</Form.Label>
              <Form.Control value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Vấn đề bạn đang quan tâm..." />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Chủ đề</Form.Label>
              <Form.Select value={newTag} onChange={e => setNewTag(e.target.value)}>
                <option>Thảo luận chung</option>
                <option>Dinh dưỡng</option>
                <option>Kinh nghiệm khám bệnh</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nội dung chi tiết</Form.Label>
              <Form.Control as="textarea" rows={5} value={newContent} onChange={e => setNewContent(e.target.value)} />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowCreateModal(false)}>Hủy</Button>
            <Button variant="primary" onClick={handleCreatePost}>Đăng bài ngay</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered scrollable>
          {activePost && (
            <>
              <Modal.Header closeButton>
                <div className="d-flex align-items-center">
                  <img src={activePost.avatar} className="rounded-circle me-2" width="40" height="40" alt="avatar" />
                  <div>
                    <h6 className="mb-0 fw-bold">{activePost.author}</h6>
                    <small className="text-muted">{formatDate(activePost.createdAt)}</small>
                  </div>
                </div>
              </Modal.Header>
              <Modal.Body>
                <h4 className="fw-bold text-primary mb-3">{activePost.title}</h4>
                <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>{activePost.content}</p>
                <hr />
                <CommentSection postId={activePost.id} />
              </Modal.Body>
            </>
          )}
        </Modal>
      </div>
    </>
  );
}

export default CommunityPage;