import React, { useState } from 'react'
import '../styles/RecipeCard.css'
import SVGIcon from './SVG'
import calendar_plus from '../assets/icons/calendar-plus.svg'
import clipboard_plus from '../assets/icons/clipboard-plus.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import { RecipeOrderPopup } from './Popup'
import config from '../config.json'
const BASE_URL_API = config.BASE_URL_API





export default function ProductCard({
  href,
  productID,
  productName,
  img,
  recipeID,
  recipeName,
  formID,
  formName,



}) {

  let image
  if(!img){
    image = "../imgs/default_recipe_img.jpg"
  }else{
    image = BASE_URL_API+"public/recipe_imgs/"+img
  }
  

  const [orderOpen, setOrderOpen] = useState(false); 

  return (
    <div className='recipe-card'>
    <div className='rc-card'>
        
        <a className='rc-title' href={href}>
          <h2 className='rc-name'>{productName}</h2>
          <img alt="" className="rc-title-img" src={image}/>  
        </a>
        <div className='rc-btns' >
          <a type="button" onClick={()=>[setOrderOpen(!orderOpen)]} className='button rc-btn '>
            <SVGIcon class="rc-btn-svg" src={clipboard_plus}/>Bestellung
          </a>

        </div>
    </div>
    

    {orderOpen && <RecipeOrderPopup 
                      onClickOK={()=>setOrderOpen(false)} 
                      onClickAbort={()=>setOrderOpen(false)} 
                      defaultRecipeID={recipeID}
                      defaultRecipeName={recipeName}
                      defaultFormID={formID}
                      defaultFormName={formName}
                      defaultProductID={productID}
                      defultProductName={productName}
                     />}
   


    </div>
    
  )

}


