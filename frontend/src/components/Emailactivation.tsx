import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailActivation = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  

  useEffect(() => {

    console.log("In Email Activation");

  }, [uid, token, navigate]);

  // TODO: Just make this the homepage? make small div that handles activation
  return(
    <div></div>
  );
};

export default EmailActivation;