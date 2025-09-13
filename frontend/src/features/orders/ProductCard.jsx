import React from "react";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Box,
  TextField,
  useTheme,
} from "@mui/material";
import { Add, Remove, ShoppingCart } from "@mui/icons-material";

const capitalizeWords = (string) => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const ProductCard = ({
  name,
  price,
  product,
  handleAddToCart,
  handleQtyChange,
  inCart,
  qty,
}) => {
  const theme = useTheme();

  return (
    <Card
      variant="outlined"
      sx={{
        p: 0.8,
        borderRadius: "8px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 5px 10px rgba(255, 255, 255, 0.11)"
            : theme.shadows[1],
      }}
    >
      <CardContent
        sx={{
          padding: "6px",
          "&:last-child": {
            paddingBottom: 0,
          },
        }}
      >
        <Stack direction="column" justifyContent="space-between" gap={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle2" fontWeight={600}>
              {capitalizeWords(name)}
            </Typography>
            <IconButton
              size="small"
              color="success"
              onClick={() => handleAddToCart(product)}
              disabled={inCart || !qty || qty < 1}
            >
              <ShoppingCart />
            </IconButton>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="subtitle1" sx={{ mt: 1 }}>
              ${price}
            </Typography>
            <TextField
              type="number"
              size="small"
              value={qty === 0 ? "" : qty}
              onChange={(e) => {
                let num = Number(e.target.value);

                if (isNaN(num) || num < 0) {
                  num = 0;
                }

                handleQtyChange(product.id, num);
              }}
              sx={{
                width: 60,
                "& fieldset": {
                  borderRadius: "4px", // must match root borderRadius
                  borderColor: theme.palette.mode === "dark" ? "lightgray" : "gray", // 🔹 Light gray border
                },
                "&:hover fieldset": {
                  borderColor: "gray", // 🔹 Darker gray on hover
                },
                "&.Mui-focused fieldset": {
                  borderColor: "gray", // 🔹 Keep blue when focused
                },
                "& .MuiInputBase-root": {
                  // Targets the input container
                  padding: 0.35,
                },
                "& .MuiInput-input": {
                  // Targets the actual input element
                  padding: 0,
                },
              }}
              slotProps={{
                htmlInput: {
                  // Replaces inputProps
                  style: {
                    padding: 0,
                    textAlign: "center",
                  },
                },
              }}
              /* inputProps={{
                style: {
                  padding: 0, // Additional padding removal for number input
                  textAlign: "center", // Optional: centers the number
                },
              }} */
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
