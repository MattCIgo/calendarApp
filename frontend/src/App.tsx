import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import Loginpage from "./components/LoginPage/Loginpage";
import Signuppage from "./components/SignupPage/Signuppage";
import Calendarpage from "./components/CalendarPage/Calendarpage";
import Emailactivation from "./components/EmailActivation/Emailactivation";
import RecoverPasswordPage from "./components/RecoverPasswordPage/RecoverPasswordPage";
import { useEffect, useState } from "react"
import { Route, Routes } from "react-router-dom";
import { DateProvider } from "./contexts/DateContext";
import { useToken } from "./contexts/TokenContext";
import { RequestAccess } from "./components/utils";

function App() {
  const { login , logout } = useToken();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const pageRefresh = async () => {
      try {
        const newToken = await RequestAccess();
        if (newToken) {
          login(newToken);
        }
      } catch (error) {
        console.log("No valid Session");
        logout();
      } finally {
        setIsInitializing(false);
      }
    }

    pageRefresh();
  }, []);

  if (isInitializing) {
    return <div>Loading...</div>;
  }


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
            <Route path="/RecoverPassword" element={<RecoverPasswordPage />} />
            <Route path="/activate/:token" element={<Emailactivation />} />
          </Routes>
        </div>
      </div>
    </DateProvider>
    
  );
}

export default App;
