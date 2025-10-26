import { useState } from "react";
import { CiLogin } from "react-icons/ci";
import { authAPI } from "../api";

export default function Login({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (!username || !password) {
      setError("Enter username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({
        username,
        password
      });

      // Store authentication data in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      onLogin();
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <CiLogin size={40} />
      <h2>Login</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <button onClick={login} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>

      <p>
        New user? <button onClick={onSwitchToSignup}>Signup</button>
      </p>
    </div>
  );
}
