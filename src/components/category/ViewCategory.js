import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import EditCategoryModel from "./EditCategory.js";
import SubCategoryTable from "./SubCategoryTable";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, category: action.payload.category };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewCategory = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // category/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, category }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `https://boston-api.adaptable.app/api/category/${id}`,
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
              <Card.Title>{category.name} Details</Card.Title>

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
                    src={category.category_image}
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
                      <p>{category.name}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Description</strong>
                      </p>
                      <p>{category.description}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Created At</strong>
                      </p>
                      <p>{getDateTime(category.createdAt)}</p>
                    </Col>
                    <Col md={4}>
                      <p className="mb-0">
                        <strong>Last Update</strong>
                      </p>
                      <p>{getDateTime(category.updatedAt)}</p>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <SubCategoryTable id={id} />
              </Row>
            </Card.Body>
          </Card>
          <EditCategoryModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </Container>
  );
};

export default ViewCategory;
