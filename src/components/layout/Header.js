import React, { Component, useContext } from "react";
import { Link } from "react-router-dom";
import {Nav, NavDropdown} from 'react-bootstrap'
import { Store } from '../../Store';

export default function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  return (
    <>
      {userInfo ? (
        <div>
          <nav className="header navbar navbar-expand navbar-white navbar-light">
            {/* Left navbar links */}
            <ul className="navbar-nav">
              {/* <li className="nav-item">
                <a
                  className="nav-link header-link"
                  data-widget="pushmenu"
                  href="www.google.com"
                >
                  <i className="fas fa-bars" />
                </a>
              </li> */}
              <li className="nav-item d-none d-sm-inline-block">
                <Link to="/admin/home" className="nav-link header-link">
                  Home
                </Link>
              </li>
            </ul>
            {/* SEARCH FORM */}

            {/* Right navbar links */}
            
            <ul className="navbar-nav ml-auto">
       {/* Notifications Dropdown Menu */}
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle right-profile-logo" data-toggle="dropdown" href="#">
            <img src={userInfo.profile_image} alt="profile_img" className="dropdown-logo" />
          </a>
          <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
            <span className="dropdown-item dropdown-header">Signed in as<br/><b>{userInfo.fullname}</b></span>
            <div className="dropdown-divider"></div>
            <Link to="/view-profile/" className="dropdown-item">
              <i className="fas fa-user mr-2"></i> Profile
            </Link>
            {/* <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <i className="fas fa-users mr-2"></i> 8 friend requests
              <span className="float-right text-muted text-sm">12 hours</span>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item">
              <i className="fas fa-file mr-2"></i> 3 new reports
              <span className="float-right text-muted text-sm">2 days</span>
            </a>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item dropdown-footer">See All Notifications</a> */}
          </div>
        </li>
        {/* <li className="nav-item">
          <a className="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
            <i className="fas fa-th-large"></i>
          </a>
        </li> */}
      </ul>
          </nav>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
