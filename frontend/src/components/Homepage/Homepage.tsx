import calendar from '../../images/calendar.jpg'
import calendarScreenShot from '../../images/calendarScreenShot.png'
import calendarScreenShot2 from '../../images/calendarScreenShot2.png'
import calendarScreenShot3 from '../../images/calendarScreenShot3.png'
import calendarScreenShot4 from '../../images/calendarScreenShot4.png'
import React, {useState} from 'react'
import Calendar from '../CalendarPage/Calendar'

/** TODO: can't use image without import??? */
const Homepage = (): JSX.Element => {
  const token = localStorage.getItem('token');
  const tutorialImages: string[] = [calendarScreenShot, calendarScreenShot2, calendarScreenShot3, calendarScreenShot4]; // TODO: better way for this?
  const tutorialDescription: string[][] = [['Check your Calendar', 'Go to the Calendar Page to check your personalized calendar and make updates and notes.'], 
  ['Create and Check Notes', 'hihi'], ['Create a Note', 'hihihi'], ['Check Past Notes', 'hihihihi']];
  // TODO: what to do with this???
  const currentDate = new Date();
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let [monthIndex, setMonthIndex] = useState(currentDate.getMonth());
  let [year, setYear] = useState(currentDate.getFullYear());

  // handle arrows of tutorial images
  // TODO: this function can be made more reusable for other image loops, pass id's of elements
  const tutorialImageHandler = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    const image = document.getElementById("tutorialImage") as HTMLImageElement;
    const imageString = image.getAttribute('src');
    const tutorialHeader = document.getElementById("tutorialHeader");
    const tutorialParagraph = document.getElementById("tutorialDescription");

    let index = 0;
    // get the image index
    while (index < tutorialImages.length) {
      if (imageString === tutorialImages[index]) {
        // only needed index
        break;
      }

      index++;

      if (index == tutorialImages.length) {
        return console.log("Somerthing went Wrong in tutorialImageHandler");
      }
    }

    if (image && tutorialHeader && tutorialParagraph) {
      if (direction === "right") {
        // if at end of array
        if(index + 1 == tutorialImages.length) {
          index = -1;
        }

        image.setAttribute('src', tutorialImages[index+1]);
        tutorialHeader.textContent= tutorialDescription[index+1][0];
        tutorialParagraph.textContent= tutorialDescription[index+1][1];
      } else if (direction === "left") {
        // if at begining of array
        if (index - 1 < 0) {
          index = tutorialImages.length;
        }

        image.setAttribute('src', tutorialImages[index-1]);
        tutorialHeader.textContent= tutorialDescription[index-1][0];
        tutorialParagraph.textContent= tutorialDescription[index-1][1];
      }
    }

  }

  if (token) {
    return (
      <div className="homeContainer"> 
        <div className="intro">
          <div className="introImage">
            <img src={calendar} id="image-loop-1"></img>
          </div>
          <div className="appDesc">
            <h1>Keep Track of Your Schedule</h1>
            <p> Welcome to Userhome!</p>
          </div>
        </div>
        <hr/>
        <div className="tutorial">
          <div className="tutorialText">
            <h1 id="tutorialHeader">Check your Calendar</h1>
            <p id="tutorialDescription">Go to the Calendar Page to check your personalized calendar and make updates and notes.</p>
          </div>
          <div className="tutorialImageDiv">
            <img src={calendarScreenShot} id="tutorialImage"></img>
            {/** TODO: container for arrows? */}
            <div id="tutorialImageArrows">
              <div id="tutorialImagesLeftArrow" onClick={(e) => tutorialImageHandler(e, "left")}>{'<'}</div>
              <div id="tutorialImagesRightArrow" onClick={(e) => tutorialImageHandler(e, "right")}>{'>'}</div>
            </div>
          </div>
        </div>
        <hr/>
        <div className="homeCalendarContainer">
          <Calendar year={year} month={months[monthIndex]} monthNumber={monthIndex}/>
          <div id="homeCalendarDesc">
            <h1 id="tutorialHeader">Calendar</h1>
            <p id="tutorialDescription">Preview the Calendar here.</p>
          </div>
        </div>
        <hr/>
        <div id="footer">
          <h1>Footer Info</h1>
        </div>
      </div>
    );
  } else {
    return (
      <div className="homeContainer"> 
        <div className="intro">
          <div className="introImage">
            <img src={calendar} id="image-loop-1"></img>
          </div>
          <div className="appDesc">
            <h1>Keep Track of Your Schedule</h1>
            <p> Welcome to Userhome!</p>
          </div>
        </div>
        <hr/>
        <div className="tutorial">
          <div className="tutorialText">
            <h1 id="tutorialHeader">Check your Calendar</h1>
            <p id="tutorialDescription">Go to the Calendar Page to check your personalized calendar and make updates and notes.</p>
          </div>
          <div className="tutorialImageDiv">
            <img src={calendarScreenShot} id="tutorialImage"></img>
            {/** TODO: container for arrows? */}
            <div id="tutorialImageArrows">
              <div id="tutorialImagesLeftArrow" onClick={(e) => tutorialImageHandler(e, "left")}>{'<'}</div>
              <div id="tutorialImagesRightArrow" onClick={(e) => tutorialImageHandler(e, "right")}>{'>'}</div>
            </div>
          </div>
        </div>
        <hr/>
        <div id="footer"></div>
      </div>
    );
  }  
}
  
export default Homepage;