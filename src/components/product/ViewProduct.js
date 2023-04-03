import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewProductReducer as reducer } from "../../reducers/product";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import EditProductModel from "./EditProduct.js";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import ProductReviewTable from "./ProductReviewTable";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

const ViewProduct = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // product/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/product/${id}`, {
          headers: { Authorization: token },
        });
        console.log(data);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
    return () => {};
  }, [id]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };
  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Card>
              <Card.Header>
                <Card.Title>
                  {loading ? <Skeleton /> : product.name} Details
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={4}>
                    {loading ? (
                      <Skeleton height={200} />
                    ) : (
                      <img
                        src={product.product_images[0]}
                        alt=""
                        className="img-fluid"
                        width={"200px"}
                        // height={"200px"}
                      />
                    )}
                  </Col>
                  <Col md={8}>
                    <Row>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Name</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : product.name}</p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Description</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : product.description}</p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Amount</strong>
                        </p>
                        <p>{loading ? <Skeleton /> : product.amount}</p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Stock</strong>
                        </p>
                        {loading ? (
                          <Skeleton />
                        ) : product.stock ? (
                          <TiTick className="green" />
                        ) : (
                          <ImCross className="red" />
                        )}
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Category</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : product.category ? (
                            product.category.name
                          ) : (
                            <b>Category not set</b>
                          )}
                        </p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Sub Category</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : product.sub_category ? (
                            product.sub_category.name
                          ) : (
                            <b>Sub category not set</b>
                          )}
                        </p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(product.createdAt)
                          )}
                        </p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(product.updatedAt)
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <ProductReviewTable id={id} />
                </Row>
              </Card.Body>
            </Card>
            <EditProductModel
              show={modalShow}
              onHide={() => setModalShow(false)}
            />
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewProduct;
