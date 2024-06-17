import React, { useRef, useState } from 'react'
import SVGIcon from './SVG';
import '../styles/Navbar.css'



export default function Navbar(props) {

  return (
    <nav id='navbar' className='navbar' >
        <ul className='navbar-nav'> { props.children } </ul>
    </nav>
    
  )
};
export function NavItem(props) {
    
    return (
        <li className='nav-item'>
            <a href={props.href} onClick={props.onClick} className='icon-button' >
                <SVGIcon src={props.icon} class='svg-icon-lg'/>
            </a>
            {props.toggle == props.id && props.children}
        </li>
    )
  };
export function DropdownItem(props) {
    return (
        <a href={props.href}  className={props.class} onClick={props.onClick}>
        <span className='icon-left'><SVGIcon src={props.leftIcon} class='svg-icon-md'/></span>
            {props.children}
        </a>
    );
}
export function DropdownMenu(props) {

    return (
        <div className={props.class}>
            {props.children}
        </div>
    )
};
