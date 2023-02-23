import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
// import logo from "./images/dv.svg";
import "./SideNavBar.css";

export default function SideNavbar() {
  const [isExpanded, setExpendState] = useState(true);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  return (
    <>
      {userInfo ? (
        <div
          className={
            isExpanded
              ? "side-nav-container"
              : "side-nav-container side-nav-container-NX"
          }
        >
          <div className="nav-upper">
            <div className="nav-heading">
              {isExpanded && (
                <a href="index3.html" className="brand-link">
                  {/* <img src={logo} alt="" width={"50px"} height="auto" /> */}
                  <span className="brand-text ml-2 font-weight-light">
                    Boston George
                  </span>
                </a>
              )}
              <button
                className="sidebar-toggle-btn"
                onClick={() => setExpendState(!isExpanded)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
            <div className="sidebar">
              {/* Sidebar user panel (optional) */}
              <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                <div className="info">
                  <Link to="/view-profile" className="d-block">
                    {userInfo.profile_image && (
                      <img
                        src={userInfo.profile_image}
                        alt=""
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          marginRight: "0.5rem",
                        }}
                      />
                    )}
                    <span className="info-text">
                      Welcome {userInfo ? userInfo.fullname : "Back"}
                    </span>
                  </Link>
                </div>
              </div>
              {/* Sidebar Menu */}
              <nav className="mt-2">
                <ul
                  className="nav nav-pills nav-sidebar flex-column"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  {/* {userInfo.account_type === "admin" ? (
                    <> */}
                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link to="/admin/home" className="nav-link">
                      <i className="fa fa-id-card"></i>
                      {isExpanded && <p className="ml-2">Dashboard</p>}
                    </Link>
                  </li>
                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link to="/admin/users" className="nav-link">
                      <i className="fa fa-user-friends"></i>
                      {isExpanded && <p className="ml-2">Users</p>}
                    </Link>
                  </li>
                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link to="/admin/category" className="nav-link">
                      <i className="fa fa-store"></i>
                      {isExpanded && <p className="ml-2">Category</p>}
                    </Link>
                  </li>
                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link to="/admin/sub-category" className="nav-link">
                      <i className="fab fa-hubspot"></i>
                      {isExpanded && <p className="ml-2">Sub Category</p>}
                    </Link>
                  </li>
                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link to="/admin/products" className="nav-link">
                      <i className="fa fa-gift"></i>
                      {isExpanded && <p className="ml-2">Products</p>}
                    </Link>
                  </li>
                  {/* </>
                  ) : (
                    <>
                      <li
                        className={`nav-item has-treeview ${
                          isExpanded ? "menu-item" : "menu-item menu-item-NX"
                        }`}
                      >
                        <Link to="/shopOwner/shops" className="nav-link">
                          <i className="fa fa-store"></i>
                          {isExpanded && <p className="ml-2">Dive Shops</p>}
                        </Link>
                      </li>
                    </>
                  )} */}
                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link
                      onClick={signoutHandler}
                      to="/"
                      className="nav-link"
                    >
                      <i className="fas fa-sign-out-alt"></i>
                      {isExpanded && <p className="ml-2">Log Out</p>}
                    </Link>
                  </li>
                </ul>
              </nav>
              {/* /.sidebar-menu */}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
