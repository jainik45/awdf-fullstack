import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";

export default function Home() {
  const skills = [
    "JavaScript (ES6+)",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB & Mongoose",
    "RESTful APIs",
    "Docker & Docker Compose",
    "Git & GitHub",
  ];

  return (
    <div className="home-page">
      <h1>Welcome to My Portfolio</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
        This is the Home Page.
      </p>
      <Header name="Jainik Ghetiya" themeColor="#2563eb" />
      <About />
      <Skills skillList={skills} />
    </div>
  );
}
