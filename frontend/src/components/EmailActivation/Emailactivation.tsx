import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "./email-activation.css"

const EmailActivation = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
     console.error("Unable to verify token");
     return;
    }

    fetch('http://localhost:8000/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        "token" : token
      }),
    }).then(response => {
      return response.json();
    }).then(data =>{
      alert("Successfully Activated Account");
    })
  }, [token, navigate]);

  // TODO: Just make this the homepage? make small div that handles activation
  return(
      <div className="emailActivationPage">
        <h1 id="activatedMessage">You've Activated your Account!</h1>
      </div>
  );
};

export default EmailActivation;