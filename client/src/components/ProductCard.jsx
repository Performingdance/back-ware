import React, { useState } from 'react'
import '../styles/RecipeCard.css'
import SVGIcon from './SVG'
import clipboard_plus from '../assets/icons/clipboard-plus.svg'
import { ProductOrderPopup } from './Popup'
import config from '../config.json'
const BASE_URL_IMG_API = config.BASE_URL_IMG_API





export default function ProductCard({
  href,
  productID,
  productName,
  img,



}) {

  let image
  if(!img || (img == "NULL") || (img == "default")){
    image = "../imgs/default_product_img.jpg"
  }else{
    image = BASE_URL_IMG_API+"public/product_imgs/prev_"+img
  }
  

  const [orderOpen, setOrderOpen] = useState(false); 

  return (
    <div className='recipe-card'>
    <div className='rc-card'>
        
        <a className='rc-title' href={href}>
          <h2 className='rc-name'>{productName}</h2>
          <img alt="" onError={(e)=>{e.target.src = "../imgs/default_product_img.jpg"}} className="rc-title-img" src={image} loading='lazy'/>
        </a>
        <div className='rc-btns' >
          <a type="button" onClick={()=>[setOrderOpen(!orderOpen)]} className='button rc-btn '>
            <SVGIcon class="rc-btn-svg" src={clipboard_plus}/>Bestellung
          </a>

        </div>
    </div>
    

    {orderOpen && <ProductOrderPopup 
                      onClickOK={()=>setOrderOpen(false)} 
                      onClickAbort={()=>setOrderOpen(false)} 
                      defaultProductID={productID}
                      defultProductName={productName}
                     />}
   


    </div>
    
  )

}


