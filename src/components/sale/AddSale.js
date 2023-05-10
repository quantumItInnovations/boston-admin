import React, { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { promotionReducer as reducer } from "../../reducers/promotion";
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

export default function AddSale() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [{ loading, error, categories, products }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [input, setInput] = useState({
    type: "",
    discount: "",
    id: "",
    start_date: "",
    end_date: "",
  });

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  }

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const resetForm = () => {
    setInput({
      type: "",
      discount: "",
      id: "",
      start_date: "",
      end_date: "",
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.type) {
      toast.warning("Please select sale type.", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }
    if (input.type === 'product' && !input.id) {
      toast.warning("Please select a product.", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }
    if (input.type === 'category' && !input.id) {
      toast.warning("Please select a category.", {
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }
    try {
      console.log({ input })
      setLoadingUpdate(true);
      const { data } = await axiosInstance.post(
        "/api/admin/sale/create", input,
        { headers: { Authorization: token } }
      );

      // console.log("quantity add data", data);
      if (data.sale) {
        toast.success("Sale Created Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/sale");
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

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get("/api/admin/all/?product=true");
        // console.log("add promotion data", res);

        dispatch({ type: "FETCH_ADD_PROMOTION_SUCCESS", payload: res.data });
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
  }, [token]);

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
            <span style={{ fontSize: "xx-large" }}>Create Sale</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as={"h4"}>Add Details</Card.Header>
              <Form onSubmit={submitHandler}>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="type">
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      name="type"
                      value={input.type}
                      onChange={inputHandler}
                      aria-label="Default select example"
                    >
                      <option key="blankChoice" hidden value>
                        Select Sale Type
                      </option>
                      <option value="*">On Site</option>
                      <option value="category">Category</option>
                      <option value="product">Product</option>
                    </Form.Select>
                  </Form.Group>
                  {input.type === 'product' && <Form.Group className="mb-3" controlId="id">
                    <Form.Label>Product</Form.Label>
                    <Form.Select
                      name="id"
                      value={input.id}
                      onChange={inputHandler}
                      aria-label="Default select example"
                    >
                      <option key="blankChoice" hidden value>
                        Select Product
                      </option>
                      {products && products.map(prod =>
                        <option key={prod._id} value={prod._id}>{prod.name}</option>
                      )}
                    </Form.Select>
                  </Form.Group>}
                  {input.type === 'category' && <Form.Group className="mb-3" controlId="id">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="id"
                      value={input.id}
                      onChange={inputHandler}
                      aria-label="Default select example"
                    >
                      <option key="blankChoice" hidden value>
                        Select Category
                      </option>
                      {categories && categories.map(cat =>
                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                      )}
                    </Form.Select>
                  </Form.Group>}
                  <Form.Group className="mb-3" controlId="discount">
                    <Form.Label>Discount</Form.Label>
                    <Form.Control
                      name="discount"
                      value={input.discount}
                      placeholder="Discount"
                      onChange={inputHandler}
                      required
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="start_date">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                          name="start_date"
                          value={input.start_date}
                          type="date"
                          onChange={inputHandler}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3" controlId="end_date">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                          name="end_date"
                          value={input.end_date}
                          type="date"
                          onChange={inputHandler}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
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
              </Form>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
