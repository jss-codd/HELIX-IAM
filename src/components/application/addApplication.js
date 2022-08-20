import React, { useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";



const AddApplicationModel = ({ showModel, setShowModel, getApplicationData, heading }) => {
  const navigate = useNavigate();
  const { register, control, handleSubmit, reset, formState:{ errors }, watch } =
    useForm();
  const { fields, append, remove } = useFieldArray({ name: "config", control });

  const [activeStatus, setActiveStatus] = useState(true);
  const [showError, setShowError] = useState(false);

  const onSubmit = async (data) => {
    setShowModel(false);
    try {
      let formObj = {};
      formObj.name = data.name;
      formObj.description = data.description;
      formObj.active = activeStatus;

      let formData = new FormData();
      formData.append('applicationData', JSON.stringify(formObj))
      formData.append("file", data?.logo[0]);
      // display form data on success
      console.log(formData, "formData")
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.post(
        `${process.env.REACT_APP_HELIX_SERVER_URL}/application/create`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("----res----", res);
      notify("Application created successfully");
      setShowModel(false);
      getApplicationData()
      reset({});
    } catch (error) {
      if (error.message === "Request failed with status code 409") {
        notifyError("Application Already Exist");
      } else {
        notifyError("Something went wrong");
      }

    }
  };


  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => {
        setShowModel(false);
      },
    });

  const notify = (message) =>
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      onClose: () => {
        navigate("/application");

        setShowModel(false);
      },
    });
  const handleSelect = (event) => {
    setActiveStatus(event.target.checked);
  }

  const checkApplicationExits = async (e) => {
    let applicationName = e.target.value;
    console.log(applicationName, "applicationName");

    const accessToken = localStorage.getItem("accessToken");
    let res = await axios.get(`${process.env.REACT_APP_HELIX_SERVER_URL}/application/isApplicationExist/${applicationName}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setShowError(res?.data)

  }

  return (
    <div>

      <Modal
        isOpen={showModel}

      >
        <ModalHeader toggle={() => setShowModel(false)}>
          {heading}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group" style={{ padding: "20px" }}>
              <label>Name:</label>
              <input
                type="text"
                required={true}
                name={`name`}
                {...register(`name`, {
                  required: true,
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "*Only accepts alphabetical value!"
                  }
                })}
                className="form-control"
                aria-describedby="emailHelp"
                placeholder="Name"
              />
              {/* {formState.errors.email?.message && (
                <FormError errorMessage={formState.errors.email?.message} />
              )} */}
              {errors.name && <p className='form-error'>{errors.name.message}</p>}
              {/* {showError && <div style={{ color: "red" }} >This sensor device id exist already.</div>} */}
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  required={true}
                  name={`description`}
                  {...register(`description`, { required: true })}
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Description"
                />
              </div>
              <div className="form-group">
                <label>Logo:</label>
                <input
                  type="file"
                  required={true}
                  name={`logo`}
                  {...register(`logo`, { required: true })}
                  accept=".jpg, .jpeg, .png"
                  className="form-control default-option"
                  aria-describedby="emailHelp"
                  placeholder="Logo"
                />
              </div>
              <div className="form-group application-active-checkbox">
                <label>Active:</label>
                {/* <input
                  type="checkbox"
                  name={`active`}
                  checked={activeStatus}
                  onChange={(e)=>handleSelect(e)}
                  className="input-legend "
                  placeholder="Active"
                  id="active-switch"
                /> */}
                <input className="form-check-input application-Check" type="checkbox" checked={activeStatus} onChange={(e) => handleSelect(e)} id="flexCheckIndeterminate" />
                {/* <label htmlFor="active-switch" className="toggleButton">Toggle</label> */}
              </div>
            </div>
            <div className="submit_div">
              <Button color="success">Submit</Button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default AddApplicationModel
