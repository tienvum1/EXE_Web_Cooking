import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheck, FaSpinner } from "react-icons/fa";
import "./MenuSuggestion.scss";
import Header from '../../components/header/Header';
import Sidebar from '../../components/sidebar/Sidebar';
 import Footer from '../../components/footer/Footer';

const MenuSuggestion = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const [mealRequirements, setMealRequirements] = useState({
    breakfast: {
      cookingTime: "",
      calories: "",
      dietType: [],
      includeIngredients: "",
      excludeIngredients: "",
      numberOfRecipes: "1",
    },
    lunch: {
      cookingTime: "",
      calories: "",
      dietType: [],
      includeIngredients: "",
      excludeIngredients: "",
      numberOfRecipes: "1",
    },
    dinner: {
      cookingTime: "",
      calories: "",
      dietType: [],
      includeIngredients: "",
      excludeIngredients: "",
      numberOfRecipes: "1",
    },
  });

  const dietTypes = [
    { value: "", label: "Không có yêu cầu đặc biệt", icon: "🍽️" },
    { value: "vegetarian", label: "Món chay", icon: "🥦" },
    { value: "meat", label: "Món thịt", icon: "🥩" },
    { value: "seafood", label: "Hải sản", icon: "🦐" },
    { value: "salad", label: "Món salad", icon: "🥗" },
    { value: "dessert", label: "Tráng miệng", icon: "🍰" },
  ];

  const mealLabels = {
    breakfast: "Bữa sáng",
    lunch: "Bữa trưa",
    dinner: "Bữa tối",
  };

  const mealIcons = {
    breakfast: '🍳',
    lunch: '🥪',
    dinner: '🍽️',
  };

  const handleMealChange = (meal) => {
    setSelectedMeals((prev) => ({
      ...prev,
      [meal]: !prev[meal],
    }));

    // Reset requirements when unchecking a meal
    if (selectedMeals[meal]) {
      setMealRequirements((prev) => ({
        ...prev,
        [meal]: {
          cookingTime: "",
          calories: "",
          dietType: [],
          includeIngredients: "",
          excludeIngredients: "",
          numberOfRecipes: "1",
        },
      }));
    }
  };

  const handleRequirementChange = (meal, field, value) => {
    if (field === "dietType") {
      setMealRequirements((prev) => {
        const currentDietTypes = prev[meal].dietType;
        const newDietTypes = currentDietTypes.includes(value)
          ? currentDietTypes.filter((item) => item !== value)
          : [...currentDietTypes, value];

        return {
          ...prev,
          [meal]: {
            ...prev[meal],
            dietType: newDietTypes,
          },
        };
      });
    } else {
      setMealRequirements((prev) => ({
        ...prev,
        [meal]: {
          ...prev[meal],
          [field]: value,
        },
      }));
    }
  };

  const validateRequirements = () => {
    const selectedMealTypes = Object.entries(selectedMeals)
      .filter(([_, selected]) => selected)
      .map(([meal]) => meal);

    if (selectedMealTypes.length === 0) {
      setError("Vui lòng chọn ít nhất một bữa ăn");
      return false;
    }

    for (const meal of selectedMealTypes) {
      const requirements = mealRequirements[meal];
      if (!requirements.cookingTime || !requirements.calories) {
        setError(`Vui lòng điền đầy đủ thông tin cho ${mealLabels[meal]}`);
        return false;
      }

      if (parseInt(requirements.cookingTime) <= 0) {
        setError(`Thời gian nấu cho ${mealLabels[meal]} phải lớn hơn 0`);
        return false;
      }

      if (parseInt(requirements.calories) <= 0) {
        setError(`Calories cho ${mealLabels[meal]} phải lớn hơn 0`);
        return false;
      }

      if (parseInt(requirements.numberOfRecipes) <= 0) {
        setError(`Số món ăn cho ${mealLabels[meal]} phải lớn hơn 0`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateRequirements()) {
      return;
    }

    setIsLoading(true);

    try {
      const selectedMealsData = Object.entries(selectedMeals)
        .filter(([_, selected]) => selected)
        .map(([meal]) => ({
          type: meal,
          ...mealRequirements[meal],
          includeIngredients: mealRequirements[meal].includeIngredients
            .split(",")
            .map((ing) => ing.trim())
            .filter(Boolean),
          excludeIngredients: mealRequirements[meal].excludeIngredients
            .split(",")
            .map((ing) => ing.trim())
            .filter(Boolean),
          numberOfRecipes: parseInt(mealRequirements[meal].numberOfRecipes),
        }));

      const response = await axios.post(
        "https://localhost:4567/api/menus/suggest",
        {
          meals: selectedMealsData,
        },
        { withCredentials: true }
      );

      if (response.data) {
        navigate("/menu-suggestion/result", {
          state: { menu: response.data },
        });
      }
    } catch (error) {
      console.error("Error generating menu:", error);
      setError(
        error.response?.data?.message || "Không thể tạo thực đơn. Vui lòng thử lại!"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <Header />
    <Sidebar/>
    <div className="menu-suggestion-page">
      <div className="menu-header">
        <h1 className="menu-title">Gợi Ý Thực Đơn</h1>
        <p className="menu-desc">
          Nhận gợi ý thực đơn cá nhân hóa dựa trên sở thích và yêu cầu của bạn
        </p>
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <form className="menu-form" onSubmit={handleSubmit}>
        <div className="meals-section">
          <h2 className="section-title">Chọn Bữa Ăn</h2>
          <div className="meals-grid">
            {Object.entries(selectedMeals).map(([meal, selected]) => (
              <div key={meal} className={`meal-option ${selected ? "selected" : ""}`}>
                <label className="meal-checkbox">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => handleMealChange(meal)}
                  />
                  <span className="meal-label">
                    {mealIcons[meal]}
                    {mealLabels[meal]}
                  </span>
                </label>

                {selected && (
                  <div className="meal-requirements">
                    <div className="requirements-row">
                      <div className="requirement-group">
                        <label>Thời gian nấu tối đa (phút)</label>
                        <input
                          type="number"
                          min="1"
                          value={mealRequirements[meal].cookingTime}
                          onChange={(e) =>
                            handleRequirementChange(meal, "cookingTime", e.target.value)
                          }
                          placeholder="Nhập thời gian nấu"
                          required
                        />
                      </div>

                      <div className="requirement-group">
                        <label>Calories tối đa</label>
                        <input
                          type="number"
                          min="1"
                          value={mealRequirements[meal].calories}
                          onChange={(e) =>
                            handleRequirementChange(meal, "calories", e.target.value)
                          }
                          placeholder="Nhập giới hạn calories"
                          required
                        />
                      </div>
                    </div>

                    <div className="requirement-group">
                      <label>Số món ăn mỗi bữa</label>
                      <input
                        type="number"
                        min="1"
                        value={mealRequirements[meal].numberOfRecipes}
                        onChange={(e) =>
                          handleRequirementChange(
                            meal,
                            "numberOfRecipes",
                            e.target.value
                          )
                        }
                        placeholder="Số món ăn (ví dụ: 1-3)"
                        required
                      />
                    </div>

                    <div className="requirement-group">
                      <label>Thể loại món ăn</label>
                      <div className="diet-types-grid">
                        {dietTypes.map((diet) => (
                          <label
                            key={diet.value}
                            className={`diet-type-option ${
                              mealRequirements[meal].dietType.includes(diet.value)
                                ? "selected"
                                : ""
                            }`}
                          >
                            <input
                              type="checkbox"
                              name={`diet-${meal}`}
                              value={diet.value}
                              checked={mealRequirements[meal].dietType.includes(diet.value)}
                              onChange={(e) =>
                                handleRequirementChange(meal, "dietType", e.target.value)
                              }
                            />
                            <span className="diet-type-label">
                              <span className="diet-icon">{diet.icon}</span>
                              {diet.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="requirements-row">
                      <div className="requirement-group">
                        <label htmlFor={`${meal}-includeIngredients`}>Nguyên liệu muốn có (phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          id={`${meal}-includeIngredients`}
                          value={mealRequirements[meal].includeIngredients}
                          onChange={(e) =>
                            handleRequirementChange(
                              meal,
                              "includeIngredients",
                              e.target.value
                            )
                          }
                          placeholder="Ví dụ: gà, bông cải xanh, gạo (để trống nếu không có)"
                        />
                      </div>

                      <div className="requirement-group">
                        <label>Nguyên liệu không muốn có (phân cách bằng dấu phẩy)</label>
                        <input
                          type="text"
                          value={mealRequirements[meal].excludeIngredients}
                          onChange={(e) =>
                            handleRequirementChange(
                              meal,
                              "excludeIngredients",
                              e.target.value
                            )
                          }
                          placeholder="Ví dụ: hải sản, đậu phộng (để trống nếu không có)"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="menu-btn-submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <FaSpinner className="spinner" /> Đang tạo thực đơn...
            </>
          ) : (
            <>
              <FaCheck /> Tạo Thực Đơn
            </>
          )}
        </button>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default MenuSuggestion; 