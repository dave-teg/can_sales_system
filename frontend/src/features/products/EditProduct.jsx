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
import {
  useGetAllProductsQuery,
  useUpdateProductMutation,
} from "./productApiSlice";
import { useGetAllCategoriesQuery } from "../categories/categoryApiSlice";

const EditProduct = () => {
  const { id } = useParams();
  const [updateProduct] = useUpdateProductMutation();
  const { data: products, isSuccess } = useGetAllProductsQuery();
  const { data: categories, isSuccess: isCategorySuccess } =
    useGetAllCategoriesQuery();

  const [formError, setFormError] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      price: "",
      category: "",
      active: false,
    },
  });

  useEffect(() => {
    if (isSuccess && isCategorySuccess && !initialized) {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      const category = categories.find(
        (c) => c.categoryName === product.categoryName
      );

      reset({
        name: product.productName,
        price: product.price,
        active: product.active,
        category: category?.id || "",
      });
      setInitialized(true);
    }
  }, [
    categories,
    id,
    initialized,
    isCategorySuccess,
    isSuccess,
    products,
    reset,
  ]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
    navigate("/dashboard/products");
  };

  const onSubmit = async (data) => {
    const { name, price, category, active } = data;
    try {
      await updateProduct({
        id,
        name,
        price,
        category_id: category,
        active,
      }).unwrap();
      setFormError("");
      setOpen(true);
    } catch (err) {
      setFormError(err?.data?.message);
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
        Edit product
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
              name="price"
              control={control}
              defaultValue=""
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Price"
                  type="number"
                  variant="outlined"
                  size="small"
                  error={!!errors.price}
                  helperText={errors?.price?.message}
                />
              )}
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
                defaultValue=""
                control={control}
                rules={{ required: "Category is required" }}
                render={({ field }) => (
                  <Select label="Category" {...field}>
                    {isCategorySuccess &&
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
          Product edited successfully
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProduct;
