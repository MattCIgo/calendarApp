import Calendar from "./Calendar";
import React, {useState, useEffect} from "react";

const Calendarpage = (): JSX.Element => {
  const token = localStorage.getItem('token');
  const currentDate = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let [monthIndex, setMonthIndex] = useState(currentDate.getMonth());
  let [year, setYear] = useState(currentDate.getFullYear());
  let [searchParameters, setSearchParameters] = useState <string[]>(['', '', '']);
  let [orderDropdown, setOrderDropdown] = useState("Order By...");
  const [searchedNotes, setSearchedNotes]  = useState<Note[]>([]);

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

  const handleLeftButton = (e: React.MouseEvent) => {
    e.preventDefault();
    let newMonthIndex = monthIndex - 1;

    if (newMonthIndex < 0) {
      newMonthIndex = 11;
      setYear(year-1);
    }

    setMonthIndex(newMonthIndex);
  }
  
  const handleRightButton = (e: React.MouseEvent) => {
    e.preventDefault();
    let newMonthIndex = monthIndex + 1;

    if (newMonthIndex > (months.length-1)) {
      newMonthIndex = 0;
      setYear(year+1);
    }

    setMonthIndex(newMonthIndex);
  }

  const updateSearchArray = (event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLDivElement, MouseEvent>, parameter: string) => {
    if (event.type === "change") {
      const inputElement = event.target as HTMLInputElement;

      // Which Search Parameter is being updated
      if (parameter === "noteWords") {
        const updatedSearchParameters = [...searchParameters];
        updatedSearchParameters[0] = inputElement.value;
        setSearchParameters(updatedSearchParameters);
      } else if (parameter === "startDate") {
        const updatedSearchParameters = [...searchParameters];
        updatedSearchParameters[1] = inputElement.value;
        setSearchParameters(updatedSearchParameters);
      } else if (parameter === "endDate") {
        const updatedSearchParameters = [...searchParameters];
        updatedSearchParameters[2] = inputElement.value;
        setSearchParameters(updatedSearchParameters);
      } else {
        console.log("error in parameter checking on updateSearchArray");
      }
    } else {
      const divElement = event.target as HTMLDivElement;
      setOrderDropdown(divElement.textContent);
    }
  }

  const getNotes = () => {
    const queryParamsObj = {
      "keyWords": searchParameters[0],
      "startDate": searchParameters[1],
      "endDate": searchParameters[2],
      "order": orderDropdown
    }

    const searchParams = new URLSearchParams(queryParamsObj);
    const queryString = searchParams.toString();

    fetch(`http://localhost:8000/notes?${queryString}`, {
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
        setSearchedNotes(jsonString);
        searchedNotesDiv();
      }).catch((error) =>{
        // TODO: parse error message/ how to replaces email with default object to access error? for loop?
        alert(error.message);
    })
  }

  const searchedNotesDiv = () => {

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
    )
  }

  // function to delete Note
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
        setSearchedNotes(searchedNotes => searchedNotes && searchedNotes.filter(note =>note &&  note.pk !== id));
      }).catch((error) =>{
        alert(error);
    })

    return
  }

  return (
    <div className="calendarPageContainer">
      <div id="month">{months[monthIndex]} {year}</div>
      <Calendar year={year} month={months[monthIndex]} monthNumber={monthIndex}/>
      <button id="leftCalendarButton" onClick={(e) => handleLeftButton(e)}>{'<'}</button>
      <button id="rightCalendarButton" onClick={(e) => handleRightButton(e)}>{'>'}</button>

      <div id="searchNotesContainer">
        <div id="searchBarNotesContainer">
          <h1 id="searchNotesTitle">Search Notes for Keywords or Phrases</h1>
          <div id="searchBarContainer">
            <input id="searchNotesInput" placeholder="Type Word or Phrase" onChange={(e) => updateSearchArray(e, "noteWords")}></input>
            <button className="searchButton" onClick={() => getNotes()}>Search</button>
          </div>
          <div id="searchParametersContainer">
            <h2>Start Date:</h2>
            <input placeholder="yyyy-mm-dd" id="enterStartDateInput" onChange={(e) => updateSearchArray(e, "startDate")}></input>
            <h2>End Date:</h2>
            <input placeholder="yyyy-mm-dd" id="enterEndDateInput" onChange={(e) => updateSearchArray(e, "endDate")}></input>
            <h2>Order By:</h2>
            <div id="orderDropdown">
              <h2 id="selectedSortOption">{orderDropdown}</h2>
              <div id="orderDropdownOptions">      
                <div className="orderDropdownIndividualOption" onClick={(e) => updateSearchArray(e, "")}>Oldest</div>  
                <div id="lastOrderOption" className="orderDropdownIndividualOption" onClick={(e) => updateSearchArray(e, "")}>Latest</div>
              </div>
            </div>
          </div>
        </div>
        <div id="searchNotesResultsContainer">
          {searchedNotesDiv()}
        </div>
      </div>
    </div>
  );
}
  
export default Calendarpage;