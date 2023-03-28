import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import LoadingBox from "../layout/LoadingBox";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload.users,
        userCount: action.payload.userCount,
        filteredUserCount: action.payload.filteredUserCount,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function Users() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  console.log("token", token);

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, users, userCount, filteredUserCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?") === true) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/user/${id}`, {
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
          `/api/admin/user/all/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(res.data);
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
  }, [token, del, curPage, resultPerPage, query]);

  const numOfPages = Math.ceil(filteredUserCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  console.log("nuofPage", numOfPages, resultPerPage);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      exit={{ opacity: 1 }}
    >
      <Container fluid className="py-3">
        {/* {loading ? (
        <LoadingBox></LoadingBox> */}
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <div className="search-box float-end">
                <InputGroup>
                  <Form.Control
                    aria-label="Search Input"
                    placeholder="Search"
                    type="search"
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
                    {/* <th>Image</th> */}
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Email</th>
                    <th>Reg. Date</th>
                    {/* <th>DOB</th> */}
                    {/* <th>Sex</th> */}
                    <th>Telephone</th>
                    <th>Fax</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading
                    ? <CustomSkeleton resutltPerPage={resultPerPage} column={9} />
                    : users &&
                      users.map((user, i) => (
                        <tr key={user._id} className="odd">
                          <td className="text-center">{skip + i + 1}</td>
                          {/* <td>
                            <img
                              className="td-img"
                              src={user.profile_image}
                              alt=""
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            />
                          </td> */}
                          <td>{user.firstname}</td>
                          <td>{user.lastname}</td>
                          <td>{user.email}</td>
                          <td>
                            {getDateTime(user.createdAt && user.createdAt)}
                          </td>
                          {/* <td>{user.dob}</td> */}
                          {/* <td>{user.sex}</td> */}
                          <td>{user.telephone}</td>
                          <td>{user.fax}</td>
                          {/* <td>
                            {user.payment_status == 1 ? (
                              <MdToggleOn
                                className="on"
                                onClick={() =>
                                  paymentStatusHandler(
                                    user._id,
                                    0
                                  )
                                }
                              />
                            ) : (
                              <MdToggleOff
                                className="off"
                                onClick={() =>
                                  paymentStatusHandler(
                                    user._id,
                                    1
                                  )
                                }
                              />
                            )}
                          </td> */}
                          <td>{user.role}</td>
                          <td>
                            <Button
                              onClick={() => {
                                navigate(`/admin/view/user/${user._id}`);
                              }}
                              type="success"
                              className="btn btn-primary"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              onClick={() => {
                                deleteUser(user._id);
                              }}
                              type="danger"
                              className="btn btn-danger ms-2"
                            >
                              <FaTrashAlt className="m-auto" />
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
              {resultPerPage < filteredUserCount && (
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
    </motion.div>
  );
}
