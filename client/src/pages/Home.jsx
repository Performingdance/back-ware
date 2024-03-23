import React, { useState } from 'react'
import Header from '../components/Header'
import login from '../assets/icons/login.svg'
import logout from '../assets/icons/logout.svg'
import person_plus from '../assets/icons/person-plus.svg'
import { AlertPopup, LoginPopup } from '../components/Popup'
import SVGIcon from '../components/SVG'
import logoutToken from '../services/logout'
import tokenCheck from '../services/tokenCheck'
import { FileList, FileUploadPopUp } from '../components/PhotoUpload'


function Home() {
  const [toggleLoginPrompt, setToggleLoginPrompt] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)
  const [toggleLogoutPrompt, setToggleLogoutPrompt] = useState(false)
  const isLoggedIn = tokenCheck()
  const [logoutMessage, setLogoutMessage]= useState()

  function handleLogout(){

    if(tokenCheck() == false){
      setLogoutMessage("Erfolgreich abgemeldet")
    }
    else{
      setLogoutMessage("Fehler bei der Abmeldung")
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
      [<button key={"login"} className='btn edit-btn' onClick={()=>setToggleLoginPrompt(true)}><SVGIcon src={login} class="svg-icon-md"/> </button>,
      <button key={"register"} className='btn edit-btn' onClick={()=>setToggleRegister(true)}><SVGIcon src={person_plus} class="svg-icon-md"/> </button>]:
      <button key={"logout"} className='btn edit-btn ' onClick={()=>{logoutToken(), handleLogout()}}><SVGIcon src={logout} class="svg-icon-md"/> </button>
      }    
      
    </div>
    {isLoggedIn? <h1 className='ta-c'>Willkommen in der fein-Bäckerei</h1>:
    <div>
      <h1 className='ta-c'>Willkommen in der fein-Bäckerei</h1>
     <h1 className='ta-c'>bitte anmelden</h1>
    </div>}
    <FileList />
    </div>
  )
}

export default Home