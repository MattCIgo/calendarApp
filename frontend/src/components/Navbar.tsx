import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = (): JSX.Element => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let currentLocation = useLocation().pathname;

  const handleLogout = (e: React.ChangeEvent<any>) => {
    e.preventDefault();

    fetch('http://localhost:8000/logout', {
      method: 'POST',
      headers: { "Content-Type" : "application/json" },
      body: JSON.stringify({"token" : token,
      }),
    }).then(response => {
      if (response.ok) {
        localStorage.removeItem('token');
        
        //if on homepage then reload, else navigate to homepage/ TODO: better way to reload, refreshes whole page?
        if (currentLocation == "/") {
          window.location.reload();
        } else {
          navigate("/", { replace: true});
        }
      } else {
        throw new Error("Something went wrong");
      }
    }).catch((error) =>{
      alert(error.message);
    }
    )
  } 

  if(token){
    return (
      <nav className="usernavbar">
        <h1 id="title"><Link to="/">Workflow App</Link></h1>
        <div className="links">
          <Link to="/Calendar" style={{marginRight:30}}>Calendar</Link>
          <Link to="/" style={{marginRight:30}}>Settings</Link>
          <Link to="/" onClick={(e)=>handleLogout(e)}>Logout</Link>
        </div>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <h1 id="title"><Link to="/">Workflow App</Link></h1>
        <div className="links">
          <Link to="/signup" style={{marginRight:30}}>Sign up</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>
    )
  }
}

export default Navbar;