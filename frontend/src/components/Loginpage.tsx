// TODO: functions to send login data to server for authentication

const Loginpage = (): JSX.Element => {

  // TODO: Complete this fucntion
  const handleLogin = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    // Check for empty Strings
    if ((document.getElementById('username') as HTMLInputElement).value == '' ||
      (document.getElementById('password') as HTMLInputElement).value == '') {
        console.log("Enter All Credentials");
        return;
    }

    let email = (document.getElementById('username') as HTMLInputElement).value;
    let password = (document.getElementById('password') as HTMLInputElement).value;

    fetch('http://localhost:8000/login', {
      method: 'POST',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({"email" : email,
        "password" : password
      }),
    }).then(response => {
      if(response.ok) {
        console.log("Logged in!");
      }
      return response.json();
    }).then(data =>{
      console.log(data);
    }
  )
  } 

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <h1>Login</h1>
        <form>
          <label style={{marginLeft: 25}}>Email: </label>
          <input type="text" id="username" name="email"></input>
          <label style={{marginLeft: 28}}>Password: </label>
          <input type="text" id="password" name="password"></input>
          <input type="submit" id="login" name="login" value="Login" onClick={(e)=>handleLogin(e)}></input>
        </form>
      </div>
    </div>
  );
}
  
export default Loginpage;