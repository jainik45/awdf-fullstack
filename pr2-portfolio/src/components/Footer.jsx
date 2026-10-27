export default function Footer() {
  return (
    <footer className="portfolio-footer" style={{ marginTop: "2rem", padding: "1.5rem", textAlign: "center", borderTop: "1px solid rgba(128,128,128,0.2)" }}>
      <p style={{ margin: "0 0 0.5rem 0" }}>
        © {new Date().getFullYear()} Jainik Ghetiya | Student ID: 24IT024 | CHARUSAT University
      </p>
      <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.8 }}>
        ITUE301 Advanced Web Development Frameworks
      </p>
    </footer>
  );
}
