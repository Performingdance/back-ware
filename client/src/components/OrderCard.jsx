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
    onClickInfo,
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
          {(product.invoiceID > 0)?
            <a type="button" className='button order-btn' onClick={()=>window.location.href = `/invoices/${product.invoiceID}`}>
              <SVGIcon class="rc-btn-svg" src={bar_graph}/> 
            </a>:
            <a type="button" className='button order-btn' onClick={onClickInv}>
            <SVGIcon class="rc-btn-svg" src={file_plus}/>
          </a>}
        </li>

      )

    }) 


  //console.log(products)
  
    return (
      <div className='client-card'>
      <div className='c-card'>
          <div className='c-title' >
            <h3>{data.client}</h3>
            <p>{ "#"+ data.ID + " (" + data.order_date + ") " + (data.billed_items || "0") + "/" + (data.total_items || "0" ) }</p>
          </div>
          <div className='rc-btns' > 
            {(( data.billed_items == data.total_items) && data.total_items > 0)?
            "":
            <a type="button" className='button rc-btn ' onClick={onClickInv}>
            <SVGIcon class="rc-btn-svg" src={file_plus}/> Rechnung (neu)
          </a>}          
            <a type="button" className='button rc-btn' onClick={onClickInfo}>
              <SVGIcon class="rc-btn-svg" src={plus}/> Info
            </a>

            <a href={`/orders/${data.ID}`} type="button" className='button rc-btn'>
              <SVGIcon class="rc-btn-svg" src={pencil_square}/> Mehr
            </a>
          </div>
  
      </div>
      {editID==data.ID && editBtn==1 && 
      <div className='c-card new-order'>
       {( data.invoiceID <= 0) && <p>Rechnung erstellen</p>}
      </div>}
      {editID==data.ID && editBtn==2 && 
      <div className=' cc-more c-card   '>
        <ul className='product-list'>
        {productList.length? productList: <p>noch keine Produkte unter dieser Bestellung</p>}

        </ul>
      </div>}

  
      </div>
    )
  }
