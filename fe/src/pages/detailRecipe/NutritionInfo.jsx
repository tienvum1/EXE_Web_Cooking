import React from 'react';
import './NutritionInfo.scss';

const NutritionInfo = ({ calories, fat, protein, carbs }) => {
  return (
    <div className="nutrition-info">
      <h2 className="nutrition-title">Thông Tin Dinh Dưỡng</h2>
      <div className="nutrition-row"><span>Calo</span><span>{calories} kcal</span></div>
      <div className="nutrition-row"><span>Chất béo</span><span>{fat} g</span></div>
      <div className="nutrition-row"><span>Đạm</span><span>{protein} g</span></div>
      <div className="nutrition-row"><span>Tinh bột</span><span>{carbs} g</span></div>
    </div>
  );
};

export default NutritionInfo;
