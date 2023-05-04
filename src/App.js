import { Store } from "./Store";
import { useContext, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import ViewProfile from "./components/profile/ViewProfile";

import Quantity from "./components/quantity/Quantity";
import AddQuantity from "./components/quantity/AddQuantity";

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
import AddPromotion from "./components/promotion/AddPromotion";
import ViewPromotion from "./components/promotion/ViewPromotion";

import Users from "./components/user/Users";
import ViewUser from "./components/user/ViewUser";

import Review from "./components/review/Review";

import AdminLoginScreen from "./components/AdminLoginScreen";
import Dashboard from "./components/layout/Dashboard";
import UnprotectedRoute from "./components/protectedRoute/UnprotectedRoute";
import Order from "./components/order/Orders";
import ViewOrder from "./components/order/ViewOrder";

function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const pageLocation = useLocation();

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);

  const routeList = [
    { path: "/admin/dashboard", element: <Dashboard /> },
    { path: "/view-profile", element: <ViewProfile /> },
    { path: "/admin/users", element: <Users /> },
    { path: "/admin/view/user/:id", element: <ViewUser /> },
    { path: "/admin/quantity", element: <Quantity /> },
    { path: "/admin/quantity/create", element: <AddQuantity /> },
    { path: "/admin/category", element: <Category /> },
    { path: "/admin/category/create", element: <AddCategory /> },
    { path: "/admin/view/category/:id", element: <ViewCategory /> },
    { path: "/admin/subCategory", element: <SubCategory /> },
    { path: "/admin/subCategory/create", element: <AddSubCategory /> },
    { path: "/admin/view/subCategory/:id", element: <ViewSubCategory /> },
    { path: "/admin/products", element: <Products /> },
    { path: "/admin/product/create", element: <AddProduct /> },
    { path: "/admin/view/product/:id", element: <ViewProduct /> },
    { path: "/admin/reviews", element: <Review /> },
    { path: "/admin/promotions", element: <Promotions /> },
    { path: "/admin/promotion/create", element: <AddPromotion /> },
    { path: "/admin/view/promotion/:id", element: <ViewPromotion /> },
    { path: "/admin/orders", element: <Order /> },
    { path: "/admin/view/order/:id", element: <ViewOrder /> },
  ];

  return (
    <div className="main-wrapper">
      {isExpanded && token && (
        <div className="sidebar-overlay" onClick={sidebarHandler}></div>
      )}
      <div className="sidebar-wrapper">
        {/* <Menu/> */}
        <SideNavbar isExpanded={isExpanded} />
      </div>
      <div
        className={`body-wrapper ${isExpanded ? "mini-body" : "full-body"} ${
          token ? "" : "m-0"
        } d-flex flex-column`}
      >
        <Header sidebarHandler={sidebarHandler} />
        <Routes location={pageLocation} key={pageLocation.pathname}>
          <Route
            path="/"
            element={
              <UnprotectedRoute>
                <AdminLoginScreen />
              </UnprotectedRoute>
            }
          />
          {routeList.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<AdminProtectedRoute>{element}</AdminProtectedRoute>}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;
