

const SearchNotesComponent = (): JSX.Element => {


  return (
    <div id="searchedNotesContainer">
      <h1 id="resultsTitle">Search Results:</h1>
      <div id="notesContainer">
        {searchedNotes && searchedNotes.map((note, index) =>
          <div className="note" key={index}>
            <div className="noteTitleFlexContainer">
              <button className="deleteNoteButton" onClick={() => deleteNote(note.pk)}>X</button>
              <h1>Note {index+1} {note.fields.date.toString()}:</h1>
            </div>
            <p>{note.fields.message}</p>
          </div>)}
      </div>
    </div>
  );
}
  
export default SearchNotesComponent;