import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { reducer } from "../../reducers/review";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaTrashAlt } from "react-icons/fa";
import CustomSkeleton from "../layout/CustomSkeleton";

export default function ProductReviewTable({ id: productId }) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(5);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);
  const [{ loading, error, reviews, filteredReviewCount }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const deleteReview = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this review?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/review/${id}`, {
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
          //   `/api/admin/review/all/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          `/api/review/all/${productId}`,
          {
            headers: { Authorization: token },
          }
        );
        // console.log("res", curPage, res.data);
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

  //   const numOfPages = Math.ceil(filteredReviewCount / resultPerPage);
  //   // console.log({resultPerPage, numOfPages, filteredReviewCount})
  const skip = resultPerPage * (curPage - 1);

  return (
    <Container fluid className="py-3">
      {error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card>
          <Card.Header>Product Reviews</Card.Header>
          <Card.Body>
            {loading ? (
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User's fullname</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <CustomSkeleton resultPerPage={resultPerPage} column={6} />
                </tbody>
              </Table>
            ) : reviews && reviews.length > 0 ? (
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>User's fullname</th>
                    <th>Email</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review, i) => (
                    <tr key={review._id} className="odd">
                      <td className="text-center">{skip + i + 1}</td>
                      <td>
                        {review.user &&
                          `${review.user.firstname} ${review.user.lastname}`}
                      </td>
                      <td>{review.user.email}</td>
                      <td>
                        <div className="rating">{review.rating}</div>
                      </td>
                      <td>{review.comment}</td>
                      <td>
                        <Button
                          onClick={() => {
                            deleteReview(review._id);
                          }}
                          type="danger"
                          className="btn btn-danger ms-2"
                        >
                          <FaTrashAlt />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              "No Reviews"
            )}
          </Card.Body>
          {reviews && reviews.length > 0 && (
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
              {/* {resultPerPage < filteredReviewCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )} */}
            </Card.Footer>
          )}
        </Card>
      )}
      <ToastContainer />
    </Container>
  );
}
