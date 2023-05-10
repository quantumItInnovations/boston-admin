import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from "../../Store";
import "./SideNavBar.css";
import { RiDashboard2Fill } from "react-icons/ri";
import { HiUsers } from "react-icons/hi";
import { MdCategory, MdOutlineProductionQuantityLimits } from "react-icons/md";
import { BiCategory, BiCircle } from "react-icons/bi";
import { TbNumbers, TbDiscount2 } from "react-icons/tb";

import { FaAngleDown, FaAngleUp, FaStarHalfAlt, FaMagic, FaShoppingBasket, FaSignOutAlt } from 'react-icons/fa';

const linkList = [
  { icon: <RiDashboard2Fill className="icon-md" />, text: "Dashboard", url: "/admin/dashboard" },
  { icon: <MdCategory className="icon-md" />, text: "Category", url: "/admin/category" },
  { icon: <BiCategory className="icon-md" />, text: "Sub Category", url: "/admin/subCategory" },
  { icon: <MdOutlineProductionQuantityLimits className="icon-md" />, text: "Products", url: "/admin/products" },
  { icon: <FaShoppingBasket className="icon-md" />, text: "Orders", url: "/admin/orders" },
  { icon: <FaStarHalfAlt className="icon-md" />, text: "Reviews", url: "/admin/reviews" },
  { icon: <HiUsers className="icon-md" />, text: "Users", url: "/admin/users" },
  { icon: <TbDiscount2 className="icon-md" />, text: "Sale", url: "/admin/sale" },
  { icon: <FaMagic className="icon-md" />, text: "Promotions", url: "/admin/promotions" },
  { icon: <TbNumbers className="icon-md" />, text: "Quantity", url: "/admin/quantity" },
];

const SaleLinkList = [
  { url: "/admin/sale/on-site", text: "On Site" },
  { url: "/admin/sale/product", text: "Product Sale" },
  { url: "/admin/sale/category", text: "Category Sale" },
  { url: "/admin/sale/subCategory", text: "SubCategory Sale" }
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
  "Sale": "sale",
  "On Site": "on-site",
  "Product Sale": "sale/product",
  "Category Sale": "sale/category",
  "SubCategory Sale": "sale/subCategory"
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
    // console.log("text", text,  active_text[text], activeLink);
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
                    className={`nav-item has-treeview ${isExpanded ? "menu-item" : "menu-item menu-item-NX"
                      } ${activeLinkHandler(text) && "active-item"}`}
                    onClick={() => setActiveLink(text)}
                  >
                    <Link to={url} className="nav-link">
                      {icon}
                      <p className="ms-2">{text}</p>
                    </Link>
                  </li>
                ))}

                {/* <li
                  className={`nav-item has-treeview ${isExpanded ? "menu-item" : "menu-item menu-item-NX"
                    }`}
                >
                  <Link className="dropdown-nav-link">
                    <TbDiscount2 className="icon-md" />
                    <p className="ms-2">Sale
                      <FaAngleDown className="right icon-md" />
                    </p>
                  </Link>
                  <ul className="nav nav-treeview" style={{ display: "block" }}>
                    {SaleLinkList.map(({ url, text }) =>
                      <li key={url} className={`nav-item ${activeLinkHandler(text) && "active-item"}`}
                      onClick={() => setActiveLink(text)}>
                        <Link to={url} className="nav-link sub-nav-link">                        <BiCircle className="icon-md" />
                          <p className="ms-2">{text}</p>
                        </Link>
                      </li>)}

                  </ul>
                </li> */}
                <li
                  className={`nav-item has-treeview ${isExpanded ? "menu-item" : "menu-item menu-item-NX"
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
