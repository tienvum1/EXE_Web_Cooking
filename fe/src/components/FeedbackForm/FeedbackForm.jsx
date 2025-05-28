import React from 'react';
import './FeedbackForm.scss';

const FeedbackForm = () => {
  return (
    <div className="feedback-form-container">
      <h2 className="feedback-form-title">Giúp chúng tôi cải thiện dịch vụ</h2>
      <textarea
        className="feedback-form-textarea"
        placeholder="Vui lòng ghi góp ý của bạn ở đây"
        rows="8"
      ></textarea>
      <button className="feedback-form-button">Gửi</button>
      <p className="feedback-form-text">
        Vui lòng không đưa bất kỳ thông tin nhận dạng cá nhân nào (dữ liệu cá nhân) vào biểu mẫu phản hồi này, bao gồm tên hoặc chi tiết liên hệ của bạn.
      </p>
      <p className="feedback-form-text">
        Chúng tôi sẽ sử dụng thông tin này để giúp chúng tôi cải thiện dịch vụ của mình. Bằng cách gửi phản hồi này, bạn đồng ý xử lý thông tin của mình theo <a href="#">Chính Sách Bảo Mật</a> và <a href="#">Điều Khoản Dịch Vụ</a> của chúng tôi
      </p>
    </div>
  );
};

export default FeedbackForm; 