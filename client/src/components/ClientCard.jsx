import React, { useEffect, useMemo, useState } from 'react'
import SVGIcon from './SVG'
import plus from '../assets/icons/plus.svg'
import file_plus from '../assets/icons/file-plus.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import bar_graph from '../assets/icons/bar-graph.svg'
import '../styles/ClientCard.css'
import '../styles/RecipeCard.css'
import '../styles/OrderCard.css'
import handleClientOrderRequest from '../hooks/handleClientOrderRequest'
import { NewOrderPopup } from './Popup'




function ClientCard({
  onClick,
  onClickOrder,
  onClickMore,
  editID,
  editBtn,
  client
}) {

const [orders,error,loading, handleRequest] = handleClientOrderRequest(client.ID)
const [orderPrompt, setOrderPrompt] = useState(false)
useEffect(()=>{if(editID==client.ID && editBtn==1){
  handleRequest (client.ID)
}},[editID])



function handleOrderBtn(e){
   // console.log(props.clientID, props.editID, props.editBtn)

    return onClick
}
const orderList = 
orders.map((order, key)=> {
  if(order.ID == -1){
    return(
      <li key={key+"li"} className='order-li'>
        <p></p>
        <a onClick={()=>{setOrderPrompt(true)}} type="button" className='button rc-btn'>
          neue Bestellung
        </a>
        <p></p>

      </li>
  
    )
  }else{
    return(
      <li key={key+"li"} className='order-li'>
        <p></p>
        <p key={key+"recipe"} className='order-p'>{order.name}</p>
        {order.invoiceID? 
        <a href={`/invoices/id:${order.invoiceID}`} type="button" className='button rc-btn'>
          <SVGIcon class="rc-btn-svg" src={bar_graph}/>
        </a>  
        :<div className='d-il'>
          <a href={`/orders/edit:${order.ID}`} type="button" className='button rc-btn'>
              <SVGIcon class="rc-btn-svg" src={pencil_square}/>
        </a>
        <a onClick={()=>{handleNewInvoice()}} type="button" className='button rc-btn'>
          <SVGIcon class="rc-btn-svg" src={file_plus}/>
        </a>         
        </div>}
        
      </li>
  
    )

  }
  

}) 


//console.log(client)

  return (
    <div className='client-card'>
    <div className='c-card'>
        <div className='c-title' >
          <h3>{client.fullName}</h3>
          <p>{client.company}</p>
        </div>
        <div className='rc-btns' > 
          <a type="button" className='button rc-btn' onClick={onClickOrder}>
            <SVGIcon class="rc-btn-svg" src={plus}/> Bestellung
          </a>
          <a type="button" className='button rc-btn ' onClick={onClickMore}>
            <SVGIcon class="rc-btn-svg" src={plus}/> Mehr
          </a>
          <a href={`/clients/edit:${client.ID}`} type="button" className='button rc-btn'>
            <SVGIcon class="rc-btn-svg" src={pencil_square}/>
          </a>
        </div>

    </div>
    {editID==client.ID && editBtn==1 && 
    <div className='c-card cc-order'>
       <ul className='product-list'>
       {orders.length && orderList}
       </ul>
      {orderPrompt && 
      <NewOrderPopup 
        defaultClientID={client.ID} 
        defaultClientName={client.fullName}
        onClickAbort={()=>setOrderPrompt(false)}
        onClickOK={()=>setOrderPrompt(false)} />}
    </div>}
    {editID==client.ID && editBtn==2 && 
    <div className=' c-card cc-more '>
      <div className='cc-more'>
        <div className='cc-address'>
          <ul className='cc-list'>
            <li>{client.street_number!= "0" && " "? client.street_number : "-"}</li>
            <li>{client.zip_code!= "0" && " "? client.zip_code : "-"}</li>
            <li>{client.city!= "0" && " "? client.city : "-"}</li>
            <li>{client.country!= "0" && " "? client.country : "-"}</li>
            
          </ul>
        </div>
        <div className='cc-invoice'>
          <ul className='cc-list'>
            <li>Handy: {client.phone != "0" && " "? client.phone : "-"}</li>
            <li>Festnetz: {client.mobile!= "0" && " "? client.mobile : "-"}</li>
            <li>Marge: {client.marge}</li>
          </ul>
        </div>

      </div>
    </div>}

    </div>
  )
}

export default ClientCard