import React, { useState, useEffect } from "react";
import { json, NonIndexRouteObject } from "react-router-dom";

const Calendar = (): JSX.Element => {
    const [notes, setNotes]  = useState<Note[] | null>([]);
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
    function deleteDiv(element: HTMLButtonElement) {
      // Get the parent element (the deletable div)
      let parentDiv: HTMLDivElement | null = element.parentNode as HTMLDivElement | null;

      // Remove the parent div from the DOM
      if (parentDiv) {
        parentDiv.remove();
      }

      return
    }

    // function to create Note
    // TODO: remove from this file and make it's own component?
    function createNote(message: String, day: number, year: number, month: number) {
      const date: string = year + "-" + month + "-" + day;

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
      let dateNotesArray: any[] = [];
      let noteNumber = 0;
      let calendarDate =  new Date(getFullDate(day.toString()));

      //TODO: Change Note model to hold day of note too not just date created....********
      if (notes) {  
        notes.forEach((note, index) => {
          let noteDate = new Date(Date.parse(notes[index].fields.date.toString()));

          // if date of note is equal to note of this day then add it to array
          if(noteDate.toDateString() === calendarDate.toDateString()) {
            dateNotesArray.push(note);
            noteNumber++;
          }
        })
      }

      // tabindex allows to use focus on child divs
      return (
        <div className="noteNumber" title= 'Number of Notes' tabIndex={0}> 
          {noteNumber}
          <div className="showNotes">HIHIGFAFg</div>
        </div>
      )
    }

    // popup to add not to a day
    // TODO: make so it returns JSX element, functions should be actual html
    const createNoteDiv = (day: number) => {
      let popUpDiv = document.createElement('div');  
      popUpDiv.className = 'popUpDiv';  

      let popUpExitButton = document.createElement('button');
      popUpExitButton.className = 'popUpExitButton';
      popUpExitButton.textContent = 'X';
      popUpExitButton.onclick = () => deleteDiv(popUpExitButton)

      // TODO: for attribute?
      let labelNoteBox = document.createElement('label');
      labelNoteBox.id = 'labelNoteBox';
      labelNoteBox.htmlFor = 'createNoteTextBox';
      labelNoteBox.textContent = 'Enter Note?';

      let createNoteTextBox = document.createElement('textarea');
      createNoteTextBox.className = 'createNoteTextBox';
      createNoteTextBox.setAttribute('placeholder', 'Enter Note...');

      let popUpAcceptButton = document.createElement('button');
      popUpAcceptButton.className = 'popUpAcceptButton';
      popUpAcceptButton.textContent = 'Accept';
      popUpAcceptButton.onclick = () => createNote(createNoteTextBox.value, day, currentDate.getFullYear(), currentDate.getMonth() + 1);

      let popUpCancelButton = document.createElement('button');
      popUpCancelButton.className = 'popUpCancelButton';
      popUpCancelButton.textContent = 'Cancel';
      popUpCancelButton.onclick = () => deleteDiv(popUpCancelButton);

      // Stops multiple new Divs from popping up (better way to do this?) makes part of dom
      if (!document.getElementsByClassName('popUpDiv')[0]) {
        document.getElementsByClassName('calendarContainer')[0].appendChild(popUpDiv);
        document.getElementsByClassName('popUpDiv')[0].appendChild(popUpExitButton);
        document.getElementsByClassName('popUpDiv')[0].appendChild(labelNoteBox);
        document.getElementsByClassName('popUpDiv')[0].appendChild(createNoteTextBox);
        document.getElementsByClassName('popUpDiv')[0].appendChild(popUpAcceptButton);
        document.getElementsByClassName('popUpDiv')[0].appendChild(popUpCancelButton);
      }

      return 
    } 

    return (
      <div className="calendarContainer">
        <div className="calendarDays">Sunday</div>
        <div className="calendarDays">Monday</div>
        <div className="calendarDays">Tuesday</div>
        <div className="calendarDays">Wednesday</div>
        <div className="calendarDays">Thursday</div>
        <div className="calendarDays">Friday</div>
        <div className="calendarDays">Saturday</div>
        <div className="numberedDays" style={{gridColumnStart:currentDay+1, backgroundColor: 1 === currentDate.getDate() 
          ? 'rgba(112, 108, 108, 0.8)': 'rgba(255, 255, 255, 0.8)'}}>
            1 
            {showNoteNumberDiv(1)}  
            <button className="createNoteButton"  onClick= {() => createNoteDiv(1)}>Create Note</button>
        </div>
        {daysOfMonth.map((day, index) =>
        <div className="numberedDays" style={{backgroundColor: day === currentDate.getDate() 
          ? 'rgba(112, 108, 108, 0.8)': 'rgba(255, 255, 255, 0.8)'}} key={index}>
            {day}{showNoteNumberDiv(day)}
          <button className="createNoteButton"  onClick= {() => createNoteDiv(day)}>Create Note</button>
        </div>)}
      </div>
    );
  }
  
  export default Calendar;