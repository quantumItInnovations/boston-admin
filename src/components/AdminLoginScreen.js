import React, { useReducer, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import axios from "axios";
import LoadingBox from "../components/layout/LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function AdminLoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { dispatch: ctxDispatch } = useContext(Store);

  const navigate = useNavigate();
  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email: username,
          password: password,
        }
      );

      console.log("data", data);
      if (data.token) {
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem(
          "userInfo",
          JSON.stringify(data.user)
        );
        localStorage.setItem("token", JSON.stringify(data.token));


        navigate("/admin/dashboard");
        dispatch({type: "FETCH_SUCCESS"});
      } else {
        toast.error(data, { position: toast.POSITION.TOP_CENTER });
      }
    } catch (err) {
      console.log("err", err.response);
      dispatch({
        type: "FETCH_FAIL",
        payload: getError(err),
      });
      toast.error(getError(err), { position: toast.POSITION.TOP_CENTER });
    }
  };

  return (
    <div className="hold-transition login-page">
      <div className="login-box">
        <div className="login-logo">
          <Link to="/">
            <b>Boston George</b>
          </Link>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <p className="login-box-msg">Sign in to start your session</p>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="text" className="input-group mb-3">
                <Form.Control
                  placeholder="Username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope" />
                  </div>
                </div>
              </Form.Group>
              <Form.Group controlId="password" className="input-group mb-3">
                <Form.Control
                  placeholder="Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-lock" />
                  </div>
                </div>
              </Form.Group>
              <div className="row">
                <div className="col-8">
                  <div className="icheck-primary">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                  </div>
                </div>
                <div className="col-4">
                  <Button type="submit" className="btn btn-primary btn-block">
                    {loading ? <LoadingBox></LoadingBox> : "Sign In"}
                  </Button>
                </div>
              </div>
            </Form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
}
