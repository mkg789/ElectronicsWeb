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

import { signupUser } from "./api";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await signupUser(form);
      setSuccess("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setError(error.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
      <Card sx={{ width: 400, p: 2 }}>
        <CardContent>
          <Typography variant="h5" fontWeight={600} textAlign="center">
            Create Account
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              sx={{ my: 1 }}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <TextField
              fullWidth
              label="Email"
              sx={{ my: 1 }}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              sx={{ my: 1 }}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              sx={{ my: 1 }}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
            />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
