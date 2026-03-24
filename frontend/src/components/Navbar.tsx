import { Link, unstable_HistoryRouter } from 'react-router-dom';
import {logout} from './utils.tsx';
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = (): JSX.Element => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

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
          <Link to="/" onClick={()=>logout(navigate)}>Logout</Link>
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