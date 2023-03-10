import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import EditPromotionModel from "./EditPromotion";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, promotion: action.payload.promotion };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

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

        const { data } = await axios.get(
          `https://boston-api.adaptable.app/api/promotion/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log("promotion", data);

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
              <Card.Title>Promotion Details</Card.Title>

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
                <Col md={6}>
                  <p className="mb-0">
                    <strong>Product</strong>
                  </p>
                  <p>
                    {promotion.product ? (
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
                  <p>{promotion.updated_price}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>{getDateTime(promotion.createdAt)}</p>
                </Col>
                <Col md={6}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>{getDateTime(promotion.updatedAt)}</p>
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
  );
};

export default ViewPromotion;
