import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Row } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import EditUserModel from "./EditUser.js";
import axiosInstance from "../../axiosUtil";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload.user };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/user/${id}`, {
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
              <Card.Title>
                {`${user.firstname} ${user.lastname}`} Details
              </Card.Title>
              <div className="card-tools">
                <i
                  className="fa fa-edit"
                  style={{ color: "blue" }}
                  onClick={() => setModalShow(true)}
                ></i>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Firstname</strong>
                  </p>
                  <p>{user.firstname}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Lastname</strong>
                  </p>
                  <p>{user.lastname}</p>
                </Col>
                <Col md={4}>
                  {" "}
                  <p className="mb-0">
                    <strong>Email</strong>
                  </p>
                  <p>{user.email}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Telephone</strong>
                  </p>
                  <p>{user.telephone}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Fax</strong>
                  </p>
                  <p>{user.fax}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Role</strong>
                  </p>
                  <p>{user.role}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Created At</strong>
                  </p>
                  <p>{getDateTime(user.createdAt)}</p>
                </Col>
                <Col md={4}>
                  <p className="mb-0">
                    <strong>Last Update</strong>
                  </p>
                  <p>{getDateTime(user.updatedAt)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <EditUserModel show={modalShow} onHide={() => setModalShow(false)} />
          <ToastContainer />
        </>
      )}
    </Container>
  );
};

export default ViewUser;
