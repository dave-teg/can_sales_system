import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid, TextField, Typography, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { useCreateCategoryMutation } from "./categoryApiSlice";

export default function NewCategory() {
  const [createCategory] = useCreateCategoryMutation();

  const [formError, setFormError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    navigate("/dashboard/categories");
  };

  const onSubmit = async (data) => {
    const { name } = data;
    try {
      await createCategory({ name }).unwrap();
      setFormError("");
      setOpen(true);
    } catch (err) {
      setFormError(err?.data?.message);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
        Create new category
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
            <TextField
              fullWidth
              label="Name"
              name="name"
              type="text"
              variant="outlined"
              size="small"
              {...register("name", {
                required: "Name is required",
              })}
              error={!!errors.name}
              helperText={errors?.name?.message}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ textTransform: "none" }}
          >
            Create
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
          Category created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
