import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import LoadingBox from "../layout/LoadingBox";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../axiosUtil";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        orders: action.payload.orders,
        filteredOrderCount: action.payload.filteredOrderCount,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Order() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  console.log(token);

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(15);
  const [status, setStatus] = useState("all");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, orders, filteredOrderCount }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const deleteOrder = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this order?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/order/${id}`, {
          headers: { Authorization: token },
        });
        setDel(false);
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get(
          `/api/admin/orders/all/?status=${status}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log("orders", res.data);
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del, curPage, resultPerPage, status]);

  const numOfPages = Math.ceil(filteredOrderCount / resultPerPage);
  console.log("nuofPage", numOfPages);

  return (
    <Container fluid className="py-3">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card>
          <Card.Header>
            {/* <Button
              onClick={() => {
                navigate(`/admin/category/create`);
              }}
              type="success"
              className="btn btn-primary btn-block mt-1"
            >
              Add Category
            </Button> */}
            <div className="float-end d-flex align-items-center">
              <p className="p-bold m-0 me-3">Filter by Status</p>
              <Form.Group controlId="status">
                <Form.Select
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                    setCurPage(1);
                  }}
                  aria-label="Default select example"
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="delivered">Delivered</option>
                </Form.Select>
              </Form.Group>
            </div>
          </Card.Header>
          <Card.Body>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Order Id</th>
                  <th>User</th>
                  <th>Product</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders &&
                  orders.map((order, i) => (
                    <tr key={order._id} className="odd">
                      <td className="text-center">{i + 1}</td>
                      <td className="dtr-control sorting_1" tabIndex={0}>
                        {order.orderId && order.orderId}
                      </td>
                      <td>
                        {order.userId &&
                          `${order.userId.firstname} ${order.userId.lastname}`}
                      </td>
                      <td>View Product Details</td>
                      <td>{order.amount}</td>
                      <td>{order.status}</td>
                      <td>{order.address.town}</td>
                      <td>
                        <Button
                          onClick={() => {
                            navigate(`/admin/view/order/${order._id}`);
                          }}
                          type="success"
                          className="btn btn-primary"
                        >
                          <i className="fa fa-eye"></i>
                        </Button>
                        <Button
                          onClick={() => {
                            deleteOrder(order._id);
                          }}
                          type="danger"
                          className="btn btn-danger ms-2"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Card.Body>
          <Card.Footer>
            <div className="float-start d-flex align-items-center mt-3">
              <p className="p-bold m-0 me-3">Row No.</p>
              <Form.Group controlId="resultPerPage">
                <Form.Select
                  value={resultPerPage}
                  onChange={(e) => {
                    setResultPerPage(e.target.value);
                    setCurPage(1);
                  }}
                  aria-label="Default select example"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </Form.Select>
              </Form.Group>
            </div>
            {resultPerPage < filteredOrderCount && (
              <CustomPagination
                pages={numOfPages}
                pageHandler={curPageHandler}
                curPage={curPage}
              />
            )}
          </Card.Footer>
        </Card>
      )}
      <ToastContainer />
    </Container>
  );
}
