import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { Dropdown, DropdownItem, DropdownMenu } from 'reactstrap';
import keycloakApi, { REACT_APP_HELIX_SERVER_URL } from '../../apiCall';
import { KeycloackContext } from '../Keycloack/KeycloackContext';
import "./SubCustomer.css";
import { toast, ToastContainer } from "react-toastify";
import ModelComponent from "../Model";
import moment from 'moment';


const SubCustomer = () => {
    const { keycloackValue } = useContext(KeycloackContext)
    const { id } = useParams();
    const [customerDetails, setCustomerDetails] = useState(null)
    const [customerList, setCustomerList] = useState([])
    const navigate = useNavigate()
    const [showModel, setShowModel] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState(null)
    const [loginUserRole, setLoginUserRole] = useState("");
    const [showAction, setShowAction] = useState(null);
    const [isTabOpen, setIsTabOpen] = useState(false);
    const [paramId, setParamId] = useState("")
    const [delUser, setDelUser] = useState("")





    useEffect(() => {
        getUserDetails()
    }, [paramId, id])

    const getUserDetails = async () => {
        let res = await keycloakApi.get(`/users/${id}`)
        if (res.status === 200) {
            setCustomerDetails(res?.data)
        }
    }


    const getAllCustomer = async () => {
        try {
            const resGroup = await keycloakApi.get(`/users/${keycloackValue?.subject}/groups`)
            setLoginUserRole(resGroup.data[0].name)
            const accessToken = localStorage.getItem("accessToken");
            const res = await axios.get(
                `${process.env.REACT_APP_HELIX_SERVER_URL}/im_users/getImUser?id=${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );


            let sorted_data = res?.data.sort(function (var1, var2) {

                var a = new Date(var1?.createdTimestamp).getTime(), b = new Date(var2?.createdTimestamp).getTime();
                if (a > b) {

                    return -1;
                }
                if (a < b) {

                    return 1;
                }

                return 0;
            })
        
            setCustomerList(sorted_data)



        } catch (error) {
            console.log(error);


        }
    }





    useEffect(() => {
        if (keycloackValue?.authenticated === true) {
            getAllCustomer()
        }

    }, [keycloackValue, paramId, id])

    const handleDelete = async () => {
        try {
            const res = await keycloakApi.delete(`/users/${selectedRecord}`);
            setShowModel(false);
            notify(`${delUser} deleted successfully`);
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
        });

    const onClickDelete = async (id) => {
        try {
            const delresGroup = await keycloakApi.get(`/users/${id}/groups`)
            setDelUser(delresGroup.data[0].name)
            setSelectedRecord(id)
            setShowModel(true)
        } catch (error) {
        }
    }

    return (
        <div className='main_div'>
            <ToastContainer theme="dark" />
            <ModelComponent
                showModel={showModel}
                setShowModel={setShowModel}
                handleDelete={handleDelete}
                delUser={delUser}
            />
            <div className='detail_box'>
                <div style={{ display: 'flex' }}>
                    <div >
                        <h6>User Name</h6>
                        <h6>Email</h6>
                    </div>
                    <div className='detail_content'>
                        <h6>{customerDetails?.username}</h6>
                        <h6>{customerDetails?.email}</h6>
                    </div>
                </div>
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
                <tbody>

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
                                <div>
                                    <img className={`arrowDown  ${dta?.id === showAction ? "active_rotate" : ""}`} src={require("../../assests/awrrowDown.png")}
                                        onClick={() => {
                                            setIsTabOpen((prev) => !prev); setShowAction(prev => {
                                                if (prev !== dta?.id) {
                                                    return dta?.id
                                                }
                                                else {
                                                    return null
                                                }
                                            })
                                        }}
                                    />
                                    <td>
                                        <div className={`unorder  ${dta?.id === showAction ? "active_tab" : ""}`} >


                                            {loginUserRole !== "Sub User" && (


                                                <Dropdown isOpen={dta?.id === showAction ? true : false}>

                                                    <DropdownMenu>

                                                        <DropdownItem>
                                                            <span className='listItem' onClick={() => { setParamId(dta?.id); navigate(`/subcustomer/${dta?.id}`) }}  >View</span>
                                                        </DropdownItem>
                                                        <DropdownItem>
                                                            <span className='listItem' onClick={() => {
                                                                onClickDelete(dta?.id)
                                                            }}  >Delete</span>
                                                        </DropdownItem>
                                                    </DropdownMenu>
                                                </Dropdown>

                                            )}
                                        </div>
                                    </td>



                                </div>
                                {/* <div className={`unorder  ${dta?.id === showAction ? "active_tab" : ""}`} ></div> */}





                            </tr>
                        )
                    })}



                </tbody>
            </table>
        </div>



    )
}

export default SubCustomer