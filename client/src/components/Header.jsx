import React, { useState } from 'react'
import '../styles/Header.css'
import logo from '../assets/img/logo_klee_m.png'
import { useAuth } from '../services/auth/AuthProvider'


function Header(props) {
  const user = useAuth();


  return (
    <div className={"header"}>
     {user.token?
        <a href="/dashboard" className='logo-header'><img className='logo' src={logo}/></a>:
        <a href="/home" className='logo-header'><img className='logo' src={logo}/></a>
     } 
        <h2 className='page-title'>{props.title}</h2>        
    </div>
  )
}

export default Header