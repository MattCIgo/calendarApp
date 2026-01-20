import Calendar from "./Calendar";
import React, {useState} from "react";

const Calendarpage = (): JSX.Element => {
  const currentDate = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let [monthIndex, setMonthIndex] = useState(currentDate.getMonth());
  let [year, setYear] = useState(currentDate.getFullYear());

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

  return (
    <div className="calendarPageContainer">
      <div id="month">{months[monthIndex]} {year}</div>
      <Calendar year={year} month={months[monthIndex]} monthNumber={monthIndex}/>
      <button id="leftCalendarButton" onClick={(e) => handleLeftButton(e)}>{'<'}</button>
      <button id="rightCalendarButton" onClick={(e) => handleRightButton(e)}>{'>'}</button>

      <div id="searchNotesContainer">
        <div id="searchBarNotesContainer">
          <div id="searchBarContainer">
            <input id="searchNotesInput" placeholder="Search Notes"></input>
            <button className="searchButton">Search</button>
          </div>
          <div id="searchParametersContainer">
            <h1>Dates:</h1>
            <input placeholder="Enter Dates"></input>
            <h1>Order By:</h1>
            <div id="orderDropdown">Order By...
              <div id="orderDropdownOptions">      
                <div className="orderDropdownIndividualOption">Oldest</div>  
                <div className="orderDropdownIndividualOption">Latest</div>
                <div className="orderDropdownIndividualOption">Recency</div> 
                <div className="orderDropdownIndividualOption">1</div>
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