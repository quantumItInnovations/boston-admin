import React, { Component, useContext } from "react";
import { Container } from "react-bootstrap";
import { Store } from "../../Store";

export default function Footer() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  return (
    <>
      {userInfo ? (
        <Container fluid className="footer-container">
          <footer className="text-center">
            <strong>
              Copyright © 2014-2023{" "}
              <a href="https://quantumitinnovation.com">Quantum It</a>.{" "}
            </strong>
            All rights reserved.
          </footer>
        </Container>
      ) : (
        <></>
      )}
    </>
  );
}
