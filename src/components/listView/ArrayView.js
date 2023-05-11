import React from "react";
import { Modal, Button, Container, Table } from "react-bootstrap";

export default function ArrayView(props) {
  // console.log("props", props);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Products List
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container
          className="small-container"
          style={{ backgroundColor: "#f4f6f9" }}
        >
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product Name</th>
                <th>Variant Type</th>
                <th>Variant Amount</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {props.arr &&
                props.arr.map(({ product, quantity }, i) => (
                  <tr key={product._id} className="odd">
                    <td className="text-center">{i + 1}</td>
                    <td>{product?.pid?.name}</td>
                    <td>{product?.qname}</td>
                    <td>{product?.amount}</td>
                    <td>{quantity}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
