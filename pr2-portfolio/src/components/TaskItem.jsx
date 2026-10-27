export default function TaskItem({ task, onToggleCompleted, onRequestDelete, busy = false }) {
  const priorityColors = {
    low: { bg: "rgba(16, 185, 129, 0.15)", text: "#059669", border: "rgba(16, 185, 129, 0.4)" },
    medium: { bg: "rgba(245, 158, 11, 0.15)", text: "#d97706", border: "rgba(245, 158, 11, 0.4)" },
    high: { bg: "rgba(239, 68, 68, 0.15)", text: "#dc2626", border: "rgba(239, 68, 68, 0.4)" },
  };

  const priorityStyle = priorityColors[task.priority] || priorityColors.medium;

  return (
    <div
      className="task-item-card"
      style={{
        border: "1px solid rgba(128,128,128,0.25)",
        borderRadius: "8px",
        padding: "1rem 1.25rem",
        marginBottom: "0.85rem",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "1rem",
        backgroundColor: "rgba(128,128,128,0.03)",
        transition: "opacity 0.2s",
        opacity: busy ? 0.7 : 1,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.85rem", flex: 1 }}>
        <input
          type="checkbox"
          checked={Boolean(task.completed)}
          onChange={(e) => onToggleCompleted(task._id || task.id, e.target.checked)}
          disabled={busy}
          style={{
            marginTop: "0.25rem",
            width: "18px",
            height: "18px",
            cursor: busy ? "not-allowed" : "pointer",
          }}
          aria-label={`Mark "${task.title}" as ${task.completed ? "pending" : "completed"}`}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: "1.05rem",
                fontWeight: 600,
                textDecoration: task.completed ? "line-through" : "none",
                opacity: task.completed ? 0.6 : 1,
              }}
            >
              {task.title}
            </span>
            <span
              style={{
                fontSize: "0.75rem",
                textTransform: "uppercase",
                fontWeight: 700,
                padding: "0.2rem 0.55rem",
                borderRadius: "12px",
                backgroundColor: priorityStyle.bg,
                color: priorityStyle.text,
                border: `1px solid ${priorityStyle.border}`,
              }}
            >
              {task.priority}
            </span>
          </div>
          {task.description && (
            <p
              style={{
                margin: "0.35rem 0 0 0",
                fontSize: "0.9rem",
                opacity: task.completed ? 0.5 : 0.8,
                lineHeight: 1.4,
              }}
            >
              {task.description}
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => onRequestDelete(task)}
        disabled={busy}
        style={{
          padding: "0.4rem 0.75rem",
          borderRadius: "5px",
          border: "1px solid #ef4444",
          backgroundColor: "transparent",
          color: "#ef4444",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: busy ? "not-allowed" : "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
}
