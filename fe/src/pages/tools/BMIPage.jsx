import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';

import './BMIPage.scss';

const BMIPage = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    if (!height || !weight) return;
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    const result = w / (h * h);
    setBmi(result.toFixed(2));
  };

  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return 'Thiếu cân';
    if (bmi < 25) return 'Bình thường';
    if (bmi < 30) return 'Thừa cân';
    if (bmi < 35) return 'Béo phì độ I';
    if (bmi < 40) return 'Béo phì độ II';
    return 'Béo phì độ III';
  };

  const getBMICategoryColor = (bmi) => {
    if (bmi < 18.5) return '#42a5f5';
    if (bmi < 25) return '#43a047';
    if (bmi < 30) return '#ffa726';
    if (bmi < 35) return '#ef5350';
    if (bmi < 40) return '#d32f2f';
    return '#8e24aa';
  };

  return (
    <div>
    <Header />
    <Sidebar />
    <div className="tool-page">
      <div className="bmi-content">
        <h2 className="tool-title">Công Cụ Tính Chỉ Số BMI</h2>
        <form className="tool-form" onSubmit={handleCalculate}>
          <label>
            Chiều cao
            <input
              type="number"
              placeholder="Nhập chiều cao tính bằng cm"
              value={height}
              onChange={e => setHeight(e.target.value)}
              min="1"
              required
            />
          </label>
          <label>
            Cân nặng
            <input
              type="number"
              placeholder="Nhập cân nặng tính bằng kg"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              min="1"
              required
            />
          </label>
          <button type="submit">Tính BMI</button>
        </form>
        {bmi && (
          <div className="tool-result" style={{borderLeft: `8px solid ${getBMICategoryColor(bmi)}`}}>
            <h3>Kết quả tính</h3>
            <div className="bmi-value" style={{color: getBMICategoryColor(bmi)}}>
              BMI: {bmi} ({getBMICategory(bmi)})
            </div>
            <div className="bmi-note">
              <b>Lưu ý:</b> Kết quả chỉ mang tính tham khảo, hãy kết hợp với các chỉ số sức khỏe khác để đánh giá tổng thể.
            </div>
          </div>
        )}
        <div className="tool-info">
          <h4>BMI là gì?</h4>
          <p>
            BMI (Body Mass Index) là chỉ số khối cơ thể, phản ánh tỷ lệ giữa cân nặng và chiều cao, giúp đánh giá mức độ gầy, bình thường, thừa cân hay béo phì của một người trưởng thành.
          </p>
          <h4>Cách tính BMI</h4>
          <p>
            <b>BMI = cân nặng (kg) / (chiều cao (m))<sup>2</sup></b><br/>
            <i>Ví dụ:</i> Nếu bạn cao 170cm (1.7m) và nặng 65kg, BMI = 65 / (1.7 x 1.7) ≈ 22.5
          </p>
          <h4>Bảng phân loại BMI (theo WHO)</h4>
          <div className="bmi-table">
            <div className="bmi-row bmi-header">
              <div>Phân loại</div>
              <div>Chỉ số BMI</div>
            </div>
            <div className="bmi-row">
              <div>Thiếu cân</div><div>&lt; 18.5</div>
            </div>
            <div className="bmi-row">
              <div>Bình thường</div><div>18.5 - 24.9</div>
            </div>
            <div className="bmi-row">
              <div>Thừa cân</div><div>25 - 29.9</div>
            </div>
            <div className="bmi-row">
              <div>Béo phì độ I</div><div>30 - 34.9</div>
            </div>
            <div className="bmi-row">
              <div>Béo phì độ II</div><div>35 - 39.9</div>
            </div>
            <div className="bmi-row">
              <div>Béo phì độ III</div><div>&gt;= 40</div>
            </div>
          </div>
          <h4>Ý nghĩa và ứng dụng thực tế</h4>
          <ul>
            <li>BMI giúp phát hiện sớm nguy cơ các bệnh như tiểu đường, tim mạch, huyết áp cao, đột quỵ, ung thư...</li>
            <li>BMI bình thường (18.5 - 24.9) thường gắn liền với sức khỏe tốt, ít nguy cơ bệnh tật liên quan đến cân nặng.</li>
            <li>BMI cao hoặc thấp đều có thể ảnh hưởng xấu đến sức khỏe, cần điều chỉnh chế độ ăn uống, vận động phù hợp.</li>
          </ul>
          <h4>Lưu ý khi sử dụng BMI</h4>
          <ul>
            <li>BMI không phân biệt được khối lượng cơ và mỡ, có thể không chính xác với vận động viên, người tập gym, người già, phụ nữ mang thai.</li>
            <li>Nên kết hợp thêm các chỉ số khác như vòng eo, tỷ lệ mỡ cơ thể, huyết áp, đường huyết để đánh giá sức khỏe toàn diện.</li>
          </ul>
          <h4>Lời khuyên thực tế</h4>
          <ul>
            <li>Để giảm BMI: Ăn uống lành mạnh, giảm calo, tăng vận động, tập thể dục đều đặn.</li>
            <li>Để tăng BMI: Ăn đủ chất, tăng protein, tập luyện tăng cơ, ngủ đủ giấc.</li>
            <li>Tham khảo ý kiến chuyên gia dinh dưỡng hoặc bác sĩ khi cần thiết.</li>
          </ul>
          <h4>Các trường hợp đặc biệt</h4>
          <ul>
            <li>Trẻ em, người già, phụ nữ mang thai, vận động viên nên dùng thêm các chỉ số khác ngoài BMI.</li>
          </ul>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default BMIPage;