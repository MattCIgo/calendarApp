// TODO: functions to add user to database/ hooks etc

import { json } from "react-router-dom";

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
        if(response.ok) {
          console.log("User Created");
        } else {
          //TODO: get more specific error from backend
          throw new Error("Something went wrong");
        }
      }).catch((error) =>{
        // TODO: parse error message/ how to replaces email with default object to access error? for loop?
        alert(error.message);
      }
    )
  } 
  
  return (
    <div className="signupContainer">
      <div className="signupBox">
        <h1>Sign up to Create an Account</h1>
          <form id="signupform">
            <label style={{marginLeft: 100}}>First Name: </label>
            <input className="signuplabel" type="text" id="firstname" name="firstname"></input><br/>
            <label style={{marginLeft: 100}}>Last Name: </label>
            <input className="signuplabel" type="text" id="lastname" name="lastname"></input><br/>
            <label style={{marginLeft: 100}}>Email: </label>
            <input className="signuplabel" type="text" id="email" name="email"></input><br/>
            <label style={{marginLeft: 100}}>Password: </label>
            <input className="signuplabel" type="text" id="signuppass" name="signuppass"></input><br/>
            <label style={{marginLeft: 100}}>Re-enter Password: </label>
            <input className="signuplabel" type="text" id="resignuppass" name="resignuppass"></input><br/>
            <input style={{marginLeft: 200}} type="submit" id="signup" name="signup" value="Sign-up"
              onClick={(e)=>handleSignup(e)}></input>
          </form>
      </div>
    </div>
  );
}
  
export default Signuppage;