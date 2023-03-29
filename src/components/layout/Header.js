import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Dropdown, Nav, Navbar } from "react-bootstrap";
import { Store } from "../../Store";
import { FaUserCircle, FaBars, FaUser } from "react-icons/fa";
import {GiHamburgerMenu} from 'react-icons/gi'

export default function Header({ sidebarHandler }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  return (
    <>
      {userInfo ? (
        <Navbar className="header">
          <Container fluid className="ps-0">
            <GiHamburgerMenu
              style={{ fontSize: "1.5rem", color: "#fff", marginLeft: "1.75rem" }}
              onClick={() => sidebarHandler()}
            />

            <Nav className="ms-auto">
              <Dropdown align="end">
                <Dropdown.Toggle
                  id="user_profile"
                  className="right-profile-logo"
                >
                  {/* <img
                    src={userInfo.profile_image}
                    alt="profile_img"
                    className="dropdown-logo"
                  /> */}
                  <FaUserCircle size={"25px"} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    Signed in as
                    <br />
                    <b>{`${userInfo.firstname} ${userInfo.lastname}`}</b>
                  </Dropdown.Header>

                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <Link to="/view-profile/" className="dropdown-item">
                      <FaUser className="me-2" /> Profile
                    </Link>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Container>
        </Navbar>
      ) : (
        <></>
      )}
    </>
  );
}
