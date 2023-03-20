import React, { useContext, useEffect, useReducer, useState } from "react";
import Chart from "react-google-charts";
import axiosInstance from "../../axiosUtil";
import { Store } from "../../Store";
import { getError } from "../../utils";

import MessageBox from "./MessageBox";
import LoadingBox from "./LoadingBox";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Form, Container } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        summary: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function Dashboard() {
  const [{ loading, summary, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
  });
  const { state } = useContext(Store);
  const { token } = state;
  const [time, setTime] = useState("weekly");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/admin/statistics/${time}`,
          {
            headers: { Authorization: token },
          }
        );
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
  }, [token, time]);
  return (
    <Container fluid>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          {/* Content Header (Page header) */}
          <div className="content-header">
            <div className="container-fluid">
              <div className="row mb-2">
                <div className="col-sm-6">
                  <h1 className="m-0 text-dark">Dashboard</h1>
                </div>
                {/* /.col */}
                <div className="col-sm-6">
                  <div className="d-flex justify-content-end align-item-center">
                    <Form className="py-2">
                      <Form.Group controlId="time">
                        <Form.Label className="mr-2 mb-0">
                          Statistics For
                        </Form.Label>
                        <Form.Select
                          value={time}
                          onChange={(e) => {
                            setTime(e.target.value);
                          }}
                          aria-label="Default select example"
                        >
                          <option>Select Time</option>
                          <option value="daily">Daily Statistics</option>
                          <option value="weekly">Weekly Statistics</option>
                          <option value="monthly">Monthly Statistics</option>
                        </Form.Select>
                      </Form.Group>
                    </Form>
                  </div>
                </div>
              </div>
              {/* /.row */}
            </div>
            {/* /.container-fluid */}
          </div>
          <section className="content">
            <div className="container-fluid">
              {/* Small boxes (Stat box) */}
              <div className="row">
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-info">
                    <div className="inner">
                      <h3>
                        {summary.users && summary.users[0]
                          ? summary.users[0].total
                          : 0}
                      </h3>
                      <p>Users</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-person-add" />
                    </div>
                    <Link to="/admin/users" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-success">
                    <div className="inner">
                      <h3>
                        {summary.orders && summary.orders[0]
                          ? summary.orders[0].total
                          : 0}
                        <sup style={{ fontSize: 20 }}></sup>
                      </h3>
                      <p>Orders</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-person" />
                    </div>
                    <Link to="/admin" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-warning">
                    <div className="inner">
                      <h3>
                        {summary.payments && summary.payments[0]
                          ? summary.payments[0].total
                          : 0}
                      </h3>
                      <p>Total Orders Price</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-stats-bars" />
                    </div>
                    <Link to="/admin/payments" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}
                <div className="col-lg-3 col-6">
                  {/* small box */}
                  <div className="small-box bg-danger">
                    <div className="inner">
                      <h3>
                        {summary.quantity && summary.quantity[0]
                          ? summary.quantity[0].total
                          : 0}
                      </h3>
                      <p>Total Orders Product Quantity</p>
                    </div>
                    <div className="icon">
                      <i className="ion ion-pie-graph" />
                    </div>
                    <Link to="/admin/subscription-types" className="small-box-footer">
                      More info <i className="fas fa-arrow-circle-right" />
                    </Link>
                  </div>
                </div>
                {/* ./col */}
              </div>
              {/* /.row */}
              {/* Main row */}
              <div className="my-3">
                <Row>
                  <Col md={6}>
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h2 className="card-title">User</h2>
                      </div>
                      <div className="card-body">
                        {summary.dailyUsers.length === 0 ? (
                          <MessageBox>No Users Added</MessageBox>
                        ) : (
                          <Chart
                            // style={{ border: "1px solid #aaa" }}
                            width="100%"
                            height="400px"
                            chartType="AreaChart"
                            loader={<div>Loading Users...</div>}
                            options={{
                              vAxis: {
                                title: "Count",
                                titleTextStyle: { color: "#1fd655" },
                              },

                              colors: ["#00ab41"],
                            }}
                            data={[
                              ["Date", "Count"],
                              ...summary.dailyUsers.map((x) => [
                                x._id,
                                x.total,
                              ]),
                            ]}
                          ></Chart>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h2 className="card-title">Orders</h2>
                      </div>
                      <div className="card-body">
                        {summary.dailyOrders.length === 0 ? (
                          <MessageBox>No Orders</MessageBox>
                        ) : (
                          <Chart
                            // style={{ border: "1px solid #aaa" }}
                            width="100%"
                            height="400px"
                            chartType="AreaChart"
                            loader={<div>Loading Orders...</div>}
                            options={{
                              vAxis: {
                                title: "Count",
                                titleTextStyle: { color: "#1fd655" },
                              },

                              colors: ["#00c04b"],
                            }}
                            data={[
                              ["Date", "Count"],
                              ...summary.dailyOrders.map((x) => [
                                x._id,
                                x.total,
                              ]),
                            ]}
                          ></Chart>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col md={6}>
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h2 className="card-title">Total Order Amount</h2>
                      </div>
                      <div className="card-body">
                        {summary.dailyPayments.length === 0 ? (
                          <MessageBox>No Payments Added</MessageBox>
                        ) : (
                          <Chart
                            // style={{ border: "1px solid #aaa" }}
                            width="100%"
                            height="400px"
                            chartType="AreaChart"
                            loader={<div>Loading Payments...</div>}
                            options={{
                              vAxis: {
                                title: "Count",
                                titleTextStyle: { color: "#1fd655" },
                              },

                              colors: ["#90EE90"],
                            }}
                            data={[
                              ["Date", "Count"],
                              ...summary.dailyPayments.map((x) => [
                                x._id,
                                x.total,
                              ]),
                            ]}
                          ></Chart>
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="card">
                      <div className="card-header card-header-primary">
                        <h2 className="card-title">Total Product Quantity</h2>
                      </div>
                      <div className="card-body">
                        {summary.dailyQuantity.length === 0 ? (
                          <MessageBox>No Orders</MessageBox>
                        ) : (
                          <Chart
                            // style={{ border: "1px solid #aaa" }}
                            width="100%"
                            height="400px"
                            chartType="AreaChart"
                            loader={<div>Loading Products...</div>}
                            options={{
                              vAxis: {
                                title: "Count",
                                titleTextStyle: { color: "#1fd655" },
                              },

                              colors: ["#90EE90"],
                             // title: "Subscriptions",
                            }}
                            data={[
                              ["Date", "Count"],
                              ...summary.dailyQuantity.map((x) => [
                                x._id,
                                x.total,
                              ]),
                            ]}
                          ></Chart>
                        )}
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </section>
          <ToastContainer />
        </div>
      )}
    </Container>
  );
}
