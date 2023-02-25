import React, { useContext, useEffect, useReducer, useState } from "react";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { Store } from "../../Store";
import { getError } from "../../utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import LoadingBox from "../layout/LoadingBox";
import axios from "axios";
import { Button } from "react-bootstrap";
import { IoMdOpen } from "react-icons/io";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        categories: action.payload.categories,
        pages: Math.ceil(action.payload.categories.length / 5),
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Category() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;
  let a = (page - 1) * 5;
  console.log(token);

  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [productList, setProductList] = useState([]);
  const [del, setDel] = useState(false);

  const [{ loading, error, categories, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?") === true) {
      try {
        setDel(true);
        const res = await axios.delete(
          `http://localhost:5000/api/admin/category/${id}`,

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
            `http://localhost:5000/api/admin?search=${searchInput}&in=shops`,
            {
              headers: { Authorization: token },
            }
          );

          navigate('/admin/shops?page=1')
          dispatch({ type: "FETCH_SUCCESS", payload: res.data });
        } else {
          const res = await axios.get(
            "http://localhost:5000/api/category/all",
            {
              headers: { Authorization: token },
            }
          );
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

  return (
    <div className="wrapper">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div>
            {/* Content Header (Page header) */}
            <div className="content-header">
              <div className="container-fluid">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">
                      <Button
                        onClick={() => {
                          navigate(`/admin/category/create`);
                        }}
                        type="success"
                        className="btn btn-primary btn-block mt-1"
                      >
                        Add Category
                      </Button>
                    </h3>
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

                  <div className="card-body">
                    <Table
                      id="example1"
                      className="table table-bordered table-striped"
                    >
                      <Thead>
                        <Tr>
                          <Th>S.No</Th>
                          <Th>Image</Th>
                          <Th>Name</Th>
                          <Th>Description</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {categories.slice(a, a + 5).map((category, i) => (
                          <Tr key={category._id} className="odd">
                            <Td>{i + 1}</Td>
                            <Td>
                            <img
                              className="td-img"
                              src={category.category_image}
                              alt=""
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            />
                            </Td>
                            <Td className="dtr-control sorting_1" tabIndex={0}>
                              {category.name}
                            </Td>
                            <Td>{category.description}</Td>
                            <Td>
                              <Button
                                onClick={() => {
                                  navigate(`/admin/view/category/${category._id}`);
                                }}
                                type="success"
                                className="btn btn-primary btn-block"
                              >
                                <i className="fa fa-eye"></i>
                              </Button>
                              <Button
                                onClick={() => {
                                  deleteCategory(category._id);
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
                                to={`/admin/shops?page=${x + 1}`}
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
            <ToastContainer />
        </>
      )}
    </div>
  );
}
