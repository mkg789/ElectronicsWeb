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

export default function Signup() {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(""); // Clear messages when typing
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://electronicsweb.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.msg || "Signup failed");
        return;
      }

      setSuccessMsg("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setErrorMsg("Server error, try again later.");
      console.error(error);
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
          <Typography variant="h5" fontWeight={600} textAlign="center" mb={2}>
            Create an Account
          </Typography>

          {/* Error Alert */}
          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

          {/* Success Alert */}
          {successMsg && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMsg}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Email"
              type="email"
              name="email"
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              variant="outlined"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 1, py: 1.2 }}
            >
              Sign Up
            </Button>
          </form>

          <Typography textAlign="center" mt={2}>
            Already have an account?{" "}
            <span
              style={{
                color: "#1976d2",
                cursor: "pointer",
                fontWeight: 600,
              }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
