import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import Loginpage from "./components/Loginpage";
import Signuppage from "./components/Signuppage";
import Calendarpage from "./components/Calendarpage";
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
            <Route path="/Signup" element={<Signuppage />} />
            <Route path="/Calendar" element={<Calendarpage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
