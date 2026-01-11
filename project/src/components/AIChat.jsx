import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function AIChat() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Xin chào, tôi là trợ lý sức khỏe AI. Bạn cần hỗ trợ gì?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages })
    });

    const data = await res.json();

    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      width: 300,
      background: "#fff",
      border: "1px solid #ddd",
      borderRadius: 10,
      padding: 10
    }}>
      <div style={{ height: 300, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <strong>{m.role === "user" ? "Bạn" : "AI"}:</strong> {m.content}
          </div>
        ))}
      </div>

      <Form.Control
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Nhập câu hỏi..."
        onKeyDown={e => e.key === "Enter" && sendMessage()}
      />
      <Button onClick={sendMessage} className="mt-2" size="sm">Gửi</Button>
    </div>
  );
}
