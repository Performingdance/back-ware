import React from 'react'
import '../index.css'
function SVGIcon(props) {
  return (
    <img className={props.class} src={props.src} alt={props.alt} onClick={props.onClick}/>
  )
}

export default SVGIcon