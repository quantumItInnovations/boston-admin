// import 'bootstrap/dist/css/bootstrap.min.css';
import React, {
  useEffect,
  useReducer,
  useContext,
  useState,
  useRef,
} from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import EditDiveShopModel from "../EditDiveShop";
import { toast, ToastContainer } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, shop: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewShopDetails = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // users/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, shop }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `http://54.175.187.169:5000/api/diveShops/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);

        dispatch({ type: "FETCH_SUCCESS", payload: data.data.shop });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
        toast.error(getError(err), {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    };
    fetchData();
  }, [id]);

  const getDateTime = (dt) => {
    const dT = dt.split(".")[0].split("T");
    return `${dT[0]} ${dT[1]}`;
  };

  return (
    <div className="wrapper">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          {/* Main content */}
          <section className="content">
            <div className="container-fluid">
              <div className="card card-primary card-outline">
                <div className="card-header">
                  <h3 className="card-title">{shop.dive_shop_name} Details</h3>
                  <div className="card-tools">
                    <i
                      className="fa fa-edit"
                      style={{ color: "blue" }}
                      onClick={() => setModalShow(true)}
                    ></i>
                  </div>
                </div>
                <div className="card-body">
                  <h4></h4>

                  <section className="content">
                    <div className="container-fluid">
                      {/* SELECT2 EXAMPLE */}
                      <div className="card card-default ">
                        {/* /.card-header */}
                        <div className="card-body">
                          <div className="row">
                            <div className="col-md-4">
                              <div className="form-group">
                                <img
                                  src={shop.shop_image_url}
                                  alt=""
                                  width={"200px"}
                                  height={"200px"}
                                />
                              </div>
                            </div>

                            <div className="col-md-8">
                              {/* details */}
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Name </label>
                                    </p>
                                    <p>{shop.dive_shop_name}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Address</label>
                                    </p>
                                    <p>{shop.address}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Distance</label>
                                    </p>
                                    <p>{shop.distance}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Summary</label>
                                    </p>
                                    <p>{shop.summary}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Phone No.</label>
                                    </p>
                                    <p>{shop.phone_number}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Created At</label>
                                    </p>
                                    <p>{getDateTime(shop.createdAt)}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Last Update</label>
                                    </p>
                                    <p>{getDateTime(shop.updatedAt)}</p>
                                  </div>
                                </div>
                              </div>
                              {/* location */}
                              <div className="row">
                                <div className="col-md-12 mt-2">
                                  <h4>Location</h4>
                                </div>

                                <div className="col-md-6">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Latitude</label>
                                    </p>
                                    <p>{shop.loc.coordinates[0]}</p>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Longitude</label>
                                    </p>
                                    <p>{shop.loc.coordinates[1]}</p>
                                  </div>
                                </div>
                              </div>
                              {/* Products */}
                              <div className="row">
                                <div className="col-md-12 mt-2">
                                  <h4>Product's List</h4>
                                </div>
                                {shop.list_of_products ? (
                                  <>
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <p>1. {shop.list_of_products[0]}</p>
                                      </div>
                                    </div>

                                    <div className="col-md-12">
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="top"
                                        overlay={
                                          <Popover id="popover-positioned-top">
                                            <Popover.Body>
                                              <ol>
                                                {shop.list_of_products.map(
                                                  (prod) => (
                                                    <li key={prod}>{prod}</li>
                                                  )
                                                )}
                                              </ol>
                                            </Popover.Body>
                                          </Popover>
                                        }
                                      >
                                        <Button variant="secondary">
                                          View More...
                                        </Button>
                                      </OverlayTrigger>
                                    </div>
                                  </>
                                ) : (
                                  <></>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* /.card-body */}
                      </div>

                      {/* /.row */}
                    </div>
                  </section>
                </div>
                {/* /.card */}
              </div>
              {/* /.card */}

              {/* /.card */}
            </div>
            {/* /.container-fluid */}
          </section>
          {/* /.content */}

          <EditDiveShopModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default ViewShopDetails;
