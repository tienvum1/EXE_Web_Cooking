import React, { useState, useRef } from 'react';
import './ChatBot.scss';
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Xin chào! Tôi có thể giúp gì cho bạn?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      // Gọi API ChatGPT backend
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/chatgpt`, { message: input }, { withCredentials: true });
      setMessages([...newMessages, { from: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages([...newMessages, { from: 'bot', text: 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại.' }]);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  return (
    <>
      {!open && (
        <button className="chatbot__toggle-btn" onClick={() => setOpen(true)}>
          <FaComments size={28} />
        </button>
      )}
      {open && (
        <div className="chatbot__container">
          <div className="chatbot__header">
            <span>ChatBot Hỗ Trợ</span>
            <button className="chatbot__close-btn" onClick={() => setOpen(false)}><FaTimes /></button>
          </div>
          <div className="chatbot__messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot__msg chatbot__msg--${msg.from}`}>{msg.text}</div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot__input-area">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? handleSend() : null}
              placeholder="Nhập câu hỏi..."
              disabled={loading}
            />
            <button onClick={handleSend} disabled={loading || !input.trim()}><FaPaperPlane /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot; 