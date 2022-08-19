import axios from "axios";
import React, { useContext, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import keycloakApi, { REACT_APP_HELIX_SERVER_URL } from "../../apiCall";
import { KeycloackContext } from "../Keycloack/KeycloackContext";
import "./CreateUser.css";

const CreateUser = () => {
  const { keycloackValue } = useContext(KeycloackContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const [disableSubmit, setDisableSubmit] = useState(false);
  const [loginUserRole, setLoginUserRole] = useState("");
  const [topMostParentId, setTopMostParentId] = useState(null);
  const [parentUserName, setParentUserName] = useState(null);
  const [latestParentData, setLatestParentData] = useState([]);
  const [parentSubCustomer,serParentSubCustomer] =useState([]);

  useEffect(() => {
    getUserGroup();
  }, [keycloackValue]);

  const getUserGroup = async () => {
    const resGroup = await keycloakApi.get(
      `/users/${keycloackValue?.subject}/groups`
    );

    setLoginUserRole(resGroup.data[0].name);
  };

  console.log(
    "------- keycloackValue---",
    keycloackValue,
    "-----",
    loginUserRole
  );

  const getUserInfo = async (id) => {
    const resUserInfo = await keycloakApi.get(`/users/${id}`);
    console.log("--------resuserINFo----", resUserInfo);
    setParentUserName(resUserInfo?.data?.username);
    return resUserInfo;
  };

  useEffect(() => {
    getUserInfo(keycloackValue?.subject);
  }, [keycloackValue]);

  const getImUserByUserName = async (username) => {
    // console.log("----------adjdh-------------",parentUserName);

    const accessToken = localStorage.getItem("accessToken");

    const res = await axios.get(
      `${process.env.REACT_APP_HELIX_SERVER_URL}/im_users/getImUserByUsername?username=${parentUserName}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log("---res-----", res);
    // setLatestParentData(res.data[0])
    if (res?.data?.length > 0 && res.data[0].parentRole !== "Admin") {
      setLatestParentData(res.data[0]);
      getImDataById(res.data);
      console.log("--caliig0---");
      if(res.data[0].parentRole !== "Customer" ){
        serParentSubCustomer(res.data[0])
      }
    }
  };

  const getImDataById = async (dta) => {
    console.log("-------latestParentData----------", dta);
    let parentId = dta[0]?.parentUser;

    if (
      dta.parentRole !== "Customer" &&
      dta.parentRole !== "Admin" &&
      parentId !== undefined
    ) {
      let userName = await getUserInfo(parentId);
      console.log("----userName--", userName);
    }

    //  let  userName =  await  getUserInfo(parentId)
    //  console.log("----userName--",userName);
    // let parentId = dta[0].parentUser
    // console.log("------------ parentId- parentId-------", parentId,dta);

    // const accessToken = localStorage.getItem("accessToken");

    //   const resIm = await axios.get(
    //     `${process.env.REACT_APP_HELIX_SERVER_URL}/im_users/getImUsersByParentId?parentId=${parentId}`,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     }
    //   );

    //   console.log("-------------resIm--",resIm);
  };

  useEffect(() => {
    if (parentUserName !== null) {
      getImUserByUserName();
    }
  }, [parentUserName]);

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

  const notifyError = (message) =>
    toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const onSubmit = async (data) => {
    console.log("-----------data-----", data);
    setDisableSubmit(true);

    let formObj = {};
    formObj.username = data.username;
    formObj.firstName = data.firstName;
    formObj.lastName = data.lastName;
    formObj.email = data.email;
    formObj.credentials = [
      {
        type: "password",
        value: data.password,
        temporary: true,
      },
    ];
    let groupToAdd = addUserToGroup(loginUserRole);
    formObj.groups = [groupToAdd];
    formObj.enabled = true;
    formObj.parentUserId = keycloackValue?.subject;
    formObj.parentRole = loginUserRole;
    if (loginUserRole === "Customer") {
      formObj.logoId = keycloackValue.subject;
      formObj.profileLogoId = "";
    }  else if (loginUserRole === "Admin") {
      formObj.logoId = "";
    } else {
      console.log("------------else--------", latestParentData);
      formObj.logoId =
        latestParentData.parentUser !== undefined > 0
          ? latestParentData.parentUser
          : "";
          if (loginUserRole === "Sub Customer") {
            formObj.profileLogoId = keycloackValue.subject;
          }else{
            formObj.profileLogoId = parentSubCustomer.parentUser !== undefined > 0
            ? parentSubCustomer.parentUser
            : "";
          } 
    }

    const accessToken = localStorage.getItem("accessToken");
    let formData = new FormData();
    formData.append('userData', JSON.stringify(formObj))
    if (data?.logo !== undefined) {
      formData.append("file", data?.logo[0]);
    } else if (data?.profile_logo !== undefined) {
      formData.append("file", data?.profile_logo[0]);
    }


    try {
      const res = await axios.post(
        `${process.env.REACT_APP_HELIX_SERVER_URL}/im_users/createImUser`,
        formData,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },

        }
      );
      if (res.status === 201) {
        console.log("----rs----", res);
        setDisableSubmit(false);
        notify(`${addUserToGroup(loginUserRole)} is created successfully`);
        reset();
      }
    } catch (error) {
      setDisableSubmit(false);
      if (error.response.status === 409)
        notifyError(`${addUserToGroup(loginUserRole)} is already created`);
      else {
        notifyError("something went wrong");
      }
    }
  };

  console.log("--------latestParentData------", latestParentData);

  return (
    <div className="user_main_container">
      <ToastContainer theme="dark" />

      <h3>Create {addUserToGroup(loginUserRole)}</h3>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="First Name"
            {...register("firstName")}
          />
        </div>

        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="Last Name"
            {...register("lastName")}
          />
        </div>

        <div className="form-group">
          <label>User name</label>
          <input
            type="text"
            className="form-control"
            aria-describedby="emailHelp"
            placeholder="User Name"
            {...register("username")}
          />
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            {...register("email", {
              required: true,
              pattern: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
            })}
          />
          {errors.email?.type === "pattern" && (
            <small id="passwordHelp" class="text-danger">
              email is not valid
            </small>
          )}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            {...register("password", {
              required:
                "password must be minimum six characters, at least one letter, one number and one special character:",
              pattern:
                /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
            })}
          />
        </div>

        {errors.password?.type === "pattern" && (
          <small id="passwordHelp" className="text-danger">
            password must be minimum eight characters, at least one letter, one
            number and one special character:
          </small>
        )}
        {loginUserRole === "Admin" && (
          <div className="form-group">
            <label >Customer Logo</label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              name="logo"
              {...register("logo")}
            />
          </div>
        )}
        {loginUserRole === "Customer" && (
          <div className="form-group">
            <label >Sub Customer Logo</label>
            <input
              className="form-control"
              type="file"
              id="formFile"
              name="profile_logo"
              {...register("profile_logo")}
            />
          </div>
        )}
        <div>
          <button type="submit" className="mt-4 btn btn-primary ">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
