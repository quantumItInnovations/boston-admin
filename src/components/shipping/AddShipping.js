import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Spinner,
} from "react-bootstrap";
import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";

export default function AddShipping() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [shipping, setShipping] = useState({
    label: "",
    charge: "",
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const resetForm = () => {
    setShipping({
      label: "",
      charge: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (shipping && !shipping.label) {
      toast.warning("Please select a label.", {
        position: toast.POSITION.BOTTOM_CENTER,
      })
      return;
    }
    try {
      setLoadingUpdate(true);
      const { data } = await axiosInstance.post(
        "/api/admin/shipping/create", shipping,
        { headers: { Authorization: token } }
      );

      // console.log("shipping add data", data);
      if (data.shipping) {
        toast.success("Shipping Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/shipping");
          setLoadingUpdate(false);
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoadingUpdate(false);
      }
    } catch (err) {
      setLoadingUpdate(false);
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid>
        <Row
          className="mt-2 mb-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        >
          <Col>
            <span style={{ fontSize: "xx-large" }}>Add Shipping</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as={"h4"}>Add Details</Card.Header>
              <Form onSubmit={submitHandler}>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="charge">
                    <Form.Label>Shipping Charge</Form.Label>
                    <Form.Control
                      value={shipping.charge}
                      onChange={(e) => setShipping({ ...shipping, charge: e.target.value })}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="mr-3">Label</Form.Label>
                    <Form.Select
                      aria-label="Select Label"
                      value={shipping.label}
                      onChange={(e) => setShipping({ ...shipping, label: e.target.value })}
                    >
                      <option key="blankChoice" hidden value>
                        Select Label
                      </option>
                      <option value="Local">Local</option>
                      <option value="Provincial">Provincial</option>
                      <option value="National">National</option>
                    </Form.Select>
                  </Form.Group>
                </Card.Body>
                <Card.Footer>
                  <Button type="submit" disabled={loadingUpdate ? true : false}>
                    {loadingUpdate ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Card.Footer>
                <ToastContainer />
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}
