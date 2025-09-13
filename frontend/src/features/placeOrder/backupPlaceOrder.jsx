import { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { ShoppingCart } from "@mui/icons-material";
import ProductCard from "./ProductCard";
import OrderSummary from "./OrderSummary";

const categories = [
  { id: 1, name: "Beer" },
  { id: 2, name: "Wine" },
  { id: 3, name: "Gin" },
  { id: 4, name: "Whisky" },
  { id: 5, name: "Bourbon" },
  { id: 6, name: "Bourbon" },
  { id: 7, name: "Bourbon" },
];

const products = [
  { id: 1, categoryId: 1, name: "Chicken Tikka", price: 80 },
  { id: 2, categoryId: 1, name: "Paneer Tikka", price: 60 },  
  { id: 3, categoryId: 2, name: "Samosa", price: 50 },
  { id: 4, categoryId: 2, name: "Samosa", price: 50 },
  { id: 5, categoryId: 3, name: "Samosa", price: 50 },
  { id: 6, categoryId: 3, name: "Samosa", price: 50 },
  { id: 7, categoryId: 1, name: "Samosa", price: 20 },
];

const PlaceOrder = () => {
  const [value, setValue] = useState(categories[0].id);
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  const handleQtyChange = (id, value) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAddToCart = (product) => {
    const qty = quantities[product.id];
    if (!qty || qty < 1) return;

    const exists = cart.find((item) => item.product_id === product.id);
    if (exists) return;

    setCart((prev) => [...prev, { product_id: product.id, ...product, quantity: qty }]);
    setQuantities((prev) => ({ ...prev, [product.id]: "" })); // Reset input
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.product_id !== id));
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: { sm: "100%", md: "1300px" },
        mx: "auto",
        overflowX: "hidden",
      }}
    >
      <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
        Place Order
      </Typography>

      <Grid container spacing={2}>
        {/* Left Section - Categories */}
        <Grid size={8}>
          <Box
            sx={{
              width: "100%",
              typography: "body1",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            <TabContext value={value}>
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: "divider",
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  backgroundColor: "background.paper",
                }}
              >
                <TabList
                  onChange={handleTabChange}
                  aria-label="Categories"
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {categories.map((category) => (
                    <Tab
                      label={category.name}
                      key={category.id}
                      value={category.id}
                    />
                  ))}
                </TabList>
              </Box>

              {categories.map((category) => (
                <TabPanel
                  key={category.id}
                  value={category.id}
                  sx={{ py: 2, px: 1 }}
                >
                  <Grid container spacing={2}>
                    {products
                      .filter((product) => product.categoryId === category.id)
                      .map((product) => {
                        const inCart = cart.some(
                          (item) => item.id === product.id
                        );
                        const qty = quantities[product.id] || 0;
                        return (
                          <Grid size={4}>
                            <ProductCard
                              key={product.id}
                              product={product}
                              handleAddToCart={handleAddToCart}
                              handleQtyChange={handleQtyChange}
                              name={product.name}
                              price={product.price}
                              inCart={inCart}
                              qty={qty}
                            />
                          </Grid>
                        );
                      })}
                  </Grid>
                </TabPanel>
              ))}
            </TabContext>
          </Box>
        </Grid>

        {/* Right Section - Order Summary */}
        <Grid size={4}>
          <OrderSummary cart={cart} setCart={setCart} handleRemoveFromCart={handleRemoveFromCart} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PlaceOrder;
