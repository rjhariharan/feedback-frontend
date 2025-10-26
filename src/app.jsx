import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FeedbackBoard from "./pages/FeedbackBoard";
import API from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  // 🔍 Check token validity on app load
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // No token means first-time open → go to login
    if (!token || !userData) {
      handleLogout();
      return;
    }

    // Optional: Verify token via backend (more secure)
    verifyToken(token);
  }, []);

  async function verifyToken(token) {
    try {
      const res = await API.get("/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.valid) {
        setUser(res.data.user);
      } else {
        handleLogout();
      }
    } catch (err) {
      console.warn("Invalid token or session expired:", err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(userData) {
    setUser(userData);
    setShowLogin(false);
    localStorage.setItem("user", JSON.stringify(userData));
  }

  function handleLogout() {
    setUser(null);
    setShowLogin(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoading(false);
  }

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return showLogin ? (
      <Login
        onLogin={() => window.location.reload()}
        onSwitchToSignup={() => setShowLogin(false)}
      />
    ) : (
      <Signup
        onSignup={() => setShowLogin(true)}
        onSwitchToLogin={() => setShowLogin(true)}
      />
    );
  }

  return <FeedbackBoard user={user} onLogout={handleLogout} />;
}
