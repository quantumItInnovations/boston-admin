import React, { useContext, useReducer, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { uploadImage } from "../../uploadImage";
import { toast, ToastContainer } from "react-toastify";
import { Button, Form, ProgressBar } from "react-bootstrap";
import axios from "axios";
import LoadingBox from "../layout/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        categories: action.payload.categories,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

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
  }
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (e) => {
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

        setSubCategoryImage(location);
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
      toast.warning("Please select a category", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    try {
      setLoadingUpdate(true);

      const { data } = await axios.post(
        "http://52.91.135.217:5000/api/admin/subCategory/create",
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
          navigate("/admin/sub-category");
        }, 3000);
        
        setLoadingUpdate(false);
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

  useEffect(() => {
    console.log("fetch 1");
    const fetchData = async () => {
      console.log("fetch 2");

      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res = await axios.get(
          "http://52.91.135.217:5000/api/category/all",
          {
            headers: { Authorization: token },
          }
        );

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
    <div className="wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Add Sub Category</h1>
            </div>
          </div>
        </div>
        {/* /.container-fluid */}
      </section>

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* left column */}
            <div className="col-md-12">
              {/* jquery validation */}
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Add Details</h3>
                </div>
                {/* /.card-header */}
                {/* form start */}
                <Form onSubmit={submitHandler}>
                  <div className="card-body">
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
                        <option>Select Category</option>
                        {/* {console.log("dfsdf", categories)} */}

                        {categories &&
                          categories.map((cat) => (
                            <option key={cat.name} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="product_image">
                      <Form.Label>Upload Image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/png image/jpeg image/jpg"
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
                  </div>
                  {/* /.card-body */}
                  <div className="card-footer">
                    <Button
                      type="submit"
                      disabled={loadingUpdate ? true : false}
                    >
                      Submit
                    </Button>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                  </div>
                </Form>
                <ToastContainer />
              </div>
              {/* /.card */}
            </div>
            <div className="col-md-6"></div>
            {/*/}.col (left) */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
  );
}
