import fall from '../../images/fall.jpg'
import React, {useState} from 'react'
import {login} from '.././utils.tsx'
import { useNavigate } from "react-router-dom"
import "./Loginpage.css"

const Loginpage = (): JSX.Element => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const navigate = useNavigate();

  const updateEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  }

  const updatePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  }

  return (
    <div className="loginContainer">
      <img src={fall} id="backgroundImage"></img>
      <div className="loginBox">
        <div id="loginCredentialsContainer">
          <h1>Login</h1>
          <form>
            <div id="email">
              <label id="emailLabel">Email: </label>
              <input type="text" id="emailText" name="email" onChange={(e) => updateEmail(e)}></input>
            </div>
            <div id="password">
              <label id="passwordLabel">Password: </label>
              <input type="text" id="passwordText" name="password" onChange={(e) => updatePassword(e)}></input> 
            </div> 
            <input type="button" id="login" name="login" value="Login" onClick={()=>login(email, password, navigate)}></input>
            <a id="forgotPassword">Forgot Password?</a>
          </form>
        </div>
      </div>
    </div>
  );
}
  
export default Loginpage;