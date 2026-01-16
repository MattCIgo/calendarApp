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
    </div>
  );
}
  
export default Calendarpage;