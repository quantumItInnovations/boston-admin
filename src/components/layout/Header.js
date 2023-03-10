import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Store } from "../../Store";

export default function Header({sidebarHandler}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  return (
    <>
      {userInfo ? (
        <Navbar className="header">
          <Container fluid>
            <Nav className="me-auto">
              <Link className="nav-link header-link" onClick={() => sidebarHandler()}>
                <i className="fas fa-bars"></i>
              </Link>
              <Link to="/admin/dashboard" className="nav-link header-link">
                Home
              </Link>
            </Nav>
          </Container>
        </Navbar>
      ) : (
        <></>
      )}
    </>
  );
}
