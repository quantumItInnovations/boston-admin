import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { shippingReducer as reducer } from "../../reducers/shipping";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Button,
  Card,
  Container,
  Form,
  Table,
} from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit, FaEye, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";

export default function Shipping() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [{ loading, error, shippings }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  
  const [del, setDel] = useState(false);
  const deleteShipping = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this shipping charge?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/shipping/${id}`, {
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
        const { data } = await axiosInstance.get(
          `/api/admin/shipping/all`,
          { headers: { Authorization: token } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
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
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <Button
                onClick={() => {
                  navigate(`/admin/shipping/create`);
                }}
                type="success"
                className="btn btn-primary btn-block mt-1"
              >
                Add Shipping
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive striped bordered hover>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Cases</th>
                    <th>Charge</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={shippings.length} column={4} />
                  ) : (
                    shippings &&
                    shippings.map((shipping, i) => (
                      <tr key={shipping._id} className="odd">
                        <td className="text-center">{i + 1}</td>
                        <td>{shipping.name}</td>
                        <td>{shipping.description}</td>
                        <td>
                          <Button
                            onClick={() => {}}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteShipping(shipping._id);
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
