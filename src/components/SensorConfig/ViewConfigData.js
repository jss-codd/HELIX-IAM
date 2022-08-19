import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Dropdown, DropdownItem, DropdownMenu, Button } from "reactstrap";
import { KeycloackContext } from "../Keycloack/KeycloackContext";
import ModelComponent from "../Model";
// import ViewConfigData from './'
import "./ViewConfigData.css";

const ViewConfigData = () => {
  const [configList, setConfigList] = useState([]);
  const navigate = useNavigate();
  const [showModel, setShowModel] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loginUserRole, setLoginUserRole] = useState("");
  const [showAction, setShowAction] = useState(null);
  const { keycloackValue, authenticated, logout } =
    useContext(KeycloackContext);

  const getConfigData = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${process.env.REACT_APP_HELIX_SERVER_URL}/sensor_config`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(res.data, "res====");
      setConfigList(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    console.log("-keyclockkk----url----", process.env.REACT_APP_KEYCLOAK_URL);
    if (keycloackValue?.authenticated === true) {
      getConfigData();
    }
  }, [keycloackValue]);

  const handleDelete = async () => {
    try {
      //   const res = await keycloakApi.delete(`/users/${selectedRecord}`);
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.delete(
        `${process.env.REACT_APP_HELIX_SERVER_URL}/sensor_config/${selectedRecord}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setShowModel(false);
      notify("Sensor configuration deleted successfully");
      getConfigData();
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
        navigate("/view-configdata");
      },
    });

  const onClickDelete = async (id) => {
    console.log(id, "function callll");

    // console.log(res, "res=======");
    setShowModel(true);
    setSelectedRecord(id);
  };

  return (
    <div>
      <ToastContainer theme="dark" />
      <ModelComponent
        showModel={showModel}
        setShowModel={setShowModel}
        handleDelete={handleDelete}
         delUser={"record"}
         heading={"Sensor Configuration"}
      />
      <div className="sidebar">
        <div className="main-section">
          {/* ---------------------------table-------------------- */}
          <div className="table_content_config_data">
            <h5> Sensor Configuration List</h5>
            <Button
              color="danger"
              onClick={() => {
                navigate(`/sensor-config`);
              }}
            >
              Add Config
            </Button>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr className="bg-heading">
                <th>SNo.</th>
                <th>Id</th>
                <th>Sensor Code</th>
                <th>Sensor Type</th>
                <th>Actions</th>

                {/* {loginUserRole !== "Sub User" && <th>Actions</th>} */}
              </tr>
            </thead>
            <tbody className="table_body">
              {configList?.map((dta, idx) => {
                console.log(dta, "wekhrwehre");
                return (
                  <tr key={idx}>
                    <th scope="row">{idx + 1}</th>
                    <td>{dta?._id}</td>
                    <td>{dta?.sensorCode}</td>
                    <td>{dta?.sensorType}</td>

                    {/* <td>{dta?.enabled ? "true" : "false"}</td> */}
                    {/* <td>{moment(dta?.createdTimestamp).format("L")}</td> */}

                    <td>
                      <div>
                        <img
                          className={`arrowDown  ${
                            dta?._id === showAction ? "active_rotate" : ""
                          }`}
                          src={require("../../assests/awrrowDown.png")}
                          onClick={() => {
                            setShowAction((prev) => {
                              if (prev !== dta?._id) {
                                return dta?._id;
                              } else {
                                return null;
                              }
                            });
                          }}
                        />

                        <div
                          className={`unorder  ${
                            dta?._id === showAction ? "active_tab" : ""
                          }`}
                        >
                          <Dropdown
                            isOpen={dta?._id === showAction ? true : false}
                          >
                            <DropdownMenu>
                              <DropdownItem>
                                <span
                                  className="listItem"
                                  onClick={() =>
                                    navigate(`/update-configdata/${dta?._id}`)
                                    // navigate(`/update-configdata`)
                                  }
                                >
                                  Edit
                                </span>
                              </DropdownItem>
                              <DropdownItem>
                                <span
                                  className="listItem"
                                  onClick={() => {
                                    onClickDelete(dta?._id);
                                  }}
                                >
                                  Delete
                                </span>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </div>
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

export default ViewConfigData;
