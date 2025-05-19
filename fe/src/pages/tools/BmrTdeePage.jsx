import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import Sidebar from '../../components/sidebar/Sidebar';
import './BmrTdeePage.scss';

const BmrTdeePage = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activity, setActivity] = useState(1.2);
  const [bmr, setBmr] = useState(null);
  const [tdee, setTdee] = useState(null);
  const [error, setError] = useState('');

  const activityLevels = {
    1.2: 'Ít vận động (ít hoặc không tập thể dục)',
    1.375: 'Vận động nhẹ (tập nhẹ 1-3 ngày/tuần)',
    1.55: 'Vận động vừa (tập vừa 3-5 ngày/tuần)',
    1.725: 'Vận động nhiều (tập nặng 6-7 ngày/tuần)',
    1.9: 'Vận động rất nhiều (tập rất nặng, công việc thể chất)',
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    setError('');

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (!weight || !height || !age) {
      setError('Vui lòng điền đầy đủ các trường thông tin.');
      return;
    }
    if (w <= 0 || h <= 0 || a <= 0) {
      setError('Các giá trị phải lớn hơn 0.');
      return;
    }
    if (a > 120) {
      setError('Tuổi không hợp lệ.');
      return;
    }

    let bmrValue = gender === 'male'
      ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
      : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a);
    
    const tdeeValue = bmrValue * activity;
    setBmr(bmrValue.toFixed(0));
    setTdee(tdeeValue.toFixed(0));
  };

  const getTdeeInterpretation = (tdee) => {
    if (tdee < 1500) return { text: 'Rất thấp', color: '#ef5350' };
    if (tdee < 2000) return { text: 'Thấp', color: '#ffa726' };
    if (tdee < 2500) return { text: 'Trung bình', color: '#43a047' };
    if (tdee < 3000) return { text: 'Cao', color: '#42a5f5' };
    return { text: 'Rất cao', color: '#8e24aa' };
  };

  return (
    <div>
    <Header />
    <Sidebar />
    <div className="tool-page">
      <div className="bmr-tdee-content">
        <h2 className="tool-title">Công Cụ Tính BMR & TDEE</h2>
        <form onSubmit={handleCalculate} className="tool-form" aria-label="Tính toán BMR và TDEE">
          <label>
            Cân nặng (kg)
            <input
              type="number"
              placeholder="Nhập cân nặng (kg)"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              min="1"
              step="0.1"
              required
              aria-required="true"
            />
          </label>
          <label>
            Chiều cao (cm)
            <input
              type="number"
              placeholder="Nhập chiều cao (cm)"
              value={height}
              onChange={e => setHeight(e.target.value)}
              min="1"
              step="0.1"
              required
              aria-required="true"
            />
          </label>
          <label>
            Tuổi
            <input
              type="number"
              placeholder="Nhập tuổi"
              value={age}
              onChange={e => setAge(e.target.value)}
              min="1"
              required
              aria-required="true"
            />
          </label>
          <label>
            Giới tính
            <select value={gender} onChange={e => setGender(e.target.value)} aria-label="Chọn giới tính">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </label>
          <label>
            Mức độ vận động
            <select value={activity} onChange={e => setActivity(Number(e.target.value))} aria-label="Chọn mức độ vận động">
              {Object.entries(activityLevels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Tính BMR & TDEE</button>
        </form>
        {bmr && tdee && (
          <div className="tool-result" style={{ borderLeft: `8px solid ${getTdeeInterpretation(tdee).color}` }}>
            <h3>Kết quả tính toán</h3>
            <div className="result-item">
              <span>BMR:</span> {bmr} kcal/ngày
              <p className="result-note">Lượng calo cơ bản cơ thể cần khi nghỉ ngơi.</p>
            </div>
            <div className="result-item">
              <span>TDEE:</span> {tdee} kcal/ngày
              <p className="result-note">
                Tổng calo cần mỗi ngày ({getTdeeInterpretation(tdee).text}).
              </p>
            </div>
            <div className="result-advice">
              <b>Lưu ý:</b> Để duy trì cân nặng, tiêu thụ khoảng {tdee} kcal/ngày. Để giảm cân, giảm 10-20% calo. Để tăng cân, tăng 10-20% calo.
            </div>
          </div>
        )}
        <div className="tool-info">
          <h4>BMR là gì?</h4>
          <p>
            BMR (Basal Metabolic Rate) là lượng calo cơ thể cần để duy trì các chức năng cơ bản như thở, tuần hoàn, và duy trì nhiệt độ cơ thể khi nghỉ ngơi hoàn toàn.
          </p>
          <h4>TDEE là gì?</h4>
          <p>
            TDEE (Total Daily Energy Expenditure) là tổng lượng calo bạn tiêu thụ mỗi ngày, bao gồm BMR và calo từ hoạt động thể chất, tiêu hóa, và các hoạt động khác.
          </p>
          <h4>Cách tính BMR & TDEE</h4>
          <p>
            Công thức Mifflin-St Jeor:<br/>
            <b>Nam:</b> BMR = 88.362 + (13.397 × cân nặng [kg]) + (4.799 × chiều cao [cm]) - (5.677 × tuổi)<br/>
            <b>Nữ:</b> BMR = 447.593 + (9.247 × cân nặng [kg]) + (3.098 × chiều cao [cm]) - (4.330 × tuổi)<br/>
            <b>TDEE = BMR × hệ số vận động</b>
          </p>
          <h4>Bảng hệ số vận động</h4>
          <div className="activity-table">
            <div className="activity-row activity-header">
              <div>Mức độ</div>
              <div>Hệ số</div>
              <div>Mô tả</div>
            </div>
            {Object.entries(activityLevels).map(([value, label]) => (
              <div className="activity-row" key={value}>
                <div>{label.split(' (')[0]}</div>
                <div>{value}</div>
                <div>{label.match(/\((.*?)\)/)[1]}</div>
              </div>
            ))}
          </div>
          <h4>Công dụng của BMR & TDEE</h4>
          <ul>
            <li>Xác định lượng calo cần thiết để đạt mục tiêu: giảm cân, tăng cân, hoặc duy trì cân nặng.</li>
            <li>Hỗ trợ lập kế hoạch dinh dưỡng và tập luyện phù hợp.</li>
            <li>Giúp hiểu rõ hơn về nhu cầu năng lượng của cơ thể.</li>
          </ul>
          <h4>Lời khuyên thực tế</h4>
          <ul>
            <li><b>Giảm cân:</b> Giảm 500-1000 kcal/ngày dưới TDEE, kết hợp tập luyện.</li>
            <li><b>Tăng cân:</b> Tăng 500-1000 kcal/ngày trên TDEE, tập trung vào protein và tập sức mạnh.</li>
            <li><b>Duy trì:</b> Tiêu thụ calo bằng TDEE, theo dõi cân nặng định kỳ.</li>
            <li>Tham khảo chuyên gia dinh dưỡng để có kế hoạch cá nhân hóa.</li>
          </ul>
          <h4>Lưu ý khi sử dụng</h4>
          <ul>
            <li>BMR và TDEE là ước tính, có thể không chính xác với vận động viên, người có cơ bắp cao, hoặc các trường hợp đặc biệt.</li>
            <li>Kết hợp với các chỉ số khác như tỷ lệ mỡ cơ thể, vòng eo để đánh giá sức khỏe toàn diện.</li>
            <li>Thay đổi cân nặng dần dần để đảm bảo sức khỏe lâu dài.</li>
          </ul>
        </div>
      </div>
            
    </div>
    <Footer />
    </div>
  );
};

export default BmrTdeePage;