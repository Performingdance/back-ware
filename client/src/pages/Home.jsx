import React, { useState } from 'react'
import Header from '../components/Header'
import login from '../assets/icons/login.svg'
import person_plus from '../assets/icons/person-plus.svg'
import { LoginPopup } from '../components/Popup'
import SVGIcon from '../components/SVG'

function Home() {
  const [toggleLogin, setToggleLogin] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)

  return (
    <div className='content'>
    <Header title="Übersicht"/>
    {toggleLogin && <LoginPopup onClickAbort={()=>setToggleLogin(false)} onClickOK={()=>setToggleLogin(false)}/>}
    <div className='top-icon'>
      <button key={"login"} className='edit-btn' onClick={()=>setToggleLogin(true)}><SVGIcon src={login} class="svg-icon-md"/> </button>
      <button key={"register"} className='edit-btn' onClick={()=>setToggleRegister(true)}><SVGIcon src={person_plus} class="svg-icon-md"/> </button>
    </div>
    </div>
  )
}

export default Home