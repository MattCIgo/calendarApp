import { createContext, useContext, useState, useEffect } from "react";

const DateContext = createContext(new Date());

//TODO: get date token should be here too?
export const DateProvider:React.FC<{children: React.ReactNode}> = ({children}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const now = new Date();
    const midnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1, 
      0, 0, 0, 0
    );
    
    const msUntilMidnight = midnight.getTime() - now.getTime();

    const timerId = setTimeout(() => {
      console.log('Midnight reached, updating data...');
      setCurrentDate(new Date()); 
    }, msUntilMidnight);

    return () => clearTimeout(timerId);
  }, []);

  return (
    <DateContext.Provider value={currentDate}>
      {children}
    </DateContext.Provider>
  );
}

export default DateContext;