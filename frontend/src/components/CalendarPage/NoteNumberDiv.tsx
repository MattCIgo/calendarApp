import Note from "../../types/note.ts"
import './Calendarpage.css'
import {deleteNote} from "./calendarUtils.tsx"

interface NoteNumberDivProps {
  date: string,
  setIsNoteNumberDivVisible: React.Dispatch<React.SetStateAction<boolean>>,
  notes: Note[],
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

function NoteNumberDiv ({date, setIsNoteNumberDivVisible, notes, setNotes}: NoteNumberDivProps) {

  return (
    <div className="showNotesDiv" onClick={(e) => e.stopPropagation()}>
      <button className="popUpExitButton" onClick={() => setIsNoteNumberDivVisible((prev) => !prev)}>X</button>
      <h1>Notes</h1>
      <div id="notesContainer">
        {notes && notes.filter(note => date === (note.fields.date).toString().replace(/-0+/g, '-')).map((note, index) =>
          <div className="note" key={index}>
            <div className="noteTitleFlexContainer">
              <button className="deleteNoteButton" onClick={() => deleteNote(note.pk, setNotes, null)}>X</button>
              <h1>Note {index+1} {note.fields.date.toString()}:</h1>
            </div>
            <p>{note.fields.message}</p>
          </div>)}
      </div>
    </div>
  )
}

export default NoteNumberDiv;