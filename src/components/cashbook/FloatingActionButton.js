import React from "react";
import "../../styles/cashbook/FloatingActionButton.css";

const FloatingActionButton = ({ onClick }) => {
  return (
    <div className="floating-button" onClick={onClick}>
      <span>+</span>
    </div>
  );
};

export default FloatingActionButton;
