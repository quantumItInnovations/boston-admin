import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { productReducer as reducer } from "../../reducers/product";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Table,
} from "react-bootstrap";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEye, FaSearch, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import CustomSkeleton from "../layout/CustomSkeleton";
import { IoMdOpen } from "react-icons/io";
import QuantityArray from "../listView/QuantityArray";

export default function Products() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [query, setQuery] = useState("");
  const [del, setDel] = useState(false);

  const curPageHandler = (p) => setCurPage(p);
  const [variant, setVariant] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const showModelHandler = (ls) => {
    // // console.log("product_list", ls);
    setVariant([...ls]);
    setModalShow(true);
  };
  const [
    { loading, error, products, productCount, filteredProductCount },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });


  const deleteProduct = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product?\n\nNote: All reviews of this product will also be deleted."
      ) === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/product/${id}`, {
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
          `/api/admin/product/all/?keyword=${query}&resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log("res", curPage, res.data);
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

  const numOfPages = Math.ceil(productCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);
  console.log({numOfPages})
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
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
                  navigate(`/admin/product/create`);
                }}
                type="success"
                className="btn btn-primary btn-block mt-1"
              >
                Add Product
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
                    <th>Image</th>
                    <th>Name</th>
                    <th>Variant</th>
                    {/* <th>Stock</th> */}
                    <th>Category</th>
                    <th>SubCategory</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <CustomSkeleton resultPerPage={resultPerPage} column={9} />
                  ) : (
                    products &&
                    products.map((product, i) => (
                      <tr key={product._id} className="odd">
                        <td className="text-center">{skip + i + 1}</td>
                        <td>
                          <img
                            className="td-img"
                            src={product.product_images[0]}
                            alt=""
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        </td>
                        <td>{product.name}</td>
                        <td><IoMdOpen
                            className="open-model"
                            onClick={() => showModelHandler(product.subProducts)}
                          /></td>
                        {/* <td>
                          {product.stock ? (
                            <TiTick className="green" />
                          ) : (
                            <ImCross className="red" />
                          )}
                        </td> */}
                        <td>
                          {product.category ? (
                            product.category.name
                          ) : (
                            <b>Category not set</b>
                          )}
                        </td>
                        <td>
                          {product.sub_category ? (
                            product.sub_category.name
                          ) : (
                            <b>Sub category not set</b>
                          )}
                        </td>
                        <td>{product.description}</td>
                        <td>
                          <Button
                            onClick={() => {
                              navigate(`/admin/view/product/${product._id}`);
                            }}
                            type="success"
                            className="btn btn-primary"
                          >
                            <FaEye />
                          </Button>
                          <Button
                            onClick={() => {
                              deleteProduct(product._id);
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
              {resultPerPage < productCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )}
            </Card.Footer>
          </Card>
        )}
        {variant && modalShow ? (
          <QuantityArray
            show={modalShow}
            onHide={() => setModalShow(false)}
            arr={variant}
            column={{"Quantity Type": "qname","Amount": "amount", "Volume": "volume"}}
            title="Variant List"
          />
        ) : (
          <></>
        )}
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
