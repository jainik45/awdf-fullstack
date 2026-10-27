import { Link } from "react-router-dom";

export default function NavBar({ isLoggedIn, onLogout }) {
  return (
    <nav
      className="main-navbar"
      style={{
        backgroundColor: "#333",
        color: "#fff",
        padding: "0.85rem 1.5rem",
        borderRadius: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
        Jainik Ghetiya
      </div>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>
          Home
        </Link>
        <span style={{ color: "#666" }}>|</span>
        <Link to="/projects" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>
          Projects
        </Link>
        <span style={{ color: "#666" }}>|</span>
        <Link to="/contact" style={{ color: "#fff", textDecoration: "none", fontWeight: 500 }}>
          Contact
        </Link>
        <span style={{ color: "#666" }}>|</span>
        {isLoggedIn ? (
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              color: "#fca5a5",
              cursor: "pointer",
              fontWeight: 500,
              padding: 0,
              fontSize: "1rem",
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={{ color: "#93c5fd", textDecoration: "none", fontWeight: 500 }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
