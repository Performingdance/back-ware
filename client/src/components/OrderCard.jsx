import React, { useState } from 'react'
import SVGIcon from './SVG'
import plus from '../assets/icons/plus.svg'
import file_plus from '../assets/icons/file-plus.svg'
import bar_graph from '../assets/icons/bar-graph.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import '../styles/ClientCard.css'
import '../styles/RecipeCard.css'
import '../styles/OrderCard.css'




export  function OrderCard({
    onClick,
    onClickMore,
    onClickInv,
    editID,
    editBtn,
    data,
    products
  }) {

  const productList = 
    products.map((product, key)=> {
      return(
        <li key={key+"li"} className='order-li'>
          <p key={key+"amount"} className='order-p' >{product.amount+"x"}</p>
          <p key={key+"product"} className='order-p'>{product.product_name}</p>
        </li>

      )

    }) 


  //console.log(products)
  
    return (
      <div className='client-card'>
      <div className='c-card'>
          <div className='c-title' >
            <h3>{data.client}</h3>
            <p>{ "#"+ data.ID + " (" + data.order_date + ")" }</p>
          </div>
          <div className='rc-btns' > 
            {( data.invoiceID <= 0)? <a type="button" className='button rc-btn ' onClick={onClickInv}>
              <SVGIcon class="rc-btn-svg" src={file_plus}/> Rechnung (neu)
            </a> :
            <a type="button" className='button rc-btn ' onClick={()=>window.location.href = `/invoices/${data.invoiceID}`}>
              <SVGIcon class="rc-btn-svg" src={bar_graph}/> Rechnung öffnen
            </a>}          
            <a type="button" className='button rc-btn' onClick={onClickMore}>
              <SVGIcon class="rc-btn-svg" src={plus}/> Mehr
            </a>

            <a href={`/orders/${data.ID}`} type="button" className='button rc-btn'>
              <SVGIcon class="rc-btn-svg" src={pencil_square}/>
            </a>
          </div>
  
      </div>
      {editID==data.ID && editBtn==1 && 
      <div className='c-card new-order'>
       {( data.invoiceID <= 0) && <p>Rechnung erstellen</p>}
      </div>}
      {editID==data.ID && editBtn==2 && 
      <div className=' c-card cc-more '>
        <ul className='product-list'>
        {productList.length? productList: <p>noch keine Produkte unter dieser Bestellung</p>}

        </ul>
      </div>}

  
      </div>
    )
  }
