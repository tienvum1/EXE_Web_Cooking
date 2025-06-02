import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPendingRecipes } from '../../api/recipe'; // Corrected relative path again
import './AdminRecipeApprovalPage.scss'; // We will create this SCSS file

const AdminRecipeApprovalPage = () => {
  const [pendingRecipes, setPendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getPendingRecipes = async () => {
      try {
        // TODO: Add logic to check if the current user is an admin before fetching
        // This is a frontend check for better UX, backend also enforces it.
        setLoading(true);
        const data = await fetchPendingRecipes();
        setPendingRecipes(data);
      } catch (err) {
        console.error('Error fetching pending recipes:', err);
        setError('Không thể tải danh sách công thức chờ duyệt.');
      } finally {
        setLoading(false);
      }
    };

    getPendingRecipes();
  }, []);

  if (loading) {
    return (
      <div className="admin-approval-page">
        <div className="container">
          <p>Đang tải danh sách công thức chờ duyệt...</p>
        </div>

      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-approval-page">
        <div className="container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-approval-page">
      <div className="container">
        <h1>Công thức chờ duyệt</h1>
        {pendingRecipes.length === 0 ? (
          <p>Không có công thức nào đang chờ duyệt.</p>
        ) : (
          <table className="recipe-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Tác giả</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th> {/* Assuming status is always 'pending' here */}
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pendingRecipes.map((recipe) => (
                <tr key={recipe._id}>
                  <td>
                    <Link to={`/admin/recipes/${recipe._id}`} className="recipe-title-link">
                      {recipe.title}
                    </Link>
                  </td>
                  <td>{recipe.author ? recipe.author.username : 'N/A'}</td>
                  <td>{new Date(recipe.createdAt).toLocaleDateString()}</td>
                  <td>Đang chờ duyệt</td>
                  <td>
                    <Link to={`/admin/recipes/${recipe._id}`}>Xem chi tiết</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRecipeApprovalPage; 