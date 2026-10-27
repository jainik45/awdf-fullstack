export default function ErrorMessage({ message = "An unexpected error occurred.", onRetry }) {
  return (
    <div
      className="error-box"
      style={{
        backgroundColor: "#fee2e2",
        color: "#991b1b",
        border: "1px solid #f87171",
        borderRadius: "8px",
        padding: "1.25rem",
        margin: "1rem 0",
      }}
      role="alert"
    >
      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.15rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>⚠️</span> Something went wrong
      </h3>
      <p style={{ margin: "0 0 1rem 0", fontSize: "0.95rem" }}>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          style={{
            backgroundColor: "#b91c1c",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            padding: "0.5rem 1rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
