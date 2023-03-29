import React, { useContext, useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { uploadImage } from "../../utils/uploadImage";
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
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        categories: action.payload.categories,
        subCategories: action.payload.subCategories,
        products: action.payload.products,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function getAllSubCategory(subCategories, categoryId) {
  if (!categoryId) return [];

  const subCategoryList = subCategories.filter((subCat) => {
    if (subCat.category) return subCat.category._id === categoryId;
  });
  return subCategoryList;
}

function getAllProduct(products, subCategoryId, categoryId) {
  if (!categoryId || !subCategoryId) return [];

  const productList = products.filter((prod) => {
    if (prod.sub_category && prod.category)
      return (
        prod.sub_category._id === subCategoryId &&
        prod.category._id === categoryId
      );
  });
  return productList;
}

export default function AddPromotion() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [{ loading, error, categories, subCategories, products }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [promo_image, setPromoImage] = useState(null);
  const [updated_price, setUpdatedPrice] = useState("");
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (file, type) => {
    console.log("file", file);
    // if (!e.target.files[0]) {
    if (!file) {
      setPromoImage(null);
      return;
    }
    try {
      const location = await uploadImage(
        // e.target.files[0],
        file,
        token,
        uploadPercentageHandler
      );
      if (location.error) {
        throw location.error;
      }

      setPromoImage(location);
      setTimeout(() => {
        setUploadPercentage(0);
        setIsUploaded(true);
      }, 1000);
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res1 = await axiosInstance.get("/api/category/all", {
          headers: { Authorization: token },
        });

        const res2 = await axiosInstance.get("/api/subCategory/all", {
          headers: { Authorization: token },
        });

        const res3 = await axiosInstance.get("/api/product/all", {
          headers: { Authorization: token },
        });

        console.log("add promotion data", res1.data, res2.data, res3.data);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            categories: res1.data.categories,
            subCategories: res2.data.subCategories,
            products: res3.data.products,
          },
        });
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.warning("Please select a category.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (!subCategory) {
      toast.warning("Please select a sub category.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (!product) {
      toast.warning("Please select a product.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (!promo_image) {
      toast.warning("Please select an image for promotion.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    try {
      setLoadingUpdate(true);

      const { data } = await axiosInstance.post(
        "/api/admin/promotion/create",
        {
          product,
          updated_price,
          promo_image,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("category add data", data);
      if (data.promotion) {
        toast.success("Promotion Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/promotions");
          setLoadingUpdate(false);
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
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

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeOut" }}
      exit={{ opacity: 1 }}
    >
      <Container fluid>
        <Row
          className="mt-2 mb-3"
          style={{ borderBottom: "1px solid rgba(0,0,0,0.2)" }}
        >
          <Col>
            <span style={{ fontSize: "xx-large" }}>Add Promotion</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header as={"h4"}>Add Details</Card.Header>
              <Form onSubmit={submitHandler}>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label className="mr-3">Category</Form.Label>
                    {loading ? (
                      <Skeleton />
                    ) : (
                      categories && (
                        <Form.Select
                          aria-label="Select Category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option key="blankChoice" hidden value>
                            Select Category
                          </option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </Form.Select>
                      )
                    )}
                  </Form.Group>

                  {category && (
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-3">Sub Category</Form.Label>
                      <Form.Select
                        aria-label="Select Sub Category"
                        value={subCategory}
                        onChange={(e) => setSubCategory(e.target.value)}
                      >
                        <option key="blankChoice" hidden value>
                          Select Sub Category
                        </option>
                        {subCategories &&
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
                  {subCategory && (
                    <Form.Group className="mb-3">
                      <Form.Label className="mr-3">Product</Form.Label>
                      <Form.Select
                        aria-label="Select Product"
                        value={product}
                        onChange={(e) => setProduct(e.target.value)}
                      >
                        <option key="blankChoice" hidden value>
                          Select Product
                        </option>
                        {products &&
                          subCategory &&
                          getAllProduct(products, subCategory, category).map(
                            (prod) => (
                              <option key={prod._id} value={prod._id}>
                                {prod.name}
                              </option>
                            )
                          )}
                      </Form.Select>
                    </Form.Group>
                  )}

                  <Form.Group className="mb-3" controlId="updated_price">
                    <Form.Label>Updated Price</Form.Label>
                    <Form.Control
                      type="number"
                      value={updated_price}
                      onChange={(e) => setUpdatedPrice(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Cropper
                    uploadHandler={uploadFileHandler}
                    w={15}
                    h={6}
                    isUploaded={isUploaded}
                  />
                  {uploadPercentage > 0 && (
                    <ProgressBar
                      now={uploadPercentage}
                      active="true"
                      label={`${uploadPercentage}%`}
                    />
                  )}
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
