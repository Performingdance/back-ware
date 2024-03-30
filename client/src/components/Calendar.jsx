import { useMemo, useState } from "react"
import DatePicker from "react-multi-date-picker"
import calendar from "../assets/icons/calendar-event.svg"
import caret_left from "../assets/icons/caret-left.svg"
import caret_right from "../assets/icons/caret-right.svg"
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import SVGIcon from "./SVG"
import '../styles/RecipeCard.css'


const weekDays = ["S", "M", "D", "M", "D", "F", "S"]
const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]

function CustomInput({openCalendar, closeCalendar, handleValueChange}){
    return(
        <a
        href="#"
        onClick={openCalendar} 
        onChange={handleValueChange} 
        type="button" 
        className='button rc-calendar-btn'>
            <SVGIcon class="svg-icon-md" src={calendar}/>
        </a>
    )
}
function CustomInputLine({
  size,
  openCalendar, 
  handleValueChange, 
  date, 
  onNextDay, 
  onPrevDay}){
  let icon_size
  if(size == sm){
    icon_size = "svg-icon-sm"
  }
  if(size == md){
    icon_size = "svg-icon-md"
  }
  else{
    icon_size = "svg-icon-md"
  }
  
  const dayDate = new Date(date).toLocaleDateString();
  //console.log(date)
  return(
      <div className="calendar-line">
        <div className="cl-arrow" onClick={onPrevDay} type="button">
          <SVGIcon src={caret_left} class={icon_size}/>
        </div>
        <div className="cl-date"
        href="#"
        onClick={openCalendar} 
        onChange={handleValueChange} 
        type="button"> 
        {dayDate} 
        </div>
        <div className="cl-arrow" onClick={onNextDay} type="button">
        <SVGIcon src={caret_right} class={icon_size}/>
         </div>
      </div>
  )
}
export default function Calendar({onDateChange}) {
  const today = new Date()

  const [values, setValues] = useState([]);
  const displaySelectedDates = useMemo(() => SelectedDates(values), [values]);
  let dates = ""
  const handleChange = (array) => {
    setValues(array);
    dates = ""
    for(let i = 0; i<array.length; i++){
      dates=[...dates, array[i].format("DD/MM/YYYY")]
    }
    onDateChange(dates)
  }

  function SelectedDates(values){
    //console.log(values)
    if(values.length == 1){
        return <p>{values[0].day+"."+values[0].month+"."+values[0].year}</p>
    } 
    else{
        return <p>{values.length} Tage ausgewählt</p>
    }
  }
  return (
    <div className="calendar-wrap">
    <DatePicker 
        multiple
        months={months}
        weekDays={weekDays}
        className="custom-calendar"
        onChange={array => handleChange(array)}
        mobileLabels={{
            OK: "OK",
            CANCEL: "Abbrechen",
            }}
        plugins={[
            <DatePanel header="-" />
            ]}
        render={<CustomInput/>}
    />
    {displaySelectedDates}
    
    </div>
  )
}

export function CalendarSingle({onDateChange}) {
  const today = new Date()

  const [values, setValues] = useState([]);

  const handleChange = (array) => {
    setValues(array.format("DD.MM.YYYY"));
    onDateChange(array.format("DD/MM/YYYY"));
  }
  return (
    <div className="calendar-wrap jc-c">
    <DatePicker 
        multiple={false}
        months={months}
        weekDays={weekDays}
        className="custom-calendar"
        onChange={array => handleChange(array)}
        render={<CustomInput/>}
    />
    <p>{values}</p>
    
    </div>
  )
}



export function DateLine({
  onDateChange,
  defaultDay,
  size
}) {
  const today = new Date().toISOString().split("T",[1])
  const [value, setValue] = useState(defaultDay|| today);

  const handleChange = (date) => {
    //console.log(date)
    setValue(date.format("YYYY-MM-DD"));
    onDateChange(date.format("YYYY-MM-DD"));
  }
  const onNextDay= () => {
    
   const currentDate = new Date(value);
   const nextDay = new Date(currentDate.getTime() + (1000 * 60 * 60 * 24)).toISOString().split("T", [1])[0];
  // console.log(nextDay)
   setValue(nextDay)
   onDateChange(nextDay)
  }
  const onPrevDay= () => {
    const currentDate = new Date(value);
    const prevDay = new Date(currentDate.getTime() - (1000 * 60 * 60 * 24)).toISOString().split("T", [1])[0];
   // console.log(prevDay)
    setValue(prevDay)
    onDateChange(prevDay)
  }

  return (
    
    <div className="calendar-wrap jc-c">
    <DatePicker 
        multiple={false}
        months={months}
        weekDays={weekDays}
        className="custom-calendar"
        onChange={date => handleChange(date)}
        render={<CustomInputLine 
          size
          date={value}
          onNextDay={()=> onNextDay()}
          onPrevDay={()=> onPrevDay()}   />}
    />
    
    
    </div>
  )
}
