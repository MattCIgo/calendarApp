import Calendar from "./Calendar";
import React, {useState} from "react";

const Calendarpage = (): JSX.Element => {
  const currentDate = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let [monthIndex, setMonthIndex] = useState(currentDate.getMonth());
  let [year, setYear] = useState(currentDate.getFullYear());
  let [searchParameters, setSearchParameters] = useState <string[]>(['', '', '']);
  let [orderDropdown, setOrderDropdown] = useState("Order By...");

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

  const getNotes = () => {
    console.log(searchParameters + "," + orderDropdown);

    //TODO: check for valid dates
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
            <input placeholder="mm-dd-yyyy" id="enterStartDateInput" onChange={(e) => updateSearchArray(e, "startDate")}></input>
            <h2>End Date:</h2>
            <input placeholder="mm-dd-yyyy" id="enterEndDateInput" onChange={(e) => updateSearchArray(e, "endDate")}></input>
            <h2>Order By:</h2>
            <div id="orderDropdown">
              <h2 id="selectedSortOption">{orderDropdown}</h2>
              <div id="orderDropdownOptions">      
                <div className="orderDropdownIndividualOption" onClick={(e) => updateSearchArray(e, "")}>Oldest</div>  
                <div className="orderDropdownIndividualOption" onClick={(e) => updateSearchArray(e, "")}>Latest</div>
                <div id="lastOrderOption" className="orderDropdownIndividualOption" onClick={(e) => updateSearchArray(e, "")}>Recency</div> 
              </div>
            </div>
          </div>
        </div>
        <div id="searchNotesResultsContainer">
          <div id="searchResultsTable">RESULTS</div>
        </div>
      </div>
    </div>
  );
}
  
export default Calendarpage;