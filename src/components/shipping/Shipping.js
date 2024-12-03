import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { shippingReducer as reducer } from "../../reducers/shipping";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import { Button, Card, Container, ListGroup, Table } from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import EditShippingModel from "./EditShipping";
import CustomSkeleton from "../layout/CustomSkeleton";

function formatText(text) {
  // Format text starting with a dollar sign ($) as bold
  const formattedText = text.replace(/\$(\d+)/g, "<strong>$&</strong>");

  // Format "Note:-" as bold
  const finalText = formattedText.replace(
    /Note:-/g,
    "<strong><br/><br/>Note:-</strong>"
  );

  console.log({ finalText });
  return finalText;
}

export default function Shipping() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [del, setDel] = useState(false);

  const [modalShow, setModalShow] = useState(false);
  const [shippingId, setShippingId] = useState();
  const showModelHandler = (id) => {
    console.log({ id });
    setModalShow(true);
    setShippingId(id);
  };

  const [{ loading, error, shippings }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const deleteShipping = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this shipping?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/shipping/${id}`, {
          headers: { Authorization: token },
        });
        setDel(false);
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axiosInstance.get(`/api/shipping/all/`, {
          headers: { Authorization: token },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del]);

  const setNewShipping = (id, newShipping) => {
    console.log({ id, newShipping });
    const idx = shippings.findIndex((x) => x._id === id);
    shippings[idx].label = newShipping.label;
    shippings[idx].charge = newShipping.charge;
    shippings[idx].description = newShipping.description;
    shippings[idx].shipvalue = newShipping.shipvalue;
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <Button
                onClick={() => {
                  navigate(`/admin/shipping/create`);
                }}
                type="success"
                className="btn btn-primary btn-block mt-1"
              >
                Add Shipping
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Case</th>
                    <th>Charge</th>
                    <th>Ship Value</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={3} column={4} />
                  ) : (
                    shippings &&
                    shippings.map((shipping, i) => (
                      <tr key={shipping._id} className="odd">
                        <td className="text-center">{i + 1}</td>
                        <td>{shipping.label}</td>
                        <td>{shipping.charge}</td>
                        <td>{shipping.shipvalue}</td>
                        <td>
                          <Button
                            onClick={() => showModelHandler(shipping._id)}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteShipping(shipping._id);
                            }}
                            type="danger"
                            className="btn btn-danger ms-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>

              <h3 className="my-3">Shipping Charges Details</h3>
              <ListGroup as="ol" numbered className="mt-3">
                {loading ? (
                  <CustomSkeleton resultPerPage={3} column={1} />
                ) : (
                  shippings &&
                  shippings.map(({ label, description }, i) => (
                    <ListGroup.Item
                      as="li"
                      className="d-flex justify-content-between align-items-start"
                    >
                      <div className="ms-2 me-auto">
                        <div className="fw-bold">{label}</div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: formatText(description),
                          }}
                        ></div>
                      </div>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
        <EditShippingModel
          show={modalShow}
          onHide={() => setModalShow(!modalShow)}
          shippingHandler={setNewShipping}
          id={shippingId}
        />
        {!modalShow && <ToastContainer />}
      </Container>
    </motion.div>
  );
}
