import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewPromotionReducer as reducer } from "../../reducers/promotion";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import EditPromotionModel from "./EditPromotion";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewPromotion = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // promotion/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, promotion }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/promotion/${id}`, {
          headers: { Authorization: token },
        });
        console.log("promotion", data);

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
                <Card.Title>Promotion Details</Card.Title>

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
                        src={promotion.promo_image}
                        alt=""
                        className="img-fluid"
                        width={"200px"}
                        // height={"200px"}
                      />
                    )}
                  </Col>
                  <Col md={8}>
                    <Row>
                      <Col md={6}>
                        <p className="mb-0">
                          <strong>Product</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : promotion.product ? (
                            promotion.product.name
                          ) : (
                            <b>Promotion product not found</b>
                          )}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-0">
                          <strong>Updated Price</strong>
                        </p>
                        <p>
                          {loading ? <Skeleton /> : promotion.updated_price}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-0">
                          <strong>Created At</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(promotion.createdAt)
                          )}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-0">
                          <strong>Last Update</strong>
                        </p>
                        <p>
                          {loading ? (
                            <Skeleton />
                          ) : (
                            getDateTime(promotion.updatedAt)
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <EditPromotionModel
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

export default ViewPromotion;
