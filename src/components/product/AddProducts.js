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
        subCategories: action.payload.subCategories,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

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
  const [product_images, setProductImage] = useState("");
  const [category, setCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");

  const [loadingUpdate, setLoadingUpdate] = useState(false);
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

        setProductImage(location);
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

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/product/create",
        {
          name,
          description,
          amount,
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
        setTimeout(() => {
          navigate("/admin/products");
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
        const res1 = await axios.get("http://localhost:5000/api/category/all", {
          headers: { Authorization: token },
        });

        const res2 = await axios.get(
          "http://localhost:5000/api/subCategory/all",
          {
            headers: { Authorization: token },
          }
        );

        console.log("add product data", res1, res2);
        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            categories: res1.data.categories,
            subCategories: res2.data.subCategories,
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

  return (
    <div className="wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Add Product</h1>
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
                <Form>
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
                    <Form.Group className="mb-3" controlId="amount">
                      <Form.Label>Amount</Form.Label>
                      <Form.Control
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
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

                    <Form.Group className="mb-3">
                      <Form.Label className="mr-3">Sub Category</Form.Label>
                      <Form.Select
                        aria-label="Select Sub Category"
                        onChange={(e) => setSubCategory(e.target.value)}
                      >
                        <option>Select Sub Category</option>
                        {subCategories &&
                          subCategories.map((subCat) =>
                            subCat.category._id === category ? (
                              <option key={subCat.name} value={subCat._id}>
                                {subCat.name}
                              </option>
                            ) : (
                              <></>
                            )
                          )}
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="product_image">
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
                  </div>
                  {/* /.card-body */}
                  <div className="card-footer">
                    <Button
                      type="submit"
                      onClick={(e) => {
                        submitHandler(e);
                      }}
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
