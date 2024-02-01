import React, { useState } from 'react'
import Header from '../components/Header'
import { LoginPopup } from '../components/Popup'


function Settings() {
  const [toggleLogin, setToggleLogin] = useState(true)

  return (
    <div className='content'>
    <Header title="Einstellungen"/>
    { toggleLogin && <LoginPopup onClickOK={() => setToggleLogin(false)} onClickAbort={()=> setToggleLogin(false)} />
    }
    <button onClick={()=>setToggleLogin(true)}>Login</button>
    </div>
  )
}

export default Settings