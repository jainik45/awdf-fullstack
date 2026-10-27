export default function Header({ name, themeColor = "#2563eb" }) {
  return (
    <header className="portfolio-header" style={{ backgroundColor: themeColor, color: "#ffffff", padding: "2rem 1.5rem", textAlign: "center", borderRadius: "8px", margin: "1rem 0" }}>
      <h1 style={{ margin: "0 0 0.5rem 0", fontSize: "2.2rem" }}>{name}</h1>
      <p style={{ margin: 0, fontSize: "1.1rem", opacity: 0.95 }}>
        Information Technology Student (ID: 24IT024) | Aspiring Full-Stack Developer
      </p>
    </header>
  );
}
