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
  CircularProgress,
} from "@mui/material";

import { loginUser } from "./api";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email and password");
      return;
    }

    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      login(data);
      navigate("/");
    } catch (error) {
      setErrorMsg(error.response?.data?.msg || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <Box
      className="auth-page"
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      px={2}
    >
      <Card className="auth-card" sx={{ maxWidth: 440 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={600} textAlign="center" mb={2}>
            Welcome Back
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={{ mb: 3 }}
          />

          <Button
            fullWidth
            variant="contained"
            onClick={handleLogin}
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>

          <Typography textAlign="center" mt={2}>
            New here?{" "}
            <span
              className="auth-link"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
