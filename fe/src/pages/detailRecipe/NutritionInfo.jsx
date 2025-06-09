import React from 'react';
import './NutritionInfo.scss';

const NutritionInfo = ({ calories, fat, protein, carbs }) => {
  return (
    <div className="nutrition-info">
      <h2 className="nutrition-title">Thông Tin Dinh Dưỡng</h2>
      <div className="nutrition-row"><span>Năng lượng</span><span>{calories}</span></div>
      <div className="nutrition-row"><span>Chất béo</span><span>{fat}</span></div>
      <div className="nutrition-row"><span>Chất đạm</span><span>{protein}</span></div>
      <div className="nutrition-row"><span>Carbohydrate</span><span>{carbs}</span></div>
    </div>
  );
};

export default NutritionInfo;
