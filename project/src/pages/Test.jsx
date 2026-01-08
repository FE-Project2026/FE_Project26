import React, { useState, useEffect } from 'react';

// Dữ liệu câu hỏi (có thể mở rộng)
const QUESTIONS = [
    { id: 1, text: "Bạn cảm thấy ít quan tâm và mất hứng thú với mọi việc" },
    { id: 2, text: "Tâm trạng chán nản , xuống dốc , hoặc tuyệt vọng" },
    { id: 3, text: "Khó vào giấc ngủ , ngủ trằn trọc hoặc ngủ quá nhiều" },
    { id: 4, text: "Cảm thấy tệ về bản thân mình , bản thân mình thất bại gục ngã" },
    { id: 5, text: "Có suy nghĩ đến việc sẽ biến mất hoặc làm đau bản thân mình" },
    { id: 6, text: "Cảm thấy tương lai tuyệt vọng , những điều tồi tệ đang diễn ra và tình tiếp tục xấu đi chứ không thể nào cải thiện được" },
    { id: 7, text: "Cảm thấy bản thân dễ bị kích động , dễ cáu gắt hơn" },
    { id: 8, text: "Bạn có phải tìm kiếm sự hỗ trợ từ các diễn đàn tâm lý học không ?" },
    { id: 9, text: "Bạn có phải sử dụng đến thuốc để làm cho tinh thần ổn định hơn không ?" },
    { id: 10, text: "Bạn có thường xuyên tập thể dục , chơi thể thao không ?" },
    { id: 11, text: "Bạn có nghĩ rằng việc thay đổi môi trường sống ,lối sống mới của mình đang ảnh hưởng đến tâm lý không ?" },
    { id: 12, text: "Khi gặp khó khăn, bạn có sẵn lòng chia sẻ với gia đình/bạn bè không ?" },
    { id: 13, text: "Bạn có bao giờ cảm thấy cô đơn hoặc thiếu sự hỗ trợ từ gia đình và bạn bè không ?" },
    // Cần thêm 12 câu hỏi nữa nếu bạn muốn đạt 25 câu (totalQuestions = 25)
];

const totalQuestions = QUESTIONS.length; // 13/25 câu hỏi

// Component Câu hỏi con
function QuestionItem({ question, onAnswer }) {
    const options = [
        { value: 0, label: "+0 (Không bao giờ)" },
        { value: 1, label: "+1 (1-2 ngày/ Tuần)" },
        { value: 2, label: "+2 (3-4 ngày/ Tuần)" },
        { value: 3, label: "+3 (Gần như hằng ngày)" },
    ];

    return (
        <div className="question">
            <h3>Câu {question.id}</h3>
            <p>{question.text}</p>
            <div className="options">
                {options.map((option) => (
                    <label key={option.value}>
                        <input
                            type="radio"
                            name={`question${question.id}`}
                            value={option.value}
                            onClick={() => onAnswer(option.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    );
}

// Component chính
export default function PsychologicalSurvey() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isFinished, setIsFinished] = useState(false);
    const [totalScore, setTotalScore] = useState(0);

    const completedCount = Object.keys(answers).length;
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    const progressPercentage = (completedCount / totalQuestions) * 100;

    // Xử lý khi người dùng trả lời
    const handleAnswer = (score) => {
        const questionId = currentQuestion.id;

        // 1. Lưu câu trả lời
        setAnswers(prev => ({ ...prev, [questionId]: score }));

        // 2. Chuyển sang câu hỏi tiếp theo
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < totalQuestions) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            // Hoàn thành khảo sát
            const finalScore = Object.values({ ...answers, [questionId]: score }).reduce((sum, s) => sum + s, 0);
            setTotalScore(finalScore);
            setIsFinished(true);
            
            // TẠM THỜI: Xử lý logic gửi dữ liệu (thay cho fetch PHP cũ)
            console.log("Khảo sát hoàn thành. Tổng điểm:", finalScore);
            // fetch('../Module/luu_khao_sat.php', ...)
        }
    };

    // Xác định thông điệp cuối cùng
    const getFinalMessage = (score) => {
        if (score <= 10) {
            return 'Tâm trạng của bạn đang rất ổn, hãy cố gắng duy trì, chưa cần đến sự hỗ trợ của chuyên gia.';
        } else if (score <= 20) {
            return 'Bạn có thể gặp một vài lo lắng hoặc áp lực. Hãy dành thời gian chăm sóc bản thân và thư giãn.';
        } else {
            return 'Bạn đang có dấu hiệu căng thẳng cao. Nên cân nhắc tìm kiếm sự trợ giúp từ chuyên gia để hỗ trợ tâm lý tốt hơn.';
        }
    };

    // Component để hiển thị Footer (đã chuyển đổi sang JSX)
    const Footer = () => (
        <footer className="text-center text-lg-start bg-body-tertiary text-muted">
            {/* Section: Social media */}
            <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
                <div className="me-5 d-none d-lg-block">
                    <span><p id="follow">Theo dõi chúng tôi qua :</p></span>
                </div>
                <div>
                    {['facebook-f', 'twitter', 'google', 'instagram', 'linkedin', 'github'].map(icon => (
                        <a key={icon} href="#" className="me-4 text-reset">
                            <i className={`fab fa-${icon}`}></i>
                        </a>
                    ))}
                </div>
            </section>
            {/* Section: Links */}
            <section className="container text-center text-md-start mt-5">
                <div className="row mt-3">
                    <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4">
                            <img src="../Media/logo.svg" alt="" width="50px" /> Health Care
                        </h6>
                        <p id="mes">
                            <span style={{ color: 'rgb(11, 196, 134)' }}> Đối tác sức khỏe TIN CẬY</span><br />
                            <p id="mes_1">Chúng tôi giúp bạn duy trì một lối sống lành mạnh, và khi bạn cần tham vấn y tế, chúng tôi kết nối bạn với những bác sĩ chuyên khoa hàng đầu qua gọi thoại và gọi video.</p>
                        </p>
                    </div>
                    {/* Các cột khác... (Cần thêm cột đầy đủ để khớp thiết kế) */}
                    {/* Cột 2: Dành cho bệnh nhân */}
                    <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4"><p id="patients">Dành cho bệnh nhân</p></h6>
                        <p><a href="#!" className="text-reset" style={{ textDecoration: 'none' }}><span>Dịch vụ</span></a></p>
                        <p><a href="#!" className="text-reset" style={{ textDecoration: 'none' }}><span>Cẩm nang</span></a></p>
                        <p><a href="#!" className="text-reset" style={{ textDecoration: 'none' }}><span>Blog sống khỏe</span></a></p>
                        <p><a href="#!" className="text-reset" style={{ textDecoration: 'none' }}><span>Chương trình thành viên</span></a></p>
                    </div>
                    {/* Cột 3: Hỗ trợ */}
                    <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                        <h6 className="text-uppercase fw-bold mb-4"><p id="sup">Hỗ trợ</p></h6>
                        <p><a href="#!" className="text-reset" style={{ textDecoration: 'none' }}><span>Câu hỏi thường gặp</span></a></p>
                        <p><a href="#!" className="text-reset" style={{ textDecoration: 'none' }}><span>Liên hệ</span></a></p>
                        <p><a href="#!" className="text-reset" style={{ textDecoration: 'none' }}><span>Chính sách bảo mật</span></a></p>
                    </div>
                    {/* Cột 4: Thông tin */}
                    <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                        <h6 className="text-uppercase fw-bold mb-4"><p id="in4">Thông tin</p></h6>
                        <p id="school"><i className="fas fa-home me-3"></i> Đại học Phương Đông (CS2), Minh Khai, Hai Bà Trưng, Hà Nội </p>
                        <p id="email"><i className="fas fa-envelope me-3"></i> tranducson2134@gmail.com</p>
                        <p id="tele_1"><i className="fas fa-phone me-3"></i> + 84 559 174 159</p>
                        <p id="tele_2"><i className="fas fa-print me-3"></i> + 84 234 567 89</p>
                    </div>
                </div>
            </section>
            {/* Copyright */}
            <div className="text-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                © 2024 Copyright:
                <a className="text-reset fw-bold" href="https://mdbootstrap.com/"><p id="group">Group 5</p></a>
            </div>
        </footer>
    );

    // Component để hiển thị Navbar (đã chuyển đổi sang JSX)
    const Navbar = () => (
        <div id="wrapper" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000 }}>
            <div className="header">
                <nav className="container">
                    <a href="Web_Suc_Khoe copy.php" id="logo" style={{ textDecoration: 'none', color: '#474746' }}>
                        <img src="../Media/logo.svg" alt="" style={{ width: '15%' }} /> HEALTH CARE
                    </a>
                    <ul id="main-menu">
                        <li id="title"><a href="Web_Suc_Khoe copy.php">Trang chủ</a></li>
                        <li id="services" className="has-child">
                            <a href="#">Dịch vụ</a>
                            <ul className="sub-menu">
                                <li><a id="service4" href="face_form.php">Kiểm tra tâm lý</a></li>
                                <li><a id="service2" href="Tuvantrilieutamly.php">Tư vấn trị liệu tâm lý</a></li>
                                <li><a id="service3" href="khamtuxa.php">Khám từ xa</a></li>
                                <li><a id="service1" href="Bacsirieng.php">Bác sĩ riêng</a></li>
                            </ul>
                        </li>
                        <li id="expert">
                            <a href="#">Chuyên gia</a>
                            <ul className="sub-menu">
                                <li><a id="expert1" href="doctors.php">Danh sách</a></li>
                                <li><a id="expert2" href="#">Chuyên gia tư vấn trực tiếp</a></li>
                                <li><a id="expert3" href="#">Đặt hẹn</a></li>
                            </ul>
                        </li>
                        <li id="community">
                            <a href="#">Cộng đồng</a>
                            <ul className="sub-menu">
                                <li><a id="forum" href="#">Diễn đàn</a></li>
                                <li><a id="support" href="#">Hỗ trợ</a></li>
                            </ul>
                        </li>
                        <li id="about_us">
                            <a href="#">Về chúng tôi</a>
                            <ul className="sub-menu">
                                <li><a id="mission" href="#">Sứ mệnh</a></li>
                                <li><a id="vision" href="#">Tầm nhìn phát triển</a></li>
                            </ul>
                        </li>
                        {/* Khu vực Ngôn ngữ/Đăng nhập (Giả lập PHP) */}
                        <li style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                            <div className="language-switcher" style={{ marginTop: 0 }}>
                                <i className="fa-solid fa-earth-americas fa-xl" style={{ fontSize: '20px' }}></i>
                                <div className="language-dropdown">
                                    <button onClick={() => console.log('Change Lang to EN')}>English</button>
                                    <button onClick={() => console.log('Change Lang to VI')}>Tiếng Việt</button>
                                    <button onClick={() => console.log('Change Lang to JP')}>日本語</button>
                                </div>
                            </div>
                            <div className="login-status" style={{ marginLeft: '15px' }}>
                                <a href="login.php" className="nav-link">Login</a>
                            </div>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
    
    // Phần hiển thị cuối cùng
    const renderFinalMessage = () => (
        <div className="final-message">
            <h2>Kết quả khảo sát của bạn</h2>
            <p>{getFinalMessage(totalScore)}</p>
            <button onClick={() => window.location.href = 'privatedoctors'}>Đặt bác sĩ riêng</button>
        </div>
    );

    return (
        <>
            {/* Nhúng CSS */}
            <style>
                {/* CSS styles của bạn được nhúng trực tiếp vào đây */}
                {`
                /* style.css */
                h2 { font-size: 18px; color: #333; }
                .progress-bar { background-color: #f0f0f0; height: 8px; border-radius: 4px; margin: 10px 0; }
                .progress { background-color: #f39c12; height: 100%; width: ${progressPercentage}%; border-radius: 4px; transition: width 0.4s ease; }
                .options label { display: block; padding: 10px; background-color: #f0f0f0; border-radius: 4px; margin: 5px 0; cursor: pointer; }
                .options label:hover { background-color: #f39c12; }
                input[type="radio"] { margin-right: 10px; }
                #completion-status { color: #f39c12; font-weight: bold; }
                .final-message { text-align: center; margin-top: 20px; }
                .final-message h2 { color: #333; }
                .final-message p { margin-top: 10px; font-size: 16px; }
                .final-message button { margin-top: 20px; padding: 10px 20px; background-color: #f39c12; border: none; border-radius: 4px; color: white; cursor: pointer; }
                
                /* Navbar CSS */
                #wrapper { position: fixed; left:0; right: 0; z-index: 1000; }
                .header { background-color:#fff; }
                .container { max-width: 1500px; margin: 0 auto; }
                nav { display: flex; justify-content:space-around; }
                #main-menu { display: flex; list-style: none; margin: 0; padding: 0; font-size: 20px; }
                #main-menu li { position: relative; display: inline-block; }
                #main-menu li a { color:#333; display: block; text-decoration: none; padding: 18px 20px; }
                #main-menu ul.sub-menu { position: absolute; background: #ffffffab; padding: 15px 0px; list-style: none; width: 200px; border:1px solid #333; display: none; }
                #main-menu li:hover>ul.sub-menu { display: block; }
                #main-menu ul.sub-menu a { padding: 8px 15px; border-bottom: 1px solid #8d8a8a; left:0; }
                #main-menu ul.sub-menu li a { color:#333; }
                #main-menu ul.sub-menu li:hover>a { border-bottom: 1px solid #474746; box-shadow: rgba(148, 241, 120, 0.4) -5px 5px, rgba(148, 184, 66, 0.3) -10px 10px; border-radius: 10px; }
                #main-menu ul.sub-menu li:last-child a { border-bottom:none; }
                #main-menu>li>a { position: relative; }
                #main-menu>li>a::before { content: ""; height: 4px; width: 0px; background: rgb(81, 233, 64); position: absolute; bottom: 0px; transition: 0.25s cubic-bezier(0.075, 0.82, 0.165, 1); }
                #main-menu>li:hover>a::before { width: 100%; left: 0px; }
                #main-menu>li.has-child::after { font-family:"Font Awesome 5 Free"; font-weight:600; content:"\f107"; color: #333; position: absolute; top:0px; right: 0px; padding: 18px 0px; }
                #main-menu .sub-menu>li.has-child::after { font-family:"Font Awesome 5 Free"; font-weight:600; content:"\f105"; color: #333; position: absolute; top:0px; right: 10px; padding: 8px 0px; }
                #main-menu .sub-menu>li.has-child :hover::after { color:rgba(255, 255, 255, 0.61); }
                .language-switcher { position: relative; display: inline-block; margin-left: 15px; }
                .language-icon { font-size: 30px; cursor: pointer; }
                .language-dropdown { display: none; position: absolute; top: 55px; left: 13.5px; background-color: white; box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2); z-index: 1; border-radius: 4px; width: 120px; }
                .language-dropdown button { color: black; padding: 10px; text-decoration: none; display: flex; justify-content: center; align-items: center; font-size: 16px; text-align: center; width: 100%; height: 40px; box-sizing: border-box; border: 1px solid black; }
                .language-dropdown a:hover { background-color: #f1f1f1; }
                .language-switcher:hover .language-dropdown { display: block; }
                .login-status a { text-decoration: none; color: #333; padding: 18px 0px; display: block; }
                `}
            </style>

            <Navbar />
            
            <div className="container" style={{ paddingTop: '100px' }}>
                <h2>Trạng thái hoàn thành</h2>
                <div className="progress-bar">
                    <div className="progress" id="progress"></div>
                </div>
                <p id="completion-status">{completedCount}/{totalQuestions}</p>

                {!isFinished && currentQuestion && (
                    <QuestionItem
                        key={currentQuestion.id}
                        question={currentQuestion}
                        onAnswer={handleAnswer}
                    />
                )}
                
                {isFinished && renderFinalMessage()}
                
                <h3 style={{ textIndent: 20, marginTop: '20px' }}>Lưu ý: </h3>
                <p style={{ textIndent: 20 }}> Kết quả bài test này chỉ mang tính chất tham khảo, không có giá trị thay thế chẩn đoán y khoa bởi chuyên gia tâm lý/bác sĩ tâm thần.</p>
            </div>
            
            <Footer />
        </>
    );
}