import React, { MouseEvent, useState, useEffect } from "react";

interface calendarPageProps {
  month: string;
  year: number;
  monthNumber: number;
}

// TODO: use hooks and use states, etc...
const Calendar: React.FC<calendarPageProps> = ({ month, year, monthNumber }): JSX.Element => {
    const token = localStorage.getItem('token');
    const [notes, setNotes]  = useState<Note[]>([]);
    const [textareaValue, setTextareaValue] = useState<string>('');
    const [numberOfNotes, setNumberOfNotes] = useState<number[]>();
    const noteNumberArray: number[] = [];
    const monthDate = new Date(month + "-" + "1" + "-" + year); // date given passed month and year (day doesn't matter?>)
    const daysOfMonth: number[] = [];
    let firstDayOfMonthDate = new Date(year, monthNumber);
    let firstDayOfMonth = firstDayOfMonthDate.getDay();

    interface Note {
      [key: number]: any; // needed for typescript indexing ( need string or number etc???)
      pk: number,
      model: string,
      fields: {
        user_id: number,
        message: string,
        date_created: Date,
        date: Date,
      }
    }

    // get the initial notes from server
    // TODO; I/O bound, make thread?
    useEffect (() => {
      fetch('http://localhost:8000/notes', {
        method: 'GET',
        headers: { "Content-Type" : "application/json",
          "Authorization": `Token ${token}`,
         },
        }).then(response => {
          if(response.ok) {
            console.log("Notes received");
          } else {
            //TODO: get more specific error from backend
            throw new Error("Something went wrong");
          }

          return response.json();
        }).then(data => {
          const jsonString = JSON.parse(data);
          setNotes(jsonString);
        }).catch((error) =>{
          // TODO: parse error message/ how to replaces email with default object to access error? for loop?
          alert(error.message);
      })
    }, [])
    
    useEffect (() => {
      updateNoteNumber();
      setNumberOfNotes(noteNumberArray);
    }, [notes, month])

    // get the full date with day passed as parameter
    function getFullDate(day: number, month: string, year: string): string {
      const date = new Date(month + "-" + day + "-" + year);
      const dateYear = date.getFullYear();
      const dateMonth = date.getMonth()+1;

      const newDate = dateYear.toString() + "-" + dateMonth.toString() + "-" + day;

      return newDate;
    }

    // Function to get the number of days in the month
    const monthDays = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    } 

    // ....
    let daysInMonth = monthDays(monthDate);
    noteNumberArray.push(0);
    let dayNumber = 2;
  
    // To get number of days in an array
    while(dayNumber <= daysInMonth) {
      daysOfMonth.push(dayNumber);
      noteNumberArray.push(0);
      dayNumber++;
    }

    // function to delete div/ exit button on divs
    // TODO: remove from this file and make it's own component?
    function deleteDiv(e: MouseEvent) {
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
    function deleteGrandParentDiv(e: MouseEvent) {
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

    // function to create Note, also deletes note if wanted
    // TODO: remove from this file and make it's own component?
    function createNote(date: string, day: number) {
      const message = textareaValue;

      if (message.length === 0) {
        return alert("Type a Message");
      }

      fetch('http://localhost:8000/notes', {
        method: 'POST',
        headers: { "Content-Type" : "application/json",
          "Authorization": `Token ${token}`,
        },
        body: JSON.stringify({"message" : message,
          "date" : date,
          "method" : "createNote",
        }),
        }).then(response => {
          if(!response.ok) {
            return response.json().then(error => {
              throw new Error(error.error);
            })
          }

          return response.json();
        }).then(data => {
          console.log(data[0].message);
          const jsonString = JSON.parse(data[0].return_note);
          updateNoteNumber();

          //TODO: causing field to be undefined
          if (numberOfNotes) {
            let noteNumbers = [...numberOfNotes];
            noteNumbers[day-1]++;
            setNumberOfNotes(noteNumbers);
          }

          setNotes(notes => [...notes, jsonString[0]]);
        }).catch((error) =>{
          alert(error);
      })

      return
    }

    // function to delete Note
    function deleteNote(id: number, day: number) {
      console.log(id);

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
          updateNoteNumber();

          if (numberOfNotes) {
            let noteNumbers = [...numberOfNotes];
            noteNumbers[day-1]--;
            setNumberOfNotes(noteNumbers);
          }

          setNotes(notes => notes && notes.filter(note =>note &&  note.pk !== id));
        }).catch((error) =>{
          alert(error);
      })

      return
    }

    // shows the number of notes in lower right of day, click to see notes
    const noteNumberDiv = (day: number): JSX.Element => {
      let date = getFullDate(day, month, year.toString());

      return (
        <div className="noteNumber" title= 'Number of Notes' onClick={(e) => showNoteNumberDiv(day-1, e)}> 
          {numberOfNotes && numberOfNotes[day-1]}
          <div className="showNotes" style={{display: "none"}} onClick={preventParentPropogation}>
            <button className="popUpExitButton" onClick={(e) => deleteDiv(e)}>X</button>
            <h1>Notes</h1>
            <div id="notesContainer">
              {notes && notes.filter(note => date === (note.fields.date).toString().replace(/-0+/g, '-')).map((note, index) =>
                <div className="note" key={index}>
                  <button className="deleteNoteButton" onClick= {() => deleteNote(note.pk, day)}>X</button>
                  <h1>Note {index+1}:</h1>
                  <p>{note.fields.message}</p>
                </div>)}
            </div>
          </div>
        </div>  
      );
    }

    const showNoteNumberDiv = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
      let showableDiv = document.getElementsByClassName("showNotes");

      if ((showableDiv[index] as HTMLElement).style.display === "none") {
        (showableDiv[index] as HTMLElement).style.display = "block";
      } else {
        (showableDiv[index] as HTMLElement).style.display = "none";
      }
    }
    
    // function to getNumber of notes for a day
    const updateNoteNumber = () => {
      if (notes) {  
        notes.map((note) => {
          let noteDate

          if (note) {
            noteDate = (note.fields.date).toString().replace(/-0+/g, '-');
          }

          let day = 1;

          while (day <= daysOfMonth.length + 1) {  
            let calendarDate = getFullDate(day, month, year.toString());

            if(noteDate === calendarDate) {
              noteNumberArray[day-1]++;
            }   
            day++
          }
        })
      }
    }

    // popup to add note to a day
    const noteDiv = (day: number): JSX.Element => {
      const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.target) {
          setTextareaValue(event.target.value);
        }
      }

      //TODO: need to delete grandparent div in case of cancel
      return (
        <div className="popUpDiv" style={{display: "none"}} data-day={day}>
          <button className="popUpExitButton" onClick= {(e) => deleteDiv(e)}>X</button>
          <label id="labelNoteBox" htmlFor="createNoteTextBox">Enter Note?</label>
          <div id="textAreaDiv">
            <textarea id="createNoteTextBox" placeholder="Enter Note..." onChange={(event) => handleNoteChange(event)}></textarea>
            <button className="popUpAcceptButton" onClick= {() => 
              createNote(getFullDate(day, month, year.toString()), day)}>Accept</button>
            <button className="popUpCancelButton" onClick= {(e) => deleteGrandParentDiv(e)}>Cancel</button>
          </div>
          
        </div>
      )
    } 

    
    // function to unhide to NoteDiv
    const showNoteDiv = (index: number) => {
      let showableDiv = document.getElementsByClassName("popUpDiv");

      if ((showableDiv[index] as HTMLElement).style.display === "none") {
        (showableDiv[index] as HTMLElement).style.display = "block";
      } else {
        (showableDiv[index] as HTMLElement).style.display = "none";
      }
    } 

    // shades present Day on calendar to indicate what day it is
    const presentDayShading = (day: number): Boolean => {
      let date = getFullDate(day, month, year.toString());
      const currentDate = new Date();
      const currentDateString = getFullDate(currentDate.getDate(), (currentDate.getMonth()+1).toString(), currentDate.getFullYear().toString());

      if (date === currentDateString){   
        return true;
      } else {
        return false;
      }
    }
 
    // keeps parents onclick events from spreading to children, can be reused
    const preventParentPropogation= (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <div className="calendarContainer">
        <div className="calendarDays">Sunday</div>
        <div className="calendarDays">Monday</div>
        <div className="calendarDays">Tuesday</div>
        <div className="calendarDays">Wednesday</div>
        <div className="calendarDays">Thursday</div>
        <div className="calendarDays">Friday</div>
        <div className="calendarDays">Saturday</div>
        <div className="numberedDays" style={{gridColumnStart:firstDayOfMonth+1, backgroundColor: presentDayShading(1) 
          ? 'rgba(112, 108, 108, 0.8)': 'rgba(255, 255, 255, 0.8)'}}>
            1 
            {noteNumberDiv(1)}
            {noteDiv(1)}
            <button className="createNoteButton"  onClick= {() => showNoteDiv(0)}>Create Note</button>
        </div>
        {daysOfMonth.map((day, index) =>
        <div className="numberedDays" style={{backgroundColor: presentDayShading(day)
          ? 'rgba(112, 108, 108, 0.8)': 'rgba(255, 255, 255, 0.8)'}} key={index}>
            {day}
            {noteNumberDiv(day)}
            {noteDiv(day)}
            <button className="createNoteButton"  onClick= {() => showNoteDiv(index+1)}>Create Note</button>
        </div>)}
      </div>
    );
  }
  
  export default Calendar;