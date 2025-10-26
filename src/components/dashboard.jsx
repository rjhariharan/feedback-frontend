import { useState, useEffect } from "react";
import { MdDashboard } from "react-icons/md";
import API from "../api";

export default function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return onLogout();

        const { data } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
      } catch (err) {
        setMessage("Session expired. Please log in again.");
        setTimeout(() => onLogout(), 1500);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [onLogout]);

  function handleLogout() {
    localStorage.clear();
    setMessage("Logged out successfully!");
    setTimeout(() => onLogout(), 1000);
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <MdDashboard size={40} />
      <h2>Dashboard</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {user && (
        <div className="card">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
