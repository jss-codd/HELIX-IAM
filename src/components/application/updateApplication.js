import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap'
import { useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";



const UpdateApplicationModel = ({ showModel, setShowModel, getApplicationData, setEditableData, heading, applicationData }) => {
    const { register, control, handleSubmit, reset, formState: { errors }, setValue } =
        useForm();

    const { fields, append, remove } = useFieldArray({ name: "config", control });

    const navigate = useNavigate();
    const [activeStatus, setActiveStatus] = useState(false);
    const [logo, setLogo] = useState("");
    const [changeLogo, setChangeLogo] = useState(false);
    useEffect(() => {
        setValue("name", applicationData.name);
        setValue("description", applicationData.description);
        setActiveStatus(applicationData.active)
        setLogo(applicationData.logo)
    }, [applicationData]);


    const onSubmit = async (data) => {
        console.log(data, "..................data");
        setShowModel(false);
        try {

            let formData = new FormData();

            let formObj = {};
            formObj.name = data.name;
            formObj.description = data.description;
            formObj.active = activeStatus;

            formData.append('applicationData', JSON.stringify(formObj))

            if (data?.logo !== undefined) {
                formData.append("file", data?.logo[0]);
            }

            const accessToken = localStorage.getItem("accessToken");
            const res = await axios.put(
                `${process.env.REACT_APP_HELIX_SERVER_URL}/application/${applicationData?._id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            getApplicationData();
            setShowModel(false);
            setEditableData({});
            setActiveStatus("");
            setChangeLogo(false)
            notify("Application updated successfully");
            reset({});
        } catch (error) {
            notifyError("Something went wrong");
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
                setEditableData({});
                setActiveStatus("");
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
                // setShowModel(false);
                setEditableData({});
            },
        });
    const handleSelect = (event) => {
        setActiveStatus(event.target.checked);
    }

    const handleChangeLogo = () => {
        setChangeLogo(!changeLogo)
    }

    return (
        <div>
            <Modal
                isOpen={showModel}

            >
                <ModalHeader toggle={() => {
                    setShowModel(false)
                    setEditableData({})
                    setActiveStatus("");
                }}>
                    {heading}
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="hide-logo">
                            <img src={logo}
                                alt="logo"
                                className="application-logo"
                            />
                            <Button className="hide-logo-button" onClick={handleChangeLogo}>{changeLogo ? "Hide Logo Option" : "Change Logo"}</Button>
                        </div>
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
                            {errors.name && <p className='form-error'>{errors.name.message}</p>}

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

                            {changeLogo && <div className="form-group">
                                <label>Logo:</label>
                                <input
                                    required={changeLogo ? true : false}
                                    type="file"
                                    name={`logo`}
                                    {...register(`logo`)}
                                    accept=".jpg, .jpeg, .png"
                                    className="form-control default-option"
                                    aria-describedby="emailHelp"
                                    placeholder="Logo"
                                />
                            </div>}
                            <div className="form-group application-active-checkbox">
                                <label>Active:</label>
                                <input className="form-check-input application-Check" type="checkbox" checked={activeStatus} onChange={(e) => handleSelect(e)} id="flexCheckIndeterminate" />
                                {/* <input
                                    type="checkbox"
                                    name={`active`}
                                    checked={activeStatus}
                                    onChange={(e) => handleSelect(e)}
                                    className="input-legend "
                                    placeholder="Active"
                                    id="active-switch"
                                />
                                <label htmlFor="active-switch" className="toggleButton">Toggle</label> */}
                            </div>
                        </div>
                        <div className="submit_div">
                            <Button color="success">Update</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default UpdateApplicationModel
