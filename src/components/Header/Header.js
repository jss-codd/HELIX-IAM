import "bootstrap/dist/css/bootstrap.min.css";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";
import keycloakApi from "../../apiCall";
import home from "../../assests/blackhome.png";
import logoImg from "../../assests/helixSenseLogo.svg";
import role from "../../assests/role.png";
import userimg from "../../assests/user.png";
import { KeycloackContext } from "../Keycloack/KeycloackContext";
import './Header.css';
import configimg from '../../assests/config.jpg'
import application from '../../assests/application.png'
import axios from 'axios'

const Header = (props) => {
    const { keycloackValue, logout, userInfo } = useContext(KeycloackContext)
    const navigate = useNavigate();
    const [loginUserRole, setLoginUserRole] = useState("");
    const [logo, setLogo] = useState("");

    useEffect(() => {
        loginUser()
    })

    const loginUser = async () => {
        const resGroup = await keycloakApi.get(`/users/${keycloackValue?.subject}/groups`)
        setLoginUserRole(resGroup.data[0].name)
        const logo = await getCustomerLogo(resGroup.data[0].name);
        setLogo(logo);
    }

    const getCustomerLogo = async (Role) => {
        if (Role === "Admin") {
            return logoImg
        }
        else if (Role === "Customer") {
            return userInfo?.logo
        }
        else {
            if (userInfo?.logo !== undefined) {
                const accessToken = localStorage.getItem("accessToken");
                let imData = await axios.get(`${process.env.REACT_APP_HELIX_SERVER_URL}/user/getCustomerLogo/${userInfo?.logo}?type=logo`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,

                    },
                })
                console.log("---------yyyyyyy-imData-----", imData);
                if (imData?.data !== undefined) {
                    return imData?.data
                }
                else {
                    return logoImg
                }
            }
            else {
                console.log("this is the else calling ")
                return logoImg
            }
        }
    }

    return (
        <div>
            <div className="heading_div">
                <div>
                    <img src={logo ? logo : logoImg} alt="logo" className="logoimg " />
                </div>
                <div className="logout_main">
                    <div className="name-logout">
                        <h6>Hi, {keycloackValue?.idTokenParsed?.preferred_username}</h6>
                        <UncontrolledDropdown>
                            <DropdownToggle className="dropdown-style">
                                <img src={userimg} alt="logo" className="user " />
                            </DropdownToggle>
                            <DropdownMenu >
                                <DropdownItem style={{ cursor: "pointer" }} header> <div onClick={() => logout()} > <img src={require("../../assests/logout.png")} alt="logo" className="logo-size " />Logout</div></DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>

                    </div>
                </div>
            </div>

        <div style={{display:'flex'}}>
        <div className="bg-sidebar" >
                <div className="img-style">
                    <img src={home} title="User" alt="logo" className="user "onClick={() => { navigate(`/`) }} />
                </div>
                {loginUserRole === "Admin" && (<div className="img-style" onClick={() => { navigate(`/permission`) }}  >
                    <img src={role} title="Roles/Permessions" alt="logo" className="user " />
                </div>)}
                {loginUserRole === "Admin" && (<div className="img-style" onClick={() => { navigate(`/view-configdata`) }}  >
                    <img src={configimg} title="configuration" alt="logo" className="user " />
                </div>)}
                {loginUserRole === "Admin" && (<div className="img-style" onClick={() => { navigate(`/application`) }}  >
                    <img src={application} title="application" alt="logo" className="user " />
                </div>)}
            </div>
            <div style={{border:"10px soild green",width:"100%"}} >
              {props.children}
            </div>
        </div>
        </div>
    )
}

export default Header