import React, { useState } from 'react'
import Note from "../../types/note.ts"
import './calendar-page.css'
import {createNote} from './calendarUtils.tsx'
import { useToken } from '../../contexts/TokenContext.tsx'

interface NoteDivProps {
  date: string,
  day: number,
  setIsNoteDivVisible: React.Dispatch<React.SetStateAction<boolean>>,
  setNotes?: React.Dispatch<React.SetStateAction<Note[]>>
}


// TODO: update notenumber
function NoteDiv({date, day, setIsNoteDivVisible, setNotes}: NoteDivProps) {
  const [textAreaValue, setTextareaValue] = useState<string>('');
  const { accessToken } = useToken();

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
        <button className="popUpAcceptButton" onClick= {() => createNote(
          textAreaValue, setTextareaValue, date, accessToken, setNotes
        )}>Accept</button>
        <button className="popUpCancelButton" onClick= {() => setIsNoteDivVisible((prev) => !prev)}>Cancel</button>
      </div> 
    </div>
  );
}

export default NoteDiv;

