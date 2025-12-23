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

import { loginUser } from "./api";
import { useAuth } from "./AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser({ email, password });
      login(data);
      navigate("/");
    } catch (error) {
      setErrorMsg(
        error.response?.data?.msg || "Login failed. Try again."
      );
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
      <Card sx={{ maxWidth: 400, width: "100%", p: 2 }}>
        <CardContent>
          <Typography variant="h4" fontWeight={600} textAlign="center">
            Welcome Back
          </Typography>

          {errorMsg && (
            <Alert severity="error" sx={{ my: 2 }}>
              {errorMsg}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button fullWidth variant="contained" onClick={handleLogin}>
            Login
          </Button>

          <Typography textAlign="center" mt={2}>
            New here?{" "}
            <span
              style={{ color: "#1976d2", cursor: "pointer" }}
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
