import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

//TODO: better error checking, UIDB64 is undefined now
const EmailActivation = () => {
  const { uidb64, token } = useParams();
  const navigate = useNavigate();

  console.log(uidb64 + "    " + token);
  console.log("IN EMAIL ACTIVATION")

  useEffect(() => {
    if (!token || !uidb64) {
     console.error("Unable to verify token or user id");
     return;
    }

    fetch('http://localhost:8000/activate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({"uidb64" : uidb64,
      "token" : token
      }),
    }).then(response => {
      return response.json();
    }).then(data =>{
      console.log(data);
    })
  }, [uidb64, token, navigate]);

  // TODO: Just make this the homepage? make small div that handles activation
  return(
      <div className="emailActivationPage">
        <h1 id="activatedMessage">You've Activated your Account!</h1>
      </div>
  );
};

export default EmailActivation;