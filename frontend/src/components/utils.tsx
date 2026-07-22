// utils
import { NavigateFunction } from 'react-router-dom';


// logout function
export function logout(navigate: NavigateFunction) {
  const token = localStorage.getItem('token'); // make useContext variable
  const currentUrl = window.location.href;

  fetch('http://localhost:8000/logout', {
      method: 'POST',
      headers: { "Content-Type" : "application/json",
          "Authorization": `Token ${token}`,
          },
  }).then(response => {
    if (response.ok) {
      localStorage.removeItem('token');
      
      //if on homepage then reload, else navigate to homepage/ TODO: better way to reload, refreshes whole page?
      if (currentUrl == "http://localhost:5173/") {
        window.location.reload();
      } else {
        navigate("/", { replace: true});
      }
    } else {
      localStorage.removeItem('token');
      navigate("/", { replace: true});
    }
  }).catch((error) =>{
      alert(error.message);
  }
  )
}

// Login function
export function login(email: string, password: string, navigate: NavigateFunction) {

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
    if (data[0].token) {
      navigate("/", { replace: true});
      localStorage.setItem('token', data[0].token);
      return 
    }
    
    alert("Incorrect Username or Password");
  })
} 





// function to delete div/ exit button on divs
export function deleteDiv(e: React.MouseEvent<Element>, setTextareaValue: React.Dispatch<React.SetStateAction<string>>) {
  // Get the parent element (the deletable div)
  const clickElement = e.target as HTMLElement;
  let parentDiv: HTMLDivElement | null = clickElement.parentNode as HTMLDivElement | null;

  // Remove the parent div from the DOM
  if (parentDiv) {
    parentDiv.style.display="none";
    setTextareaValue('');
  }

  return
}

  // deletes grandparentdiv
  // TODO: combine with deleteDiv? make own component?
export function deleteGrandParentDiv(e: React.MouseEvent<Element>, setTextareaValue: React.Dispatch<React.SetStateAction<string>>) {
  // Get the parent element (the deletable div)
  const clickElement = e.target as HTMLElement;
  let parentDiv: HTMLDivElement | null = clickElement.parentNode as HTMLDivElement | null;

  // Remove the parent div from the DOM
  if (parentDiv) {
    let grandParentDiv: HTMLDivElement | null = parentDiv.parentNode as HTMLDivElement | null;

    if (grandParentDiv) {
      grandParentDiv.style.display="none";
      setTextareaValue('');
    }
  }

  return
}





// TODO: keeps parents onclick events from spreading to children, can be reused, is this needed??
export const preventParentPropogation = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
  e.preventDefault();
};
