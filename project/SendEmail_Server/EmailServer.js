import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();
const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Cấu hình tài khoản gửi mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- API 1: GỬI MAIL LỊCH KHÁM CHO BỆNH NHÂN ---
app.post("/api/send-approval-email", async (req, res) => {
  const { patientEmail, patientName, time, date, doctorName } = req.body;
  console.log("📨 Đang xử lý mail lịch khám tới:", patientEmail);

  // 1. Kiểm tra kỹ xem có email không (Tránh lỗi EENVELOPE)
  if (!patientEmail) {
    console.error("❌ Lỗi: Không có địa chỉ email người nhận!");
    return res.status(400).json({ error: "Missing patientEmail" });
  }

  const mailOptions = {
    from: '"HealthCare System" <no-reply@healthcare.com>',
    to: patientEmail,
    subject: "✅ Xác nhận lịch khám - HealthCare",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2563eb;">Xác nhận lịch khám thành công</h2>
        <p>Xin chào <strong>${patientName}</strong>,</p>
        <p>Lịch khám của bạn đã được bác sĩ xác nhận.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p><strong>👨‍⚕️ Bác sĩ:</strong> ${doctorName}</p>
        <p><strong>📅 Ngày:</strong> ${date}</p>
        <p><strong>⏰ Thời gian:</strong> ${time}</p>
        <p>Vui lòng đến đúng giờ để được phục vụ tốt nhất.</p>
        <p style="color: #666; font-size: 12px; margin-top: 30px;">Đây là email tự động, vui lòng không trả lời.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Gửi mail lịch khám thành công!");
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Lỗi gửi mail:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// --- API 2: GỬI MAIL KẾT QUẢ ĐĂNG KÝ BÁC SĨ ---
app.post("/api/send-doctor-result", async (req, res) => {
  const { email, name, status, reason } = req.body;
  console.log(`📩 Đang xử lý mail bác sĩ tới: ${email} - Status: ${status}`);

  // Kiểm tra email
  if (!email) {
     return res.status(400).json({ error: "Missing doctor email" });
  }

  let subject = "";
  let htmlContent = "";

  if (status === 'approved') {
    subject = "🎉 Chúc mừng! Tài khoản Bác sĩ của bạn đã được duyệt";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #16a34a;">Hồ sơ đã được phê duyệt!</h2>
        <p>Xin chào Bác sĩ <strong>${name}</strong>,</p>
        <p>Chúng tôi vui mừng thông báo hồ sơ đăng ký của bạn đã được Admin phê duyệt.</p>
        <p>Bây giờ bạn có thể đăng nhập vào hệ thống để bắt đầu tiếp nhận bệnh nhân.</p>
        <div style="margin: 20px 0;">
            <a href="http://localhost:5173/login" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Đăng nhập ngay</a>
        </div>
      </div>
    `;
  } else {
    subject = "⚠️ Thông báo về hồ sơ đăng ký Bác sĩ";
    htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #dc2626;">Đăng ký không thành công</h2>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Rất tiếc, hồ sơ đăng ký của bạn chưa đạt yêu cầu.</p>
        <p><strong>Lý do:</strong> ${reason || "Thông tin chưa hợp lệ."}</p>
      </div>
    `;
  }

  const mailOptions = {
    from: '"HealthCare Admin" <no-reply@healthcare.com>',
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Gửi mail bác sĩ thành công!");
    res.status(200).json({ message: "Sent doctor result email" });
  } catch (error) {
    console.error("❌ Lỗi gửi mail bác sĩ:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// --- KHỞI ĐỘNG SERVER (ĐẶT Ở CUỐI CÙNG) ---
app.listen(PORT, () => {
  console.log(`📨 Email Server đang chạy tại: http://localhost:${PORT}`);
});