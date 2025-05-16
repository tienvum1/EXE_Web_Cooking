import React, { useState } from 'react';
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
import Footer from '../../components/footer/Footer';
import './CreateRecipe.scss';

const CreateRecipe = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [servings, setServings] = useState('2 người');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState([{ text: '', images: [] }]);
  const [mainImage, setMainImage] = useState(null);
  const [mainImageUrl, setMainImageUrl] = useState('');
  // Nutrition Info
  const [nutrition, setNutrition] = useState({ calories: '', fat: '', protein: '', carbs: '' });

  // Ảnh món ăn
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
    if (file) {
      setMainImageUrl(URL.createObjectURL(file));
    } else {
      setMainImageUrl('');
    }
  };

  // Nguyên liệu
  const handleIngredientChange = (idx, value) => {
    const newIngredients = [...ingredients];
    newIngredients[idx] = value;
    setIngredients(newIngredients);
  };
  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx));

  // Bước làm
  const handleStepChange = (idx, value) => {
    const newSteps = [...steps];
    newSteps[idx].text = value;
    setSteps(newSteps);
  };
  const handleStepAddImage = (idx, e) => {
    const files = Array.from(e.target.files);
    const newSteps = [...steps];
    const newImages = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    newSteps[idx].images = [...(newSteps[idx].images || []), ...newImages];
    setSteps(newSteps);
    e.target.value = '';
  };
  const removeStepImage = (stepIdx, imgIdx) => {
    const newSteps = [...steps];
    newSteps[stepIdx].images = newSteps[stepIdx].images.filter((_, i) => i !== imgIdx);
    setSteps(newSteps);
  };
  const addStep = () => setSteps([...steps, { text: '', images: [] }]);
  const removeStep = (idx) => setSteps(steps.filter((_, i) => i !== idx));

  return (
    <div className="create-recipe-page">
      <Header />
      <Sidebar />
      <div className="create-recipe-container">
        {/* Hàng trên: Ảnh + Thông tin món */}
        <div className="create-recipe-top-row">
          <div className="create-recipe-upload-box">
            <label style={{ cursor: 'pointer', display: 'block' }}>
              <div className="upload-icon">
                {mainImageUrl ? (
                  <img src={mainImageUrl} alt="main" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: 16 }} />
                ) : (
                  <i className="fas fa-image"></i>
                )}
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleMainImageChange} />
            </label>
            <div className="upload-text">Bạn đã đăng hình món mình nấu ở đây chưa?<br/>Chia sẻ với mọi người thành phẩm nấu nướng của bạn nào!</div>
          </div>
          <div className="create-recipe-title-block">
            <input
              className="create-recipe-title-input"
              placeholder="Tên món: Món canh bí ngon nhất nhà mình"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
            <div className="create-recipe-user">
              <div className="create-recipe-avatar">T</div>
              <div>
                <div className="create-recipe-username">Tiến Vũ</div>
                <div className="create-recipe-userid">@cook_113267840</div>
              </div>
            </div>
            <textarea
              className="create-recipe-desc"
              placeholder="Hãy chia sẻ với mọi người về món này của bạn nhé ..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
            {/* Nutrition Info */}
            <div className="create-recipe-nutrition">
              <div className="nutrition-title">Thông tin dinh dưỡng (trên 1 khẩu phần)</div>
              <div className="nutrition-fields">
                <div className="nutrition-field">
                  <label>Calories</label>
                  <input type="number" min="0" placeholder="kcal" value={nutrition.calories} onChange={e => setNutrition(n => ({ ...n, calories: e.target.value }))} />
                </div>
                <div className="nutrition-field">
                  <label>Fat</label>
                  <input type="number" min="0" placeholder="g" value={nutrition.fat} onChange={e => setNutrition(n => ({ ...n, fat: e.target.value }))} />
                </div>
                <div className="nutrition-field">
                  <label>Protein</label>
                  <input type="number" min="0" placeholder="g" value={nutrition.protein} onChange={e => setNutrition(n => ({ ...n, protein: e.target.value }))} />
                </div>
                <div className="nutrition-field">
                  <label>Carbs</label>
                  <input type="number" min="0" placeholder="g" value={nutrition.carbs} onChange={e => setNutrition(n => ({ ...n, carbs: e.target.value }))} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Hàng dưới: Nguyên liệu + Các bước */}
        <div className="create-recipe-bottom-row">
          <div className="create-recipe-ingredients">
            <h3>Nguyên Liệu</h3>
            <div className="create-recipe-servings">
              <span>Khẩu phần</span>
              <input value={servings} onChange={e => setServings(e.target.value)} />
            </div>
            <div className="create-recipe-ingredient-list">
              {ingredients.map((ing, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input
                    value={ing}
                    onChange={e => handleIngredientChange(idx, e.target.value)}
                    placeholder={`Nguyên liệu ${idx + 1}`}
                  />
                  {ingredients.length > 1 && (
                    <button type="button" onClick={() => removeIngredient(idx)} style={{ color: '#e67e22', background: 'none', border: 'none', cursor: 'pointer' }}>-</button>
                  )}
                </div>
              ))}
            </div>
            <div className="create-recipe-ingredient-actions">
              <span style={{ cursor: 'pointer' }} onClick={addIngredient}>+ Nguyên liệu</span>
            </div>
          </div>
          <div className="create-recipe-steps">
            <h3>Các bước</h3>
            <div className="create-recipe-cooktime">
              <span>Thời gian nấu</span>
              <input value={cookTime} onChange={e => setCookTime(e.target.value)} placeholder="VD: 1 tiếng 30 phút" />
            </div>
            <div className="create-recipe-step-list">
              {steps.map((step, idx) => (
                <div className="create-recipe-step" key={idx}>
                  <span className="step-number">{idx + 1}</span>
                  <input
                    value={step.text}
                    onChange={e => handleStepChange(idx, e.target.value)}
                    placeholder={`Mô tả bước ${idx + 1}`}
                  />
                  {steps.length > 1 && (
                    <button type="button" onClick={() => removeStep(idx)} style={{ color: '#e67e22', background: 'none', border: 'none', cursor: 'pointer', marginLeft: 8 }}>-</button>
                  )}
                  <div className="step-images-grid">
                    {step.images && step.images.map((img, imgIdx) => (
                      <div key={imgIdx} className="step-image-preview">
                        <img src={img.url} alt="step" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                        <button type="button" className="remove-step-image" onClick={() => removeStepImage(idx, imgIdx)}>&times;</button>
                      </div>
                    ))}
                    <label className="step-image-placeholder step-image-add">
                      <i className="fas fa-camera"></i>
                      <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => handleStepAddImage(idx, e)} />
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <div className="create-recipe-step-actions">
              <span style={{ cursor: 'pointer' }} onClick={addStep}>+ Bước làm</span>
            </div>
          </div>
        </div>
      </div>
      <div className="create-recipe-actions">
        <button className="btn-delete"><i className="fas fa-trash-alt"></i> Xóa</button>
        <button className="btn-save">Lưu và Đóng</button>
        <button className="btn-publish">Lên sóng</button>
      </div>
      <Footer />
    </div>
  );
};

export default CreateRecipe; 