import React, { useState, useEffect } from 'react';
import { FaRegClock, FaDrumstickBite, FaRegSave, FaShareAlt, FaRegBookmark, FaBookmark, FaDonate,FaUtensils } from 'react-icons/fa';
import axios from 'axios';
import './RecipeHeader.scss';
import DonateModal from './DonateModal';

const RecipeHeader = ({ title, user, prepTime, cookTime, recipeId,categories }) => {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDonate, setShowDonate] = useState(false);
  const [donateAmount, setDonateAmount] = useState('');
  const [donateMsg, setDonateMsg] = useState('');
  const [donateLoading, setDonateLoading] = useState(false);
  const [donateResult, setDonateResult] = useState('');

  // Kiểm tra đã lưu chưa khi mount
  useEffect(() => {
    const checkSaved = async () => {
      try {
        const res = await axios.get('https://localhost:4567/api/saved-recipes/list', { withCredentials: true });
        setSaved(res.data.some(item => item.recipe._id === recipeId));
      } catch {}
    };
    if (recipeId) checkSaved();
  }, [recipeId]);

  const handleSave = async () => {
    if (!recipeId) return;
    setLoading(true);
    try {
      if (!saved) {
        await axios.post('https://localhost:4567/api/saved-recipes/save', { recipeId }, { withCredentials: true });
        setSaved(true);
      } else {
        await axios.post('https://localhost:4567/api/saved-recipes/unsave', { recipeId }, { withCredentials: true });
        setSaved(false);
      }
    } catch (err) {
      alert('Vui lòng đăng nhập để sử dụng chức năng này!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-header">
      <h1 className="recipe-title">{title}</h1>

      <div className="recipe-meta">
        <div className="user-info">
          <img className="avatar" src={user.avatar} alt={user.name} />
          <div className="user-details">
            <div className="name">{user.name}</div>
            <div className="date">{user.date}</div>
          </div>
        </div>

        <div className="time-info">

          <div className="item"><FaRegClock /> <span>Cook:</span> {cookTime}</div>
          <div className="item"><FaUtensils /> <span>{categories}</span></div>
        </div>

        <div className="actions">
          <button className="btn"><FaRegSave /><span>Save</span></button>
          <button className="btn"><FaShareAlt /><span>Share</span></button>
          <button
            className={saved ? 'btn saved-btn' : 'btn save-btn'}
            onClick={handleSave}
            aria-label={saved ? 'Bỏ lưu món' : 'Lưu món'}
            disabled={loading}
          >
            {saved ? <FaBookmark /> : <FaRegBookmark />}
            <span>{saved ? 'Đã lưu' : 'Lưu món'}</span>
          </button>
          <button className="btn donate-btn" onClick={() => setShowDonate(true)}><FaDonate /><span>Donate</span></button>
        </div>
      </div>

      <DonateModal
        open={showDonate}
        onClose={() => setShowDonate(false)}
        recipeId={recipeId}
      />
    </div>
  );
};

export default RecipeHeader;
