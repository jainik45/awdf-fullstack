export default function TaskStats({ tasks = [] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const pendingPct = total > 0 ? 100 - completedPct : 0;

  // Chart dimensions for SVG
  const chartHeight = 120;
  const chartWidth = 280;
  const barWidth = 48;
  const maxVal = Math.max(total, 1);

  const completedHeight = Math.round((completed / maxVal) * 80);
  const pendingHeight = Math.round((pending / maxVal) * 80);

  return (
    <div
      className="task-stats-panel"
      style={{
        backgroundColor: "rgba(128,128,128,0.06)",
        border: "1px solid rgba(128,128,128,0.25)",
        borderRadius: "8px",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>Task Analytics &amp; Statistics</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "1rem", marginBottom: "1.25rem" }}>
        <div style={{ padding: "0.85rem", borderRadius: "6px", backgroundColor: "rgba(37, 99, 235, 0.1)", textAlign: "center" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#2563eb" }}>{total}</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>Total Tasks</div>
        </div>

        <div style={{ padding: "0.85rem", borderRadius: "6px", backgroundColor: "rgba(16, 185, 129, 0.1)", textAlign: "center" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#10b981" }}>{completed}</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>Completed ({completedPct}%)</div>
        </div>

        <div style={{ padding: "0.85rem", borderRadius: "6px", backgroundColor: "rgba(245, 158, 11, 0.1)", textAlign: "center" }}>
          <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#f59e0b" }}>{pending}</div>
          <div style={{ fontSize: "0.85rem", opacity: 0.85 }}>Pending ({pendingPct}%)</div>
        </div>
      </div>

      {total > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <svg width={chartWidth} height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} style={{ overflow: "visible" }}>
            {/* Grid baseline */}
            <line x1="20" y1="95" x2="260" y2="95" stroke="rgba(128,128,128,0.3)" strokeWidth="1" />

            {/* Completed Bar */}
            <rect
              x="60"
              y={95 - completedHeight}
              width={barWidth}
              height={completedHeight}
              fill="#10b981"
              rx="4"
            />
            <text x={60 + barWidth / 2} y={85 - completedHeight} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">
              {completed}
            </text>
            <text x={60 + barWidth / 2} y="112" textAnchor="middle" fill="currentColor" fontSize="11">
              Done
            </text>

            {/* Pending Bar */}
            <rect
              x="160"
              y={95 - pendingHeight}
              width={barWidth}
              height={pendingHeight}
              fill="#f59e0b"
              rx="4"
            />
            <text x={160 + barWidth / 2} y={85 - pendingHeight} textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold">
              {pending}
            </text>
            <text x={160 + barWidth / 2} y="112" textAnchor="middle" fill="currentColor" fontSize="11">
              Pending
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}
