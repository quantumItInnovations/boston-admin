import React, { useReducer, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "../components/layout/LoadingBox";
import axiosInstance from "../axiosUtil";

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
      const { data } = await axiosInstance.post("/api/admin/login", {
        email: username,
        password: password,
      });

      console.log("data", data);
      if (data.token) {
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
        localStorage.setItem("userInfo", JSON.stringify(data.user));
        localStorage.setItem("token", JSON.stringify(data.token));

        navigate("/admin/dashboard");
        dispatch({ type: "FETCH_SUCCESS" });
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
    <Container fluid className="p-0 vh-100 f-center flex-column login-page">
      <div className="login-logo">
        <Link to="/" className="text-center">
          <b>Boston George</b>
        </Link>
      </div>

      <Card className="login-box">
        <Card.Body>
          <p className="text-center">Sign in to start your session</p>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="text" className="input-group mb-3">
              <Form.Control
                placeholder="Username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <InputGroup.Text>
                <span className="fas fa-envelope" />
              </InputGroup.Text>
            </Form.Group>
            <Form.Group controlId="password" className="input-group mb-3">
              <Form.Control
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text>
                <span className="fas fa-lock" />
              </InputGroup.Text>
            </Form.Group>
            <Row>
              <Col sm={7} className="mb-sm-0 mb-3">
                <Form.Group controlId="remember">
                  <Form.Check
                    type="checkbox"
                    id="default-checkbox"
                    label="Remember Me"
                  />
                </Form.Group>
              </Col>
              <Col sm={5}>
                <Button type="submit" className="float-sm-end">
                  {loading ? <LoadingBox></LoadingBox> : "Sign In"}
                </Button>
              </Col>
            </Row>
          </Form>
          <ToastContainer />
        </Card.Body>
      </Card>
    </Container>
  );
}
