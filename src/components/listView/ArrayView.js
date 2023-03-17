import React, { useEffect, useReducer, useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button, Container } from "react-bootstrap";
import axios from "axios";
import LoadingBox from "../LoadingBox";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
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

export default function ArrayView(props) {
  console.log("props", props);
  const { state } = useContext(Store);
  const { token } = state;
  // const { id } = props.ls; // users/:id
  // console.log("id", id);
  // const [temp, setTemp] = useState(props.ls.cond.temp);
  // const [depth, setDepth] = useState(props.ls.cond.depth);
  // const [visibility, setVisibility] = useState(props.ls.cond.visibility);
  // const [altitude, setAltitude] = useState(props.ls.cond.altitude);
  // const [skill, setSkill] = useState(props.ls.cond.skill);
  // const [swell, setSwell] = useState(props.ls.cond.swell);

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const navigate = useNavigate();
  const bodyFormData = new FormData();

  // const submitHandler = async (e) => {
  //   e.preventDefault();
  //   console.log("ok");
  //   try {
  //     dispatch({ type: "UPDATE_REQUEST" });

  //     const dive_conditions = {
  //       temp: temp,
  //       depth: depth,
  //       visibility: visibility,
  //       altitude: altitude,
  //       skill: skill,
  //       swell: swell,
  //     };
  //     // console.log(id);
  //     console.log(dive_conditions);
  //     console.log("token", token);
  //     // const { data } = await axiosInstance.put(
  //     //   `http://54.175.187.169:5000/api/diveSpots/editDiveConditions`,
  //     //   {
  //     //     dive_spot_id: id,
  //     //     dive_conditions: dive_conditions,
  //     //   },
  //     //   {
  //     //     headers: {
  //     //       Authorization: token,
  //     //     },
  //     //   }
  //     // );

  //     // console.log("data", data);
  //     //   if (data.data) {
  //     //     toast.success("User Updated Successfully.", {
  //     //       position: toast.POSITION.BOTTOM_CENTER,
  //     //     });
  //     //     setTimeout(() => {
  //     //       navigate("/admin/users");
  //     //     }, 3000);
  //     //   } else {
  //     //     toast.error(data.error.message, {
  //     //       position: toast.POSITION.TOP_CENTER,
  //     //     });
  //     //   }
  //     dispatch({ type: "UPDATE_SUCCESS" });
  //   } catch (err) {
  //     props.onHide();
  //     dispatch({ type: "UPDATE_FAIL" });
  //     console.log(err);
  //     toast.error("Invalid operation", {
  //       position: toast.POSITION.BOTTOM_CENTER,
  //     });
  //   }
  // };

  console.log("props", props);
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Shop Products List
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container
          className="small-container"
          style={{ backgroundColor: "#f4f6f9" }}
        >
          {/* <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="temp">
              <Form.Label>Temp</Form.Label>
              <Form.Control
                value={temp}
                onChange={(e) => setTemp(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="depth">
              <Form.Label>Depth</Form.Label>
              <Form.Control
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="visibility">
              <Form.Label>Visibility</Form.Label>
              <Form.Control
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="altitude">
              <Form.Label>Altitude</Form.Label>
              <Form.Control
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="skill">
              <Form.Label>Skill</Form.Label>
              <Form.Control
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="swell">
              <Form.Label>Swell</Form.Label>
              <Form.Control
                value={swell}
                onChange={(e) => setSwell(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
          <ToastContainer /> */}
          <ol>
            {props.arr && props.arr.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>
          Close
        </Button>
        {/* <Button
          variant="success"
          type="submit"
          onClick={(e) => {
            submitHandler(e);
          }}
        >
          Submit
        </Button>
        {loadingUpdate && <LoadingBox></LoadingBox>} */}
      </Modal.Footer>
    </Modal>
  );
}
