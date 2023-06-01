import React, { useEffect, useReducer, useContext, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { editReducer as reducer } from "../../reducers/commonReducer";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Modal,
  Form,
  Button,
  Container,
} from "react-bootstrap";
import LoadingBox from "../layout/LoadingBox";
import axiosInstance from "../../utils/axiosUtil";

export default function EditCategoryModel(props) {
  const { state } = useContext(Store);
  const { token } = state;
  const { id } = props; // category/:id

  const [{ loading, error, loadingUpdate }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const [faq, setFaq] = useState({
    question: "",
    answer: ""
  });

  const resetForm = () => {
    setFaq({
      question: "",
      answer: ""
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });

        const { data } = await axiosInstance.get(`/api/faq/${id}`, {
          headers: { Authorization: token },
        });
        // // console.log(data);

        const { question, answer } = data.faq;
        setFaq({ question, answer });

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
        `/api/admin/faq/${id}`, faq,
        { headers: { Authorization: token } }
      );

      // console.log("faq update data", data);
      props.faqHandler(id, faq);
      if (data.faq) {
        toast.success("FAQ Updated Succesfully.  Redirecting...", {
          position: toast.POSITION.BOTTOM_CENTER, autoClose: 2000
        });

        resetForm();
        setTimeout(() => {
          props.onHide();
        }, 3000);

      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }

      dispatch({ type: "UPDATE_SUCCESS" });

    } catch (err) {
      props.onHide();
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
          Edit FAQ
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={submitHandler}>
        <Modal.Body>
          <Container className="small-container">
            <Form.Group className="mb-3" controlId="question">
              <Form.Label>Question</Form.Label>
              <Form.Control
                value={faq.question}
                onChange={(e) => setFaq({ ...faq, question: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="answer">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                value={faq.answer}
                onChange={(e) => setFaq({ ...faq, answer: e.target.value })}
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
