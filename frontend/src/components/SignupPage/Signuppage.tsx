import { json } from "react-router-dom";
import fall from '../../images/fall.jpg'
import "./signup-page.css"

const Signuppage = (): JSX.Element => {

  const handleSignup = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    // Check for empty Strings
    if ((document.getElementById('firstname') as HTMLInputElement).value == '' ||
      (document.getElementById('lastname') as HTMLInputElement).value == '' ||
      (document.getElementById('email') as HTMLInputElement).value == '' ||
      (document.getElementById('signuppass') as HTMLInputElement).value == '') {
        alert("Enter All Credentials");
        return;
    }

    // TODO: Check for valid Email (REGEX)

    // Check if re-entered password matches
    if ((document.getElementById('signuppass') as HTMLInputElement).value !=
      (document.getElementById('resignuppass') as HTMLInputElement).value) {
        alert("Passwords do not Match.");
        return;
    }

    let firstName = (document.getElementById('firstname') as HTMLInputElement).value;
    let lastName = (document.getElementById('lastname') as HTMLInputElement).value;
    let email = (document.getElementById('email') as HTMLInputElement).value;
    let password = (document.getElementById('signuppass') as HTMLInputElement).value;

    fetch('http://localhost:8000/users', {
      method: 'POST',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({"first_name" : firstName,
        "last_name" : lastName,
        "password" : password,
        "email" : email
      }),
    }).then(response => {
        if(!response.ok) {
          return response.json().then(error => {
            throw new Error(error.error);
          })
        }

        return response.json();
    }).then(data =>{
      alert(data.message);
    }).catch((error) =>{
      // TODO: parse error message
      alert(error);
    }
    )
  } 
  
  return (
    <div className="signupContainer">
      <img src={fall} id="backgroundImage"></img>
      <div className="signupBox">
        <div className="signupBoxContainer">
          <h1>Sign up to Create an Account</h1>
          <form>
            <div id="firstNameDiv">
              <label>First Name: </label>
              <input type="text" id="firstname" name="firstname"></input><br/>
            </div>
            <div id="lastNameDiv">
              <label>Last Name: </label>
              <input type="text" id="lastname" name="lastname"></input><br/>
            </div>
            <div id="emailDiv">
              <label>Email: </label>
              <input type="text" id="email" name="email"></input><br/>
            </div>
            <div id="passwordDiv">
              <label>Password: </label>
              <input type="text" id="signuppass" name="signuppass"></input><br/>
            </div>
            <div id="repasswordDiv">
              <label>Re-enter Password: </label>
              <input type="text" id="resignuppass" name="resignuppass"></input><br/>
            </div>
            <input type="submit" id="signup" name="signup" value="Sign-up"
              onClick={(e)=>handleSignup(e)}></input>
          </form>
        </div>     
      </div>
    </div>
  );
}
  
export default Signuppage;