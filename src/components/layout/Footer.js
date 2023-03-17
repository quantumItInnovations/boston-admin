import React, { useContext } from "react";
import { Container } from "react-bootstrap";
import { Store } from "../../Store";

export default function Footer() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const d = new Date();
  return (
    <>
      {userInfo ? (
        <Container fluid className="p-0 mt-auto">
          <footer className="text-center">
            <strong>
              Copyright © 2014-{`${d.getFullYear()} `}
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
