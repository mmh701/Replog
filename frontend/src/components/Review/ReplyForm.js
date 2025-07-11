import React from 'react';
import { useReviewApi } from '../../hooks/useReviewApi';
import './ReplyForm.css';

function ReplyForm({ show, setShow, replyText, setReplyText, parentId, onCommentAdded, memberId }) {
  const { postReply } = useReviewApi();

  const handleSubmit = async () => {
    if (!replyText.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }

    try {
      await postReply(parentId, {
        memberId,
        cont: replyText,
        rating: 0
      });
      setReplyText('');
      setShow(false);
      onCommentAdded();
    } catch (err) {
      alert('댓글 등록 실패');
    }
  };

  if (show === false) return null;

  return (
    <div className="mt-2">
      <textarea
  className="reply-textarea"
  value={replyText}
  onChange={(e) => setReplyText(e.target.value)}
  onInput={(e) => {
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }}
  placeholder="댓글을 입력하세요"
  rows={1}
/>
<div className="reply-actions">
  <button onClick={handleSubmit} className="reply-btn">등록</button>
  <button onClick={() => setShow(false)} className="reply-btn cancel">취소</button>
</div>

    </div>
  );
}

export default ReplyForm;
