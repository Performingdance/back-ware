import React, { useState } from 'react'
import Header from '../components/Header'
import login from '../assets/icons/login.svg'
import logout from '../assets/icons/logout.svg'
import person_plus from '../assets/icons/person-plus.svg'
import { AlertPopup, LoginPopup } from '../components/Popup'
import SVGIcon from '../components/SVG'
import { useAuth } from '../services/auth/AuthProvider'


function Home() {
  const auth = useAuth();
  const [toggleLoginPrompt, setToggleLoginPrompt] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)
  const [toggleLogoutPrompt, setToggleLogoutPrompt] = useState(false)
  const [logoutMessage, setLogoutMessage]= useState("")

  if(auth.token && auth.user){
    document.location.href = "/dashboard"
  }
  return (
    <div className='content'>
    <Header title={"Back-ware"} />
    {toggleLogoutPrompt && <AlertPopup title={logoutMessage} onClickOK={()=>setToggleLogoutPrompt(false) } />}
    {toggleLoginPrompt && <LoginPopup onClickAbort={()=>setToggleLoginPrompt(false)} onClickOK={()=>{setToggleLoginPrompt(false)}}/>}
    <div className='top-icon'>
      <button key={"login"} className='btn edit-btn' onClick={()=>setToggleLoginPrompt(true)}><SVGIcon src={login} class="svg-icon-md"/> </button>
      <button key={"register"} className='btn edit-btn' onClick={()=>setToggleRegister(true)}><SVGIcon src={person_plus} class="svg-icon-md"/> </button>   
    </div>
    <div>
     <h1 className='ta-c'>bitte anmelden</h1>
    </div>
    </div>
  )
}

export default Home