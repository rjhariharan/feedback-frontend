import { useState } from "react";
import { SiGnuprivacyguard } from "react-icons/si";
import { authAPI } from "../api";

export default function Signup({ onSignup, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function signup() {
    if (!username || !email || !phone || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authAPI.register({
        username,
        email,
        phone,
        password
      });

      // Store user data and token in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", response.user.username);
      localStorage.setItem("user", JSON.stringify(response.user));

      setSuccess("Account created successfully! Redirecting...");

      // Call the parent callback with user data after a short delay
      setTimeout(() => {
        onSignup();
      }, 1500);

    } catch (error) {
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <SiGnuprivacyguard size={40} />
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={signup} disabled={loading}>{loading ? "Creating..." : "Signup"}</button>

      <p>
        Already registered? <button onClick={onSwitchToLogin}>Login</button>
      </p>
    </div>
  );
}
