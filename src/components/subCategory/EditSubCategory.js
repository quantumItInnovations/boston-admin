import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { uploadImage } from "../../uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, ProgressBar } from "react-bootstrap";
import axios from "axios";
import LoadingBox from "../layout/LoadingBox";

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
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (e, type) => {
    try {
      if (e.target.files[0]) {
        const location = await uploadImage(
          e.target.files[0],
          token,
          uploadPercentageHandler
        );
        if (location.error) {
          throw location.error;
        }

        setSubCategoryImage("location");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const res = await axios.get(
          "http://52.91.135.217:5000/api/category/all",
          {
            headers: { Authorization: token },
          }
        );

        const { data } = await axios.get(
          `http://52.91.135.217:5000/api/subCategory/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);

        const subCategory = data.subCategory;
        setName(subCategory.name);
        setDescription(subCategory.description);
        setCategory(subCategory.category);
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

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        `http://52.91.135.217:5000/api/admin/subCategory/${id}`,
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
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Sub Category Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/sub-category");
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
      <Modal.Body>
        <Container className="small-container">
          <img src={preview} width={200} height={200}></img>

          <Form>
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
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value={category._id}>{category.name}</option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat.name} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="sub_category_image">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/png, image/jpeg image/jpg"
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
          </Form>
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
          onClick={(e) => {
            submitHandler(e);
          }}
        >
          Submit
        </Button>
        {loadingUpdate && <LoadingBox></LoadingBox>}
      </Modal.Footer>
    </Modal>
  );
}
