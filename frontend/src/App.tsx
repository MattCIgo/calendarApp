import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage/Homepage";
import Loginpage from "./components/LoginPage/Loginpage";
import Signuppage from "./components/SignupPage/Signuppage";
import Calendarpage from "./components/CalendarPage/Calendarpage";
import Emailactivation from "./components/Emailactivation";
import { Route, Routes } from "react-router-dom";
import { DateProvider } from "./contexts/DateContext";

function App() {
  return (
    <DateProvider>
      <div className="App">      
        <Navbar/>
        <div className="page">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/Login" element={<Loginpage />} /> 
            <Route path="/Signup" element={<Signuppage />} />
            <Route path="/Calendar" element={<Calendarpage />} />
            <Route path="/activate/:uidb64/:token" element={<Emailactivation />} />
          </Routes>
        </div>
      </div>
    </DateProvider>
    
  );
}

export default App;
