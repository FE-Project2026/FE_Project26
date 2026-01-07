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
            </InputGroup>
          </div>
        </Container>
      </section>

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
    </div>
  );
}

export default CommunityPage;