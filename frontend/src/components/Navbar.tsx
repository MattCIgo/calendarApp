import { Link } from 'react-router-dom';

const Navbar = (): JSX.Element => {

  return (
    <nav className="navbar">
      <h1 id="title"><Link to="/">Workflow App</Link></h1>
      <div className="links">
        <Link to="/login">Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;