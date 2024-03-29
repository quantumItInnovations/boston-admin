import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewSubCategoryReducer as reducer } from "../../reducers/subCategory";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import EditSubCategoryModel from "./EditSubCategory.js";
import ProductTable from "./ProductTable";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

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
        // // console.log(data);

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
                  {loading ? <Skeleton /> : subCategory.name} Details
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
                        src={subCategory.sub_category_image}
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
                        <p>{loading ? <Skeleton /> : subCategory.name}</p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Description</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : subCategory.description}
                        </p>
                      </Col>
                      <Col md={4}>
                        <p className="mb-0">
                          <strong>Category</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : subCategory.category ? (
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
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(subCategory.createdAt)
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
                            getDateTime(subCategory.updatedAt)
                          )}
                        </p>
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
    </motion.div>
  );
};

export default ViewSubCategory;
