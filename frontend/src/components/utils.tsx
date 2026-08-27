// utils
import { NavigateFunction } from 'react-router-dom';


// logout function
export function Logout(navigate: NavigateFunction, logout: () => void) {
  const token = localStorage.getItem('token'); // make useContext variable
  const currentUrl = window.location.href;

  fetch('http://localhost:8000/logout', {
      method: 'POST',
      credentials: 'include',
      headers: { "Content-Type" : "application/json",
          "Authorization": `Bearer ${token}`,
          },
  }).then(response => {
    if (response.ok) {
      logout();
      
      //if on homepage then reload, else navigate to homepage/ TODO: better way to reload, refreshes whole page?
      if (currentUrl == "http://localhost:5173/") {
        window.location.reload();
      } else {
        navigate("/", { replace: true});
      }
    } else {
      navigate("/", { replace: true});
    }
  }).catch((error) =>{
      alert(error.message);
  }
  )
}

// Login function
export function Login(email: string, password: string, login: (newToken: string) => void, 
  navigate: NavigateFunction, event: React.FormEvent<HTMLFormElement>) {

  event.preventDefault();
 
  // Check for empty Strings
  if (!email || !password) {
      alert("Enter All Credentials");
      return;
  }

  fetch('http://localhost:8000/login', {
    method: 'POST',
    headers: { "Content-Type" : "application/json" },
    body: JSON.stringify({"email" : email,
      "password" : password
    }),
  }).then(response => {
    return response.json();
  }).then(data => {
    if (data.access) {
      navigate("/", { replace: true});
      login(data.access)
      return 
    }
    
    alert("Incorrect Username or Password");
  })
} 


// request new access token
export const RequestAccess = async () => {
  const refreshResponse = await fetch('http://localhost:8000/api/token/refresh/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })

  if (refreshResponse.ok) {
    const data = await refreshResponse.json();
    return data;
  } else {
    throw new Error("Unable to get new access token");
  }
}




// TODO: keeps parents onclick events from spreading to children, can be reused, is this needed??
export const preventParentPropogation = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
  e.preventDefault();
};
