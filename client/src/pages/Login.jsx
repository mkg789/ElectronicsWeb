import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from "@mui/material";

export default function Login({ onLogin }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.msg || "Login failed");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data.token);

      // Save user info
      localStorage.setItem("user", JSON.stringify(data.user));

      // Notify App
      if (typeof onLogin === "function") onLogin();

      navigate("/");
    } catch (error) {
      console.error(error);
      setErrorMsg("Server error, please try again.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f1f3f6"
      px={2}
    >
      <Card sx={{ maxWidth: 400, width: "100%", p: 2, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={600} textAlign="center" mb={1}>
            Welcome Back
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Login to continue
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            type="email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrorMsg("");
            }}
            sx={{ mb: 2 }}
            required
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMsg("");
            }}
            sx={{ mb: 3 }}
            required
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ py: 1.2, mb: 2 }}
            onClick={handleLogin}
          >
            Login
          </Button>

          <Typography textAlign="center" mb={2}>
            New here?{" "}
            <span
              style={{
                color: "#1976d2",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </Typography>

          <Button variant="text" fullWidth onClick={() => navigate("/")}>
            ← Back to Home
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
