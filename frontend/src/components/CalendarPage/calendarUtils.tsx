import Note from "../../types/note.ts"

// TODO: pass setNotes and setSearchedNtoes parameters and textareavalues

export function createNote(textAreaValue: string, setTextAreaValue: React.Dispatch<React.SetStateAction<string>>, 
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>, date: string) {
    
  const message = textAreaValue;
  setTextAreaValue('');

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

      // TODO: optional parameters for when needing to setNotes or setSearchedNotes
      setNotes(prevNotes => [...prevNotes, createdNote[0]]);
      setSearchedNotes(searchedNotes => searchedNotes && searchedNotes.filter(note =>note &&  note.pk !== id));
    }).catch((error) =>{
      alert(error);
  })

  return
}


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