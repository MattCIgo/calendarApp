import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import Loginpage from "./components/Loginpage";
import { BrowserRouter as Router , Route, Routes } from "react-router-dom";

function App() {

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="page">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/Login" element={<Loginpage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
