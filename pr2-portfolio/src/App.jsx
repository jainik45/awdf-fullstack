import { useState, useEffect, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Spinner from "./components/Spinner";
import { lazyWithDelay } from "./utils/lazyWithDelay";
import { getToken, clearToken } from "./auth";

// Practical 8: Lazy loaded pages with anti-flicker delay wrapper
const Projects = lazyWithDelay(() => import("./pages/Projects"), 300);
const Contact = lazyWithDelay(() => import("./pages/Contact"), 300);
const Login = lazyWithDelay(() => import("./pages/Login"), 300);
const NotFound = lazyWithDelay(() => import("./pages/NotFound"), 300);

export default function App() {
  const [dark, setDark] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(getToken()));
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(Boolean(getToken()));
  }, []);

  const handleLogout = () => {
    clearToken();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className={dark ? "dark" : "light"}>
      <div className="app-container">
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "0.75rem" }}>
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={() => setDark((prev) => !prev)}
          >
            {dark ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <NavBar isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        <main className="content-area">
          {/* Practical 8: ONE Suspense wraps only the Routes block */}
          <Suspense fallback={<Spinner message="Loading page..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <Projects />
                  </ProtectedRoute>
                }
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </div>
  );
}
