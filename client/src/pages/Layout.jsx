import {Outlet} from 'react-router-dom'
import { useState } from 'react';
import '../index.css';
import list_check from '../assets/icons/list-check.svg';
import shop from '../assets/icons/shop.svg';
import calculator from '../assets/icons/calculator.svg';
import recipe_book from '../assets/icons/book-half.svg';
import calendar_plus from '../assets/icons/calendar-plus.svg';
import dots from '../assets/icons/three-dots.svg';
import carrot from '../assets/icons/carrot.svg';
import gear_wide from '../assets/icons/gear-wide.svg';
import person_vcard from '../assets/icons/person-vcard.svg'
import Navbar, { NavItem, DropdownMenu, DropdownItem } from '../components/Navbar';




const Layout = () =>{

 const [open, setOpen] = useState(false);
  return (
<main className='app-layout'>
<div className='content'>
        <Outlet/>

</div>
    <Navbar>

<NavItem icon={list_check} toggle={open} id="list" onClick={()=> {open != "list" ? setOpen("list") : setOpen(false)}} >
  <DropdownMenu class="dropdown dropdown-start">
      <DropdownItem href="/daylist" class="menu-item" leftIcon={carrot}>Tagesliste</DropdownItem>
      <DropdownItem href="/worksheet" class="menu-item" leftIcon={calculator}>Backzettel</DropdownItem>
  </DropdownMenu>
</NavItem>
<NavItem href="/products" icon={recipe_book}/>
<NavItem icon={dots} toggle={open} id="more" onClick={()=>{open != "more" ? setOpen("more") :setOpen(false)}}>
  <DropdownMenu class="dropdown">
      <DropdownItem href="/ingredients" class="menu-item" leftIcon={carrot}>Zutaten</DropdownItem>
      <DropdownItem href="/forms" class="menu-item" leftIcon={carrot}>Formen</DropdownItem>
      <DropdownItem href="/recipes" class="menu-item" leftIcon={carrot}>Rezepte</DropdownItem>
      <DropdownItem href="/calculator" class="menu-item" leftIcon={calculator}>Preisrechner</DropdownItem>
      <DropdownItem href="/invoices" class="menu-item" leftIcon={calendar_plus}>Rechnungen</DropdownItem>
      <DropdownItem href="/clients" class="menu-item" leftIcon={calendar_plus}>Kunden</DropdownItem>
  </DropdownMenu>
</NavItem>

<NavItem href="/orders" icon={shop}/>

<NavItem icon={gear_wide} toggle={open} id="settings" onClick={()=> {open != "settings" ? setOpen("settings") : setOpen(false)}} >
  <DropdownMenu class="dropdown dropdown-end">
      <DropdownItem href="/account" class="menu-item" leftIcon={person_vcard}>Konto</DropdownItem>
      <DropdownItem href="/settings" class="menu-item" leftIcon={gear_wide}>Einstellungen</DropdownItem>
  </DropdownMenu>
</NavItem>
</Navbar>

</main>
  )
}

export default Layout