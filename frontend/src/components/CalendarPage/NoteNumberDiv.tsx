import Note from "../../types/note.ts";

interface NoteNumberDivProps {
  date: string,
  setIsNoteNumberDivVisible: React.Dispatch<React.SetStateAction<boolean>>,
  notes: Note[],
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>
}

function NoteNumberDiv ({date, setIsNoteNumberDivVisible, notes, setNotes}: NoteNumberDivProps) {
  const token = localStorage.getItem('token');

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
        setNotes(prevNotes => prevNotes.filter(note => note.pk !== id));
      }).catch((error) =>{
        alert(error);
    })

    return
  }

  return (
    <div className="showNotesDiv" onClick={(e) => e.stopPropagation()}>
      <button className="popUpExitButton" onClick={() => setIsNoteNumberDivVisible((prev) => !prev)}>X</button>
      <h1>Notes</h1>
      <div id="notesContainer">
        {notes && notes.filter(note => date === (note.fields.date).toString().replace(/-0+/g, '-')).map((note, index) =>
          <div className="note" key={index}>
            <div className="noteTitleFlexContainer">
              <button className="deleteNoteButton" onClick={() => deleteNote(note.pk)}>X</button>
              <h1>Note {index+1} {note.fields.date.toString()}:</h1>
            </div>
            <p>{note.fields.message}</p>
          </div>)}
      </div>
    </div>
  )
}

export default NoteNumberDiv;