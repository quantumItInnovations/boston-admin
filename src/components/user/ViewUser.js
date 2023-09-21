import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewUserReducer as reducer } from "../../reducers/user";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import EditUserModel from "./EditUser.js";
import axiosInstance from "../../utils/axiosUtil";
import { FaCheck, FaEdit } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [freeShip, setFreeShip] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const handleUserShip = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      // console.log({ freeShip, e })
      const { data } = await axiosInstance.put(`/api/admin/user/${id}`,
        { free_ship: e.target.checked },
        { headers: { Authorization: token } }
      );

      if (data.user) {
        setFreeShip(data.user.free_ship);
        toast.success("Free Shipping For User Updated Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
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
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/user/${id}`, {
          headers: { Authorization: token },
        });
        // console.log("user:", data);
        setFreeShip(data.user.free_ship);
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
                  {loading ? (
                    <Skeleton />
                  ) : (
                    `${user.firstname} ${user.lastname}`
                  )}{" "}
                  Details
                </Card.Title>
                <div className="card-tools">
                  <FaEdit
                    style={{ color: "blue" }}
                    onClick={() => setModalShow(true)}
                  />
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Firstname</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.firstname}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Lastname</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.lastname}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Email</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.email}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Mobile No.</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.mobile_no}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Free Shipping</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : loadingUpdate ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      <Form.Check className="ship-box" onChange={handleUserShip} checked={freeShip} />
                    )
                      // user.free_ship
                      //   ? <FaCheck className="green" />
                      //   : <ImCross className="red" />
                    }</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Role</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : user.role}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(user.updatedAt)}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <EditUserModel
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

export default ViewUser;
