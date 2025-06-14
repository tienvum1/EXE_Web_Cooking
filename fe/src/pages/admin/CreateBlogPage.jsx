import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AdminPage.scss'; // Create a new SCSS file for admin styles

const API_URL = 'https://exe-web-cooking.onrender.com';

const CreateBlogPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    content: '',
    image: null,
    tags: [''], // Start with one empty tag input
    sections: [], // Start with no sections
  
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      setImagePreviewUrl(URL.createObjectURL(file));
    } else {
      setImagePreviewUrl(null);
    }
  };

  const handleTagChange = (index, value) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData({ ...formData, tags: newTags });
  };

  const handleAddTag = () => {
    setFormData({ ...formData, tags: [...formData.tags, ''] });
  };

  const handleRemoveTag = (index) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData({ ...formData, tags: newTags });
  };

  const handleSectionChange = (sectionIndex, field, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex][field] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleParagraphChange = (sectionIndex, paragraphIndex, value) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].paragraphs[paragraphIndex] = value;
    setFormData({ ...formData, sections: newSections });
  };

  const handleAddSection = () => {
    setFormData({ ...formData, sections: [...formData.sections, { title: '', paragraphs: [''] }] });
  };

  const handleRemoveSection = (sectionIndex) => {
    const newSections = formData.sections.filter((_, i) => i !== sectionIndex);
    setFormData({ ...formData, sections: newSections });
  };

  const handleAddParagraph = (sectionIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].paragraphs.push('');
    setFormData({ ...formData, sections: newSections });
  };

  const handleRemoveParagraph = (sectionIndex, paragraphIndex) => {
    const newSections = [...formData.sections];
    newSections[sectionIndex].paragraphs = newSections[sectionIndex].paragraphs.filter((_, i) => i !== paragraphIndex);
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('desc', formData.desc);
    formDataToSend.append('content', formData.content);
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    formDataToSend.append('quote', formData.quote);

    formDataToSend.append('tags', JSON.stringify(formData.tags.filter(tag => tag.trim() !== '')));
    formDataToSend.append('sections', JSON.stringify(formData.sections.map(section => ({
      ...section,
      paragraphs: section.paragraphs.filter(p => p.trim() !== ''),
    })).filter(section => section.title.trim() !== '' || section.paragraphs.length > 0)));

    try {
      const res = await axios.post(`${API_URL}/api/blogs`, formDataToSend, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage('Bài blog đã được tạo thành công!');
      setFormData({ title: '', desc: '', content: '', image: null, tags: [''], sections: [], quote: '' });
      setImagePreviewUrl(null);
      console.log('Blog created:', res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tạo bài blog.');
      console.error('Create Blog Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-container create-blog-container">
      <h2>Tạo Bài Blog Mới</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="create-blog-form">
        <div className="form-group">
          <label htmlFor="title">Tiêu đề:</label>
          <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="desc">Mô tả ngắn:</label>
          <textarea id="desc" name="desc" value={formData.desc} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="content">Nội dung đầy đủ:</label>
          <textarea id="content" name="content" value={formData.content} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="image">Ảnh chính:</label>
          <input type="file" id="image" name="image" accept="image/*" onChange={handleImageFileChange} />
          {imagePreviewUrl && (
            <img src={imagePreviewUrl} alt="Xem trước ảnh" style={{ marginTop: '10px', maxWidth: '200px', height: 'auto' }} />
          )}
        </div>

        <div className="form-group">
          <label>Tags:</label>
          {formData.tags.map((tag, index) => (
            <div key={index} className="tag-input-group">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
              />
              {formData.tags.length > 1 && (
                <button type="button" onClick={() => handleRemoveTag(index)}>Xóa</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddTag}>Thêm Tag</button>
        </div>

        <div className="form-group">
          <label>Các Phần (Sections):</label>
          {formData.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="section-group">
              <h3>Phần {sectionIndex + 1}</h3>
              {formData.sections.length > 0 && (
                <button type="button" onClick={() => handleRemoveSection(sectionIndex)}>Xóa Phần</button>
              )}
              <div className="form-group">
                <label htmlFor={`section-title-${sectionIndex}`}>Tiêu đề Phần:</label>
                <input
                  type="text"
                  id={`section-title-${sectionIndex}`}
                  value={section.title}
                  onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                  required
                />
              </div>
              <label>Đoạn văn:</label>
              {section.paragraphs.map((p, paragraphIndex) => (
                <div key={paragraphIndex} className="paragraph-input-group">
                  <textarea
                    value={p}
                    onChange={(e) => handleParagraphChange(sectionIndex, paragraphIndex, e.target.value)}
                    required
                  />
                  {section.paragraphs.length > 1 && (
                    <button type="button" onClick={() => handleRemoveParagraph(sectionIndex, paragraphIndex)}>Xóa Đoạn</button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => handleAddParagraph(sectionIndex)}>Thêm Đoạn Văn</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSection}>Thêm Phần Mới</button>
        </div>

        <button type="submit" disabled={loading}>{loading ? 'Đang tạo...' : 'Tạo Bài Blog'}</button>
      </form>
    </div>
  );
};

export default CreateBlogPage; 