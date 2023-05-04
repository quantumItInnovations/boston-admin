import React from "react";
import { Modal, Button, Container, Table } from "react-bootstrap";

const getColumn = (obj) => {
  const attributes = Object.keys(obj);
  const defaultFields = ["_id", "createdAt", "updatedAt", "pid", "__v"];
  return attributes.filter((attribute) => !defaultFields.includes(attribute));
};

export default function QuantityArray(props) {
  console.log(props);
  const { title, arr } = props;
  let columns;
  if (arr.length > 0) columns = Object.entries(props.column);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container
          className="small-container"
          style={{ backgroundColor: "#f4f6f9" }}
        >
          {arr && arr.length > 0 ? (
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>S.No</th>
                  {columns && columns.map(([col, _]) => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {arr &&
                  arr.map((row, i) => (
                    <tr key={i} className="odd">
                      <td className="text-center">{i + 1}</td>
                      {columns &&
                        columns.map(([_, col]) => {
                          return (
                            <>
                              <td key={col}>{row[col]}</td>
                            </>
                          );
                        })}
                    </tr>
                  ))}
              </tbody>
            </Table>
          ) : (
            "No Price List"
          )}
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
