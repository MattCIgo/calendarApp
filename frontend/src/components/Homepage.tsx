
const Homepage = (): JSX.Element => {
  const token = localStorage.getItem('token');

  if (token) {
    return (
      <div className="homeContainer"> 
        <div className="intro">
          <div className="appDesc">
            <h1>User Homepage</h1>
            <p> Welcome to Userhome!</p>
          </div>
          <div className="introImage">
            <div className="image"></div>
          </div>
        </div>

        <div className="tutorial">

        </div>
      </div>
    );
  } else {
    return (
      //TODO: Doesn't update to this on logout
      <div className="homeContainer">
        <div className="intro">
          <div className="appDesc">
            <h1>Calendar App</h1>
            <p> Welcome to Calendar App!</p>
          </div>
          <div className="introImage">
            {/* image goes here */}
            <div className="image"></div>
          </div>
        </div>
        <div className="tutorial">
        </div>
      </div>
    ); 
  }  
}
  
  export default Homepage;