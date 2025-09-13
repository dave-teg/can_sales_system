import React from "react";
import { Box, Button, Typography, Tooltip, Grid } from "@mui/material";
import CategoryGrid from "./CategoryGrid";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const navigate = useNavigate();

  const handleCreateCategory = () => {
    navigate("/dashboard/categories/new");
  };

  return (
    <Box sx={{ width: "100%", maxWidth: { sm: "100%", md: "1700px" } }}>
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Categories
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ textTransform: "none" }}
          onClick={handleCreateCategory}
        >
          Create New
        </Button>
      </Box>
      <Grid container spacing={2} columns={12}>
        <Grid size={12}>
          <CategoryGrid />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Categories;
