import React, { useMemo, useState } from 'react'
import SVGIcon from './SVG'
import plus from '../assets/icons/plus.svg'
import calendar_plus from '../assets/icons/calendar-plus.svg';
import "../styles/FloatIcon.css"
import { DropdownMenu, DropdownItem } from './Navbar'
import NewRecipePopup, {NewClientPopup,NewIngPopup, NewInvoicePopup, NewOrderPopup } from './Popup';


export default function FloatIcon (props){
  const [toggleDrop, setToggleDrop] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [path,setPath] = useState(location.pathname);
  //console.log(path)

  return (
    <>
    <button className='float-btn' onClick={()=>setToggleDrop(!toggleDrop)} ><SVGIcon src={plus} class='svg-icon-lg'/></button>
    { toggleDrop &&     
    <DropdownMenu class="float-dropdown">
            <DropdownItem href="#" onClick={()=>{setToggleDrop(!toggleDrop), setTogglePopup("order")}} class="float-menu-item" leftIcon={calendar_plus}>Neuer Auftrag</DropdownItem>
            <DropdownItem href="#" onClick={()=>{setToggleDrop(!toggleDrop), setTogglePopup("recipe")}} class="float-menu-item" leftIcon={calendar_plus}>Neues Rezept</DropdownItem>
            <DropdownItem href="#" onClick={()=>{setToggleDrop(!toggleDrop), setTogglePopup("ing")}} class="float-menu-item" leftIcon={calendar_plus}>Neue Zutat</DropdownItem>
            <DropdownItem href="#" onClick={()=>{setToggleDrop(!toggleDrop), setTogglePopup("invoice")}} class="float-menu-item" leftIcon={calendar_plus}>Neue Rechnung</DropdownItem>
            <DropdownItem href="#" onClick={()=>{setToggleDrop(!toggleDrop), setTogglePopup("client")}} class="float-menu-item" leftIcon={calendar_plus}>Neue/r Kunde/in</DropdownItem>
    </DropdownMenu> }
    {togglePopup == "order" && <NewOrderPopup type="order" title="Neuer Auftrag" onClickAbort={()=>setTogglePopup(false)} onClickOK={()=>setTogglePopup(!togglePopup)}/>}
    {togglePopup == "recipe" && <NewRecipePopup title="Neues Rezept" onClickAbort={()=>setTogglePopup(false)} onClickOK={()=>setTogglePopup(!togglePopup)}/>}
    {togglePopup == "ing" && <NewIngPopup title="Neue Zutat"  onClickAbort={()=>setTogglePopup(false)} onClickOK={()=>setTogglePopup(!togglePopup)}/>}
    {togglePopup == "invoice" && <NewInvoicePopup type="invoice" title="Neue Rechnung" onClickAbort={()=>setTogglePopup(false)} onClickOK={()=>setTogglePopup(!togglePopup)}/>}
    {togglePopup == "client" && <NewClientPopup type="client" title="Neue*r Kund*in" onClickAbort={()=>setTogglePopup(false)} onClickOK={()=>setTogglePopup(!togglePopup)}/>}

    </>
    


  )
}
