import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import LoadingBox from "../layout/LoadingBox";
import axios from "axios";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { MdToggleOff, MdToggleOn } from "react-icons/md";
import CustomPagination from "../layout/CustomPagination";

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
        const res = await axios.delete(
          `https://boston-api.adaptable.app/api/admin/user/${id}`,

          {
            headers: { Authorization: token },
          }
        );
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
        const res = await axios.get(
          // "https://boston-api.adaptable.app/api/admin/user/all",
          `https://boston-api.adaptable.app/api/admin/user/all/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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
  console.log("nuofPage", numOfPages);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <Container fluid className="py-3">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card>
          <Card.Header>
            <div className="search-box float-end">
              <InputGroup>
                <Form.Control
                  aria-label="Search Input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <InputGroup.Text
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setQuery(searchInput);
                  }}
                >
                  <i className="fas fa-search"></i>
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
                {users && users.map((user, i) => (
                  <tr key={user._id} className="odd">
                    <td className="text-center">{i + 1}</td>
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
                    <td>{getDateTime(user.createdAt && user.createdAt)}</td>
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
                        <i className="fa fa-eye"></i>
                      </Button>
                      <Button
                        onClick={() => {
                          deleteUser(user._id);
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
          {resultPerPage < filteredUserCount && (
            <Card.Footer>
              <CustomPagination
                pages={numOfPages}
                pageHandler={curPageHandler}
                curPage={curPage}
              />
            </Card.Footer>
          )}
        </Card>
      )}
      <ToastContainer />
    </Container>
  );
}
