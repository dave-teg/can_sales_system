import React, { useState } from "react";
import { Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  FormControlLabel,
  FormGroup,
  Switch,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  AccountCircle,
  Lock,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import usePersist from "../../hooks/usePersist";
import { useLoginMutation } from "./authApiSlice";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";

export default function LoginPage() {
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [persist, setPersist] = usePersist();

  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { username, password } = data;
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      reset();
      navigate("/dashboard");
    } catch (err) {
      setLoginError(err.data?.message);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h6" align="center" gutterBottom>
          Login to MK POS System
        </Typography>

        {/* <Alert severity="info">
          You can login using <strong>testuser12</strong> with password <strong>password123</strong> to test
        </Alert> */}

        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
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
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    sx={{ minWidth: "auto", p: 0 }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            {...register("password", {
              required: "Password is required",
            })}
            error={!!errors.password}
            helperText={errors?.password?.message}
            margin="normal"
          />
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          {/* <FormGroup>
            <FormControlLabel
              sx={{ mt: 2 }}
              control={
                <Switch
                  checked={persist}
                  onChange={(e) => setPersist(e.target.checked)}
                />
              }
              label="Trust this device"
            />
          </FormGroup> */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?
            <MuiLink
              component={RouterLink}
              to="/register"
              sx={{
                ml: 0.5,
                color: "primary.main",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Register
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
