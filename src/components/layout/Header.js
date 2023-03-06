import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Store } from "../../Store";

export default function Header() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  return (
    <>
      {userInfo ? (
        <Navbar className="header">
          <Container>
            <Nav className="me-auto">
              <Link to="/admin/home" className="nav-link header-link">
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
