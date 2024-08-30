

const Navbar = (): JSX.Element => {

  return (
    <nav className="navbar">
      <h1 id="title"><a href="/">Workflow App</a></h1>
      <div className="links">
        <a href="/login">Login</a>
      </div>
    </nav>
  );
}

export default Navbar;