import { useNavigate } from "react-router-dom";
import fall from '../images/fall.jpg'

const Loginpage = (): JSX.Element => {
  const navigate = useNavigate();

  const handleLogin = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    // Check for empty Strings
    if ((document.getElementById('emailText') as HTMLInputElement).value == '' ||
      (document.getElementById('passwordText') as HTMLInputElement).value == '') {
        alert("Enter All Credentials");
        return;
    }

    let email = (document.getElementById('emailText') as HTMLInputElement).value;
    let password = (document.getElementById('passwordText') as HTMLInputElement).value;

    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({"email" : email,
        "password" : password
      }),
    }).then(response => {
      return response.json();
    }).then(data =>{
      // If a token is returned then log the user in
      if (data[0].token) {
        navigate("/", { replace: true});
        localStorage.setItem('token', data[0].token);
        return 
      }

      alert("Incorrect Username or Password");
    }
    )
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
              <input type="text" id="emailText" name="email"></input>
            </div>
            <div id="password">
              <label id="passwordLabel">Password: </label>
              <input type="text" id="passwordText" name="password"></input> 
            </div> 
            <input type="submit" id="login" name="login" value="Login" onClick={(e)=>handleLogin(e)}></input>
            <a id="forgotPassword">Forgot Password?</a>
          </form>
        </div>
      </div>
    </div>
  );
}
  
export default Loginpage;