import React, {useState, useEffect, useContext} from "react"
import DateContext from "../../contexts/DateContext.tsx"
import NoteDiv from "./NoteDiv.tsx"
import NoteNumberDiv from "./NoteNumberDiv.tsx"
import Note from "../../types/note.ts"
import './calendar-page.css'
import { useToken } from '../../contexts/TokenContext.tsx'
import { RequestAccess } from "../utils.tsx"

interface calendarPageProps {
  month: string;
  year: number;
  monthNumber: number;
  notes?: Note[],
  setNotes?: React.Dispatch<React.SetStateAction<Note[]>>,
}

// TODO: use hooks and use states, etc...
const Calendar: React.FC<calendarPageProps> = ({ month, year, monthNumber, notes, setNotes }): JSX.Element => {
  const { accessToken, login } = useToken();
  const [visibleDay, setVisibleDay] = useState<number | null>(null);
  const [visibleNoteNumber, setVisibleNoteNumber] = useState<number | null>(null);
  const monthDate = new Date(month + "-" + "1" + "-" + year);
  const daysOfMonth: number[] = [];
  let firstDayOfMonthDate = new Date(year, monthNumber);
  let firstDayOfMonth = firstDayOfMonthDate.getDay();
  let currentDate = useContext(DateContext);

  // ....
  let daysInMonth = monthDays(monthDate);
  let dayNumber = 1;

  // To get number of days in an array
  while(dayNumber <= daysInMonth) {
    daysOfMonth.push(dayNumber);
    dayNumber++;
  }
  
  // get the initial notes from server
  // TODO; I/O bound, make thread?
  useEffect (() => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchNotes = async (accessToken: string) => {

      const response = await fetch('http://localhost:8000/notes', {
        method: 'GET',
        headers: { "Content-Type" : "application/json",
          "Authorization": `Bearer ${accessToken}`,
          },
        })

        if (response.status === 401 ) {

          const newToken = await RequestAccess();


          if (newToken) {
            login(newToken);
            return fetchNotes(newToken);
          }
        }

        if (!response.ok) {
          throw new Error("Failed to receive notes");
        }

        const data = await response.json();
        if(setNotes) {
          setNotes(data);
        }
    }

    if (accessToken) {
      fetchNotes(accessToken);
    }
  }, [])

  // TODO: check noteCounts byDate array in console
  const noteCountsByDate = React.useMemo(() => {
    const counts: Record<string, number> = {};

    // TODO: notes is undefined here?
    if(notes) {
      notes.forEach((note) => {
        if (note && note.fields && note.fields.date) {
          const noteDateStr = note.fields.date.toString().replace(/-0+/g, '-');
          counts[noteDateStr] = (counts[noteDateStr] || 0) + 1;
        }
      });
    }
    
    return counts;
  }, [notes])

  
  // get the full date with day passed as parameter 
  function getFullDate(day: number, month: string, year: string): string {
    const date = new Date(month + "-" + day + "-" + year);
    const dateYear = date.getFullYear();
    const dateMonth = date.getMonth()+1;

    const newDate = dateYear.toString() + "-" + dateMonth.toString() + "-" + day;

    return newDate;
  }

  // Function to get the number of days in the month
  function monthDays(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  } 

  // shades present Day on calendar to indicate what day it is
  const presentDayShading = (day: number): Boolean => {
    let date = getFullDate(day, month, year.toString());
    let presentDate = getFullDate(currentDate.getDate(), (currentDate.getMonth() + 1).toString(), currentDate.getFullYear().toString());

    if (date === presentDate){   
      return true;
    } else {
      return false;
    }
  }

  function handleNoteDivOpening (day: number) {
    setVisibleDay(visibleDay === day ? null : day);
    setVisibleNoteNumber(null);
  }

  function handleNoteNumberDivOpening (day: number) {
    setVisibleNoteNumber(visibleNoteNumber === day ? null : day)
    setVisibleDay(null);
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
      {daysOfMonth.map((day, index) =>
      <div className="numberedDays" style={{gridColumnStart: index === 0 ? firstDayOfMonth + 1 : 'auto', 
        backgroundColor: presentDayShading(day) ? 'rgba(112, 108, 108, 0.8)': 'rgba(255, 255, 255, 0.8)'}} key={index}>
          {day}
          <button className="createNoteButton"  onClick={() => handleNoteDivOpening(day)}>Create Note</button>
          <div className="noteNumber" title= 'Number of Notes' onClick={() => handleNoteNumberDivOpening(day)}>
            {noteCountsByDate[getFullDate(day, month,year.toString())] ? noteCountsByDate[getFullDate(day, month,year.toString())] : 0}
          </div>
          {visibleDay === day && <NoteDiv day={day} date={getFullDate(day, month, year.toString())} 
            setIsNoteDivVisible={() => setVisibleDay(null)} setNotes = {setNotes}/>}
          {visibleNoteNumber === day && <NoteNumberDiv date={getFullDate(day, month, year.toString())}
            setIsNoteNumberDivVisible={() => setVisibleNoteNumber(null)} notes={notes ?? null} setNotes={setNotes}/> }
      </div>)}
    </div>
  );
}
  
export default Calendar;