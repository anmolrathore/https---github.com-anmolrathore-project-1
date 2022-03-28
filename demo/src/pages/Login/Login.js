import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import Group from "../../assets/Group 2649.svg";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../../components/Footer";
import {url}  from "../../API";


const Login = (props) => {
  let navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });
  const handle_input = (e) => {
    const { name, value } = e.target;
    setInput((pre) => {
      return {
        ...pre,
        [name]: value,
      };
    });
  };

  const submit = (e) => {
    var data = new FormData();
    data.append("username", input.username);
    data.append("password", input.password);

    var config = {
      method: "post",
      url: `${url}/token`,
      headers: {
        "content-type": "multipart/form-data",
      },
      data: data,
    };
    axios(config)
      .then(function (response) {
        // console.log(response);
        // console.log(JSON.stringify(response.data.access_token));
        localStorage.setItem("token",JSON.stringify(response.data.access_token));
        navigate("/fileupload");
      })
      .catch(function (error) {
        toast.error("Invalid login credentials.");
        // console.log(error);

      });
  };
  return (
    <>
  
      <div className="main-container">
        <ToastContainer />
      
          <img src={Group} alt="left" className="img" />
      
        <div className="right-login" >
          <div className="right-content" >
            <div className="logo">
              <img src="images/headerlogo.svg" alt="logo" />
            </div>
            <div className="login">
              <h1>Log in</h1>
            </div>
            <div>
            <form>
              <div className="user-name">
                <p>enter username</p>
                <input
                  type="text"
                  name="username"
                  onChange={handle_input}
                  required
                  value={input.username}
                />
              </div>
              <div className="password">
                <p>Password</p>

                <input
                  type="password"
                  name="password"
                  onChange={handle_input}
                  required
                  value={input.password}
                 

                />
                
              </div>
              <div className="rem">

                <input type="checkbox"  />
                <span >remember me</span>
                <NavLink to="/" className="forget-password" id="forget-forget" >
                  <p style={{display:"flex",flexDirection:"row",justifySelf:"flex-end",alignSelf:"flex-end" ,marginTop:"0.5rem"}}> forget password</p>
                </NavLink>
              </div>
              <div className="login-btn">
                <Button variant="contained" onClick={submit}>
                  login
                </Button>
              </div>
            </form>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    </>
  );
};



export default Login;

