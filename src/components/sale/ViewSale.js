import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewSaleReducer as reducer } from "../../reducers/sale";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import EditSaleModel from "./EditSale.js";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

const ViewSale = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // sale/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, sale }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/sale/${id}`, {
          headers: { Authorization: token },
        });
        console.log({ data });

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
                <Card.Title>Sale Details</Card.Title>

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
                    <p className="mb-0">
                      <strong>Type</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : sale.type}</p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Start Date</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(sale.start_date)
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>End Date</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(sale.end_date)
                      )}
                    </p>
                  </Col>

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Discount</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : sale.discount}</p>
                  </Col>
                  {!loading && (sale.product || sale.category) &&
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>{loading ? <Skeleton /> :
                          sale.product ? "Product" : "Category"}</strong>
                      </p>
                      <p>{loading ? <Skeleton /> :
                        sale.product ? sale.product.name : sale.category.name}</p>
                    </Col>}

                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        getDateTime(sale.createdAt)
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
                        getDateTime(sale.updatedAt)
                      )}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <EditSaleModel
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

export default ViewSale;
