import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Login failed");
        return;
      }

      // Save JWT in localStorage
      localStorage.setItem("token", data.token);

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Login to continue</p>

        <input
          type="email"
          placeholder="Email"
          className="login-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-submit" onClick={handleLogin}>
          Login
        </button>

        <p className="create-account">
          New here?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </p>

        <button className="back-home" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
