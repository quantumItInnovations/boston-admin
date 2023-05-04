import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { viewOrderReducer as reducer } from "../../reducers/order";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
  Button,
  Spinner,
} from "react-bootstrap";
import MessageBox from "../layout/MessageBox";
import axiosInstance from "../../utils/axiosUtil";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

const ViewOrder = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // order/:id

  const [status, setStatus] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/order/${id}`, {
          headers: { Authorization: token },
        });
        console.log(data);
        setStatus(data.order.status);
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

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoadingUpdate(true);
      const { data } = await axiosInstance.put(
        `/api/admin/order/${id}/update/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("category add data", data);
      if (data.order) {
        toast.success("Order Status Updated Succesfully", {
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
                  {loading ? <Skeleton /> : order.orderId} Details
                </Card.Title>

                {/* <div className="card-tools">
                <FaEdit style={{ color: "blue" }}
                  onClick={() => setModalShow(true)}
                />
              </div> */}
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Order Id</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : order.orderId}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>User</strong>
                    </p>
                    <p>
                      {loading ? (
                        <Skeleton />
                      ) : (
                        order.userId &&
                        `${order.userId.firstname} ${order.userId.lastname}`
                      )}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Status</strong>
                    </p>
                    {loading ? (
                      <Skeleton />
                    ) : (
                      <Form onSubmit={submitHandler}>
                        <Row>
                          <Col>
                            <Form.Group controlId="status">
                              <Form.Select
                                value={status}
                                onChange={(e) => {
                                  setStatus(e.target.value);
                                }}
                                aria-label="Default select example"
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="delivered">Delivered</option>
                              </Form.Select>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Button type="submit">
                              {loadingUpdate ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                "Update"
                              )}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Amount</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : order.amount}</p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Created At</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(order.createdAt)}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p className="mb-0">
                      <strong>Last Update</strong>
                    </p>
                    <p>
                      {loading ? <Skeleton /> : getDateTime(order.updatedAt)}
                    </p>
                  </Col>
                </Row>
                <h4 className="my-3">Address</h4>
                <Row>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Country</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : order.address.country}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Town</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : order.address.town}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Street</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : order.address.street}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Post Code</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : order.address.post_code}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0">
                      <strong>Mobile No.</strong>
                    </p>
                    <p>{loading ? <Skeleton /> : order.address.mobile_no}</p>
                  </Col>
                </Row>
                <h4 className="my-3">Product Details</h4>
                <Row className="mb-3">
                  <Table responsive striped bordered hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Product Name</th>
                        <th>Variant Type</th>
                        <th>Variant Amount</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <CustomSkeleton resultPerPage={5} column={3} />
                      ) : (
                        order.products &&
                        order.products.map((product, i) => (
                          <tr key={product._id} className="odd">
                            <td className="text-center">{i + 1}</td>
                            <td>{product?.parent_prod?.name}</td>
                            <td>{product?.product?.qname}</td>
                            <td>{product?.product?.amount}</td>
                            <td>{product.quantity}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Row>
              </Card.Body>
            </Card>
            {/* <EditorderModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          /> */}
            <ToastContainer />
          </>
        )}
      </Container>
    </motion.div>
  );
};

export default ViewOrder;
