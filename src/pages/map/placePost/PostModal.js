//react
import React from "react";
//css
import "../../../styles/place/Modal.css";

const PostModal = ({ title, isOpen, onClose, onSubmit, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Modal Header */}
        <div className="modal-header">
          <h4 className="modal-title">{title}</h4>  {/*PlacePost 66번째 줄~ */}
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">{children}</div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="modal-cancel" onClick={onClose}>
            취소
          </button>
          <button type="button" className="modal-submit" onClick={onSubmit}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
