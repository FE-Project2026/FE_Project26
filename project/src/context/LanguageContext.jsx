// src/context/LanguageContext.js

import React, { createContext, useState, useContext } from 'react';

// 1. LẤY DỮ LIỆU DỊCH TỪ FILE GỐC CỦA BẠN
const translations = {
  en: {
    title: 'Home',
    services: 'Services',
    service1: 'Telemedicine',
    service2: 'Psychotherapy Consultation',
    service3: 'Personal Doctor',
    service4: 'Health Check',
    expert: 'Expert',
    expert1: 'List of Experts',
    expert2: 'Direct Consultation',
    expert3: 'Book an Appointment',
    community: 'Community',
    forum: 'Forum',
    support: 'Support',
    about_us: 'About Us',
    mission: 'Mission',
    vision: 'Vision',
    // Thêm các key còn thiếu
    test1: 'Psychology Test 1',
    test2: 'Psychology Test 2',
    sologan_1: 'Do you want to take care of yourself?',
    txt_1: "Let <span class='highlight'>Health Care</span> help you",
    sologan_2: 'Do you need advice from experts?',
    txt_2: "Let <span class='highlight'>Health Care</span> help you",
    sologan_3: 'Are you feeling pressured, confused, self-conscious?',
    txt_3: "Let <span class='highlight'>Health Care</span> help you",
    remote: "Service",
    ND1: "Simple approach, effective and economical treatment",
    doctor: "Private Doctor",
    cnt: "Let people love you",
    remote_2: "Remote examination",
    cnt_2: " The key is to examine carefully!",
    news: "Edu Health",
    cnt_3: "Edu Talk, Video training",
    know: "Health GPT",
    cnt_4: "Chat 24/7 with AI doctor",
    feedback: "Feedback",
    cmt_1: "Thank you very much doctor. Even though it was only a remote medical examination, the doctor still gave me a feeling of safety from an enthusiastic and very caring doctor...",
    cmt_2: "The support team is very good and timely. The doctor is enthusiastic, skilled, guides and answers patients' questions and concerns...",
    cmt_3: "Thank you very much Health Care. The doctor is very dedicated, clear, and professional in examination and consultation, positively impacting the patient...",
    follow: "Follow us: ",
    mes: "<span style='color: rgb(11, 196, 134)'> TRUSTED health partner</span>",
    mes_1: "We help you maintain a healthy lifestyle, and when you need medical consultation, we connect you with leading specialists via voice and video calls.",
    patients: "For patients",
    thao: "Services",
    thuong: "Guide",
    phuong: "Blog",
    ngoc: "Membership program",
    ques: "Question",
    sup: "Support",
    contact: "Contact",
    privacy: "Privacy",
    in4: "Information",
    school: "Phuong Dong Univerysity, Minh Khai, Hai Ba Trung, Ha Noi",
    email: "tranducson2134@gmail.com",
    tele_1: "+ 84 559 174 159",
    tele_2: "+ 84 234 567 89",
    
  },
  vi: {
    title: 'Trang chủ',
    services: 'Dịch vụ',
    service1: 'Bác sĩ riêng',
    service2: 'Trị liệu tâm lý',
    service3: 'Khám từ xa',
    service4: 'Kiểm tra tâm lý',
    expert: 'Chuyên gia',
    expert1: 'Danh sách',
    expert2: 'Chuyên gia tư vấn ',
    expert3: 'Đặt hẹn',
    community: 'Cộng đồng',
    forum: 'Diễn đàn',
    support: 'Hỗ trợ',
    about_us: 'Về chúng tôi',
    mission: 'Sứ mệnh',
    vision: 'Tầm nhìn',
    // Thêm các key còn thiếu
    test1: 'Test Tâm Lý 1',
    test2: 'Test Tâm Lý 2',
    sologan_1: 'Bạn muốn tự chăm sóc bản thân',
    txt_1: "Để <span class='highlight'>Health Care</span> giúp bạn",
    sologan_2: 'Bạn cần lời khuyên từ chuyên gia',
    txt_2: "Để <span class='highlight'>Health Care</span> giúp bạn",
    sologan_3: 'Bạn cảm thấy áp lực, lo lắng, tự ti ',
    txt_3: "Để <span class='highlight'>Health Care</span> giúp bạn",
    remote: "Dịch vụ",
    ND1: "Tiếp cận đơn giản, điều trị hiệu quả, chi phí tiết kiệm",
    doctor: "Bác sĩ riêng",
    cnt: "Cho người ta thương yêu",
    remote_2: "Khám từ xa",
    cnt_2: "Khám gần khám xa, cốt là khám kỹ!",
    news: "Edu Health",
    cnt_3: "Hỏi kiến thức, Healthtalk, Video trainings",
    know: "HealthGPT",
    cnt_4: "Chat 24/7 với bác sĩ AI",
    feedback: "Đánh giá của khách hàng",
    cmt_1: "Em cảm ơn bác sĩ rất nhiều. Dù chỉ là khám bệnh từ xa nhưng bác sĩ vẫn cho em cảm giác an toàn từ 1 vị bác sĩ nhiệt tình và rất có tâm...",
    cmt_2: "Đội ngũ hỗ trợ rất tốt, kịp thời. Bác sĩ nhiệt tình, giỏi chuyên môn, hướng dẫn và giải đáp được thắc mắc, lo âu của bệnh nhân...",
    cmt_3: "Anh chị em nghiệp vụ của Health Care thực sự chu đáo, tận tình... Bác sĩ khám, tư vấn rất tận tình, rõ ràng, chuyên nghiệp...",
    follow: "Theo dõi chúng tôi: ",
    mes: "<span style='color: rgb(11, 196, 134)'> Đối tác sức khỏe TIN CẬY</span>",
    mes_1: "Chúng tôi giúp bạn duy trì một lối sống lành mạnh, và khi bạn cần tham vấn y tế, chúng tôi kết nối bạn với những bác sĩ chuyên khoa hàng đầu qua gọi thoại và gọi video.",
    patients: "Dành cho bệnh nhân",
    thao: "Dịch vụ",
    thuong: "Cẩm nang",
    phuong: "Blog sống khỏe",
    ngoc: "Chương trình thành viên",
    ques: "Câu hỏi thường gặp",
    sup: "Hỗ trợ",
    contact: "Liên hệ",
    privacy: "Chính sách bảo mật",
    in4: "Thông tin",
    school: "Đại học Phương Đông (CS2), Minh Khai, Hai Bà Trưng, Hà Nội",
    email: "tranducson2134@gmail.com",
    tele_1: "+ 84 559 174 159",
    tele_2: "+ 84 234 567 89",
   
  },
  jp: {
    title: 'ホームページ',
    services: 'サービス',
    service1: '遠隔診療',
    service2: '心理カウンセリング',
    service3: 'プライベートドクター',
    service4: '健康チェック',
    expert: '専門家',
    expert1: 'リスト',
    expert2: '直接相談専門家',
    expert3: '予約',
    community: 'コミュニティ',
    forum: 'フォーラム',
    support: 'サポート',
    about_us: '私たちについて',
    mission: 'ミッション',
    vision: 'ビジョン',
    // Thêm các key còn thiếu
    test1: '心理テスト1',
    test2: '心理テスト2',
    sologan_1: '自分のことは大事にしたい',
    txt_1: " <span class='highlight'>ヘルスケア</span>が お手伝いします",
    sologan_2: '専門家からのアドバイスが必要ですか',
    txt_2: "<span class='highlight'>ヘルスケア</span>が お手伝いします",
    sologan_3: 'プレッシャー、不安、自意識過剰を感じている',
    txt_3: "<span class='highlight'>ヘルスケア</span>が お手伝いします",
    remote: "サービス",
    ND1: "シンプルなアクセス、効果的な治療、コスト削減",
    doctor: "開業医",
    cnt: "人々にあなたを愛してもらいましょう",
    remote_2: "遠隔診察",
    cnt_2: "近くも遠くもじっくり観察するのがポイント!",
    news: "エデュヘルス",
    cnt_3: "知識を求める、Healthtalk、ビデオトレーニング",
    know: "健康GPT",
    cnt_4: "AI 医師と 24 時間 365 日チャットできます",
    feedback: "フィードバック",
    cmt_1: "医師、本当にありがとうございました。遠隔診療でしたが、熱心でとても親身な先生で安心感がありました...",
    cmt_2: "サポートチームは非常に優秀でタイムリーです。医師は熱心で熟練しており、患者の質問や懸念に答えて指導し...",
    cmt_3: "Health Care のスタッフは真に思いやりがあり...医師は非常に熱心に、わかりやすく、専門的に診察とアドバイスを行っており...",
    follow: "私たちに従ってください ",
    mes: "<span style='color: rgb(11, 196, 134)'> 信頼できる健康パートナー</span>",
    mes_1: "私たちは、お客様の健康的なライフスタイルの維持をお手伝いし、医療相談が必要な場合には、音声通話やビデオ通話を通じて一流の専門家におつなぎします。",
    patients: "患者様向け",
    thao: "サービス",
    thuong: "ハンドブック",
    phuong: "健康的な生活のブログ",
    ngoc: "会員プログラム",
    ques: "質問",
    sup: "サポート",
    contact: "連絡",
    privacy: "プライバシーポリシー",
    in4: "情報",
    school: "フォンドン大学,ミンカイ、ハイバチュン、ハノイ",
    email: "tranducson2134@gmail.com",
    tele_1: "+ 84 559 174 159",
    tele_2: "+ 84 234 567 89",
  },
};

// 2. TẠO CONTEXT
const LanguageContext = createContext();

// 3. TẠO PROVIDER (Component "cha" bọc ứng dụng)
export function LanguageProvider({ children }) {
  // Mặc định là 'vi' và lưu vào localStorage
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'vi');

  const changeLanguage = (lang) => {
    localStorage.setItem('language', lang); // Lưu lựa chọn
    setLanguage(lang);
  };

  // Hàm 't' (translate)
  const t = (key) => {
    return translations[language][key] || key; // Nếu không tìm thấy key, trả về chính key đó
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 4. TẠO HOOK (để component con dễ sử dụng)
export const useLanguage = () => useContext(LanguageContext);