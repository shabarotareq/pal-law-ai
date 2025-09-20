import React from "react";
import "./Notification.css";

const Notification = ({ message, type = "info", onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const getClassName = () => {
    switch (type) {
      case "success":
        return "notification success";
      case "error":
        return "notification error";
      case "warning":
        return "notification warning";
      default:
        return "notification info";
    }
  };

  return (
    <div className={getClassName()}>
      <span className="notification-icon">{getIcon()}</span>
      <span className="notification-message">{message}</span>
      {onClose && (
        <button className="notification-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default Notification;
