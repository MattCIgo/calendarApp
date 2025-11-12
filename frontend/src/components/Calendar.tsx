import React, { MouseEvent, useState, useEffect } from "react";
import { json, NonIndexRouteObject } from "react-router-dom";

const Calendar = (): JSX.Element => {
    const [notes, setNotes]  = useState<Note[] | null>([]);
    const [textareaValue, setTextareaValue] = useState<string>(''); // TODO: rename to more descriptive variables
    const [dayvalue, setDayValue] = useState<number>();
    const token = localStorage.getItem('token');
    const currentDate = new Date();
    const daysOfMonth = [];
    let currentDay = currentDate.getDay();
    let currentDayOfMonth = currentDate.getDate();

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

    // TODO: get the initial notes from server, sending request twice??? running twice???
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
          // TODO: parse as js object, should be better way???
          const jsonString = JSON.parse(data);
          setNotes(jsonString);
        }).catch((error) =>{
          // TODO: parse error message/ how to replaces email with default object to access error? for loop?
          alert(error.message);
      })
    }, [])

    // Function to get full date of current Day
    function getCurrentFullDate(): string {
      const year = currentDate.getFullYear().toString();
      const day = currentDate.getDate().toString();
      const month = (currentDate.getMonth() + 1).toString();

      const newDate = year + "-" + month + "-" + day;
      return newDate
    }

    // get the full date with day passed as parameter
    function getFullDate(day: string): string {
      const year = currentDate.getFullYear().toString();
      const month = (currentDate.getMonth() + 1).toString();
      
      const newDate = year + "-" + month + "-" + day;

      return newDate;
    }

    // To get the first day of the month, as number
    while (currentDayOfMonth != 1){
      currentDayOfMonth = currentDayOfMonth - 1;

      currentDay = currentDay - 1;

      if (currentDay < 0) {
        currentDay = 6;
      }
    }

    // Function to get the number of days in the month
    // TODO: is this necessary?
    const monthDays = () => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    } 

    // ....
    let daysInMonth = monthDays();
    let dayNumber = 2;

    // To get number of days in an array
    while(dayNumber <= daysInMonth) {
      daysOfMonth.push(dayNumber);
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
        parentDiv.remove();
        setTextareaValue('');
      }

      return
    }

    // function to create Note
    // TODO: remove from this file and make it's own component?
    function createNote(day: number, year: number, month: number) {
      //TODO: day still is wrong???
      console.log(day);
      const date: string = year + "-" + month + "-" + day;
      let message = textareaValue;
      setTextareaValue('');

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

    // create div that shows number of notes for a day
    // TODO: update on createNote, rerun function?
    const showNoteNumberDiv = (day: number): JSX.Element => {
      // TODO: get all notes that have the same date as date passed 
      console.log(day);
      let dateNotesArray: any[] = [];
      let noteNumber = 0;
      let calendarDate =  getFullDate(day.toString());

      //TODO: day is wrong when being passed to createNote... problem with on change is reloading div every type
      //TODO: this function is being called when typing in text area of create note... fix
      if (notes) {  
        notes.map((note) => {
          let noteDate = note.fields.date.toString()
          console.log(noteDate);
          console.log(noteDate + " and " + calendarDate);

          // if date of note is equal to note of this day then add it to array
          if(noteDate === calendarDate) {
            dateNotesArray.push(note);
            noteNumber++;
          }
        })
      }

      return (
        <div className="noteNumber" title= 'Number of Notes' tabIndex={0}> 
          {noteNumber}
          <div className="showNotes">
            HIHIGFAFg
            <div className="showNotesChild">fdsafadsg</div>
            <button>dfadf</button>
          </div>
        </div>  
      )
    }

    // popup to add note to a day
    const noteDiv = (day: number): JSX.Element => {

      //TODO: GET CORRECT DAY, WORKS FOR NOTENUMBERDIV, HOW TO GET SPECIFIC DATE,
      //TODO: POTENTIALLY HAVE DIV WITH EXACT DATE THEN USE THAT???

      return (
        <div id="popUpDiv" style={{display: "none"}}>
          <button className="popUpExitButton" onClick= {(e) => deleteDiv(e)}>X</button>
          <label id="labelNoteBox" htmlFor="createNoteTextBox">Enter Note?</label>
          <textarea id="createNoteTextBox" placeholder="Enter Note..."></textarea>
          <button className="popUpAcceptButton" onClick= {() => 
            createNote(day, currentDate.getFullYear(), currentDate.getMonth() + 1)}>Accept</button>
          <button className="popUpCancelButton" onClick= {(e) => deleteDiv(e)}>Cancel</button>
        </div>
      )
    } 

    // popup to add note to a day, should this go within noteDiv
    const showNoteDiv = () => {
      let showableDiv: HTMLElement | null = document.getElementById("popUpDiv") as HTMLElement;

      if (showableDiv.style.display === "none") {
        showableDiv.style.display = "block";
      } else {
        showableDiv.style.display = "none";
      }
    } 

    // TODO: make html more readable
    return (
      <div className="calendarContainer">
        <div className="calendarDays">Sunday</div>
        <div className="calendarDays">Monday</div>
        <div className="calendarDays">Tuesday</div>
        <div className="calendarDays">Wednesday</div>
        <div className="calendarDays">Thursday</div>
        <div className="calendarDays">Friday</div>
        <div className="calendarDays">Saturday</div>
        <div id="numberedDays" style={{gridColumnStart:currentDay+1, backgroundColor: 1 === currentDate.getDate() 
          ? 'rgba(112, 108, 108, 0.8)': 'rgba(255, 255, 255, 0.8)'}}>
            1 
            {showNoteNumberDiv(1)}
            {noteDiv(1)}
            <button className="createNoteButton"  onClick= {() => showNoteDiv()}>Create Note</button>
        </div>
        {daysOfMonth.map((day, index) =>
        <div id="numberedDays" style={{backgroundColor: day === currentDate.getDate() 
          ? 'rgba(112, 108, 108, 0.8)': 'rgba(255, 255, 255, 0.8)'}} key={index}>
            {day}
            {showNoteNumberDiv(day)}
            {noteDiv(day)}
            <button className="createNoteButton"  onClick= {() => showNoteDiv()}>Create Note</button>
        </div>)}
      </div>
    );
  }
  
  export default Calendar;