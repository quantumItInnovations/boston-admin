import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { orderReducer as reducer } from "../../reducers/order";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { IoMdOpen } from "react-icons/io";
import ArrayView from "../listView/ArrayView";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

export default function Order() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  console.log(token);

  const [status, setStatus] = useState("all");
  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(15);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [productList, setProductList] = useState([]);
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, orders, filteredOrderCount }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const showModelHandler = (ls) => {
    // console.log("product_list", ls);
    setProductList([...ls]);
    setModalShow(true);
  };

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
          `/api/admin/orders/all/?status=${status}&orderId=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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
  }, [token, del, curPage, resultPerPage, status, query]);

  const numOfPages = Math.ceil(filteredOrderCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  console.log("nuofPage", numOfPages);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {/* {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? ( */}
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <div className="float-start d-flex align-items-center">
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
              <div className="search-box float-end">
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search by Order Id"
                    type="search"
                    maxLength="6"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <InputGroup.Text
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setQuery(searchInput);
                      setCurPage(1);
                    }}
                  >
                    <FaSearch />
                  </InputGroup.Text>
                </InputGroup>
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
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={8} />
                  ) : (
                    orders &&
                    orders.map((order, i) => (
                      <tr key={order._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>{order.orderId && order.orderId}</td>
                        <td>
                          {order.userId &&
                            `${order.userId.firstname} ${order.userId.lastname}`}
                        </td>
                        <td className="text-center">
                          <IoMdOpen
                            className="open-model"
                            onClick={() => showModelHandler(order.products)}
                          />
                        </td>
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
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteOrder(order._id);
                            }}
                            type="danger"
                            className="btn btn-danger ms-2"
                          >
                            <FaTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
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
        {productList && modalShow ? (
          <ArrayView
            show={modalShow}
            onHide={() => setModalShow(false)}
            arr={productList}
          />
        ) : (
          <></>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
