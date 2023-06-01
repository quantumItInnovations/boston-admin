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

export default function AddFAQ() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [faq, setFaq] = useState({
    question: "",
    answer: "",
    type: "",
  });
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const resetForm = () => {
    setFaq({
      question: "",
      answer: "",
      type: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (faq && !faq.type) {
      toast.warning("Please select the type of FAQ.", {
        position: toast.POSITION.BOTTOM_CENTER,
      })
      return;
    }
    try {
      setLoadingUpdate(true);
      const { data } = await axiosInstance.post(
        "/api/admin/faq/create", faq,
        { headers: { Authorization: token } }
      );

      // console.log("faq add data", data);
      if (data.faq) {
        toast.success("FAQ Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/faqs");
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
            <span style={{ fontSize: "xx-large" }}>Add FAQ</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as={"h4"}>Add Details</Card.Header>
              <Form onSubmit={submitHandler}>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="question">
                    <Form.Label>Question</Form.Label>
                    <Form.Control
                      value={faq.question}
                      onChange={(e) => setFaq({ ...faq, question: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="answer">
                    <Form.Label>Answer</Form.Label>
                    <Form.Control
                      value={faq.answer}
                      onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="mr-3">Type</Form.Label>
                    <Form.Select
                      aria-label="Select Type"
                      value={faq.type}
                      onChange={(e) => setFaq({ ...faq, type: e.target.value })}
                    >
                      <option key="blankChoice" hidden value>
                        Select Type
                      </option>
                      <option value="top-most">Top Most</option>
                      <option value="shipping">Shipping</option>
                      <option value="payment">Payment</option>
                      <option value="ordering">Ordering</option>
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
