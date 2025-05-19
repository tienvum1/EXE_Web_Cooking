import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import './WeightPage.scss';

const WeightPage = () => {
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState('male');
  const [idealWeight, setIdealWeight] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');
    if (!height) {
      setError('Vui lòng nhập chiều cao.');
      return;
    }
    const h = parseFloat(height);
    if (h < 100 || h > 250) {
      setError('Chiều cao nên nằm trong khoảng 100-250cm.');
      return;
    }
    // Công thức Lorentz
    let result = gender === 'male'
      ? h - 100 - (h - 150) / 4
      : h - 100 - (h - 150) / 2.5;
    setIdealWeight(result.toFixed(1));
  };

  return (
    <div>
    <Header />
    <Sidebar />
    <div className="tool-page">
      <div className="weight-content">
        <h2 className="tool-title">Công Cụ Tính Cân Nặng Chuẩn</h2>
        <form onSubmit={handleCalculate} className="tool-form">
          <label>
            Chiều cao (cm)
            <input type="number" value={height} onChange={e => setHeight(e.target.value)} min="1" required placeholder="Nhập chiều cao (cm)" />
          </label>
          <label>
            Giới tính
            <select value={gender} onChange={e => setGender(e.target.value)}>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Tính cân nặng chuẩn</button>
        </form>
        {idealWeight && (
          <div className="tool-result">
            <h3>Kết quả</h3>
            <div className="weight-value">Cân nặng chuẩn: {idealWeight} kg</div>
            <div className="weight-note">
              <b>Lưu ý:</b> Đây là giá trị tham khảo, hãy kết hợp với các chỉ số sức khỏe khác để đánh giá tổng thể.
            </div>
          </div>
        )}
        <div className="tool-info">
          <h4>Cân nặng chuẩn là gì?</h4>
          <p>
            Cân nặng chuẩn là mức cân nặng lý tưởng dựa trên chiều cao và giới tính, giúp bạn xác định mục tiêu cân nặng hợp lý, đảm bảo sức khỏe lâu dài. Đây là một chỉ số tham khảo, không phải là tiêu chuẩn tuyệt đối cho mọi người.
          </p>
          <h4>Cách tính cân nặng chuẩn (theo Lorentz)</h4>
          <p>
            <b>Nam:</b> Cân nặng chuẩn = Chiều cao (cm) - 100 - (Chiều cao (cm) - 150) / 4<br/>
            <b>Nữ:</b> Cân nặng chuẩn = Chiều cao (cm) - 100 - (Chiều cao (cm) - 150) / 2.5
          </p>
          <h4>Ví dụ thực tế</h4>
          <ul>
            <li>Nam cao 170cm: 170 - 100 - (170-150)/4 = 170 - 100 - 5 = <b>65kg</b></li>
            <li>Nữ cao 160cm: 160 - 100 - (160-150)/2.5 = 160 - 100 - 4 = <b>56kg</b></li>
          </ul>
          <h4>Ý nghĩa và ứng dụng thực tế</h4>
          <ul>
            <li>Giúp bạn đặt mục tiêu cân nặng phù hợp với thể trạng và giới tính.</li>
            <li>Hỗ trợ xây dựng chế độ ăn uống, tập luyện hợp lý.</li>
            <li>Giảm nguy cơ các bệnh liên quan đến cân nặng như tiểu đường, tim mạch, huyết áp cao.</li>
          </ul>
          <h4>Các yếu tố ảnh hưởng đến cân nặng chuẩn</h4>
          <ul>
            <li>Tuổi tác, di truyền, tỷ lệ cơ - mỡ, mức độ vận động, chế độ dinh dưỡng.</li>
            <li>Phụ nữ mang thai, người tập luyện thể thao chuyên nghiệp có thể có cân nặng lý tưởng khác biệt.</li>
          </ul>
          <h4>Lưu ý khi sử dụng chỉ số cân nặng chuẩn</h4>
          <ul>
            <li>Chỉ số này chỉ mang tính tham khảo, không áp dụng cho trẻ em, người già, vận động viên chuyên nghiệp.</li>
            <li>Nên kết hợp đánh giá thêm BMI, tỷ lệ mỡ cơ thể, vòng eo, sức khỏe tổng thể.</li>
            <li>Tham khảo chuyên gia dinh dưỡng nếu cần thiết.</li>
          </ul>
          <h4>Lời khuyên thực tế</h4>
          <ul>
            <li>Không nên giảm cân hoặc tăng cân quá nhanh, hãy đặt mục tiêu hợp lý và kiên trì.</li>
            <li>Ăn uống cân đối, tập luyện đều đặn, ngủ đủ giấc để duy trì cân nặng lý tưởng.</li>
            <li>Kiểm tra sức khỏe định kỳ để theo dõi các chỉ số quan trọng khác.</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default WeightPage;