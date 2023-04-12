import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { uploadMultiImage } from "../../utils/uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, ProgressBar } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

function getAllSubCategory(subCategories, categoryId) {
  if (!categoryId) return [];

  const subCategoryList = subCategories.filter((subCat) => {
    if (subCat.category) return subCat.category === categoryId;
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
  const [product_images, setProductImage] = useState(null);
  const [category, setCategory] = useState("");
  const [sub_category, setSubCategory] = useState("");
  const [preview, setPreview] = useState("");

  const stockHandler = (e) => {
    e.persist();
    console.log(e.target.value);
    setStock(e.target.value === "true" ? true : false);
  };

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (e, type) => {
    if (!e.target.files[0]) {
      setProductImage(null);
      return;
    }
    for (let k in e.target.files) {
      if (e.target.files[k].size > 5000000) {
        toast.warning("One of the image size is too large. (max size 5MB)", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setProductImage(null);
        return;
      }
    }
    try {
      if (e.target.files[0]) {
        const location = await uploadMultiImage(
          e.target.files,
          token,
          uploadPercentageHandler
        );
        if (location.error) {
          throw location.error;
        }

        setProductImage([...location]);
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

        const res = await axiosInstance.get("/api/admin/all");

        const { data } = await axiosInstance.get(`/api/product/${id}`, {
          headers: { Authorization: token },
        });
        console.log("edit product data", res, data);

        const product = data.product;
        setName(product.name);
        setDescription(product.description);
        setStock(product.stock);
        setAmount(product.amount);
        if (product.category) setCategory(product.category._id);
        if (product.sub_category) setSubCategory(product.sub_category._id);
        setProductImage(product.product_images[0]);
        setPreview(product.product_images[0]);

        console.log(res.data.categories, res.data.subCategories);
        setCategories([...res.data.categories]);
        setSubCategories([...res.data.subCategories]);
        dispatch({ type: "FETCH_SUCCESS" });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!category) {
      toast.warning("Please select a category.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    if (!sub_category) {
      toast.warning("Please select a sub category.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    if (!product_images) {
      toast.warning("Please choose a file.", {
        position: toast.POSITION.BOTTOM_CENTER,
      });
      return;
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axiosInstance.put(
        `/api/admin/product/${id}`,
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
        toast.success("Product Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/products");
          dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
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
          Edit Product
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <img src={preview} alt="" width={"200px"} height={"200px"} />
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
                checked={stock === true}
              />
              <Form.Check
                inline
                label="Out-Of-Stock"
                value="false"
                type="radio"
                id="inline-radio-2"
                onChange={stockHandler}
                checked={stock === false}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="mr-3">Category</Form.Label>
              <Form.Select
                aria-label="Select Category"
                value={category}
                onChange={(e) => {
                  setSubCategory("");
                  setCategory(e.target.value);
                }}
              >
                <option key="blankChoice" hidden value>
                  Select Category
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
                >
                  <option key="blankChoice" hidden value>
                    Select Sub Category
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
                accept="image/*"
                onChange={(e) => {
                  uploadFileHandler(e);
                }}
                multiple
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
