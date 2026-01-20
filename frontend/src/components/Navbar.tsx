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
      headers: { "Content-Type" : "application/json",
          "Authorization": `Token ${token}`,
         },
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
        localStorage.removeItem('token');
        navigate("/", { replace: true});
      }
    }).catch((error) =>{
      alert(error.message);
    }
    )
  } 

  const clickMenuFunction = (e: React.MouseEvent<HTMLAnchorElement>) => {
    let links = document.getElementById("links");

    if (links && links.style.display === "block") {
      links.style.display = "none";
    } else {
      if (links) {
        links.style.display = "block";
      }
    }
  }

  window.addEventListener('resize', function() {
    const screenWidth = window.innerWidth;
    let links = document.getElementById("links");

    if (screenWidth > 500 && links && links.style.display === "none") {
      links.style.display = "block";
    }

    if (screenWidth < 500 && links && links.style.display === "block") {
      links.style.display = "none";
    } 
  });

  if(token){
    return (
      <nav className="usernavbar">
        <Link to="/" id="title">Calendar App</Link>
        <div id="links">
          <Link to="/Calendar">Calendar</Link>
          <Link to="/Settings">Settings</Link>
          <Link to="/" onClick={(e)=>handleLogout(e)}>Logout</Link>
        </div>

        <a className="icon" onClick={(e) => clickMenuFunction(e)}>
          <i className="fa fa-bars"></i>
        </a>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <Link to="/" id="title">Calendar App</Link>
        <div id="links">
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>

        <a className="icon" onClick={(e) => clickMenuFunction(e)}>
          <i className="fa fa-bars"></i>
        </a>
      </nav>
    )
  }
}

export default Navbar;