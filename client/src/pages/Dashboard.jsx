import React, { useState } from 'react'
import Header from '../components/Header'
import logout from '../assets/icons/logout.svg'
import { AlertPopup, LoginPopup } from '../components/Popup'
import SVGIcon from '../components/SVG'
import { useAuth } from '../services/auth/AuthProvider'


function Dashboard() {
  const auth = useAuth();
  const [toggleLoginPrompt, setToggleLoginPrompt] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)
  const [toggleLogoutPrompt, setToggleLogoutPrompt] = useState(false)
  const [logoutMessage, setLogoutMessage]= useState("")

  if (!auth.token){
    // 
    return (
      <div className='content'>
      <Header title={"Bitte anmelden" } />
      </div>
    )
  }else{
    return (
      <div className='content'>
      <Header title={"Wilkommen " + (auth.user?.username || "") } />
      {toggleLogoutPrompt && <AlertPopup title={logoutMessage} onClickOK={()=>setToggleLogoutPrompt(false) } />}
      {toggleLoginPrompt && <LoginPopup onClickAbort={()=>setToggleLoginPrompt(false)} onClickOK={()=>{setToggleLoginPrompt(false)}}/>}
      <div className='top-icon'>
        <button key={"logout"} className='btn edit-btn ' onClick={()=>{auth.logOut()}}><SVGIcon src={logout} class="svg-icon-md"/> </button>      
      </div>
        <h1 className='ta-c'>Willkommen in der Back-ware</h1>
      </div>
    )
  }
  
}

export default Dashboard