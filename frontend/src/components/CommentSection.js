import { useState, useEffect } from "react";
import axios from "../error/api/interceptor";
import { ErrorModal } from "../error/components/ErrorModal";
import BannedWordFilterModal, { checkBannedWords } from "../components/BannedWordFilterModal";

export default function CommentSection({ 
  postNo,
  userId,
  nickname,
  comments,
  setComments,
  isAuthenticated,
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [editingCommentNo, setEditingCommentNo] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [bannedModalOpen, setBannedModalOpen] = useState(false);
  const [bannedWordsMatched, setBannedWordsMatched] = useState([]);

  // 추가된 에러 모달 상태
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  const openErrorModal = (message) => {
    setErrorModalMessage(message);
    setErrorModalOpen(true);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await axios.get("/auth/admin-only");
        setIsAdmin(true);
      } catch {
        setIsAdmin(false);
      }
    };

    if (isAuthenticated) {
      checkAdmin();
    }
  }, [isAuthenticated]);

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      openErrorModal("로그인 후 댓글 작성이 가능합니다.");
      return;
    }
    if (!newComment.trim()) return;

    const { hasBanned, matchedWords } = checkBannedWords(newComment);
    if (hasBanned) {
      setBannedWordsMatched(matchedWords);
      setBannedModalOpen(true);
      return;
    }

    try {
      const res = await axios.post("/comments", {
        memberId: userId,
        nickname,
        postNo: parseInt(postNo),
        content: newComment,
      });
      setComments((prev) => [...prev, { ...res.data, likes: 0, isLiked: false }]);
      setNewComment("");
    } catch {
      openErrorModal("댓글 작성에 실패했습니다.");
    }
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`/comments/${commentToDelete}`);
      setComments((prev) => prev.filter((c) => c.commentNo !== commentToDelete));
    } catch {
      openErrorModal("댓글 삭제에 실패했습니다.");
    } finally {
      setCommentToDelete(null);
    }
  };

  const handleUpdateComment = async (commentNo) => {
    const { hasBanned, matchedWords } = checkBannedWords(editingContent);
    if (hasBanned) {
      setBannedWordsMatched(matchedWords);
      setBannedModalOpen(true);
      return;
    }

    try {
      const res = await axios.put(`/comments/${commentNo}`, {
        memberId: userId,
        nickname,
        postNo: parseInt(postNo),
        content: editingContent,
      });
      setComments((prev) =>
        prev.map((c) =>
          c.commentNo === commentNo ? { ...c, content: res.data.content, updatedAt: res.data.updatedAt } : c
        )
      );
      setEditingCommentNo(null);
      setEditingContent("");
    } catch {
      openErrorModal("댓글 수정에 실패했습니다.");
    }
  };

  const toggleCommentLike = async (commentNo) => {
    try {
      const res = await axios.post(`/comments/${commentNo}/like`, null, {
        params: { memberId: userId },
      });
      const isLiked = res.data === "liked";
      setComments((prev) =>
        prev.map((c) =>
          c.commentNo === commentNo
            ? { ...c, isLiked, likes: isLiked ? c.likes + 1 : c.likes - 1 }
            : c
        )
      );
    } catch {
      openErrorModal("댓글 좋아요 처리 실패");
    }
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>

      {comments.map((comment) => {
        const isValidDate = (date) => date && !isNaN(new Date(date).getTime());
        const isEdited = isValidDate(comment.updatedAt);
        const timeLabel = isEdited ? comment.updatedAt : comment.createdAt;
        const isAuthor = comment.memberId === userId;

        return (
          <div className="comment-box" key={comment.commentNo}>
            <div className="comment-meta">
              <div className="comment-info">
                <span>{comment.nickname}</span>
                <span className="comment-date">
                  {new Date(timeLabel).toLocaleString()} {isEdited && "(수정됨)"}
                </span>
              </div>
              <button
                className={`comment-like ${comment.isLiked ? "liked" : ""}`}
                onClick={() => toggleCommentLike(comment.commentNo)}
              >
                추천 {comment.likes}
              </button>
            </div>

            {editingCommentNo === comment.commentNo ? (
              <>
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="comment-edit-area"
                />
                <div className="comment-edit-buttons">
                  <button onClick={() => handleUpdateComment(comment.commentNo)} className="btn-confirm">
                    완료
                  </button>
                  <button onClick={() => setEditingCommentNo(null)} className="btn-cancel">
                    취소
                  </button>
                </div>
              </>
            ) : (
              <div className="comment-content-row">
                <div className="comment-content">{comment.content}</div>
                {(isAuthor || isAdmin) && (
                  <div className="comment-action-buttons">
                    {isAuthor && (
                      <button
                        onClick={() => {
                          setEditingCommentNo(comment.commentNo);
                          setEditingContent(comment.content);
                        }}
                      >
                        수정
                      </button>
                    )}
                    <button
                      onClick={() => setCommentToDelete(comment.commentNo)}
                      className="btn-delete"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <div className="comment-input-section">
        <textarea
          placeholder={isAuthenticated ? "댓글을 입력하세요" : "로그인 후 댓글을 작성할 수 있습니다"}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!isAuthenticated}
        />
        <button onClick={handleCommentSubmit} disabled={!isAuthenticated}>
          댓글 작성
        </button>
      </div>

      <ErrorModal
        isOpen={commentToDelete !== null}
        title="댓글 삭제 확인"
        message="댓글을 삭제하시겠습니까?"
        onConfirm={handleDeleteComment}
        onCancel={() => setCommentToDelete(null)}
      />

      <BannedWordFilterModal
        isOpen={bannedModalOpen}
        matchedWords={bannedWordsMatched}
        onClose={() => setBannedModalOpen(false)}
      />

      <ErrorModal
        isOpen={errorModalOpen}
        title="오류"
        message={errorModalMessage}
        onConfirm={() => setErrorModalOpen(false)}
        onCancel={() => setErrorModalOpen(false)}
      />
    </div>
  );
}