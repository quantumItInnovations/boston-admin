import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import EditProductModel from "./EditProduct.js";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, product: action.payload.product };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

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

        const { data } = await axios.get(
          `http://52.91.135.217:5000/api/product/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
    return ()=>{}
  }, [id]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };
  return (
    <Container className="py-3">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Card>
            <Card.Header>
              <Card.Title>{product.name} Details</Card.Title>
              <div className="card-tools">
                <i
                  className="fa fa-edit"
                  style={{ color: "blue" }}
                  onClick={() => setModalShow(true)}
                ></i>
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <img
                    src={product.product_images}
                    alt=""
                    width={"200px"}
                    height={"200px"}
                  />
                </Col>
                <Col md={8}>
                  <Row>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Name</strong>
                      </p>
                      <p>{product.name}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Description</strong>
                      </p>
                      <p>{product.description}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Amount</strong>
                      </p>
                      <p>{product.amount}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Stock</strong>
                      </p>
                      {product.stock ? (
                        <TiTick className="green" />
                      ) : (
                        <ImCross className="red" />
                      )}
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Category</strong>
                      </p>
                      <p>{product.category ? product.category.name : <b>Category not set</b>}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Sub Category</strong>
                      </p>
                      <p>{product.sub_category ? product.sub_category.name : <b>Sub category not set</b>}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Created At</strong>
                      </p>
                      <p>{getDateTime(product.createdAt)}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Last Update</strong>
                      </p>
                      <p>{getDateTime(product.updatedAt)}</p>
                    </Col>
                  </Row>
                </Col>
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
  );
};

export default ViewProduct;
