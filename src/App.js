import { Store } from "./Store";
import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import Category from "./components/category/Category";
import AddCategory from "./components/category/AddCategory";
import ViewCategory from "./components/category/ViewCategory";

import SubCategory from "./components/subCategory/SubCategory";
import AddSubCategory from "./components/subCategory/AddSubCategory";
import ViewSubCategory from "./components/subCategory/ViewSubCategory";

import Products from "./components/product/Products";
import AddProduct from "./components/product/AddProduct";
import ViewProduct from "./components/product/ViewProduct";

import Promotions from "./components/promotion/Promotion";

import Users from "./components/user/Users";
import ViewUser from "./components/user/ViewUser";

import AdminLoginScreen from "./components/AdminLoginScreen";
import Dashboard from "./components/layout/Dashboard";

const Children = ({ child }) => (
  <AdminProtectedRoute>{child}</AdminProtectedRoute>
);
function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const pathname = window.location.pathname;
  console.log(pathname);

  return (
    <BrowserRouter>
      <div className="main-wrapper">
        <div className="sidebar-wrapper">
          {/* <Menu/> */}
          <SideNavbar />
        </div>
        <div className="body-wrapper">
          <div style={{ width: "100%" }}>
            <Header />
            <Routes>
              <Route path="/" element={<AdminLoginScreen />} />
              <Route
                path="/admin/dashboard"
                element={<Children child={<Dashboard />} />}
              />

              <Route
                path="/admin/users"
                element={<Children child={<Users />} />}
              />
              <Route
                path="/admin/view/user/:id"
                element={<Children child={<ViewUser />} />}
              />

              <Route
                path="/admin/category"
                element={<Children child={<Category />} />}
              />
              <Route
                path="/admin/category/create"
                element={<Children child={<AddCategory />} />}
              />
              <Route
                path="/admin/view/category/:id"
                element={<Children child={<ViewCategory />} />}
              />

              <Route
                path="/admin/sub-category"
                element={<Children child={<SubCategory />} />}
              />
              <Route
                path="/admin/sub-category/create"
                element={<Children child={<AddSubCategory />} />}
              />
              <Route
                path="/admin/view/sub-category/:id"
                element={<Children child={<ViewSubCategory />} />}
              />

              <Route
                path="/admin/products"
                element={<Children child={<Products />} />}
              />
              <Route
                path="/admin/product/create"
                element={<Children child={<AddProduct />} />}
              />
              <Route
                path="/admin/view/product/:id"
                element={<Children child={<ViewProduct />} />}
              />

              <Route
                path="/admin/product/create"
                element={<Children child={<AddProduct />} />}
              />

              <Route
                path="/admin/promotions"
                element={<Children child={<Promotions />} />}
              />

              <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
