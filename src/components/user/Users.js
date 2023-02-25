import React, { useContext, useEffect, useReducer, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import { Store } from "../../Store";
import { getError } from "../../utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import LoadingBox from "../layout/LoadingBox";
import axios from "axios";

import { Button } from "react-bootstrap";
import { MdToggleOff, MdToggleOn } from "react-icons/md";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        users: action.payload.users,
        pages: Math.ceil(action.payload.users.length / 15),
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
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  let a = (page - 1) * 15;
  console.log("token", token);

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState(false);
  const [del, setDel] = useState(false);

  const [{ loading, error, users, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?") === true) {
      try {
        setDel(true);
        const res = await axios.delete(
          `http://localhost:5000/api/admin/user/${id}`,

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
        if (searchInput) {
          const res = await axios.get(
            `http://localhost:5000/api/admin?search=${searchInput}&in=users`,

            {
              headers: { Authorization: token },
            }
          );

          navigate('/admin/users?page=1')
          dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        } else {
          const res = await axios.get(
            "http://localhost:5000/api/admin/user/all",

            {
              headers: { Authorization: token },
            }
          );
            console.log(res.data)
          dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        }
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
  }, [page, token, del, query]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <div className="wrapper">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="card">
                <div className="card-header">
                  <div className="float-right">
                    <nav className="navbar navbar-expand navbar-white navbar-light">
                      <form className="form-inline ml-3">
                        <div className="input-group input-group-sm">
                          <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="form-control form-control-navbar"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                          />
                          <div className="input-group-append">
                            <button className="btn btn-navbar">
                              <i
                                className="fas fa-search"
                                onClick={(e) => {
                                  setQuery(!query);
                                }}
                              ></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </nav>
                  </div>
                </div>

                <div className="card-body" style={{overflowX: "auto"}}>
                  <Table
                    id="example1"
                    className="table table-bordered table-striped"
                    style={{ overflowX: "auto" }}
                  >
                    <Thead>
                      <Tr>
                        <Th>S.No</Th>
                        {/* <Th>Image</Th> */}
                        <Th>Firstname</Th>
                        <Th>Lastname</Th>
                        <Th>Email</Th>
                        <Th>Reg. Date</Th>
                        {/* <Th>DOB</Th> */}
                        {/* <Th>Sex</Th> */}
                        <Th>Telephone</Th>
                        <Th>Fax</Th>
                        <Th>Role</Th>
                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.slice(a, a + 15).map((user, i) => (
                        <Tr key={user._id} className="odd">
                          <Td>{i + 1}</Td>
                          {/* <Td>
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
                          </Td> */}
                          <Td>{user.firstname}</Td>
                          <Td>{user.lastname}</Td>
                          <Td>{user.email}</Td>
                          <Td>{getDateTime(user.createdAt&&user.createdAt)}</Td>
                          {/* <Td>{user.dob}</Td> */}
                          {/* <Td>{user.sex}</Td> */}
                          <Td>{user.telephone}</Td>
                          <Td>{user.fax}</Td>
                          {/* <Td>
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
                          </Td> */}
                          <Td>{user.role}</Td>
                          <Td>
                            <Button
                              onClick={() => {
                                navigate(`/admin/view/user/${user._id}`);
                              }}
                              type="success"
                              className="btn btn-primary btn-block"
                            >
                              <i className="fa fa-eye"></i>
                            </Button>
                            <Button
                              onClick={() => {
                                deleteUser(user._id);
                              }}
                              type="danger"
                              className="btn btn-danger btn-block"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <div className="mt-3 float-right">
                    <div className="dataTables_paginate paging_simple_numbers">
                      <ul className="pagination">
                        {[...Array(pages).keys()].map((x) => (
                          <div key={x}>
                            <Link
                              className={
                                x + 1 === Number(page)
                                  ? "page-link paginate_button page-item active"
                                  : "page-link paginate_button page-item"
                              }
                              key={x + 1}
                              to={`/admin/users?page=${x + 1}`}
                            >
                              {x + 1}
                            </Link>
                          </div>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
