// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./layout/Layout";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";
import Dashboard from "./features/analytics/Dashboard";
import DashboardLayout from "./layout/DashBoard2";
import PlaceOrder from "./features/orders/PlaceOrder";
import Products from "./features/products/Products";
import Categories from "./features/categories/Categories";
import NewCategory from "./features/categories/NewCategory";
import EditCategory from "./features/categories/EditCategory";
import OrderDetails from "./features/orders/OrderDetails";
import NewProduct from "./features/products/NewProduct";
import EditProduct from "./features/products/EditProduct";
import Users from "./features/users/Users";
import EditUser from "./features/users/EditUser";
import RequireAuth from "./features/auth/RequireAuth";
import PersistLogin from "./features/auth/PersistLogin";
import SessionGuard from "./features/auth/SessionGuard";
import OrderPage from "./features/orders/OrderPage";
import MissingPage from "./components/MissingPage";
import Waiters from "./features/waiters/Waiters"
import EditWaiter from "./features/waiters/EditWaiter"
import NewWaiter from "./features/waiters/NewWaiter"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<SessionGuard />}>
            <Route element={<PersistLogin />}>
              <Route element={<RequireAuth allowedRoles={["user", "admin"]} />}>
                <Route path="dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="order">
                    <Route index element={<OrderPage />} />
                    <Route path="new" element={<PlaceOrder />} />
                    <Route path=":id" element={<OrderDetails />} />
                  </Route>
                  <Route path="products">
                    <Route index element={<Products />} />
                    <Route path="new" element={<NewProduct />} />
                    <Route path=":id" element={<EditProduct />} />
                  </Route>
                  <Route path="categories">
                    <Route index element={<Categories />} />
                    <Route path="new" element={<NewCategory />} />
                    <Route path=":id" element={<EditCategory />} />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={"admin"} />}>
                    <Route path="users">
                      <Route index element={<Users />} />
                      <Route path=":id" element={<EditUser />} />
                    </Route>
                  </Route>
                  <Route path="waiters">
                    <Route index element={<Waiters />} />
                    <Route path=":id" element={<EditWaiter />} />
                    <Route path="new" element={<NewWaiter />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          {/* Catch-All Route */}
          <Route path="*" element={<MissingPage />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}
