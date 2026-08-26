import fall from '../../images/fall.jpg'
import React, {useState} from 'react'
import {Login} from '.././utils.tsx'
import { useNavigate, Link } from "react-router-dom"
import "./login-page.css"
import { useToken } from '../../contexts/TokenContext';

const Loginpage = (): JSX.Element => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const { login } = useToken();
  const navigate = useNavigate();

  return (
    <div className="loginContainer">
      <img src={fall} id="backgroundImage"></img>
      <div className="loginBox">
        <div id="loginCredentialsContainer">
          <h1>Login</h1>
          <form onSubmit={(event)=>Login(email, password, login, navigate, event)}>
            <div id="email">
              <label id="emailLabel">Email: </label>
              <input type="text" id="emailText" name="email" onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div id="password">
              <label id="passwordLabel">Password: </label>
              <input type="password" id="passwordText" name="password" onChange={(e) => setPassword(e.target.value)}></input> 
            </div> 
            <button type="submit" id="login">Submit</button>
            <Link to="/RecoverPassword" id="recoverPageLink">Forgot Password?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}
  
export default Loginpage;