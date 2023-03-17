import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { uploadImage } from "../../uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Modal,
  Form,
  Button,
  Container,
  Col,
  Row,
  ProgressBar,
} from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import Cropper from "../cropper/cropper";
import axiosInstance from "../../axiosUtil";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
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

export default function EditCategoryModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // category/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category_image, setCategoryImage] = useState("");
  const [preview, setPreview] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/category/${id}`, {
          headers: { Authorization: token },
        });
        console.log(data);

        const category = data.category;
        setName(category.name);
        setDescription(category.description);
        setCategoryImage(category.category_image);
        setPreview(category.category_image);
        dispatch({ type: "FETCH_SUCCESS" });
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
    if (!category_image) {
      toast.warning("Please choose a file.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axiosInstance.put(
        `/api/admin/category/${id}`,
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

      console.log("category update data", data);
      if (data.category) {
        toast.success("Category Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/category");
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
          Edit Category
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <img src={preview} width={200} className="img-fluid"></img>

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
                active
                label={`${uploadPercentage}%`}
              />
            )} */}
            <Form.Group className="mb-3" controlId="category_image">
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
                  active
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
