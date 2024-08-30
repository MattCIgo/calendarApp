const Homepage = (): JSX.Element => {

    return (
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
  
  export default Homepage;