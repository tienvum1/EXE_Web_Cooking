const axios = require('axios');
require('dotenv').config();

exports.handleChat = async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: 'Bạn chưa nhập câu hỏi.' });
  }

  // Nếu có GEMINI_API_KEY thì gọi thật, không thì trả về mock
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    return res.json({ reply: `Bạn vừa hỏi: "${message}". (Đây là phản hồi mẫu, hãy cấu hình Google Gemini API Key để dùng thật!)` });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { parts: [{ text: message }] }
        ],
        generationConfig: {
            maxOutputTokens: 500,
            temperature: 0.7,
        }
      }
      // Gemini API doesn't require Authorization header in this basic call
    );
    const reply = response.data.candidates[0].content.parts[0].text.trim();
    res.json({ reply });
  } catch (err) {
    // Log lỗi chi tiết ra console
    if (err.response) {
      console.error('Google Gemini API error:', err.response.status, err.response.data);
    } else {
      console.error('Google Gemini API error:', err.message);
    }
    res.status(500).json({ reply: 'Xin lỗi, có lỗi xảy ra khi kết nối Google Gemini.' });
  }
}; 