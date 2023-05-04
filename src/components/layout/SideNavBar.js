import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
import "./SideNavBar.css";
import { RiDashboard2Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { MdCategory, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { TbNumbers } from "react-icons/tb";

import { FaStarHalfAlt, FaMagic, FaShoppingBasket, FaSignOutAlt} from 'react-icons/fa';

const linkList = [
  { icon: <RiDashboard2Fill className="icon-md" />, text: "Dashboard", url: "/admin/dashboard" },
  { icon: <MdCategory className="icon-md" />, text: "Category", url: "/admin/category" },
  { icon: <BiCategory className="icon-md" />, text: "Sub Category", url: "/admin/subCategory" },
  { icon: <MdOutlineProductionQuantityLimits className="icon-md" />, text: "Products", url: "/admin/products" },
  { icon: <FaShoppingBasket className="icon-md" />, text: "Orders", url: "/admin/orders"},
  { icon: <FaStarHalfAlt className="icon-md" />, text: "Reviews", url: "/admin/reviews" },
  { icon: <HiUsers className="icon-md" />, text: "Users", url: "/admin/users" },
  { icon: <FaMagic className="icon-md" />, text: "Promotions", url: "/admin/promotions" },
  { icon: <TbNumbers className="icon-md" />, text: "Quantity", url: "/admin/quantity" },
];

const active_text = {
  "Dashboard": "dashboard",
  "Category": "category",
  "Sub Category": "subCategory",
  "Products": "product",
  "Orders": "order",
  "Reviews": "review",
  "Users": "user",
  "Promotions": "promotion",
  "Quantity": "quantity",
};

export default function SideNavbar({ isExpanded }) {
  const pathname = window.location.pathname;
  const [activeLink, setActiveLink] = useState("Dashboard");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");

    navigate("/");
  };

  const activeLinkHandler = (text) => {
    // // console.log("text", active_text[text]);
    // // console.log(pathname.includes(active_text[text]));
    return pathname.includes(active_text[text]);
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
          <div className="brand-link">
            <img src="/LogoWhite.png" alt="" width={"50px"} height="auto" />
            <span className="brand-text ms-2 font-weight-light">
              Boston George
            </span>
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
                    Welcome{" "}
                    {userInfo
                      ? `${userInfo.firstname} ${userInfo.lastname}`
                      : "Back"}
                  </span>
                </Link>
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
                    } ${activeLinkHandler(text) && "active-item"}`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {/* <i className={icon}></i> */}
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}

                <li
                  className={`nav-item has-treeview ${
                    isExpanded ? "menu-item" : "menu-item menu-item-NX"
                  }`}
                >
                  <Link onClick={signoutHandler} to="/" className="nav-link">
                    {/* <i className="fas fa-sign-out-alt"></i> */}
                    <FaSignOutAlt className="icon-md" />
                    <p className="ms-2">Log Out</p>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
