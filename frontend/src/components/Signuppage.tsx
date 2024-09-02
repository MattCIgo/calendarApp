// TODO: functions to add user to database

const Signuppage = (): JSX.Element => {

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
                <label style={{marginLeft: 100}}>Username: </label>
                <input className="signuplabel" type="text" id="signupuser" name="signupuser"></input><br/>
                <label style={{marginLeft: 100}}>Password: </label>
                <input className="signuplabel" type="text" id="signuppass" name="signuppass"></input><br/>
                <label style={{marginLeft: 100}}>Re-enter Password: </label>
                <input className="signuplabel" type="text" id="resignuppass" name="resignuppass"></input><br/>
                <input style={{marginLeft: 200}} type="submit" id="signup" name="signup" value="Sign up"></input>
              </form>
        </div>
      </div>
    );
  }
  
  export default Signuppage;