import React, { useEffect, useReducer, useContext, useState } from "react";
import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import EditDealModel from "../EditDeals";
import { toast, ToastContainer } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, offer: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewDealDetails = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // users/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, offer }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `http://54.175.187.169:5000/api/offers/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);

        dispatch({ type: "FETCH_SUCCESS", payload: data.data.offer });
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
                  <h3 className="card-title">Offer Details</h3>
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
                                <h4 className="mb-1">Image</h4>
                                <img
                                  src={offer.image_url}
                                  alt=""
                                  width={"200px"}
                                  height={"200px"}
                                />
                                <h4 className="mb-1 mt-2">Banner Image</h4>
                                <img
                                  src={offer.banner_image_url}
                                  alt=""
                                  width={"200px"}
                                  height={"200px"}
                                />
                              </div>
                            </div>

                            <div className="col-md-8">
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Price </label>
                                    </p>
                                    <p>{offer.price}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Place Address</label>
                                    </p>
                                    <p>{offer.place_address}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Description</label>
                                    </p>
                                    <p>{offer.description}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Head</label>
                                    </p>
                                    <p>{offer.head}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Summary</label>
                                    </p>
                                    <p>{offer.summary}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Created At</label>
                                    </p>
                                    <p>{getDateTime(offer.createdAt)}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Last Update</label>
                                    </p>
                                    <p>{getDateTime(offer.updatedAt)}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-12 mt-2">
                                  <h4>What's Included</h4>
                                </div>
                                {offer.whats_included ? (
                                  <>
                                    <div className="col-md-12">
                                      <div className="form-group">
                                        <p>1. {offer.whats_included[0]}</p>
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
                                                {offer.whats_included.map(
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
                                          View More ...
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

          <EditDealModel show={modalShow} onHide={() => setModalShow(false)} />
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default ViewDealDetails;
