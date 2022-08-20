import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";
import React, { useCallback, useContext, useEffect, useState,useRef} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, Dropdown, DropdownItem, DropdownMenu } from "reactstrap";
import keycloakApi, { REACT_APP_HELIX_SERVER_URL } from "../../apiCall";
import plus from "../../../src/assests/plus.png";
import { KeycloackContext } from "../Keycloack/KeycloackContext";
import ModelComponent from "../Model";
import "./dashboard.css";
import Dropzone from "./Dropzone";

const Dashboard = () => {
  const [customerList, setCustomerList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const [showModel, setShowModel] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loginUserRole, setLoginUserRole] = useState("");
  const [showAction, setShowAction] = useState(null);
  const [delUser, setDelUser] = useState("");
  const [visible,setVisible] = useState(false)
  const fileRef = useRef();
  const { keycloackValue, authenticated, logout, userInfo } =
    useContext(KeycloackContext);

//     const [image, setImage] = useState(null);

//   const onChangeImage = (imageList) => {
//     setImage(imageList[0]);
//   };

  const addUserToGroup = (user) => {
    switch (user) {
      case "Admin":
        return "Customer";
      case "Customer":
        return "Sub Customer";
      case "Sub Customer":
        return "User";
      case "User":
        return "Sub User";
    }
  };

  const getAllCustomer = async () => {
    try {
      const resGroup = await keycloakApi.get(
        `/users/${keycloackValue?.subject}/groups`
      );
      setLoginUserRole(resGroup.data[0].name);
      const accessToken = localStorage.getItem("accessToken");

      const res = await axios.get(
        `${process.env.REACT_APP_HELIX_SERVER_URL}/im_users/getImUser?id=${keycloackValue?.subject}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      let sorted_data = res?.data.sort(function (var1, var2) {
        var a = new Date(var1?.createdTimestamp).getTime(),
          b = new Date(var2?.createdTimestamp).getTime();
        if (a > b) {
          return -1;
        }
        if (a < b) {
          return 1;
        }

        return 0;
      });
      setCustomerList(sorted_data);
    } catch (error) {}
  };

  console.log("----user info---------",userInfo);

  useEffect(() => {
    console.log("-keyclockkk----url----", process.env.REACT_APP_KEYCLOAK_URL,keycloackValue);
    if (keycloackValue?.authenticated === true) {
      getAllCustomer();
    }
  }, [keycloackValue]);

  const handleDelete = async () => {
    try {
      const res = await keycloakApi.delete(`/users/${selectedRecord}`);

      setShowModel(false);
      notify("User deleted successfully");
      getAllCustomer();
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
        navigate("/");
      },
    });

  const onClickDelete = async (id) => {
    try {
      const delresGroup = await keycloakApi.get(`/users/${id}/groups`);
      setDelUser(delresGroup.data[0].name);
      setSelectedRecord(id);
      setShowModel(true);
    } catch (error) {}
  };

  // iupload logo 

  // const handleUploadImage = (imageList) => {
  //   imageList[0]
  //   const formData = new FormData();
  //   formData.append("file", image.file);
  //   const accessToken = localStorage.getItem("accessToken");
  //   fetch(`${process.env.REACT_APP_HELIX_SERVER_URL}/user/logo`, {
  //     method: "POST",
  //     body: formData,
  //     headers: {
  //       Authorization: `Bearer ${accessToken}`,
  //     },
  //   })
  //     .then((response) => {
  //       onCloseModal();
  //     })
  //     .catch((error) => console.log(error));
  // };












  return (
    <div>
      <ToastContainer theme="dark" />
      <ModelComponent
        showModel={showModel}
        setShowModel={setShowModel}
        handleDelete={handleDelete}
        delUser={delUser}
        heading={"Customer"}
      />
      <div className="sidebar">
        <div className="main-section">
          <div className="button_div">
            <div style={{ display: "flex" }}>
              <div
              
              >
                <Dropzone visible={visible} setVisible={setVisible} />
                {keycloackValue?.hasRealmRole("Add Logo") && (
                  <Button
                  color="secondary"
                  onClick={()=>setVisible(true)}
                  style={{marginRight:"20px"}}
                >
                  Upload Logo
                </Button>

                ) }
                
                
              </div>

              <div style={{ marginRight: "20px" }}>
                <Button
                  color="success"
                  onClick={() => {
                    window.open(
                      `${process.env.REACT_APP_HELIX_APP_URL}`,
                      "_blank"
                    );
                  }}
                >
                  Helix App
                </Button>
              </div>
              {loginUserRole !== "Sub User" && (
                <Button
                  color="primary"
                  onClick={() => navigate("/create-user")}
                  className="bg-btn"
                >
                  <img src={plus} alt="logo" className="logo-size " /> ADD{" "}
                  {addUserToGroup(loginUserRole)}
                </Button>
              )}
            </div>
          </div>

          {/* ---------------------------table-------------------- */}
          {/* <div className="table_content">
            <h5> All {addUserToGroup(loginUserRole)} List</h5>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr className="bg-heading">
                <th>SNo.</th>
                <th>Id</th>
                <th>User Name</th>
                <th>Email</th>

                <th>Enabled</th>
                <th>Created At</th>
                {loginUserRole !== "Sub User" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody className="table_body">
              {customerList?.map((dta, idx) => {
                return (
                  <tr key={idx}>
                    <th scope="row">{idx + 1}</th>
                    <td>{dta?.id}</td>
                    <td>{dta?.username}</td>
                    <td>{dta?.email}</td>

                    <td>{dta?.enabled ? "true" : "false"}</td>
                    <td>{moment(dta?.createdTimestamp).format("L")}</td>

                    {loginUserRole !== "Sub User" && (
                      <td>
                        <div>
                          <img
                            className={`arrowDown  ${
                              dta?.id === showAction ? "active_rotate" : ""
                            }`}
                            src={require("../../assests/awrrowDown.png")}
                            onClick={() => {
                              setShowAction((prev) => {
                                if (prev !== dta?.id) {
                                  return dta?.id;
                                } else {
                                  return null;
                                }
                              });
                            }}
                          />

                          <div
                            className={`unorder  ${
                              dta?.id === showAction ? "active_tab" : ""
                            }`}
                          >
                            <Dropdown
                              isOpen={dta?.id === showAction ? true : false}
                            >
                              <DropdownMenu>
                                <DropdownItem>
                                  <span
                                    className="listItem"
                                    onClick={() =>
                                      navigate(`/subcustomer/${dta?.id}`)
                                    }
                                  >
                                    View
                                  </span>
                                </DropdownItem>
                                <DropdownItem>
                                  <span
                                    className="listItem"
                                    onClick={() => {
                                      onClickDelete(dta?.id);
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
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table> */}
          {/* <div className="pagi_div"></div> */}
                    {/* </div> */}

                    {/* ---------------------------table-------------------- */}
                    <div className="table_content">
                        <h5> All {addUserToGroup(loginUserRole)} List</h5>
                    </div>
                    <table className="table table-bordered">
                        <thead>
                            <tr className="bg-heading">
                                <th>
                                    SNo.
                                </th>
                                <th>
                                    Id
                                </th>
                                <th>
                                    User Name
                                </th>
                                <th>
                                    Email
                                </th>

                                <th>
                                    Enabled
                                </th>
                                <th>
                                    Created At
                                </th>
                                {
                                    loginUserRole !== "Sub User" && (
                                        <th>
                                            Actions
                                        </th>
                                    )
                                }
                            </tr>
                        </thead>
                        <tbody className="table_body">

                            {customerList?.map((dta, idx) => {

                                return (

                                    <tr key={idx} >

                                        <th scope="row">
                                            {idx + 1}
                                        </th>
                                        <td>
                                            {dta?.id}
                                        </td>
                                        <td>
                                            {dta?.username}
                                        </td>
                                        <td>
                                            {dta?.email}
                                        </td>

                                        <td>
                                            {dta?.enabled ? "true" : "false"}
                                        </td>
                                        <td>
                                            {moment(dta?.createdTimestamp).format('L')}

                                        </td>

                                        {loginUserRole !== "Sub User" && (
                                            <td>

                                                <div>
                                                    <img className={`arrowDown  ${dta?.id === showAction ? "active_rotate" : ""}`} src={require("../../assests/awrrowDown.png")}
                                                        onClick={() => {
                                                            setShowAction(prev => {
                                                                if (prev !== dta?.id) {
                                                                    return dta?.id
                                                                }
                                                                else {
                                                                    return null
                                                                }
                                                            })
                                                        }}



                                                    />


                                                    <div className={`unorder  ${dta?.id === showAction ? "active_tab" : ""}`} >



                                                        <Dropdown isOpen={dta?.id === showAction ? true : false}>

                                                            {loginUserRole === "Admin" && <DropdownMenu>

                                                                <DropdownItem>
                                                                    <span className='listItem' onClick={() => navigate(`/subcustomer/${dta?.id}`)}  >View</span>
                                                                </DropdownItem>
                                                                <DropdownItem>
                                                                    <span className='listItem' onClick={() => {
                                                                        onClickDelete(dta?.id)
                                                                    }}  >Delete</span>
                                                                </DropdownItem>
                                                            </DropdownMenu>}
                                                            {loginUserRole === "Customer" && (keycloackValue?.hasRealmRole("View Sub Customer") || keycloackValue?.hasRealmRole("Delete Sub Customer")) && <DropdownMenu>

                                                                {keycloackValue?.hasRealmRole("View Sub Customer") && <DropdownItem>
                                                                    <span className='listItem' onClick={() => navigate(`/subcustomer/${dta?.id}`)}  >View</span>
                                                                </DropdownItem>}
                                                                {keycloackValue?.hasRealmRole("Delete Sub Customer") && <DropdownItem>
                                                                    <span className='listItem' onClick={() => {
                                                                        onClickDelete(dta?.id)
                                                                    }}  >Delete</span>
                                                                </DropdownItem>}
                                                            </DropdownMenu>}
                                                            {loginUserRole === "Sub Customer" && (keycloackValue?.hasRealmRole("View User") || keycloackValue?.hasRealmRole("Delete User")) && <DropdownMenu>

                                                                {keycloackValue?.hasRealmRole("View User") && <DropdownItem>
                                                                    <span className='listItem' onClick={() => navigate(`/subcustomer/${dta?.id}`)}  >View</span>
                                                                </DropdownItem>}
                                                                {keycloackValue?.hasRealmRole("Delete User") && <DropdownItem>
                                                                    <span className='listItem' onClick={() => {
                                                                        onClickDelete(dta?.id)
                                                                    }}  >Delete</span>
                                                                </DropdownItem>}
                                                            </DropdownMenu>}
                                                            {loginUserRole === "User" && (keycloackValue?.hasRealmRole("View Sub User") || keycloackValue?.hasRealmRole("Delete Sub User")) &&<DropdownMenu>

                                                                {keycloackValue?.hasRealmRole("View Sub User") && <DropdownItem>
                                                                    <span className='listItem' onClick={() => navigate(`/subcustomer/${dta?.id}`)}  >View</span>
                                                                </DropdownItem>}
                                                                {keycloackValue?.hasRealmRole("Delete Sub User") && <DropdownItem>
                                                                    <span className='listItem' onClick={() => {
                                                                        onClickDelete(dta?.id)
                                                                    }}  >Delete</span>
                                                                </DropdownItem>}
                                                            </DropdownMenu>}
                                                        </Dropdown>

                                                    </div>

                                                </div>

                                            </td>
                                        )}
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                    <div className="pagi_div"></div>
                </div>
            </div>
        </div>
    //   </div>
    // </div>
  );
};

export default Dashboard;
