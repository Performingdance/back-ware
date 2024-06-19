import React, { useState } from 'react'
import Header from '../components/Header'
import { LoginPopup, RegisterPopup } from '../components/Popup'


function Settings() {
  const [toggleLogin, setToggleLogin] = useState(false)
  const [toggleRegister, setToggleRegister] = useState(false)

  function handleLogout(){

  }

  return (
    <div className='content'>
    <Header title="Konto"/>
    <div className='page-content' >
    { toggleLogin && <LoginPopup onClickOK={() => setToggleLogin(false)} onClickAbort={()=> setToggleLogin(false)} />
    }
    { toggleRegister && <RegisterPopup onClickOK={() => {setToggleRegister(false), setToggleLogin(true)}} onClickAbort={()=> setToggleRegister(false)} />
    }
    <button onClick={()=>setToggleLogin(true)}>Login</button>
    <button onClick={()=>handleLogout()}>Logout</button>
    <button onClick={()=>setToggleRegister(true)}>neuer Benutzer</button>

    </div>
    
    </div>
  )
}

export default Settings