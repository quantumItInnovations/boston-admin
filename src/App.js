import { Store } from "./Store";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import ViewProfile from "./components/profile/ViewProfile";

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

  const [isExpanded, setExpandState] = useState(window.innerWidth > 768);
  const sidebarHandler = () => setExpandState((prev) => !prev);
  const pathname = window.location.pathname;

  const routeList = [
    { path: "/admin/dashboard", element: <Dashboard key={pathname} /> },
    { path: "/view-profile", element: <ViewProfile key={pathname} /> },
    { path: "/admin/users", element: <Users key={pathname} /> },
    { path: "/admin/view/user/:id", element: <ViewUser key={pathname} /> },
    { path: "/admin/category", element: <Category key={pathname} /> },
    { path: "/admin/category/create", element: <AddCategory key={pathname} /> },
    {
      path: "/admin/view/category/:id",
      element: <ViewCategory key={pathname} />,
    },
    { path: "/admin/subCategory", element: <SubCategory key={pathname} /> },
    {
      path: "/admin/subCategory/create",
      element: <AddSubCategory key={pathname} />,
    },
    {
      path: "/admin/view/subCategory/:id",
      element: <ViewSubCategory key={pathname} />,
    },
    { path: "/admin/products", element: <Products key={pathname} /> },
    { path: "/admin/product/create", element: <AddProduct key={pathname} /> },
    {
      path: "/admin/view/product/:id",
      element: <ViewProduct key={pathname} />,
    },
    {
      path: "/admin/reviews",
      element: <Review key={pathname} />,
    },
    { path: "/admin/promotions", element: <Promotions key={pathname} /> },
    {
      path: "/admin/promotion/create",
      element: <AddPromotion key={pathname} />,
    },
    {
      path: "/admin/view/promotion/:id",
      element: <ViewPromotion key={pathname} />,
    },
    { path: "/admin/orders", element: <Order key={pathname} /> },
    { path: "/admin/view/order/:id", element: <ViewOrder key={pathname} /> },
  ];

  return (
    <BrowserRouter>
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
          <Routes>
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
                element={
                  <AdminProtectedRoute>
                    <AnimatePresence initial={false}>{element}</AnimatePresence>
                  </AdminProtectedRoute>
                }
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
