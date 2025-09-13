import React from "react";
import { Box, Button, Typography, Tooltip, Grid } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ProductGrid from "./ProductGrid";

const Products = () => {
  const navigate = useNavigate();

  const handleCreateProduct = () => {
    navigate("/dashboard/products/new");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Products
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        {/* <CustomButton sx={{fontSize: '14px',}} startIcon={<Add/>}>Create New</CustomButton> */}
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ textTransform: "none" }}
          onClick={handleCreateProduct}
        >
          Create New
        </Button>
      </Box>
      <Grid container spacing={2} columns={12} sx={{mb: 4}}>
        <Grid size={12}>
          <ProductGrid />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Products;
