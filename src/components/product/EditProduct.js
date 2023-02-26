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

function getAllSubCategory(subCategories, categoryId) {
  if (!categoryId) return [];

  const subCategoryList = subCategories.filter((subCat) => {
    return subCat.category._id === categoryId;
  });
  return subCategoryList;
}

export default function EditProductModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // product/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [stock, setStock] = useState("");
  const [product_images, setProductImage] = useState("");
  const [category, setCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");
  const [preview, setPreview] = useState("");

  const stockHandler = (e) => {
    e.persist();
    console.log(e.target.value);
    setStock(e.target.value);
  };

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

        setProductImage("location");
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

        const res1 = await axios.get("http://localhost:5000/api/category/all", {
          headers: { Authorization: token },
        });

        const res2 = await axios.get(
          "http://localhost:5000/api/subCategory/all",
          {
            headers: { Authorization: token },
          }
        );

        const { data } = await axios.get(
          `http://localhost:5000/api/product/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);

        const product = data.product;
        console.log("product", product);
        setName(product.name);
        setDescription(product.description);
        setStock(product.stock);
        setAmount(product.amount);
        setCategory(product.category);
        setSubCategory(product.sub_category);
        setProductImage(product.product_images);
        setPreview(category.product_images);
        setCategories(res1.data.categories);
        setSubCategories(res2.data.subCategories);
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

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/product/${id}`,
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

      console.log("product update data", data);
      if (data.product) {
        dispatch({ type: "UPDATE_SUCCESS" });
        toast.success("Product Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/products");
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

  console.log("category", category, sub_category);
  const [openCategory, setOpenCategory] = useState(false);
  const [openSubCategory, setOpenSubCategory] = useState(false);
  const selectCategoryHandler = () => setOpenCategory(!openCategory);
  const selectSubCategoryHandler = () => setOpenSubCategory(!openSubCategory);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Product
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

            <Form.Group className="mb-3" controlId="amount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
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
                checked={stock}
              />
              <Form.Check
                inline
                label="Out-Of-Stock"
                value="false"
                type="radio"
                id="inline-radio-2"
                onChange={stockHandler}
                checked={!stock}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mr-3">Category</Form.Label>
              <Form.Select
                aria-label="Select Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                onClick={selectCategoryHandler}
              >
                <option>
                  {openCategory ? "Select Category" : `${category.name}`}
                </option>
                {categories &&
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            {category && (
              <Form.Group className="mb-3">
                <Form.Label className="mr-3">Sub Category</Form.Label>
                <Form.Select
                  aria-label="Select Sub Category"
                  value={sub_category}
                  onChange={(e) => setSubCategory(e.target.value)}
                  onClick={selectSubCategoryHandler}
                >
                  <option>
                    {openSubCategory
                      ? "Select Sub Category"
                      : `${sub_category.name}`}
                  </option>

                  {subCategories &&
                    category &&
                    getAllSubCategory(subCategories, category).map((subCat) => (
                      <option key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>
            )}

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
