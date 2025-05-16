import React, { useState } from 'react';
import styles from './RecipeComments.module.scss';

const RecipeComments = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); // id của comment đang trả lời
  const [replyContent, setReplyContent] = useState('');

  // Tạo id đơn giản cho comment
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSend = () => {
    if (comment.trim() === '') return;
    setComments([
      ...comments,
      {
        id: generateId(),
        user: 'Bạn',
        avatar: '',
        content: comment,
        time: 'Vừa xong',
        replies: []
      }
    ]);
    setComment('');
  };

  const handleReplySend = (parentId) => {
    if (replyContent.trim() === '') return;
    setComments(comments => comments.map(c => {
      if (c.id === parentId) {
        return {
          ...c,
          replies: [
            ...c.replies,
            {
              id: generateId(),
              user: 'Bạn',
              avatar: '',
              content: replyContent,
              time: 'Vừa xong'
            }
          ]
        };
      }
      return c;
    }));
    setReplyingTo(null);
    setReplyContent('');
  };

  return (
    <div className={styles.commentWrapper}>
      <h2 className={styles.title}>Bình luận</h2>
      <div className={styles.inputWrapper}>
        <div className={styles.avatar}>T</div>
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Thêm bình luận"
          className={styles.input}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button onClick={handleSend} className={styles.sendButton} aria-label="Gửi bình luận">
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      <div className={styles.commentList}>
        {comments.map((c, idx) => (
          <div key={c.id} className={styles.commentItem}>
            <div className={styles.avatarSmall}>{c.user[0]}</div>
            <div style={{flex: 1}}>
              <div className={styles.commentHeader}>
                {c.user}
                <span className={styles.commentTime}>{c.time}</span>
              </div>
              <div className={styles.commentContent}>{c.content}</div>
              <button
                style={{ color: '#f4a259', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, marginTop: 2 }}
                onClick={() => setReplyingTo(c.id)}
              >
                Trả lời
              </button>
              {/* Hiển thị input trả lời */}
              {replyingTo === c.id && (
                <div style={{ display: 'flex', alignItems: 'center', marginTop: 8 }}>
                  <div className={styles.avatarSmall}>T</div>
                  <input
                    value={replyContent}
                    onChange={e => setReplyContent(e.target.value)}
                    placeholder="Trả lời bình luận..."
                    className={styles.input}
                    style={{ fontSize: 15, height: 32 }}
                    onKeyDown={e => { if (e.key === 'Enter') handleReplySend(c.id); }}
                  />
                  <button
                    onClick={() => handleReplySend(c.id)}
                    className={styles.sendButton}
                    aria-label="Gửi trả lời"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              )}
              {/* Hiển thị replies */}
              {c.replies && c.replies.length > 0 && (
                <div style={{ marginLeft: 36, marginTop: 6 }}>
                  {c.replies.map((r, ridx) => (
                    <div key={r.id} className={styles.commentItem}>
                      <div className={styles.avatarSmall}>{r.user[0]}</div>
                      <div>
                        <div className={styles.commentHeader}>
                          {r.user}
                          <span className={styles.commentTime}>{r.time}</span>
                        </div>
                        <div className={styles.commentContent}>{r.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeComments;
