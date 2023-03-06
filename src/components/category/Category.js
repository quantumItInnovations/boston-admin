import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import LoadingBox from "../layout/LoadingBox";
import axios from "axios";
import { Button } from "react-bootstrap";
import { IoMdOpen } from "react-icons/io";
import CustomPagination from "../layout/CustomPagination";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        categories: action.payload.categories,
        categoryCount: action.payload.categoryCount,
        filteredCategoryCount: action.payload.filteredCategoryCount,
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
  console.log(token);

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);

  const [{ loading, error, categories, categoryCount, filteredCategoryCount }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const deleteCategory = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this category?") === true
    ) {
      try {
        setDel(true);
        const res = await axios.delete(
          `http://52.91.135.217:5000/api/admin/category/${id}`,

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
            // "http://52.91.135.217:5000/api/category/all",
            `http://localhost:5000/api/category/all/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
            {
              headers: { Authorization: token },
            }
          );
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

  const numOfPages = Math.ceil(filteredCategoryCount / resultPerPage);
  console.log("nuofPage", numOfPages);

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
                                  onClick={() => {
                                    setQuery(searchInput);
                                  }}
                                ></i>
                              </button>
                            </div>
                          </div>
                        </form>
                      </nav>
                    </div>
                  </div>

                  <div className="card-body" style={{ overflowX: "scroll" }}>
                    <table
                      id="example1"
                      className="table table-bordered table-striped"
                    >
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((category, i) => (
                          <tr key={category._id} className="odd">
                            <td>{i + 1}</td>
                            <td>
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
                            </td>
                            <td className="dtr-control sorting_1" tabIndex={0}>
                              {category.name}
                            </td>
                            <td>{category.description}</td>
                            <td>
                              <Button
                                onClick={() => {
                                  navigate(
                                    `/admin/view/category/${category._id}`
                                  );
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
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {resultPerPage < filteredCategoryCount && (
                    <CustomPagination
                      pages={numOfPages}
                      pageHandler={curPageHandler}
                      curPage={curPage}
                    />
                  )}
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
