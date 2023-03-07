import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
// import logo from "./images/dv.svg";
import "./SideNavBar.css";

const linkList = [
  { icon: "fa fa-id-card", text: "Dashboard", url: "/admin/dashboard" },
  { icon: "fa fa-user-friends", text: "Users", url: "/admin/users" },
  { icon: "fa fa-store", text: "Category", url: "/admin/category" },
  { icon: "fab fa-hubspot", text: "Sub Category", url: "/admin/sub-category" },
  { icon: "fa fa-gift", text: "Products", url: "/admin/products" },
  { icon: "fas fa-magic", text: "Promotions", url: "/admin/promotions" },
];
export default function SideNavbar() {
  const [activeLink, setActiveLink] = useState("Dashboard");
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
          <div
            className="toggle-sidebar"
            onClick={() => setExpendState(!isExpanded)}
          ></div>
          <div className="nav-upper">
            <div
              className={`nav-heading ${
                isExpanded
                  ? "justify-content-between"
                  : "justify-content-center"
              }`}
            >
              {isExpanded && (
                <Link to="/admin/dashboard" className="brand-link">
                  {/* <img src={logo} alt="" width={"50px"} height="auto" /> */}
                  <span className="brand-text ms-2 font-weight-light">
                    Boston George
                  </span>
                </Link>
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
                  {isExpanded && (
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
                        Welcome{" "}
                        {userInfo
                          ? `${userInfo.firstname} ${userInfo.lastname}`
                          : "Back"}
                      </span>
                    </Link>
                  )}
                </div>
              </div>
              {/* Sidebar Menu */}
              <nav className="mt-2">
                <ul
                  className="nav-pills nav-sidebar px-0 d-flex flex-column flex-wrap"
                  data-widget="treeview"
                  role="menu"
                  data-accordion="false"
                >
                  {linkList.map(({ icon, text, url }) => (
                    <li
                      key={url}
                      className={`nav-item has-treeview ${
                        isExpanded ? "menu-item" : "menu-item menu-item-NX"
                      } ${activeLink === text && "active-item"}`}
                      onClick={() => setActiveLink(text)}
                    >
                      <Link to={url} className="nav-link">
                        <i className={icon}></i>
                        {isExpanded && <p className="ms-2">{text}</p>}
                      </Link>
                    </li>
                  ))}

                  <li
                    className={`nav-item has-treeview ${
                      isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                  >
                    <Link onClick={signoutHandler} to="/" className="nav-link">
                      <i className="fas fa-sign-out-alt"></i>
                      {isExpanded && <p className="ms-2">Log Out</p>}
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
