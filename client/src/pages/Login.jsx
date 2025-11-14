import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome Back</h1>
        <p className="login-subtitle">Login to continue</p>

        <input type="email" placeholder="Email" className="login-input" />
        <input type="password" placeholder="Password" className="login-input" />

        <button className="login-submit">Login</button>

        <p className="create-account">
          New here?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>Sign Up</span>
        </p>

        <button className="back-home" onClick={() => navigate("/")}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
