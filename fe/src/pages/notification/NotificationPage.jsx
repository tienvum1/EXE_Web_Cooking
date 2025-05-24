import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './NotificationPage.scss';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoti = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/notifications`, { withCredentials: true });
        setNotifications(res.data);
      } catch {}
      setLoading(false);
    };
    fetchNoti();
  }, []);

  const markAsRead = async (id) => {
    await axios.patch(`${process.env.REACT_APP_API_URL}/api/notifications/${id}/read`, {}, { withCredentials: true });
    setNotifications(noti => noti.map(n => n._id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="notification-page-container">
      <h2>Thông báo</h2>
      {loading ? <div>Đang tải...</div> : (
        <ul className="noti-list">
          {notifications.map(noti => (
            <li key={noti._id} className={noti.read ? 'read' : 'unread'} onClick={() => markAsRead(noti._id)}>
              <div className="noti-content">{noti.content}</div>
              <div className="noti-date">{new Date(noti.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage; 