import Calendar from "./Calendar";

const Calendarpage = (): JSX.Element => {
  // TODO: pass currentDate to calendar component
  const currentDate = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const currentMonth = months[currentDate.getMonth()];

  return (
    <div className="calendarPageContainer">
      <div id="month">{currentMonth}</div>
      <Calendar />
    </div>
  );
}
  
export default Calendarpage;