// src/pages/PsychologicalSurveyIntro.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const PsychologicalSurveyIntro = () => {
    return (
        <div className="container_1 max-w-3xl mx-auto p-5 sm:p-8 bg-white shadow-lg rounded-lg" style={{ marginTop: '80px' }}>
            
            {/* --- BANNER --- */}
            <header className="header_1 relative w-full h-56 rounded-xl overflow-hidden shadow-md">
                {/* Nền Gradient Xanh Đậm hơn để làm nổi chữ Vàng */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600"></div>

                {/* Họa tiết trang trí */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-yellow-300 opacity-20 rounded-full translate-x-10 translate-y-10"></div>

                {/* Nội dung Banner */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
                    {/* Icon: Màu Vàng Rực */}
                    <div className="mb-3 text-4xl text-yellow-300 drop-shadow-md">
                        <i className="fas fa-brain"></i>
                    </div>
                    
                    {/* Tiêu đề: Màu Trắng Kem (hơi ngả vàng) */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-wide text-yellow-50 drop-shadow-sm">
                        Khảo sát Sức khỏe Tâm lý
                    </h1>
                    
                    {/* Phụ đề: Màu Vàng Nhạt */}
                    <p className="text-lg md:text-xl font-medium text-yellow-200 opacity-90">
                        Thấu hiểu bản thân - Chữa lành tâm hồn
                    </p>
                </div>
            </header>

            {/* Thông tin tóm tắt */}
            <div className="info flex flex-col sm:flex-row justify-around items-center p-4 my-6 border-y border-gray-100 bg-blue-50 rounded-md text-gray-700 font-medium">
                <div className="questions mb-2 sm:mb-0 text-blue-800">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700 mr-2">
                        <i className="fas fa-list-ul text-sm"></i>
                    </span>
                    13 Câu hỏi trắc nghiệm
                </div>
                <div className="time text-blue-800">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 text-blue-700 mr-2">
                        <i className="fas fa-clock text-sm"></i>
                    </span>
                    Thời gian ~ 5 phút
                </div>
            </div>

            {/* Nội dung giới thiệu */}
            <section className="content space-y-5 text-gray-600 leading-relaxed">
                <p>Bài test (trắc nghiệm) dựa trên nguyên lí của bài test <span className="font-bold text-blue-600">DASS-21</span> (Thang đo Trầm cảm - Lo âu - Căng thẳng).</p>

                <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                        <i className="fas fa-bullseye mr-2 text-yellow-600"></i>
                        Mục đích bài test:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 ml-2 text-gray-700">
                        <li>Tự đánh giá tình trạng Sức khỏe tinh thần cá nhân.</li>
                        <li>Dự đoán sớm các dấu hiệu tâm lý bất ổn.</li>
                        <li>Tổng hợp thông tin để thuận tiện khi thăm khám với Bác sĩ/Chuyên gia.</li>
                    </ul>
                </div>

                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mt-6">
                    Nguyên tắc thực hiện:
                </h3>
                <p className="italic text-gray-600 bg-gray-50 p-3 rounded">
                    "Hãy đọc mỗi câu hỏi sau và chọn đáp án gần giống nhất với tình trạng mà
                    bạn cảm thấy <strong>TRONG 1 TUẦN QUA</strong>. Không có câu trả lời đúng hay sai.
                    Và đừng dừng lại quá lâu ở bất kỳ câu nào."
                </p>

                <div className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-100 mt-4">
                    <strong><i className="fas fa-exclamation-triangle mr-1"></i> Lưu ý:</strong> Kết quả bài test này chỉ mang tính chất tham khảo, không có giá trị thay
                    thế chẩn đoán y khoa bởi chuyên gia tâm lý/bác sĩ tâm thần.
                </div>
            </section>

            {/* Nút Start - ĐÃ ĐỔI MÀU */}
            <div className="Form text-center mt-10 mb-5">
                <Link
                    to="/services/Test"
                    // Thay đổi class ở đây: Nền Vàng/Cam - Chữ Đậm
                    className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-blue-900 transition-all duration-200 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full focus:outline-none focus:ring-4 focus:ring-yellow-300 hover:shadow-xl hover:scale-105 hover:from-yellow-300 hover:to-orange-400"
                    style={{ textDecoration: 'none' }}
                >
                    <span className="drop-shadow-sm">BẮT ĐẦU NGAY</span>
                    <i className="fas fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
                </Link>
            </div>
        </div>
    );
}

export default PsychologicalSurveyIntro;