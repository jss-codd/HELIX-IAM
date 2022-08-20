import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dropdown, DropdownItem, DropdownMenu, Button } from "reactstrap";
import { KeycloackContext } from "../Keycloack/KeycloackContext";
import ModelComponent from "../Model";
import AddApplicationModel from './addApplication'
import UpdateApplicationModel from "./updateApplication"
import "./ViewApplication.css";

const ViewApplcationData = () => {
    const [applicationList, setApplicationList] = useState([]);
    const navigate = useNavigate();
    const [showModel, setShowModel] = useState(false);
    const [showAddModel, setShowAddModel] = useState(false);
    const [showEditModel, setShowEditModel] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [editableData, setEditableData] = useState({});
    const [deleteData,setDeleteData] = useState("")
    const [showAction, setShowAction] = useState(null);
    const { keycloackValue, authenticated, logout } =
        useContext(KeycloackContext);

    const getApplicationData = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const res = await axios.get(
                `${process.env.REACT_APP_HELIX_SERVER_URL}/application`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log(res.data, "res====");
            setApplicationList(res.data);
        } catch (error) { }
    };

    useEffect(() => {
        console.log("-keyclockkk----url----", process.env.REACT_APP_KEYCLOAK_URL);
        if (keycloackValue?.authenticated === true) {
            getApplicationData();
        }
    }, [keycloackValue]);

    const handleDelete = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const res = await axios.delete(
                `${process.env.REACT_APP_HELIX_SERVER_URL}/application/${deleteData}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            setShowModel(false);
            notify("Application deleted successfully");
            getApplicationData();
            setDeleteData("")
        } catch (error) {
            notifyError("Unauthorized");
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
            },
        });

    const onClickDelete = async (id) => {
        console.log(id,"this is the id >>>>>>>>>>>>>")
        setDeleteData(id)
        setShowModel(true);
    };

    const handleEdit=(dta)=>{
        setEditableData(dta)
        setShowEditModel(true);
    }

    return (
        <div>
            <ToastContainer theme="dark" />
            <ModelComponent
                showModel={showModel}
                setShowModel={setShowModel}
                handleDelete={handleDelete}
                delUser={"Application"}
                heading={" Application"}
            />

            <AddApplicationModel
                showModel={showAddModel}
                setShowModel={setShowAddModel}
                getApplicationData={getApplicationData}
                delUser={"record"}
                heading={"Add Applications"}
            />
               <UpdateApplicationModel
                showModel={showEditModel}
                getApplicationData={getApplicationData}
                setShowModel={setShowEditModel}
                applicationData={editableData}
                setEditableData={setEditableData}
                heading={"Edit Application"}
            />
            <div className="sidebar">
                <div className="main-section">
                    {/* ---------------------------table-------------------- */}
                    <div className="table_content_config_data">
                        <h5> Application List</h5>
                        
                        <Button
                            color="danger"
                            onClick={() => {
                                setShowAddModel(true)
                            }}
                        >
                            Add Application
                        </Button>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr className="bg-heading">
                                <th>SNo.</th>
                                <th>Id</th>
                                <th>Application Name</th>
                                <th>Active Status</th>
                                <th>Actions</th>

                                {/* {loginUserRole !== "Sub User" && <th>Actions</th>} */}
                            </tr>
                        </thead>
                        <tbody className="table_body">
                            {applicationList?.map((dta, idx) => {
                                return (
                                    <tr key={idx}>
                                        <th scope="row">{idx + 1}</th>
                                        <td>{dta?._id}</td>
                                        <td>{dta?.name}</td>
                                        <td>{dta?.active ? "Enabled" : "Disabled"}</td>

                                        {/* <td>{dta?.enabled ? "true" : "false"}</td> */}
                                        {/* <td>{moment(dta?.createdTimestamp).format("L")}</td> */}

                                        <td>
                                            <div className="application-actions">
                                                <Button onClick={()=>handleEdit(dta)} color="secondary">
                                                    Edit
                                                </Button>
                                              <Button onClick={()=>onClickDelete(dta?._id)} color="danger">
                                                Delete
                                              </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="pagi_div"></div>
                </div>
            </div>
        </div>
    );
};

export default ViewApplcationData;
