import React, { useState } from 'react'
import Header from '../components/Header'
import { LoginPopup, RegisterPopup } from '../components/Popup'
import logout from '../assets/icons/logout.svg'
import person_plus from '../assets/icons/person-plus.svg'
import SVGIcon from '../components/SVG'
import { useAuth } from '../services/auth/AuthProvider'
import EditUser from '../components/User.jsx'

function Settings() {
  const [toggleLogoutPrompt, setToggleLogoutPrompt] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)
  
  const auth = useAuth()
  const userrole = localStorage.getItem("role")

  return (
    <div className='content'>
    <Header title="Konto"/>
    <div className='top-icon'>
      <button key={"logout"} className='btn edit-btn' onClick={()=>auth.logOut()}><SVGIcon src={logout} class="svg-icon-md"/> </button>
      <button key={"register"} className='btn edit-btn' onClick={()=>setToggleRegister(true)}><SVGIcon src={person_plus} class="svg-icon-md"/> </button>   
    </div>
    <div className='page-content-wide' >
    {toggleLogoutPrompt && <AlertPopup title={logoutMessage} onClickOK={()=>setToggleLogoutPrompt(false) } />}
    { toggleRegister && <RegisterPopup onClickOK={() => {setToggleRegister(false), setToggleLogin(true)}} onClickAbort={()=> setToggleRegister(false)} />
    }
    {  userrole == "admin" && 
      <EditUser />}
    </div>
    
    </div>
  )
}

export default Settings