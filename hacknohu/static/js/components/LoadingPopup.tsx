import React from "react";
import "../../css/components/LoadingPopup.css";

interface LoadingPopupProps {
  isVisible: boolean;
  message?: string;
}

const LoadingPopup = ({ isVisible, message }: LoadingPopupProps) => {
  if (!isVisible) return null;

  return (
    <div className="loading-popup-overlay">
      <div className="loading-popup-content">
        <div className="loading-popup-spinner" />
        <div className="loading-popup-message">
          {message || "Đang tải, vui lòng chờ..."}
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;
