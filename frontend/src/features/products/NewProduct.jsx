import { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { useCreateProductMutation } from "./productApiSlice";
import { useGetAllCategoriesQuery } from "../categories/categoryApiSlice";

export default function NewProduct() {
  const [createProduct] = useCreateProductMutation();
  const { data: categories, isSuccess } = useGetAllCategoriesQuery();

  const [formError, setFormError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: "",
    },
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    navigate("/dashboard/products");
  };

  const onSubmit = async (data) => {
    const { name, price, category } = data;
    try {
      await createProduct({ name, price, category_id: category }).unwrap();
      setFormError("");
      setOpen(true);
    } catch (err) {
      setFormError(err?.data?.message);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
        Create new product
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
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              variant="outlined"
              size="small"
              {...register("price", {
                required: "Price is required",
              })}
              error={!!errors.price}
              helperText={errors?.price?.message}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl
              fullWidth
              size="small"
              error={Boolean(errors.category)}
            >
              <InputLabel>Category</InputLabel>
              <Controller
                name="category"
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select label="Category" {...field}>
                    {isSuccess &&
                      categories.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.categoryName}
                        </MenuItem>
                      ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.category?.message}</FormHelperText>
            </FormControl>
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
          Product created successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
