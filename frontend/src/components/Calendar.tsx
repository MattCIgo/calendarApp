import React from "react";
import { NonIndexRouteObject } from "react-router-dom";

const Calendar = (): JSX.Element => {
    const currentDate = new Date();
    const daysOfMonth = [];
    let currentDay = currentDate.getDay();
    let currentDayOfMonth = currentDate.getDate();

    // To get the first day of the month, as number
    while (currentDayOfMonth != 1){
      currentDayOfMonth = currentDayOfMonth - 1;

      currentDay = currentDay - 1;

      if (currentDay < 0) {
        currentDay = 6;
      }
    }

    // Function to get the number of days in the month
    const monthDays = () => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    } 

    let daysInMonth = monthDays();
    let dayNumber = 2;

    // To get number of days in an array
    while(dayNumber <= daysInMonth) {
      daysOfMonth.push(dayNumber);
      dayNumber++;
    }

    // function to delete div
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

    // TODO: function to add note to a day
    const test = () => {
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

      // TOOO: onclick save valuie in text area to array? send to server
      // TODO: save time note created at
      let popUpAcceptButton = document.createElement('button');
      popUpAcceptButton.className = 'popUpAcceptButton';
      popUpAcceptButton.textContent = 'Accept';

      let popUpCancelButton = document.createElement('button');
      popUpCancelButton.className = 'popUpCancelButton';
      popUpCancelButton.textContent = 'Cancel';
      popUpCancelButton.onclick = () => deleteDiv(popUpCancelButton);

      // Stops multiple new Divs from popping up (better way to do this?)
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
        <div className="numberedDays" onClick={test} style={{gridColumnStart:currentDay+1}}>1</div>
        {daysOfMonth.map((day, index) =>
          <div className="numberedDays" onClick={test} key={index}>{day}</div>)}
      </div>
    );
  }
  
  export default Calendar;