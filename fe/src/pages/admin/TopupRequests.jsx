import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopupRequests.scss';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TopupRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions/pending-topup`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setRequests(response.data.data);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Không thể tải danh sách yêu cầu nạp tiền');
        console.error('Error fetching topup requests:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequest = async (transactionId, action) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/transactions/topup/${transactionId}`,
        { action },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      toast.success(action === 'approve' ? 'Đã xác nhận yêu cầu nạp tiền' : 'Đã từ chối yêu cầu nạp tiền', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      fetchRequests();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error handling request:', err);
        toast.error('Có lỗi xảy ra khi xử lý yêu cầu', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    }
  };

  if (loading) {
    return <div className="topup-requests loading">Đang tải...</div>;
  }

  if (error) {
    return <div className="topup-requests error">{error}</div>;
  }

  return (
    <div className="topup-requests">
      <ToastContainer />
      <h1>Danh sách yêu cầu nạp tiền</h1>
      
      {requests.length === 0 ? (
        <p className="no-requests">Không có yêu cầu nạp tiền nào đang chờ xử lý</p>
      ) : (
        <div className="requests-table">
          <table>
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Số tiền</th>
                <th>Ngân hàng</th>
                <th>Tên người gửi</th>
                <th>Nội dung CK</th>
                <th>Thời gian</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request._id}>
                  <td>{request.to.username}</td>
                  <td>{request.amount.toLocaleString('vi-VN')}đ</td>
                  <td>{request.bankName}</td>
                  <td>{request.accountHolderName}</td>
                  <td className="transfer-content">{request.transferContent || 'Không có'}</td>
                  <td>{new Date(request.createdAt).toLocaleString('vi-VN')}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleRequest(request._id, 'approve')}
                      >
                        Xác nhận
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleRequest(request._id, 'reject')}
                      >
                        Từ chối
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopupRequests; 