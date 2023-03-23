import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import EditSubCategoryModel from "./EditSubCategory.js";
import ProductTable from "./ProductTable";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        subCategory: action.payload.subCategory,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewSubCategory = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // subCategory/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, subCategory }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/subCategory/${id}`, {
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
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
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
              <Card.Title>{subCategory.name} Details</Card.Title>
              <div className="card-tools">
                <FaEdit style={{ color: "blue" }}
                  onClick={() => setModalShow(true)}
                />
              </div>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={4}>
                  <img
                    src={subCategory.sub_category_image}
                    alt=""
                    className="img-fluid"
                    width={"200px"}
                    // height={"200px"}
                  />
                </Col>
                <Col md={8}>
                  <Row>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Name</strong>
                      </p>
                      <p>{subCategory.name}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Description</strong>
                      </p>
                      <p>{subCategory.description}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Category</strong>
                      </p>
                      <p>
                        {subCategory.category ? (
                          subCategory.category.name
                        ) : (
                          <b>Category not set</b>
                        )}
                      </p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Created At</strong>
                      </p>
                      <p>{getDateTime(subCategory.createdAt)}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Last Update</strong>
                      </p>
                      <p>{getDateTime(subCategory.updatedAt)}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <ProductTable id={id} />
              </Row>
            </Card.Body>
          </Card>
          <EditSubCategoryModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </Container>
  );
};

export default ViewSubCategory;
