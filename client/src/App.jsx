import React, { Component, useState } from 'react';
import './index.css';
//import Counter from './components/_tests_/counter';
import list_check from './assets/icons/list-check.svg';
import shop from './assets/icons/shop.svg';
import calculator from './assets/icons/calculator.svg';
import recipe_book from './assets/icons/book-half.svg';
import calendar_plus from './assets/icons/calendar-plus.svg';
import dots from './assets/icons/three-dots.svg';
import carrot from './assets/icons/carrot.svg';
import gear_wide from './assets/icons/gear-wide.svg';
import person_vcard from './assets/icons/person-vcard.svg'
import Navbar, { NavItem, DropdownMenu, DropdownItem } from './components/Navbar';
import Orders from './pages/Orders';
import Recipes from './pages/Recipes';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Ingredients from './pages/Ingredients';
import Forms from './pages/Forms';
import Daylist from './pages/Daylist';
import Archives from './pages/Archives';
import Home from './pages/Home';
import Settings from './pages/Settings';
import EditIng from './pages/EditIng';
import EditRecipe from './pages/EditRecipe';
import EditClient from './pages/EditClient';
import Worksheet from './pages/Worksheet';
import Calculator from './pages/Calculator';
import EditOrder from './pages/EditOrder';
import EditInvoice from './pages/EditInvoice';
import Account from './pages/Account';
import Products from './pages/Products';




function App() {
  
  let CurrentPage = Home;
  if(window.location.pathname == "/home"){
    CurrentPage = Home
  }
  if(window.location.pathname == "/orders"){
    CurrentPage = Orders
  }
  if(window.location.pathname == "/invoices"){
    CurrentPage = Invoices
  }
  if(window.location.pathname == "/ingredients"){
    CurrentPage = Ingredients
  }  
  if(window.location.pathname == "/recipes"){
    CurrentPage = Recipes
  }  
  if(window.location.pathname == "/products"){
    CurrentPage = Products
  }
  if(window.location.pathname == "/forms"){
    CurrentPage = Forms
  }  
  if(window.location.pathname == "/clients"){
    CurrentPage = Clients
  } 
  if(window.location.pathname == "/archives"){
    CurrentPage = Archives
  }
  if(window.location.pathname == "/settings"){
    CurrentPage = Settings
  }
  if(window.location.pathname == "/account"){
    CurrentPage = Account
  }
  if(window.location.pathname == "/daylist"){
    CurrentPage = Daylist
  }
  if(window.location.pathname == "/worksheet"){
    CurrentPage = Worksheet
  }
  if(window.location.pathname == "/calculator"){
    CurrentPage = Calculator
  }
  if(window.location.pathname.includes( `/ingredients/edit:` )){
    CurrentPage = EditIng
  }
  if(window.location.pathname.includes( `/recipes/edit:` )){
    CurrentPage = EditRecipe
  }  
  if(window.location.pathname.includes( `/clients/edit:` )){
    CurrentPage = EditClient
  }
  if(window.location.pathname.includes( `/orders/edit:` )){
    CurrentPage = EditOrder
  }
  if(window.location.pathname.includes( `/invoices/edit:` )){
    CurrentPage = EditInvoice
  }
  

  const [open, setOpen] = useState(false);

  return (
    <div className='app'>
      <div className='content'>
        <CurrentPage/>

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
    
    </div>

  )
}




export default App
