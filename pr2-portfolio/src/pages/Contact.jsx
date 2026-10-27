import { useState } from "react";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="contact-page" style={{ padding: "1rem 0" }}>
      <h2>Contact Me</h2>
      <p>Feel free to reach out with questions, feedback, or collaboration opportunities.</p>

      <div style={{ margin: "1.5rem 0", maxWidth: "550px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
          <label htmlFor="message-input" style={{ fontWeight: 600 }}>
            Your Message:
          </label>
          <button
            type="button"
            onClick={() => setShowTooltip((prev) => !prev)}
            style={{
              cursor: "pointer",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              border: "1px solid #888",
              background: "transparent",
              color: "inherit",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            title="Help"
            aria-label="Toggle help tooltip"
          >
            ?
          </button>
        </div>

        {showTooltip && (
          <div
            style={{
              padding: "0.6rem 0.85rem",
              background: "#333",
              color: "#fff",
              borderRadius: "6px",
              fontSize: "0.85rem",
              marginBottom: "0.75rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Type your message here. The character count and live preview update instantly.
          </div>
        )}

        <textarea
          id="message-input"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          style={{
            width: "100%",
            padding: "0.75rem",
            borderRadius: "6px",
            border: "1px solid #888",
            background: "transparent",
            color: "inherit",
            fontSize: "1rem",
            fontFamily: "inherit",
          }}
        />

        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", display: "flex", justifyContent: "space-between" }}>
          <span>Character Count: <strong>{message.length}</strong></span>
        </div>

        <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: "6px", border: "1px dashed #888" }}>
          <strong>Live Preview:</strong>
          <p style={{ marginTop: "0.5rem", minHeight: "1.5rem", fontStyle: message ? "normal" : "italic", opacity: message ? 1 : 0.6 }}>
            {message || "Nothing typed yet..."}
          </p>
        </div>
      </div>
    </div>
  );
}
