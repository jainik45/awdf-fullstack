import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";

export default function RepoList({ username = "jainik45" }) {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://api.github.com/users/${username}/repos?sort=updated`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setRepos(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch repositories");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username, attempt]);

  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="repo-list-container" style={{ margin: "1.5rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1rem" }}>
        <h3>GitHub Repositories (@{username})</h3>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter repositories..."
          style={{
            padding: "0.5rem 0.75rem",
            borderRadius: "6px",
            border: "1px solid #888",
            background: "transparent",
            color: "inherit",
            fontSize: "0.95rem",
          }}
        />
      </div>

      {loading && <Spinner message="Loading repositories..." />}

      {error && !loading && (
        <ErrorMessage
          message={error}
          onRetry={() => setAttempt((prev) => prev + 1)}
        />
      )}

      {!loading && !error && filteredRepos.length === 0 && (
        <p style={{ fontStyle: "italic", opacity: 0.7 }}>No repositories found matching your query.</p>
      )}

      {!loading && !error && filteredRepos.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem" }}>
          {filteredRepos.map((repo) => (
            <div
              key={repo.id || repo.name}
              style={{
                border: "1px solid rgba(128,128,128,0.3)",
                borderRadius: "8px",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#2563eb", fontWeight: 600, fontSize: "1.05rem", textDecoration: "none" }}
                >
                  {repo.name}
                </a>
                <p style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: "0.35rem" }}>
                  {repo.description || "No description provided."}
                </p>
              </div>
              <div style={{ marginTop: "0.75rem", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <span>⭐</span>
                <span>{repo.stargazers_count}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
