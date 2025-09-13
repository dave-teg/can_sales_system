import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
  Switch,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  AccountCircle,
  Lock,
  Person,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "./authApiSlice";

const RegisterPage = () => {
  const [registerError, setRegisterError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { fullname, username, password } = data;
    try {
      const response = await registerUser({
        fullname,
        username,
        password,
      }).unwrap();
      console.log(response);
      reset();
      navigate("/");
    } catch (err) {
      setRegisterError(err.data?.message);
    }
  };

  const password = watch("password");

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Create MK POS System Account
        </Typography>

        {registerError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {registerError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            required
            label="Full name"
            name="fullname"
            type="text"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              },
            }}
            margin="normal"
            {...register("fullname", {
              required: "Full name is required",
              minLength: {
                value: 5,
                message: "Full name must be at least 5 characters",
              },
              validate: (value) =>
                value.trim().split(" ").length == 2 ||
                "Please enter both first and last name",
            })}
            error={!!errors.fullname}
            helperText={errors?.fullname?.message}
          />
          <TextField
            fullWidth
            required
            label="Username"
            name="username"
            type="text"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              },
            }}
            margin="normal"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              validate: (value) =>
                value === value.toLowerCase() || "Username must be lowercase",
            })}
            error={!!errors.username}
            helperText={errors?.username?.message}
          />
          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            error={!!errors.password}
            helperText={errors?.password?.message}
            margin="normal"
          />
          <TextField
            fullWidth
            required
            label="Confirm Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords don't match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors?.confirmPassword?.message}
            margin="normal"
          />

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            {isLoading ? "Signing up..." : "Sign up"}
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?
            <MuiLink
              component={RouterLink}
              to="/"
              sx={{
                ml: 0.5,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Login
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
