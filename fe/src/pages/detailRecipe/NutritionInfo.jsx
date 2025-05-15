import React from 'react';
import './NutritionInfo.scss';
const NutritionInfo = ({ calories, fat, protein, carbs }) => {
  return (
    <div className="nutrition-info">
      <h2 className="nutrition-title">Nutrition Information</h2>
      <div className="nutrition-row"><span>Calories</span><span>{calories}</span></div>
      <div className="nutrition-row"><span>Total Fat</span><span>{fat}</span></div>
      <div className="nutrition-row"><span>Protein</span><span>{protein}</span></div>
      <div className="nutrition-row"><span>Carbohydrate</span><span>{carbs}</span></div>
    </div>
  );
};

export default NutritionInfo;