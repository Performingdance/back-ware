import React, { useState } from 'react'
import '../styles/RecipeCard.css'
import SVGIcon from './SVG'
import calendar_plus from '../assets/icons/calendar-plus.svg'
import clipboard_plus from '../assets/icons/clipboard-plus.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import Calendar from './Calendar'
import handleRecipeFormRequest from '../hooks/handleRecipeFormExtRequest'







export default function RecipeCard(props) {
  
  function handleFormAmount(forms, formID, amount){
    let obj = forms.find(f=>f.ID == formID);
    if(obj) obj.amount=amount;
     //console.log(forms)
  
  }
  function handleNewOrderSubmit(forms, recipeID,dates,e){
    e.preventDefault();

    let selectedForms = forms.filter(form => form.amount > 0)
    if(!selectedForms.length){
      alert("Mind. bei einer Form eine Menge eingeben")
      return
    }
    if(!dates.length){
      alert("Mind. einen Tag auswählen")
      return
    }else{

    }
  
     console.log(selectedForms)
     console.log(recipeID)
     console.log(dates)
  
    setOrderOpen(!orderOpen)
  }
  function handleAddOrderSubmit(forms, recipeID, dates,e){
    e.preventDefault();
    let selectedForms = forms.filter(form => form.amount!= 0)
    if(!selectedForms.length){
      alert("Mind. bei einer Form eine Menge eingeben")
      return
    }
    if(!dates.length){
      alert("Mind. einen Tag auswählen")
      return
    }
    // console.log(selectedForms)
    // console.log(recipeID)
    // console.log(dates)
    
    alert("super")
    
    setOrderOpen(!orderOpen)
  }
  const [orderOpen, setOrderOpen] = useState(false);
  const [forms, error, loading] = handleRecipeFormRequest(props.recipeID);
  const [dates, setDates] = useState([]);

  const handleDateChange = (newDates) => {
    setDates(newDates);
  }
  const listOfForms =  forms.map((form) => 
    
    <li className="rc-form-item" key={"li"+form.ID}>
    <span className="rc-input-label" key={form.name}>{form.name}</span>
    <input placeholder="0" onChange={(e)=> handleFormAmount(forms, form.ID, e.target.value)} className="rc-form-input input" type="number" key={form.ID}></input>
    </li>)
//console.log(props.recipeID)
  return (
    <div className='recipe-card'>
    <div className='rc-card'>
        
        <a className='rc-title' href={props.href}>
          <h2 className='rc-name'>{props.title}</h2>
          <img alt="" className="rc-title-img" src={props.img}/>  
        </a>
        <div className='rc-btns' >
          <a type="button" onClick={()=>[setOrderOpen(!orderOpen), setDates("")]} className='button rc-btn '>
            <SVGIcon class="rc-btn-svg" src={clipboard_plus}/>Bestellung
          </a>

        </div>
    </div>
    

    {orderOpen &&
    <div className='rc-order'>
        <div className='rc-calendar'>

        <Calendar onDateChange={handleDateChange}/>
        </div>
        <div className='rc-form'>
        {/* map all forms here + input for amount */}
        <ul>
        {listOfForms}
        </ul>
        </div>
        <button onClick={(e)=>handleNewOrderSubmit(forms, props.recipeID,dates,e)} className="button rc-submit-btn">Neue Bestellung</button>
        <button onClick={(e)=>handleAddOrderSubmit(forms, props.recipeID,dates,e)} className="button rc-submit-btn">best. Bestellung</button>
      </div>}
    </div>
    
  )

}


