import { useState, useEffect } from "react";
import Signup from "./components/signup";
import Login from "./components/login";
import FeedbackBoard from "./components/feedbackboard";

export default function App() {
  const [page, setPage] = useState("login"); // Default to login for safety
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      try {
        JSON.parse(user); // Validate user data
        setPage("dashboard");
      } catch (err) {
        console.error("Invalid user data in localStorage:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setPage("login");
      }
    } else {
      setPage("login");
    }

    setLoading(false);
  }, []);

  function handleSignup() {
    setPage("login");
  }

  function handleLogin() {
    setPage("dashboard");
  }

  function handleLogout() {
    localStorage.clear();
    setPage("login");
  }

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#333"
      }}>
        Loading...
      </div>
    );
  }

  // Show error screen if there's a critical error
  if (error) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#333",
        textAlign: "center",
        padding: "20px"
      }}>
        <h2>⚠️ Application Error</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setError("");
            setPage("login");
          }}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      {page === "signup" && <Signup onSignup={handleSignup} onSwitchToLogin={() => setPage("login")} />}
      {page === "login" && <Login onLogin={handleLogin} onSwitchToSignup={() => setPage("signup")} />}
      {page === "dashboard" && <FeedbackBoard onLogout={handleLogout} />}
    </>
  );
}
