import React, { useState } from 'react';
import Note from "../types/note.ts";

interface NoteDivProps {
  date: string,
  day: number,
  setIsNoteDivVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}


// TODO: update notenumber
function NoteDiv({date, day, setIsNoteDivVisible, setNotes}: NoteDivProps) {
  const token = localStorage.getItem('token');
  const [textAreaValue, setTextareaValue] = useState<string>('');

  function createNote(day: number) {
    const message = textAreaValue;
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
        const createdNote = JSON.parse(data[0].return_note);
        console.log(createdNote);
        setNotes(prevNotes => [...prevNotes, createdNote[0]]);
      }).catch((error) =>{
        alert(error);
    })

    return
  }

  const handleNoteChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target) {
      setTextareaValue(event.target.value);
    }
  }
  

  return (
    <div className="popUpDiv" data-day={day}>
      <button className="popUpExitButton" onClick= {() => setIsNoteDivVisible((prev) => !prev)}>X</button>
      <label id="labelNoteBox" htmlFor="createNoteTextBox">Enter Note?</label>
      <div id="textAreaDiv">
        <textarea id="createNoteTextBox" value={textAreaValue} placeholder="..." onChange={(event) => handleNoteChange(event)}></textarea>
        <button className="popUpAcceptButton" onClick= {() => createNote(day)}>Accept</button>
        <button className="popUpCancelButton" onClick= {() => setIsNoteDivVisible((prev) => !prev)}>Cancel</button>
      </div> 
    </div>
  );
}

export default NoteDiv;

