const Calendar = (): JSX.Element => {
    const currentDate = new Date();
    const daysOfMonth = [];
    let currentDay = currentDate.getDay();
    let currentDayOfMonth = currentDate.getDate();

    // To get the first day of the month, as number
    while (currentDayOfMonth != 1){
      currentDayOfMonth = currentDayOfMonth - 1;

      currentDay = currentDay - 1;

      if (currentDay < 0) {
        currentDay = 6;
      }
    }

    // TODO: Function to get the number of days in the month
    const monthDays = () => {
      return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    } 

    let daysInMonth = monthDays();
    let dayNumber = 2;

    // To get number of days in an array
    while(dayNumber <= daysInMonth) {
      daysOfMonth.push(dayNumber);
      dayNumber++;
    }


    // TODO: function to add note to a day
    const test = () => {
      alert("clicked");
      return 
    } 

    return (
      <div className="calendarContainer">
        <div className="calendarDays">Sunday</div>
        <div className="calendarDays">Monday</div>
        <div className="calendarDays">Tuesday</div>
        <div className="calendarDays">Wednesday</div>
        <div className="calendarDays">Thursday</div>
        <div className="calendarDays">Friday</div>
        <div className="calendarDays">Saturday</div>
        <div className="numberedDays" style={{gridColumnStart:currentDay+1}}>1</div>
        {daysOfMonth.map((day, index) =>
          <div className="numberedDays" onClick={test} key={index}>{day}</div>)}
      </div>
    );
  }
  
  export default Calendar;