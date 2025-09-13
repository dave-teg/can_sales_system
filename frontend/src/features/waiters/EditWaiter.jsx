import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, Grid, TextField, Typography, Button, Alert, FormControlLabel, Switch } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import {
  useUpdateWaiterMutation,
  useGetAllWaitersQuery,
} from "./waitersApiSlice";

const EditWaiter = () => {
  const { id } = useParams();
  const [updateWaiter] = useUpdateWaiterMutation();
  const { data: waiters, isSuccess } = useGetAllWaitersQuery();

  const [formError, setFormError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      active: false,
    },
  });

  useEffect(() => {
    if (isSuccess && !initialized) {
      const waiter = waiters.find((c) => c.id === id);
      if (!waiter) return;

      reset({ name: waiter.fullname, active: waiter.active });
      setInitialized(true);
    }
  }, [reset, isSuccess, waiters, id, initialized]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    navigate("/dashboard/waiters");
  };

  const onSubmit = async (data) => {
    const { name, active } = data;
    try {
      await updateWaiter({ id, fullname:name, active }).unwrap();
      setFormError("");
      setOpen(true);
    } catch (err) {
      setFormError(err?.data?.message);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
        Edit waiter
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
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Name"
                  type="text"
                  variant="outlined"
                  size="small"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                />
              )}
            />
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
          Waiter edited successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditWaiter;
