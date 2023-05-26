import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { uploadImage } from "../../utils/uploadImage";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container, ProgressBar } from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function EditUserModel(props) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = useParams(); // user/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [mobile_no, setMobileNo] = useState("");
  // const [fax, setFax] = useState("");
  const [role, setRole] = useState("");

  const resetForm = () => {
    setFirstname("");
    setLastname("");
    setMobileNo("");
    // setFax("");
    setRole("");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/admin/user/${id}`, {
          headers: { Authorization: token },
        });
        // console.log(data);

        const user = data.user;
        // setPassword(user.password);
        setFirstname(user.firstname);
        setLastname(user.lastname);
        setMobileNo(user.mobile_no);
        // setFax(user.fax);
        setRole(user.role);

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

      const { data } = await axiosInstance.put(
        `/api/admin/user/${id}`,
        {
          firstname,
          lastname,
          mobile_no,
          // fax,
          role,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      // console.log("user update data", data);
      if (data.user) {
        toast.success("User Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        resetForm();
        setTimeout(() => {
          navigate("/admin/users");
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
        <Modal.Title id="contained-modal-title-vcenter">Edit User</Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            {/* <Form.Group className="mb-3" controlId="name">
              <Form.Label>Password</Form.Label>
              <Form.Control
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group> */}

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

            <Form.Group className="mb-3" controlId="mobile_no">
              <Form.Label>Mobile No.</Form.Label>
              <Form.Control
                value={mobile_no}
                onChange={(e) => setMobileNo(e.target.value)}
                required
              />
            </Form.Group>

            {/* <Form.Group className="mb-3" controlId="fax">
              <Form.Label>Fax</Form.Label>
              <Form.Control
                value={fax}
                onChange={(e) => setFax(e.target.value)}
                required
              />
            </Form.Group> */}

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
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
