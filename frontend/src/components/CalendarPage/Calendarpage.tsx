import Calendar from "./Calendar"
import React, {useState, useEffect} from "react"
import SearchNotesComponent from "./SearchNotesComponent.tsx"
import Note from "../../types/note.ts"
import './Calendarpage.css'

const Calendarpage = (): JSX.Element => {
  const token = localStorage.getItem('token');
  const currentDate = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let [monthIndex, setMonthIndex] = useState(currentDate.getMonth());
  let [year, setYear] = useState(currentDate.getFullYear());

  const handleLeftButton = (e: React.MouseEvent) => {
    e.preventDefault();
    let newMonthIndex = monthIndex - 1;

    if (newMonthIndex < 0) {
      newMonthIndex = 11;
      setYear(year-1);
    }

    setMonthIndex(newMonthIndex);
  }
  
  const handleRightButton = (e: React.MouseEvent) => {
    e.preventDefault();
    let newMonthIndex = monthIndex + 1;

    if (newMonthIndex > (months.length-1)) {
      newMonthIndex = 0;
      setYear(year+1);
    }

    setMonthIndex(newMonthIndex);
  }


  // function to delete Note
  function deleteNote(id: number) {
    fetch('http://localhost:8000/notes', {
      method: 'POST',
      headers: { "Content-Type" : "application/json",
        "Authorization": `Token ${token}`,
      },
      body: JSON.stringify({"note_id": id,
        "method": "deleteNote",
      }),
      }).then(response => {
        if(!response.ok) {
          return response.json().then(error => {
            throw new Error(error.error);
          })
        }

        return response.json();
      }).then(data => {
        console.log(data.message); 
      }).catch((error) =>{
        alert(error);
    })

    return
  }

  return (
    <div className="calendarPageContainer">
      <div id="month">{months[monthIndex]} {year}</div>
      <Calendar year={year} month={months[monthIndex]} monthNumber={monthIndex}/>
      <button id="leftCalendarButton" onClick={(e) => handleLeftButton(e)}>{'<'}</button>
      <button id="rightCalendarButton" onClick={(e) => handleRightButton(e)}>{'>'}</button>
      <SearchNotesComponent />
    </div>
  );
}
  
export default Calendarpage;