import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function EditShippingModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = props; // shipping/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [shipping, setShipping] = useState({
    label: "",
    charge: "",
    description: "",
  });

  const resetForm = () => {
    setShipping({
      label: "",
      charge: "",
      description: "",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/shipping/${id}`, {
          headers: { Authorization: token },
        });
        // // console.log(data);

        const { charge, label, description } = data.shipping;
        setShipping({ charge, label, description });

        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (shipping && !shipping.label) {
      toast.warning("Please select a label.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axiosInstance.put(
        `/api/admin/shipping/${id}`,
        shipping,
        { headers: { Authorization: token } }
      );

      // console.log("shipping update data", data);
      props.shippingHandler(id, shipping);
      if (data.shipping) {
        toast.success("Shipping Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
          autoClose: 2000,
        });

        resetForm();
        setTimeout(() => {
          props.onHide();
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }

      dispatch({ type: "UPDATE_SUCCESS" });
    } catch (err) {
      props.onHide();
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Shipping Charge Details
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="shipvalue">
              <Form.Label>Shipping Value to avoid Shipping Charge</Form.Label>
              <Form.Control
                value={shipping.shipvalue}
                onChange={(e) =>
                  setShipping({ ...shipping, shipvalue: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="charge">
              <Form.Label>Shipping Charge</Form.Label>
              <Form.Control
                value={shipping.charge}
                onChange={(e) =>
                  setShipping({ ...shipping, charge: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="desc">
              <Form.Label>Shipping Description</Form.Label>
              <Form.Control
                value={shipping.description}
                onChange={(e) =>
                  setShipping({ ...shipping, description: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mr-3">Label</Form.Label>
              <Form.Select
                aria-label="Select Label"
                value={shipping.label}
                onChange={(e) =>
                  setShipping({ ...shipping, label: e.target.value })
                }
              >
                <option key="blankChoice" hidden value>
                  Select Label
                </option>
                <option value="Local">Local</option>
                <option value="Provincial">Provincial</option>
                <option value="National">National</option>
              </Form.Select>
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={loadingUpdate ? true : false}
          >
            Submit
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
