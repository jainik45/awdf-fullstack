import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../api";
import { setToken } from "../auth";

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationDetails, setValidationDetails] = useState([]);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Check if redirected due to expired session
    const expiredMsg = sessionStorage.getItem("auth_message");
    if (expiredMsg) {
      setErrorMessage(expiredMsg);
      sessionStorage.removeItem("auth_message");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setValidationDetails([]);
    setBusy(true);

    try {
      const data = await login({ email, password });
      if (data && data.token) {
        setToken(data.token);
        if (onLoginSuccess) onLoginSuccess();
        navigate("/projects");
      }
    } catch (err) {
      setErrorMessage(err.message || "Invalid email or password");
      if (err.details && Array.isArray(err.details)) {
        setValidationDetails(err.details);
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");
    setValidationDetails([]);
    setBusy(true);

    try {
      const data = await register({ email, password });
      setInfoMessage("User registered successfully, please login");
      setPassword("");
    } catch (err) {
      setErrorMessage(err.message || "Registration failed");
      if (err.details && Array.isArray(err.details)) {
        setValidationDetails(err.details);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: "440px", margin: "2rem auto", padding: "2rem", border: "1px solid rgba(128,128,128,0.25)", borderRadius: "10px", backgroundColor: "rgba(128,128,128,0.04)" }}>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Authentication</h2>

      {infoMessage && (
        <div style={{ backgroundColor: "#d1fae5", color: "#065f46", border: "1px solid #34d399", padding: "0.75rem 1rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>
          ✓ {infoMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{ backgroundColor: "#fee2e2", color: "#991b1b", border: "1px solid #f87171", padding: "0.75rem 1rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.9rem" }}>
          ⚠️ {errorMessage}
        </div>
      )}

      {validationDetails.length > 0 && (
        <ul style={{ backgroundColor: "#fff1f2", color: "#be123c", border: "1px solid #fda4af", padding: "0.75rem 1.25rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.85rem", listStyle: "disc" }}>
          {validationDetails.map((item, index) => (
            <li key={index}>{item.message}</li>
          ))}
        </ul>
      )}

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="login-email" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500, fontSize: "0.9rem" }}>
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            placeholder="user@example.com"
            required
            style={{
              width: "100%",
              padding: "0.65rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #888",
              background: "transparent",
              color: "inherit",
              fontSize: "0.95rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="login-password" style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500, fontSize: "0.9rem" }}>
            Password
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            placeholder="At least 6 characters"
            required
            style={{
              width: "100%",
              padding: "0.65rem 0.75rem",
              borderRadius: "6px",
              border: "1px solid #888",
              background: "transparent",
              color: "inherit",
              fontSize: "0.95rem",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            type="submit"
            disabled={busy}
            style={{
              flex: 1,
              padding: "0.7rem",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
            }}
          >
            {busy ? "Please wait..." : "Login"}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            disabled={busy}
            style={{
              flex: 1,
              padding: "0.7rem",
              borderRadius: "6px",
              border: "1px solid #2563eb",
              backgroundColor: "transparent",
              color: "#2563eb",
              fontWeight: 600,
              cursor: busy ? "not-allowed" : "pointer",
              fontSize: "0.95rem",
            }}
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
