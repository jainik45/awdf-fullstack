import React, { useState } from "react";

function TaskForm({ onSubmit, busy = false }) {
  console.log("TaskForm render");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [clientError, setClientError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setClientError("Title is required");
      return;
    }
    setClientError("");
    onSubmit(
      {
        title: title.trim(),
        description: description.trim(),
        priority,
      },
      () => {
        // Callback on success: reset form fields
        setTitle("");
        setDescription("");
        setPriority("medium");
      }
    );
  };

  return (
    <form
      className="task-form"
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "rgba(128,128,128,0.06)",
        border: "1px solid rgba(128,128,128,0.25)",
        borderRadius: "8px",
        padding: "1.25rem",
        marginBottom: "2rem",
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.15rem" }}>Create New Task</h3>

      {clientError && (
        <div style={{ color: "#dc2626", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
          ⚠️ {clientError}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
        <div>
          <label htmlFor="task-title" style={{ display: "block", fontWeight: 500, marginBottom: "0.35rem", fontSize: "0.9rem" }}>
            Title *
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={busy}
            placeholder="e.g. Complete Practical 6 integration"
            required
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #888",
              background: "transparent",
              color: "inherit",
              fontSize: "0.95rem",
            }}
          />
        </div>

        <div>
          <label htmlFor="task-desc" style={{ display: "block", fontWeight: 500, marginBottom: "0.35rem", fontSize: "0.9rem" }}>
            Description
          </label>
          <textarea
            id="task-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={busy}
            placeholder="Add relevant task details or steps..."
            rows={2}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #888",
              background: "transparent",
              color: "inherit",
              fontSize: "0.95rem",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", justifyContent: "space-between" }}>
          <div>
            <label htmlFor="task-priority" style={{ fontWeight: 500, marginRight: "0.5rem", fontSize: "0.9rem" }}>
              Priority:
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={busy}
              style={{
                padding: "0.45rem 0.75rem",
                borderRadius: "6px",
                border: "1px solid #888",
                background: "transparent",
                color: "inherit",
                fontSize: "0.9rem",
              }}
            >
              <option value="low" style={{ background: "#222", color: "#fff" }}>Low</option>
              <option value="medium" style={{ background: "#222", color: "#fff" }}>Medium</option>
              <option value="high" style={{ background: "#222", color: "#fff" }}>High</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={busy}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: busy ? "#9ca3af" : "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
              transition: "background-color 0.2s",
            }}
          >
            {busy ? "Saving..." : "Add Task"}
          </button>
        </div>
      </div>
    </form>
  );
}

export default React.memo(TaskForm);
