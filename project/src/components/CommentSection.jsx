import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { db } from '../firebaseConfig'; // Đảm bảo đường dẫn đúng
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { currentUser } = useAuth();

  // 1. Lắng nghe danh sách Comment theo thời gian thực
  useEffect(() => {
    // Truy vấn vào sub-collection "comments" của bài viết cụ thể
    const commentsRef = collection(db, 'posts', postId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc')); // Xếp cũ nhất lên đầu (kiểu Facebook)

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [postId]);

  // 2. Xử lý Gửi Comment
  const handleSendComment = async () => {
    if (!currentUser) return alert("Vui lòng đăng nhập để bình luận!");
    if (!newComment.trim()) return;

    try {
      const commentsRef = collection(db, 'posts', postId, 'comments');
      const postRef = doc(db, 'posts', postId);

      // A. Thêm comment vào sub-collection
      await addDoc(commentsRef, {
        text: newComment,
        author: currentUser.displayName || currentUser.email.split('@')[0],
        authorId: currentUser.uid,
        avatar: currentUser.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        createdAt: serverTimestamp()
      });

      // B. Tăng số lượng comment ở bài viết gốc lên 1
      await updateDoc(postRef, {
        comments: increment(1)
      });

      setNewComment(""); // Xóa ô nhập sau khi gửi
    } catch (error) {
      console.error("Lỗi gửi comment:", error);
    }
  };

  // Hàm format thời gian
  const formatTime = (timestamp) => {
    if (!timestamp) return "Đang gửi...";
    return timestamp.toDate().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="mt-3">
      <h6 className="fw-bold text-primary mb-3">Bình luận ({comments.length})</h6>

      {/* DANH SÁCH COMMENT */}
      <div className="comment-list mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {comments.length === 0 ? (
          <p className="text-muted small text-center">Chưa có bình luận nào.</p>
        ) : (
          comments.map((cmt) => (
            <div key={cmt.id} className="d-flex mb-3">
              <img 
                src={cmt.avatar} 
                alt="Avatar" 
                className="rounded-circle me-2" 
                width="32" height="32" 
                style={{ objectFit: 'cover' }} 
              />
              <div className="bg-light p-2 px-3 rounded-3" style={{ maxWidth: '90%' }}>
                <div className="d-flex align-items-center mb-1">
                  <span className="fw-bold me-2 small">{cmt.author}</span>
                  <small className="text-muted" style={{ fontSize: '10px' }}>
                    {formatTime(cmt.createdAt)}
                  </small>
                </div>
                <p className="mb-0 small text-secondary">{cmt.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ô NHẬP COMMENT */}
      <InputGroup>
        <Form.Control
          placeholder="Viết bình luận công khai..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendComment()} // Enter để gửi
        />
        <Button variant="primary" onClick={handleSendComment}>
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </InputGroup>
    </div>
  );
};

export default CommentSection;