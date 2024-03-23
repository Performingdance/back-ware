import React, { useState } from 'react'
import '../styles/RecipeCard.css'
import SVGIcon from './SVG'
import calendar_plus from '../assets/icons/calendar-plus.svg'
import clipboard_plus from '../assets/icons/clipboard-plus.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import { RecipeOrderPopup } from './Popup'







export default function ProductCard(props) {
  

  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedRecipeID,setSelectedRecipeID] = useState(-1);
  const [selectedRecipeName,setSelectedRecipeName] = useState("");
  
//console.log(props.recipeID)
  return (
    <div className='recipe-card'>
    <div className='rc-card'>
        
        <a className='rc-title' href={props.href}>
          <h2 className='rc-name'>{props.title}</h2>
          <img alt="" className="rc-title-img" src={props.img}/>  
        </a>
        <div className='rc-btns' >
          <a type="button" onClick={()=>[ setSelectedRecipeName(props.title), setSelectedRecipeID(props.recipeID),setOrderOpen(!orderOpen)]} className='button rc-btn '>
            <SVGIcon class="rc-btn-svg" src={clipboard_plus}/>Bestellung
          </a>

        </div>
    </div>
    

    {orderOpen && <RecipeOrderPopup 
                      onClickOK={()=>setOrderOpen(false)} 
                      onClickAbort={()=>setOrderOpen(false)} 
                      defaultRecipeID={selectedRecipeID}
                      defaultRecipeName={selectedRecipeName}
                     />}
   


    </div>
    
  )

}


