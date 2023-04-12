import React, { useContext, useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { categoryReducer as reducer } from "../../reducers/category";
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
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

export default function AddSubCategory() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [{ loading, error, categories }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sub_category_image, setSubCategoryImage] = useState("");

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setSubCategoryImage("");
  };
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  // const uploadFileHandler = async (file) => {
  const uploadFileHandler = async (e) => {
    // if (!file) {
    if (!e.target.files[0]) {
      setSubCategoryImage(null);
      return;
    }
    if(e.target.files[0].size > 5000000) {
      toast.warning("Image size is too large.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setSubCategoryImage(null);
      return;
    }
    try {
      // if (e.target.files[0]) {
      const location = await uploadImage(
        e.target.files[0],
        // file,
        token,
        uploadPercentageHandler
      );
      if (location.error) {
        throw location.error;
      }

      setSubCategoryImage(location);
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.warning("Please select a category", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }

    if (!sub_category_image) {
      toast.warning("Please select an image for sub-category or wait till image is uploaded.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    try {
      setLoadingUpdate(true);

      const { data } = await axiosInstance.post(
        "/api/admin/subCategory/create",
        {
          name,
          description,
          sub_category_image,
          category,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("subCategory add data", data);
      if (data.subCategory) {
        toast.success("Sub Category Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/subCategory");
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
        const res = await axiosInstance.get("/api/category/all", {
          headers: { Authorization: token },
        });

        console.log("add subCategory data", res);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: res.data,
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
            <span style={{ fontSize: "xx-large" }}>Add Sub Category</span>
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
                  <Form.Group className="mb-3">
                    <Form.Label className="mr-3">Category</Form.Label>
                    {loading ? (
                      <Skeleton />
                    ) : (
                      <Form.Select
                        aria-label="Select Category"
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option key="blankChoice" hidden value>
                          Select Category
                        </option>
                        {/* {console.log("dfsdf", categories)} */}

                        {categories &&
                          categories.map((cat) => (
                            <option key={cat.name} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                      </Form.Select>
                    )}
                  </Form.Group>
                  {/* <Cropper
                      uploadHandler={uploadFileHandler}
                      w={5}
                      h={6}
                      isUploaded={isUploaded}
                    />
                    {uploadPercentage > 0 && (
                      <ProgressBar
                        now={uploadPercentage}
                        active
                        label={`${uploadPercentage}%`}
                      />
                    )} */}
                  <Form.Group className="mb-3" controlId="sub_category_image">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        uploadFileHandler(e);
                      }}
                      required
                    />
                    {uploadPercentage > 0 && (
                      <ProgressBar
                        now={uploadPercentage}
                        active="true"
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
