import React, { useContext, useState } from "react";
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
import { motion } from "framer-motion";

export default function AddCategory() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category_image, setCategoryImage] = useState("");

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  // const uploadFileHandler = async (file, type) => {
  const uploadFileHandler = async (e, type) => {
    if (!e.target.files[0]) {
      // if (!file) {
      setCategoryImage(null);
      return;
    }
    if(e.target.files[0].size > 5000000) {
      toast.warning("Image size is too large.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      setCategoryImage(null);
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

      setCategoryImage(location);
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

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategoryImage("");
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category_image) {
      toast.warning("Please select an image or wait till image is uploaded.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    try {
      setLoadingUpdate(true);
      const { data } = await axiosInstance.post(
        "/api/admin/category/create",
        {
          name,
          description,
          category_image,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("category add data", data);
      if (data.category) {
        toast.success("Category Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/category");
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
            <span style={{ fontSize: "xx-large" }}>Add Category</span>
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

                  {/* <Cropper
                      uploadHandler={uploadFileHandler}
                      w={25}
                      h={17}
                      isUploaded={isUploaded}
                    />
                    {uploadPercentage > 0 && (
                      <ProgressBar
                        now={uploadPercentage}
                        active="true"
                        label={`${uploadPercentage}%`}
                      />
                    )} */}
                  <Form.Group className="mb-3" controlId="category_image">
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
