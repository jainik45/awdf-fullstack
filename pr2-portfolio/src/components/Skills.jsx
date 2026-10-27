export default function Skills({ skillList = ["JavaScript (ES6+)", "React.js", "Node.js", "Express.js", "MongoDB & Mongoose", "REST APIs", "Docker", "Git & GitHub"] }) {
  return (
    <section className="skills-section" style={{ padding: "1.5rem", borderRadius: "8px", margin: "1rem 0" }}>
      <h2>Technical Skills</h2>
      <ul className="skills-list" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", listStyle: "none", padding: 0 }}>
        {skillList.map((skill) => (
          <li
            key={skill}
            className="skill-badge"
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "20px",
              backgroundColor: "rgba(37, 99, 235, 0.12)",
              border: "1px solid rgba(37, 99, 235, 0.3)",
              fontWeight: 500,
            }}
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}
