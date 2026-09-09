import {useEffect, useRef} from 'react';
import {Logout} from '../utils.tsx';
import { Link, useNavigate } from "react-router-dom";
import "./nav-bar.css"
import { useToken } from '../../contexts/TokenContext.tsx';

const Navbar = (): JSX.Element => {
  const { logout, accessToken } = useToken();
  const navigate = useNavigate();
  const links = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleResize() {
      if (!links.current) {
        return
      }

      const screenWidth = window.innerWidth;
      const currentDisplay = links.current.style.display;

      if (screenWidth > 500 && currentDisplay === "none") {
        links.current.style.display = "block";
      }

      if (screenWidth < 500 && currentDisplay === "block") {
        links.current.style.display = "none";
      } 
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

  const clickMenuFunction = () => {
    if (!links.current) {
      return
    }
    
    const currentDisplay = links.current.style.display;

    if (currentDisplay === "block") {
      links.current.style.display = "none";
    } else {
      links.current.style.display = "block";
    }
  }

  if(accessToken){
    return (
      <nav className="usernavbar">
        <Link to="/" id="title">Calendar App</Link>
        <div id="links" ref={links}>
          <Link to="/Calendar">Calendar</Link>
          <Link to="/" onClick={()=>Logout(navigate, logout, accessToken)}>Logout</Link>
        </div>
        <a className="icon" onClick={clickMenuFunction}>
          <i className="fa fa-bars"></i>
        </a>
      </nav>
    );
  } else {
    return (
      <nav className="navbar">
        <Link to="/" id="title">Calendar App</Link>
        <div id="links" ref={links}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        </div>
        <a className="icon" onClick={clickMenuFunction}>
          <i className="fa fa-bars"></i>
        </a>
      </nav>
    )
  }
}

export default Navbar;