import React from 'react'
import '../styles/Header.css'
import logo from '../assets/img/logo_klee_m.png'

function Header(props) {
  return (
    <div className='header'>
        <a href="/home" className='logo-header'><img className='logo' src={logo}/></a>
        <h1 className='page-title'>{props.title}</h1>        
    </div>
  )
}

export default Header