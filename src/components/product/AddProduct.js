import React, { useContext, useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { productReducer as reducer } from "../../reducers/product";
import { uploadMultiImage } from "../../utils/uploadImage";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  ProgressBar,
  Row,
  Spinner,
} from "react-bootstrap";
import Cropper from "../cropper/cropper";
import axiosInstance from "../../utils/axiosUtil";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

function getAllSubCategory(subCategories, categoryId) {
  if (!categoryId) return [];

  const subCategoryList = subCategories.filter((subCat) => {
    if (subCat.category) return subCat.category === categoryId;
  });
  return subCategoryList;
}

export default function AddProduct() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [{ loading, error, subCategories, categories }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [stock, setStock] = useState("false");
  const [product_images, setProductImage] = useState(null);
  const [category, setCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setAmount("");
    setStock("");
    setProductImage("");
    setCategory("");
    setSubCategory("");
  };
  const stockHandler = (e) => {
    e.persist();
    console.log(e.target.value);
    setStock(e.target.value);
  };

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (e, type) => {
    if (!e.target.files[0]) {
      setProductImage(null);
      return;
    }
    try {
      if (e.target.files[0]) {
        const location = await uploadMultiImage(
          e.target.files,
          token,
          uploadPercentageHandler
        );
        if (location.error) {
          throw location.error;
        }

        setProductImage([...location]);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
      }
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.warning("Please select a category.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    if (!sub_category) {
      toast.warning("Please select a sub category.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    if (!product_images) {
      toast.warning(
        "Please select at at least one image for product or wait till image is uploaded.",
        {
          position: toast.POSITION.BOTTOM_CENTER,
        }
      );
      return;
    }
    try {
      setLoadingUpdate(true);

      const { data } = await axiosInstance.post(
        "/api/admin/product/create",
        {
          name,
          description,
          amount,
          stock,
          product_images,
          category,
          sub_category,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("product add data", data);
      if (data.product) {
        toast.success("Product Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/products");
          setLoadingUpdate(false);
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setLoadingUpdate(false);
      }
    } catch (err) {
      setLoadingUpdate(false);
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  useEffect(() => {
    console.log("fetch 1");
    const fetchData = async () => {
      console.log("fetch 2");

      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axiosInstance.get("/api/admin/all");
        console.log("add product data", res);
        dispatch({ type: "FETCH_ADD_PRODUCT_SUCCESS", payload: res.data });
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
  }, [token]);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid>
        <Row
          className="mt-2 mb-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        >
          <Col>
            <span style={{ fontSize: "xx-large" }}>Add Product</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as={"h4"}>Add Details</Card.Header>
              <Form onSubmit={submitHandler}>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="amount">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="stock">
                    <Form.Label>Stock</Form.Label>
                    <br></br>
                    <Form.Check
                      inline
                      label="In-Stock"
                      value="true"
                      type="radio"
                      id="inline-radio-1"
                      onChange={stockHandler}
                      checked={stock === "true"}
                    />
                    <Form.Check
                      inline
                      label="Out-Of-Stock"
                      value="false"
                      type="radio"
                      id="inline-radio-2"
                      onChange={stockHandler}
                      checked={stock === "false"}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="mr-3">Category</Form.Label>
                    {loading ? (
                      <Skeleton />
                    ) : (
                      <Form.Select
                        aria-label="Select Category"
                        value={category}
                        onChange={(e) => {
                          setSubCategory("");
                          setCategory(e.target.value);
                        }}
                      >
                        <option key="blankChoice" hidden value>
                          Select Category
                        </option>
                        {categories &&
                          categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                      </Form.Select>
                    )}
                  </Form.Group>
                  {category && (
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-3">Sub Category</Form.Label>
                      <Form.Select
                        aria-label="Select Sub Category"
                        value={sub_category}
                        onChange={(e) => setSubCategory(e.target.value)}
                      >
                        <option key="blankChoice" hidden value>
                          Select Sub Category
                        </option>
                        {subCategories &&
                          category &&
                          getAllSubCategory(subCategories, category).map(
                            (subCat) => (
                              <option key={subCat._id} value={subCat._id}>
                                {subCat.name}
                              </option>
                            )
                          )}
                      </Form.Select>
                    </Form.Group>
                  )}
                  <Form.Group className="mb-3" controlId="product_image">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/png image/jpeg image/jpg"
                      onChange={(e) => {
                        uploadFileHandler(e);
                      }}
                      required
                      multiple
                    />
                    {uploadPercentage > 0 && (
                      <ProgressBar
                        now={uploadPercentage}
                        active
                        label={`${uploadPercentage}%`}
                      />
                    )}
                  </Form.Group>
                </Card.Body>
                <Card.Footer>
                  <Button type="submit" disabled={loadingUpdate ? true : false}>
                    {loadingUpdate ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </Card.Footer>
                <ToastContainer />
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </motion.div>
  );
}
