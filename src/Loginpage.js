import axios from 'axios';
import React from 'react'
import { useForm } from "react-hook-form";
import queryString from 'query-string'
import {useNavigate} from "react-router-dom"

const Loginpage = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const navigate = useNavigate()

    const onSubmit =  async data => {
        let formObj ={}
        formObj.username=data.username
        formObj.password=data.password
        formObj.client_id="test-client"
        formObj.grant_type="password"

        const res= await axios.post("http://localhost:8080/auth/realms/washroom/protocol/openid-connect/token",queryString.stringify(formObj),{
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        
       if(res?.status===200){
        localStorage.setItem('accessToken', res?.data?.access_token);

         navigate("/")
       }

    };




  return (
    <div>
        <div className='user_main_container'>
            <h3>Login</h3>

            <form onSubmit={handleSubmit(onSubmit)}  >
            <div className="form-group">
                    <label>User name</label>
                    <input type="text" className="form-control"  aria-describedby="emailHelp" placeholder="User Name"  {...register("username")}/>
                       
                </div>
                <div className="form-group">
                    <label >Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"{...register("password")}/>
                </div>
                
                <button type="submit" className="mt-4 btn btn-primary ">Submit</button>
            </form>

        </div>


    </div>
  )
}

export default Loginpage