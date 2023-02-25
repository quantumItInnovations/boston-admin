import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import LoadingBox from "../layout/LoadingBox";
import MessageBox from "../layout/MessageBox";
import EditUserModel from "./EditUser.js";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload.user };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const ViewUser = () => {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [modalShow, setModalShow] = useState(false);
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axios.get(
          `http://localhost:5000/api/admin/user/${id}`,
          {
            headers: { Authorization: token },
          }
        );
        console.log(data);

        dispatch({ type: "FETCH_SUCCESS", payload: data });
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
                  <h3 className="card-title">{user.name} Details</h3>
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
                            {/* <div className="col-md-4">
                              <div className="form-group">
                                <img
                                  src={user.category_image}
                                  alt=""
                                  width={"200px"}
                                  height={"200px"}
                                />
                              </div>
                            </div>

                            <div className="col-md-8">
                              // details
                              <div className="row"> */}
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Firstname</label>
                                    </p>
                                    <p>{user.firstname}</p>
                                  </div>
                                </div>
                                
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Lastname</label>
                                    </p>
                                    <p>{user.lastname}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Email</label>
                                    </p>
                                    <p>{user.email}</p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Telephone</label>
                                    </p>
                                    <p>{user.telephone}</p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Fax</label>
                                    </p>
                                    <p>{user.fax}</p>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Role</label>
                                    </p>
                                    <p>{user.role}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Created At</label>
                                    </p>
                                    <p>{getDateTime(user.createdAt)}</p>
                                  </div>
                                </div>

                                <div className="col-md-4">
                                  <div className="form-group">
                                    <p className="mb-0">
                                      <label>Last Update</label>
                                    </p>
                                    <p>{getDateTime(user.updatedAt)}</p>
                                  </div>
                                </div>
                              {/* </div>
                            </div> */}
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

          <EditUserModel
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
          <ToastContainer />
        </>
      )}
    </div>
  );
};

export default ViewUser;
