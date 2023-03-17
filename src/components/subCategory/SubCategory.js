import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
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
import { IoMdOpen } from "react-icons/io";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../axiosUtil";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        subCategories: action.payload.subCategories,
        subCategoryCount: action.payload.subCategoryCount,
        filteredSubCategoryCount: action.payload.filteredSubCategoryCount,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function SubCategory() {
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
  const [
    {
      loading,
      error,
      subCategories,
      subCategoryCount,
      filteredSubCategoryCount,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const deleteSubCategory = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this sub-category?") ===
      true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/subCategory/${id}`, {
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
          `/api/subCategory/all/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          // `/api/subCategory/all/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
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

  const numOfPages = Math.ceil(filteredSubCategoryCount / resultPerPage);
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
            <Button
              onClick={() => {
                navigate(`/admin/subCategory/create`);
              }}
              type="success"
              className="btn btn-primary btn-block mt-1"
            >
              Add Sub Category
            </Button>
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
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {subCategories &&
                  subCategories.map((subCategory, i) => (
                    <tr key={subCategory._id} className="odd">
                      <td className="text-center">{i + 1}</td>
                      <td>
                        <img
                          className="td-img"
                          src={subCategory.sub_category_image}
                          alt=""
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      </td>
                      <td>{subCategory.name}</td>
                      <td>
                        {subCategory.category ? (
                          subCategory.category.name
                        ) : (
                          <b>Category not set</b>
                        )}
                      </td>
                      <td>{subCategory.description}</td>
                      <td>
                        <Button
                          onClick={() => {
                            navigate(
                              `/admin/view/subCategory/${subCategory._id}`
                            );
                          }}
                          type="success"
                          className="btn btn-primary"
                        >
                          <i className="fa fa-eye"></i>
                        </Button>
                        <Button
                          onClick={() => {
                            deleteSubCategory(subCategory._id);
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
            {resultPerPage < filteredSubCategoryCount && (
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
