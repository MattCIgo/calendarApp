import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import Loginpage from "./components/LoginPage/Loginpage";
import Signuppage from "./components/SignupPage/Signuppage";
import Calendarpage from "./components/CalendarPage/Calendarpage";
import Emailactivation from "./components/EmailActivation/Emailactivation";

import RecoverPasswordPage from "./components/RecoverPasswordPage/RecoverPasswordPage";
import { Route, Routes } from "react-router-dom";
import { DateProvider } from "./contexts/DateContext";

import { TokenProvider } from "./contexts/TokenContext";

function App() {
  return (
    <DateProvider>
    <TokenProvider>
      <div className="App">      
        <Navbar/>
        <div className="page">
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/Login" element={<Loginpage />} /> 
            <Route path="/Signup" element={<Signuppage />} />
            <Route path="/Calendar" element={<Calendarpage />} />
            <Route path="/RecoverPassword" element={<RecoverPasswordPage />} />
            <Route path="/activate/:uidb64/:token" element={<Emailactivation />} />
          </Routes>
        </div>
      </div>
    </TokenProvider>
    </DateProvider>
    
  );
}

export default App;
