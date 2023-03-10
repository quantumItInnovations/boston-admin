import { Store } from "./Store";
import { useContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import AdminProtectedRoute from "./components/protectedRoute/AdminProtectedRoute";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import SideNavbar from "./components/layout/SideNavBar";
import NotFound from "./components/layout/NotFound";

import ViewProfile from "./components/ViewProfile";

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

import AdminLoginScreen from "./components/AdminLoginScreen";
import Dashboard from "./components/layout/Dashboard";
import UnprotectedRoute from "./components/protectedRoute/UnprotectedRoute";

const Children = ({ child }) => (
  <AdminProtectedRoute>{child}</AdminProtectedRoute>
);
function App() {
  const { state } = useContext(Store);
  const { token } = state;

  const sibebarRef = useRef(null);
  const [isExpanded, setExpandState] = useState(true);

  const sidebarHandler = () => setExpandState((prev) => !prev);

  const handleClickOutside = (e) => {
    if (sibebarRef.current && !sibebarRef.current.contains(e.target)) {
      // Clicked outside the side navigation bar, close it
      // Implement your close side navigation bar logic here
      setExpandState(false);
      // sidebarHandler();
    }
  };

  const mediaQueryHandler = (mediaQuery) => {
    
    if (mediaQuery.matches)
      document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
  };
  window.matchMedia("(max-width: 768px)").addEventListener("change", mediaQueryHandler);

  // useEffect(() => {
  //   // Add event listener to the document object
  //   console.log(w)
  //   if(w.matches) document.addEventListener("mousedown", handleClickOutside);

  //   // Remove event listener when the component unmounts
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [w]);

  const pathname = window.location.pathname;
  console.log(pathname);
  return (
    <BrowserRouter>
      <div className="main-wrapper">
        {isExpanded && token && <div className="sidebar-overlay"></div>}
        <div className="sidebar-wrapper" ref={sibebarRef}>
          {/* <Menu/> */}
          <SideNavbar sidebarHandler={sidebarHandler} isExpanded={isExpanded} />
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
            <Route
              path="/admin/dashboard"
              element={<Children child={<Dashboard />} />}
            />

            <Route
              path="/view-profile"
              element={<Children child={<ViewProfile />} />}
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
            <Route
              path="/admin/promotion/create"
              element={<Children child={<AddPromotion />} />}
            />
            <Route
              path="/admin/view/promotion/:id"
              element={<Children child={<ViewPromotion />} />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
