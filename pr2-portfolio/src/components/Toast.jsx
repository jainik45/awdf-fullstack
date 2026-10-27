import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";

  return (
    <div
      className="toast-notification"
      role="alert"
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 1000,
        backgroundColor: isSuccess ? "#065f46" : "#991b1b",
        color: "#ffffff",
        padding: "0.85rem 1.25rem",
        borderRadius: "8px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        fontSize: "0.95rem",
        fontWeight: 500,
        animation: "slideIn 0.25s ease-out",
      }}
    >
      <span>{isSuccess ? "✓" : "⚠️"}</span>
      <span>{message}</span>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.8)",
          cursor: "pointer",
          fontSize: "1.1rem",
          marginLeft: "0.5rem",
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
