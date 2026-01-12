console.log("SERVER STARTED");
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config({ debug: true });
console.log("API KEY:", process.env.OPENAI_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Backend is running");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Prompt định hướng AI
const SYSTEM_PROMPT = `
Bạn là trợ lý sức khỏe AI cho website khám bệnh từ xa.

Nhiệm vụ:
- Trả lời các câu hỏi về sức khỏe phổ thông
- Giải thích dễ hiểu cho người không chuyên
- Không được chẩn đoán bệnh như bác sĩ
- Luôn khuyên người dùng đi khám nếu triệu chứng nặng
- Luôn trả lời bằng tiếng Việt lịch sự, nhẹ nhàng

Ví dụ:
User: Tôi bị đau đầu 3 ngày
AI: Bạn nên nghỉ ngơi, uống đủ nước. Nếu kéo dài thêm hoặc kèm sốt, buồn nôn thì nên đi khám bác sĩ.
`;

app.post("/chat", async (req, res) => {
  console.log("Nhận request từ frontend:", req.body);
  try {
    const userMessages = req.body.messages || [];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...userMessages,
      ],
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (err) {
    console.error("AI error:", err);
    res.status(500).json({
      reply: "Xin lỗi, hệ thống AI đang gặp sự cố. Vui lòng thử lại sau.",
    });
  }
});

app.listen(3001, () => {
  console.log(" AI Server running at http://localhost:3001");
});
