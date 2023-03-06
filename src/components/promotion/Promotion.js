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
import { IoMdOpen } from "react-icons/io";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        promotions: action.payload.promotions,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Promotions() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  console.log(token);

  const [{ loading, error, promotions }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [del, setDel] = useState(false);
  const deletePromotion = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this promotion?") === true
    ) {
      try {
        setDel(true);
        const res = await axios.delete(
          `http://localhost:5000/api/admin/promotion/${id}`,
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
        const res = await axios.get("http://localhost:5000/api/promotion/all", {
          headers: { Authorization: token },
        });
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
  }, [token, del]);

  return (
    <Container fluid className="py-3">
      {" "}
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Card>
          <Card.Header>
            <Button
              onClick={() => {
                navigate(`/admin/promotion/create`);
              }}
              type="success"
              className="btn btn-primary btn-block mt-1"
            >
              Add Promotion
            </Button>
          </Card.Header>

          <Card.Body>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Product</th>
                  <th>Updated Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {promotions &&
                  promotions.map((promotion, i) => (
                    <tr key={promotion._id} className="odd">
                      <td className="text-center">{i + 1}</td>
                      <td className="dtr-control sorting_1" tabIndex={0}>
                        {promotion.product.name}
                      </td>
                      <td>{promotion.updated_price}</td>
                      <td>
                        <Button
                          onClick={() => {
                            navigate(`/admin/view/promotion/${promotion._id}`);
                          }}
                          type="success"
                          className="btn btn-primary"
                        >
                          <i className="fa fa-eye"></i>
                        </Button>
                        <Button
                          onClick={() => {
                            deletePromotion(promotion._id);
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
        </Card>
      )}
      <ToastContainer />
    </Container>
  );
}
