import React, { useState } from 'react'
import Header from '../components/Header'
import login from '../assets/icons/login.svg'
import person_plus from '../assets/icons/person-plus.svg'
import { LoginPopup } from '../components/Popup'
import SVGIcon from '../components/SVG'
import logoutToken from '../services/logout'
import tokenCheck from '../services/tokenCheck'


function Home() {
  const [toggleLoginPrompt, setToggleLoginPrompt] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)
  const isLoggedIn = tokenCheck()
  return (
    <div className='content'>
    <Header title="Übersicht"/>
    {toggleLoginPrompt && <LoginPopup onClickAbort={()=>setToggleLoginPrompt(false)} onClickOK={()=>setToggleLoginPrompt(false)}/>}
    <div className='top-icon'>
      {!isLoggedIn?
      [<button key={"login"} className='edit-btn' onClick={()=>setToggleLoginPrompt(true)}><SVGIcon src={login} class="svg-icon-md"/> </button>,
      <button key={"register"} className='edit-btn' onClick={()=>setToggleRegister(true)}><SVGIcon src={person_plus} class="svg-icon-md"/> </button>]:
      <a href='./' key={"logout"} className='button edit-btn ' onClick={()=>{logoutToken()}}><SVGIcon src={login} class="svg-icon-md"/> </a>
      }    
      
    </div>
    </div>
  )
}

export default Home