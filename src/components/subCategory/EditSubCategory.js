import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { uploadImage } from "../../utils/uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, ProgressBar } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import Cropper from "../cropper/cropper";
import axiosInstance from "../../utils/axiosUtil";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: action.payload.categories,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

export default function EditSubCategoryModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // category/:id

  const [{ loading, error, loadingUpdate, categories }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
    }
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [sub_category_image, setSubCategoryImage] = useState("");
  const [preview, setPreview] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const res = await axiosInstance.get("/api/category/all", {
          headers: { Authorization: token },
        });

        const { data } = await axiosInstance.get(`/api/subCategory/${id}`, {
          headers: { Authorization: token },
        });
        console.log(data);

        const subCategory = data.subCategory;
        setName(subCategory.name);
        setDescription(subCategory.description);
        if (subCategory.category) setCategory(subCategory.category._id);
        setSubCategoryImage(subCategory.sub_category_image);
        setPreview(subCategory.sub_category_image);
        dispatch({ type: "FETCH_SUCCESS", payload: res.data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!sub_category_image) {
      toast.warning("Please choose a file.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axiosInstance.put(
        `/api/admin/subCategory/${id}`,
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

      console.log("category update data", data);
      if (data.subCategory) {
        toast.success("Sub Category Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/subCategory");
          dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    } catch (err) {
      dispatch({ type: "UPDATE_FAIL" });
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Sub Category
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <img src={preview} width={200} height={200}></img>
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
              <Form.Select
                aria-label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option disabled>Select Category</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat.name} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Form.Select>
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
                accept="image/png image/jpeg image/jpg"
                onChange={(e) => {
                  uploadFileHandler(e);
                }}
              />
              {uploadPercentage > 0 && (
                <ProgressBar
                  now={uploadPercentage}
                  active="true"
                  label={`${uploadPercentage}%`}
                />
              )}
            </Form.Group>
            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button
            variant="success"
            type="submit"
            disabled={loadingUpdate ? true : false}
          >
            Submit
          </Button>
          {loadingUpdate && <LoadingBox></LoadingBox>}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
