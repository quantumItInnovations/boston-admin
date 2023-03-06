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
    return subCat.category._id === categoryId;
  });
  return subCategoryList;
}

function getAllProduct(products, subCategoryId, categoryId) {
  if (!categoryId || !subCategoryId) return [];

  const productList = products.filter((prod) => {
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

  const [updated_price, setUpdatedPrice] = useState("");
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const [loadingUpdate, setLoadingUpdate] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res1 = await axios.get(
          "http://52.91.135.217:5000/api/category/all",
          {
            headers: { Authorization: token },
          }
        );

        const res2 = await axios.get(
          "http://52.91.135.217:5000/api/subCategory/all",
          {
            headers: { Authorization: token },
          }
        );

        const res3 = await axios.get(
          "http://52.91.135.217:5000/api/product/all",
          {
            headers: { Authorization: token },
          }
        );

        console.log("add product data", res1.data, res2.data, res3.data);
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
  }, [token, category, subCategory]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/promotion/create",
        {
          product,
          updated_price,
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

  return (
    <div className="wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Add Promotion</h1>
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
                    {categories && (
                      <Form.Group className="mb-3">
                        <Form.Label className="mr-3">Category</Form.Label>
                        <Form.Select
                          aria-label="Select Category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                        >
                          <option>Select Category</option>
                          {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    )}
                    {category && (
                      <Form.Group className="mb-3">
                        <Form.Label className="mr-3">Sub Category</Form.Label>
                        <Form.Select
                          aria-label="Select Sub Category"
                          value={subCategory}
                          onChange={(e) => setSubCategory(e.target.value)}
                        >
                          <option>Select Sub Category</option>
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
                    {subCategory && (
                      <Form.Group className="mb-3">
                        <Form.Label className="mr-3">Product</Form.Label>
                        <Form.Select
                          aria-label="Select Product"
                          value={product}
                          onChange={(e) => setProduct(e.target.value)}
                        >
                          <option>Select Product</option>
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
                        value={updated_price}
                        onChange={(e) => setUpdatedPrice(e.target.value)}
                        required
                      />
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
