import React, { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../../Store";
import { getError } from "../../utils/error";
import { faqReducer as reducer } from "../../reducers/faq";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import MessageBox from "../layout/MessageBox";
import {
  Accordion,
  Button,
  Card,
  Container,
  Form,
  useAccordionButton,
} from "react-bootstrap";
import CustomPagination from "../layout/CustomPagination";
import axiosInstance from "../../utils/axiosUtil";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import EditFaqModel from "./EditFaq";
import Skeleton from "react-loading-skeleton";

function CustomToggle({ children, eventKey }) {
  const [isExpanded, setExpanded] = useState(false);
  const handleCollapse = useAccordionButton(eventKey, () => {
    setExpanded(!isExpanded);
  });

  return (
    <button
      className={`accordion-button ${isExpanded ? '' : 'collapsed'}`}
      type="button"
      aria-expanded={isExpanded}
      onClick={handleCollapse}
    >
      {children}
    </button>
  );
}

export default function Faq() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token } = state;

  const [curPage, setCurPage] = useState(1);
  const [resultPerPage, setResultPerPage] = useState(10);
  const [del, setDel] = useState(false);
  // const [BG, setBG] = useState("#fff");
  const curPageHandler = (p) => setCurPage(p);

  const [modalShow, setModalShow] = useState(false);
  const [faqId, setFaqId] = useState();
  const showModelHandler = (id) => {
    console.log({ id });
    setModalShow(true);
    setFaqId(id);
  }

  const [
    { loading, error, faqs, filteredFaqCount },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
  });

  const deleteFaq = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this FAQ?") === true
    ) {
      try {
        setDel(true);
        const res = await axiosInstance.delete(`/api/admin/faq/${id}`, {
          headers: { Authorization: token },
        });
        setDel(false);
      } catch (error) {
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axiosInstance.get(
          `/api/faq/all/?resultPerPage=${resultPerPage}&currentPage=${curPage}`,
          { headers: { Authorization: token } }
        );
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(error),
        });
        toast.error(getError(error), {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      }
    };
    fetchData();
  }, [token, del, curPage, resultPerPage]);

  const numOfPages = Math.ceil(filteredFaqCount / resultPerPage);
  const skip = resultPerPage * (curPage - 1);

  const setNewFAQ = (id, newFAQ) => {
    console.log({ id, newFAQ });
    const idx = faqs.findIndex((x) => x._id === id);
    faqs[idx].question = newFAQ.question;
    faqs[idx].answer = newFAQ.answer;
  };

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: "0%" }}
      transition={{ duration: 0.75, ease: "easeInOut" }}
      exit={{ x: "100%" }}
    >
      <Container fluid className="py-3">
        {error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Card>
            <Card.Header>
              <Button
                onClick={() => {
                  navigate(`/admin/faq/create`);
                }}
                type="success"
                className="btn btn-primary btn-block mt-1"
              >
                Add FAQ
              </Button>
            </Card.Header>
            <Card.Body>
              <Accordion defaultActiveKey="0">
                {loading ? (
                  <>
                    <Skeleton height={35} />
                    <Skeleton height={35} />
                    <Skeleton height={35} />
                    <Skeleton height={35} />
                    <Skeleton height={35} />
                  </>
                ) : (
                  faqs && faqs.map(({ _id, question, answer }, i) => (
                    <Card key={_id}>
                      <Card.Header className="accordion-header">
                        <CustomToggle eventKey={i}>{question}</CustomToggle>
                        <div className="f-center card-tools" style={{ padding: "0 1.25rem", gap: "0.5rem", backgroundColor: "#e7f1ff" }}>
                          <FaEdit color="blue" onClick={() => showModelHandler(_id)} />
                          <FaTrashAlt color="red" onClick={() => deleteFaq(_id)} />
                        </div>
                      </Card.Header>
                      <Accordion.Collapse eventKey={i}>
                        <Card.Body>{answer}</Card.Body>
                      </Accordion.Collapse>
                    </Card>
                  ))
                )}
              </Accordion>
            </Card.Body>
            <Card.Footer>
              <div className="float-start d-flex align-items-center mt-3">
                <p className="p-bold m-0 me-3">Row No.</p>
                <Form.Group controlId="resultPerPage">
                  <Form.Select
                    value={resultPerPage}
                    onChange={(e) => {
                      setResultPerPage(e.target.value);
                      setCurPage(1);
                    }}
                    aria-label="Default select example"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </Form.Select>
                </Form.Group>
              </div>
              {resultPerPage < filteredFaqCount && (
                <CustomPagination
                  pages={numOfPages}
                  pageHandler={curPageHandler}
                  curPage={curPage}
                />
              )}
            </Card.Footer>
          </Card>
        )}

        <EditFaqModel
          show={modalShow}
          onHide={() => setModalShow(!modalShow)}
          faqHandler={setNewFAQ}
          id={faqId}
        />
        <ToastContainer />
      </Container>
    </motion.div>
  );
}
