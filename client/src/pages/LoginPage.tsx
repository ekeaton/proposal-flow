import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../lib/schemas";
import type { LoginFormValues } from "../lib/schemas";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Link,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "background.default",
        padding: "24px",
      }}
    >
      <Paper
        sx={{
          padding: "48px",
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header Section */}
        <Box sx={{ marginBottom: "32px" }}>
          <Typography
            variant="h4"
            sx={{ marginBottom: "8px" }}
          >
            Sign In
          </Typography>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Enter your email to access your{" "}
            <span style={{ fontWeight: 700, color: "#111827" }}>
              ProposalFlow
            </span>{" "}
            account.
          </Typography>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{ marginBottom: "24px", borderRadius: "8px" }}
          >
            {error}
          </Alert>
        )}

        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <TextField
            label="Email Address"
            autoComplete="email"
            autoFocus
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Continue"
            )}
          </Button>

          <Divider sx={{ margin: "8px 0" }} />

          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.secondary" }}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              sx={{
                fontWeight: 700,
                textDecoration: "none",
                color: "primary.main",
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Typography
        variant="caption"
        sx={{ marginTop: "32px", color: "text.disabled" }}
      >
        © 2026 ProposalFlow Inc.
      </Typography>
    </Box>
  );
}

export default LoginPage;
