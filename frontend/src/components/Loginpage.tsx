// TODO: functions to send login data to server for authentication

const Loginpage = (): JSX.Element => {

    return (
      <div className="loginContainer">
        <div className="loginBox">
          <h1>Login</h1>
          <form>
            <label style={{marginLeft: 25}}>Username: </label>
            <input type="text" id="username" name="username"></input>
            <label style={{marginLeft: 28}}>Password: </label>
            <input type="text" id="password" name="password"></input>
            <input type="submit" id="login" name="login" value="Login"></input>
          </form>
        </div>
      </div>
    );
  }
  
  export default Loginpage;