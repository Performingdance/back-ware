import React from 'react'
import "../styles/Loading.css"
import SVGIcon from './SVG'
import bread from '../assets/icons/bread.svg'

function Loading({
  _key
}) {
  return (
    <div key={"background"} className='loading-bg'>
      <SVGIcon src={bread} class='spinning-icon' />
    </div>
  )
}

export default Loading