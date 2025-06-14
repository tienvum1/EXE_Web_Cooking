import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminEditBlogPage.scss'; // Changed import

const AdminEditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    content: '',
    tags: [],
    sections: [],
    quote: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://exe-web-cooking.onrender.com/api/blogs/${id}`, {
          withCredentials: true,
        });
        const fetchedBlog = res.data;
        setBlog(fetchedBlog);
        setFormData({
          title: fetchedBlog.title || '',
          desc: fetchedBlog.desc || '',
          content: fetchedBlog.content || '',
          tags: fetchedBlog.tags || [],
          sections: fetchedBlog.sections || [],
          quote: fetchedBlog.quote || '',
        });
      } catch (err) {
        console.error('Error fetching blog:', err);
        setError('Không thể tải thông tin blog.');
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleTagChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, tags: value.split(',').map(tag => tag.trim()) });
  };

  const handleSectionChange = (e, index, field) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: e.target.value };
    setFormData({ ...formData, sections: newSections });
  };

  const addSection = () => {
    setFormData({ ...formData, sections: [...formData.sections, { heading: '', text: '' }] });
  };

  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('desc', formData.desc);
    data.append('content', formData.content);
    data.append('quote', formData.quote);
    data.append('tags', JSON.stringify(formData.tags));
    data.append('sections', JSON.stringify(formData.sections));
    if (imageFile) {
      data.append('image', imageFile);
    }

    try {
      await axios.put(`https://exe-web-cooking.onrender.com/api/blogs/${id}`, data, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Blog đã được cập nhật thành công!');
      navigate('/admin/blogs');
    } catch (err) {
      console.error('Lỗi cập nhật blog:', err);
      setError('Không thể cập nhật blog.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!blog) {
    return <div className="no-blog-found">Không tìm thấy blog.</div>;
  }

  return (
    <div className="admin-page-content">
      <h2>Chỉnh sửa Blog</h2>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="title">Tiêu đề:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="desc">Mô tả ngắn:</label>
          <textarea id="desc" name="desc" value={formData.desc} onChange={handleChange} rows="3" required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="content">Nội dung:</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleChange} rows="10" required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">Ảnh chính:</label>
          {blog.image && <img src={blog.image} alt="Current Blog" style={{ maxWidth: '200px', marginBottom: '10px' }} />}
          <input type="file" id="image" name="image" onChange={handleFileChange} accept="image/*" />
        </div>
        <div className="form-group">
          <label htmlFor="tags">Tags (phân cách bởi dấu phẩy):</label>
          <input type="text" id="tags" name="tags" value={formData.tags.join(', ')} onChange={handleTagChange} />
        </div>
        <div className="form-group">
          <label>Các phần:</label>
          {formData.sections.map((section, index) => (
            <div key={index} className="section-item">
              <input
                type="text"
                placeholder="Tiêu đề phần"
                value={section.heading}
                onChange={(e) => handleSectionChange(e, index, 'heading')}
              />
              <textarea
                placeholder="Nội dung phần"
                value={section.text}
                onChange={(e) => handleSectionChange(e, index, 'text')}
                rows="4"
              ></textarea>
              <button type="button" onClick={() => removeSection(index)} className="remove-section-button">Xóa phần</button>
            </div>
          ))}
          <button type="button" onClick={addSection} className="add-section-button">Thêm phần</button>
        </div>
        <div className="form-group">
          <label htmlFor="quote">Trích dẫn:</label>
          <textarea id="quote" name="quote" value={formData.quote} onChange={handleChange} rows="2"></textarea>
        </div>
        <button type="submit" className="submit-button">Cập nhật Blog</button>
      </form>
    </div>
  );
};

export default AdminEditBlogPage; 