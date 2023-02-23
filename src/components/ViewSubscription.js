import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import EditSubscriptionModel from "../EditSubscriptionType";
import { toast, ToastContainer } from "react-toastify";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, type: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewSubscriptionTypeDetails = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // users/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, type }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `http://54.175.187.169:5000/api/subscriptions/types/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);

        dispatch({ type: "FETCH_SUCCESS", payload: data.data.type });
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
                  <h3 className="card-title">{type.name} Details</h3>
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
                                <p className="mb-0">
                                  <label>Name </label>
                                </p>
                                <p>{type.name}</p>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Amount</label>
                                </p>
                                <p>{type.amount}</p>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Free Trial</label>
                                </p>
                                <p>{type.free_trial}</p>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Created At</label>
                                </p>
                                <p>{getDateTime(type.createdAt)}</p>
                              </div>
                            </div>

                            <div className="col-md-4">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Last Update</label>
                                </p>
                                <p>{getDateTime(type.updatedAt)}</p>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col">
                              <div className="form-group">
                                <p className="mb-0">
                                  <label>Description</label>
                                </p>
                                <ol>
                                  {type.description &&
                                    type.description.map((des) => (
                                      <li key={des}>{des}</li>
                                    ))}
                                </ol>
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

          <EditSubscriptionModel show={modalShow} onHide={() => setModalShow(false)} />
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default ViewSubscriptionTypeDetails;
