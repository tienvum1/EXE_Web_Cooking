import React, { useState } from 'react';
import './FeedbackPage.scss';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';

const FeedbackForm = () => {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      setSent(true);
      setValue('');
      // TODO: Gửi dữ liệu về server tại đây nếu muốn
    }
  };

  return (
    <>
    <Header />
    <Sidebar />
    <div className="feedback-form-container">
      <h2 className="feedback-title">Giúp chúng tôi cải thiện dịch vụ</h2>
      <p className="feedback-desc">
        FitMeal luôn không ngừng hoàn thiện dịch vụ để khiến bạn hài lòng hơn. Rất mong nhận được phản hồi của bạn để FitMeal có thể cải thiện tốt hơn.
      </p>
      <form className="feedback-form" onSubmit={handleSubmit}>
        <textarea
          className="feedback-textarea"
          placeholder="Vui lòng ghi góp ý của bạn ở đây"
          value={value}
          onChange={e => setValue(e.target.value)}
          rows={5}
        />
        <button className="feedback-btn" type="submit" disabled={!value.trim()}>
          Gửi
        </button>
        {sent && <div className="feedback-success">Cảm ơn bạn đã góp ý cho FitMeal!</div>}
      </form>
      <div className="feedback-note">
        Vui lòng không đưa bất kỳ thông tin nhận dạng cá nhân nào (dữ liệu cá nhân) vào biểu mẫu phản hồi này, bao gồm tên hoặc chi tiết liên hệ của bạn.
      </div>
      <div className="feedback-policy">
        Chúng tôi sẽ sử dụng thông tin này để giúp chúng tôi cải thiện dịch vụ của mình. Bằng cách gửi phản hồi này, bạn đồng ý xử lý thông tin của mình theo <a href="#privacy">Chính Sách Bảo Mật</a> và <a href="#terms">Điều Khoản Dịch Vụ</a> của chúng tôi.
      </div>
    </div>
    <Footer />
    </>
  );
};

export default FeedbackForm;