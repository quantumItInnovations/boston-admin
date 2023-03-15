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
    if (subCat.category) return subCat.category._id === categoryId;
  });
  return subCategoryList;
}

function getAllProduct(products, subCategoryId, categoryId) {
  if (!categoryId || !subCategoryId) return [];

  const productList = products.filter((prod) => {
    if (prod.sub_category && prod.category)
      return (
        prod.sub_category._id === subCategoryId &&
        prod.category._id === categoryId
      );
  });
  return productList;
}

export default function EditPromotionModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // promotion/:id

  const [
    { loading, error, loadingUpdate, categories, subCategories, products },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [promo_image, setPromoImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [updated_price, setUpdatedPrice] = useState("");
  const [product, setProduct] = useState(null);

  const [uploadPercentage, setUploadPercentage] = useState(0);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (e, type) => {
    if (!e.target.files[0]) {
      setPromoImage(null);
      return;
    }
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

        setPromoImage(location);
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

  const resetForm = () => {
    setPreview(null);
    setUpdatedPrice(null);
    setPromoImage(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const res1 = await axios.get(
          "https://boston-api.adaptable.app/api/category/all",
          {
            headers: { Authorization: token },
          }
        );

        const res2 = await axios.get(
          "https://boston-api.adaptable.app/api/subCategory/all",
          {
            headers: { Authorization: token },
          }
        );

        const res3 = await axios.get(
          "https://boston-api.adaptable.app/api/product/all",
          {
            headers: { Authorization: token },
          }
        );

        const { data } = await axios.get(
          `https://boston-api.adaptable.app/api/promotion/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log("edit promotion", data);
        console.log("add promotion data", res1.data, res2.data, res3.data);

        const promotion = data.promotion;
        setProduct(promotion.product);
        setUpdatedPrice(promotion.updated_price);
        setPreview(promotion.promo_image);
        setPromoImage(promotion.promo_image);

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
  }, [id, props.show]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!promo_image) {
      toast.warning("Please choose a file.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      dispatch({ type: "UPDATE_REQUEST" });
      const { data } = await axios.put(
        `https://boston-api.adaptable.app/api/admin/promotion/${id}`,
        {
          product,
          updated_price,
          promo_image,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("promotion update data", data);
      if (data.promotion) {
        toast.success("Promotion Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/promotions");
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
          Edit Promotion
        </Modal.Title>
      </Modal.Header>
      {loading ? (
        <LoadingBox />
      ) : (
        <Form onSubmit={submitHandler}>
          <Modal.Body>
            <Container className="small-container">
              <img src={preview} width={200} height={200}></img>
              <Form.Group className="mb-3" controlId="updated_price">
                <Form.Label>Updated Price</Form.Label>
                <Form.Control
                  value={updated_price}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="promotion_image">
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
      )}
    </Modal>
  );
}
