export default function ConfirmDialog({
  isOpen,
  title = "Confirm Deletion",
  message = "Are you sure you want to delete this task? This action cannot be undone.",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
      }}
    >
      <div
        className="modal-card"
        style={{
          backgroundColor: "#ffffff",
          color: "#111111",
          borderRadius: "10px",
          padding: "1.75rem",
          maxWidth: "420px",
          width: "90%",
          boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
        }}
      >
        <h3 style={{ margin: "0 0 0.75rem 0", fontSize: "1.2rem", color: "#b91c1c" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 1.5rem 0", fontSize: "0.95rem", lineHeight: 1.4 }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              background: "#f3f4f6",
              color: "#374151",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "6px",
              border: "none",
              background: "#dc2626",
              color: "#ffffff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  );
}
