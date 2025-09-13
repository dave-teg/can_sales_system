import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  Alert,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { useGetAllUsersQuery, useUpdateUserMutation } from "./userApiSlice";

const EditUser = () => {
  const { id } = useParams();
  const { data: users, isSuccess } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserMutation();

  const [formError, setFormError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullname: "",
      password: "",
      role: "",
      active: false,
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const user = users.find((u) => u.id === id);

      reset({
        fullname: user.fullname,
        password: "",
        role: user.role,
        active: user.active,
      });
    }
  }, [reset, isSuccess, users, id]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    navigate("/dashboard/users");
  };

  const onSubmit = async (data) => {
    const { fullname, password, role, active } = data;
    try {
      await updateUser({ id, fullname, password, role, active }).unwrap();
      setFormError("");
      setOpen(true);
    } catch (err) {
      setFormError(err?.data?.message);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
        Edit user
      </Typography>

      {formError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {formError}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          columnSpacing={2}
          rowSpacing={4}
          columns={12}
          sx={{ mb: 2 }}
        >
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="fullname"
              control={control}
              defaultValue=""
              rules={{ required: "fullname is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Full Name"
                  type="text"
                  variant="outlined"
                  size="small"
                  error={!!errors.fullname}
                  helperText={errors?.fullname?.message}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Reset Password"
                  type="password"
                  variant="outlined"
                  size="small"
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small" error={Boolean(errors.role)}>
              <InputLabel>Role</InputLabel>
              <Controller
                name="role"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field }) => (
                  <Select label="role" {...field}>
                    <MenuItem value="user">Cashier</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                )}
              />
              <FormHelperText>{errors.role?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="active"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label="Active"
                  labelPlacement="start"
                />
              )}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ textTransform: "none" }}
          >
            Edit
          </Button>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} variant="filled" severity="success">
          User edited successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditUser;
