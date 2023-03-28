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
import { FaEye, FaTrashAlt } from "react-icons/fa";
import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

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
        const res = await axiosInstance.delete(`/api/admin/promotion/${id}`, {
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
        const res = await axiosInstance.get("/api/promotion/all", {
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
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      exit={{ opacity: 1 }}
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
                    <th>Image</th>
                    <th>Product</th>
                    <th>Updated Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={3} column={5} />
                  ) : (
                    promotions &&
                    promotions.map((promotion, i) => (
                      <tr key={promotion._id} className="odd">
                        <td className="text-center">{i + 1}</td>
                        <td>
                          <img
                            className="td-img"
                            src={promotion.promo_image}
                            alt=""
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        </td>
                        <td>
                          {promotion.product ? (
                            promotion.product.name
                          ) : (
                            <b>Promotion product not found</b>
                          )}
                        </td>
                        <td>{promotion.updated_price}</td>
                        <td>
                          <Button
                            onClick={() => {
                              navigate(
                                `/admin/view/promotion/${promotion._id}`
                              );
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deletePromotion(promotion._id);
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
          </Card>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
