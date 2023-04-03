import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import axiosInstance from "../../utils/axiosUtil";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, Spinner } from "react-bootstrap";

export default function UpdateProfileModel(props) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { token } = state;

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobile_no, setMobileNo] = useState("");
  const [fax, setFax] = useState("");

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get("/api/user/user-profile", {
          headers: { Authorization: token },
        });

        const user = data.user;

        setFirstname(user.firstname);
        setLastname(user.lastname);
        setFax(user.fax);
        setMobileNo(user.mobile_no);

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
  }, [token, props.show]);

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setMobileNo("");
    setFax("");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log("ok");
    try {
      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axiosInstance.put(
        "/api/user/update-profile",
        {
          firstname,
          lastname,
          fax,
          mobile_no,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      // console.log("data", data);
      if (data.user) {
        toast.success("User Updated Successfully.", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        ctxDispatch({ type: "PROFILE_UPDATE", payload: data.user });
        localStorage.setItem("userInfo", JSON.stringify(data.user));

        resetForm();
        setTimeout(() => {
          dispatch({ type: "UPDATE_SUCCESS" });
        }, 3000);
      } else {
        dispatch({ type: "UPDATE_FAIL" });
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
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container
            className="small-container"
            style={{ backgroundColor: "#f4f6f9" }}
          >
            {/* <img
            src={preview}
            alt={"profile_img"}
            style={{ width: "200px", height: "200px" }}
          /> */}
            <Form.Group className="mb-3" controlId="firstname">
              <Form.Label>Firstname</Form.Label>
              <Form.Control
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastname">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="fax">
              <Form.Label>Fax</Form.Label>
              <Form.Control
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                value={mobile_no}
                onChange={(e) => setMobileNo(e.target.value)}
                required
              />
            </Form.Group>

            <ToastContainer />
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={props.onHide}>
            Close
          </Button>
          <Button variant="success" type="submit">
            {loadingUpdate ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Submit"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
