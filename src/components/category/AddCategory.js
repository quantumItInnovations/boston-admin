import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../../Store";
import { getError } from "../../utils";
import { uploadImage } from "../../uploadImage";
import { toast, ToastContainer } from "react-toastify";
import { Button, Form, ProgressBar } from "react-bootstrap";
import axios from "axios";
import LoadingBox from "../layout/LoadingBox";

export default function AddCategory() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { token, userInfo } = state;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category_image, setCategoryImage] = useState("");

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const uploadPercentageHandler = (per) => {
    setUploadPercentage(per);
  };

  const uploadFileHandler = async (e, type) => {
    try {
      if (e.target.files[0]) {
        const location = await uploadImage(
          e.target.files[0],
          token,
          uploadPercentageHandler
        );
        if (location.error) {
          throw location.error;
        }

        setCategoryImage(location);
        setTimeout(() => {
          setUploadPercentage(0);
        }, 1000);
      }
    } catch (error) {
      toast.error(error, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://52.91.135.217:5000/api/admin/category/create",
        {
          name,
          description,
          category_image,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      console.log("category add data", data);
      if (data.category) {
        toast.success("Category Added Succesfully", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        setTimeout(() => {
          navigate("/admin/category");
        }, 3000);

        setLoadingUpdate(false);
      } else {
        toast.error(data.error.message, {
          position: toast.POSITION.TOP_CENTER,
        });
        setLoadingUpdate(false);
      }
    } catch (err) {
      setLoadingUpdate(false);
      toast.error(getError(err), {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };

  return (
    <div className="wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Add Category</h1>
            </div>
          </div>
        </div>
        {/* /.container-fluid */}
      </section>

      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* left column */}
            <div className="col-md-12">
              {/* jquery validation */}
              <div className="card card-primary">
                <div className="card-header">
                  <h3 className="card-title">Add Details</h3>
                </div>
                {/* /.card-header */}
                {/* form start */}
                <Form>
                  <div className="card-body">
                    <Form.Group className="mb-3" controlId="name">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="description">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="product_image">
                      <Form.Label>Upload Image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/png, image/jpeg image/jpg"
                        onChange={(e) => {
                          uploadFileHandler(e);
                        }}
                      />
                      {uploadPercentage > 0 && (
                        <ProgressBar
                          now={uploadPercentage}
                          active
                          label={`${uploadPercentage}%`}
                        />
                      )}
                    </Form.Group>
                  </div>
                  {/* /.card-body */}
                  <div className="card-footer">
                    <Button
                      type="submit"
                      onClick={(e) => {
                        submitHandler(e);
                      }}
                    >
                      Submit
                    </Button>
                    {loadingUpdate && <LoadingBox></LoadingBox>}
                  </div>
                </Form>
                <ToastContainer />
              </div>
              {/* /.card */}
            </div>
            <div className="col-md-6"></div>
            {/*/}.col (left) */}
          </div>
          {/* /.row */}
        </div>
        {/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
  );
}
