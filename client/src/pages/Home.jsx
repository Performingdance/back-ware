import React, { useState } from 'react'
import Header from '../components/Header'
import login from '../assets/icons/login.svg'
import person_plus from '../assets/icons/person-plus.svg'
import { AlertPopup, LoginPopup } from '../components/Popup'
import SVGIcon from '../components/SVG'
import logoutToken from '../services/logout'
import tokenCheck from '../services/tokenCheck'


function Home() {
  const [toggleLoginPrompt, setToggleLoginPrompt] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)
  const [toggleLogoutPrompt, setToggleLogoutPrompt] = useState(false)
  const isLoggedIn = tokenCheck()
  let logoutMessage

  function handleLogout(){

    if(tokenCheck() == false){
      logoutMessage = "Erfolgreich abgemeldet"
    }
    else{
      logoutMessage = "Fehler bei der Abmeldung"
    }
    setToggleLogoutPrompt(true)
  }
  return (
    <div className='content'>
    <Header title="Übersicht"/>
    {toggleLogoutPrompt && <AlertPopup title={logoutMessage} onClickOK={()=>setToggleLogoutPrompt(false) } />}
    {toggleLoginPrompt && <LoginPopup onClickAbort={()=>setToggleLoginPrompt(false)} onClickOK={()=>{setToggleLoginPrompt(false)}}/>}
    <div className='top-icon'>
      {!isLoggedIn?
      [<button key={"login"} className='edit-btn' onClick={()=>setToggleLoginPrompt(true)}><SVGIcon src={login} class="svg-icon-md"/> </button>,
      <button key={"register"} className='edit-btn' onClick={()=>setToggleRegister(true)}><SVGIcon src={person_plus} class="svg-icon-md"/> </button>]:
      <button key={"logout"} className='btn edit-btn ' onClick={()=>{logoutToken(), handleLogout()}}><SVGIcon src={login} class="svg-icon-md"/> </button>
      }    
      
    </div>
    </div>
  )
}

export default Home