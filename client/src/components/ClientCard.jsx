import React, { useEffect, useMemo, useState } from 'react'
import SVGIcon from './SVG'
import plus from '../assets/icons/plus.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import '../styles/ClientCard.css'
import '../styles/RecipeCard.css'
import handleClientOrderRequest from '../hooks/handleClientOrderRequest'




function ClientCard({
  onClick,
  onClickOrder,
  onClickMore,
  editID,
  editBtn,
  data: client
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
    <div className='c-card new-order'>
      <p>Bestellung</p>
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