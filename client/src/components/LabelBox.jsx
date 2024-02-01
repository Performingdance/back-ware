import React from 'react'
import '../styles/LabelBox.css'
import calcHeight from '../hooks/handleResize'

export default function LabelBox({
    _key, 
    className,
    title,
    text}) {
  return (
    <div _key={_key+"lb"} className={className+" labelbox"} >
        <p _key={_key+"p"} className='lb-title'>{title}</p>
        <p _key={_key+"text"} className='lb-text'>{text}</p>
    </div>
  )
}

export function LabelInput({
  _key, 
  className,
  title,
  placeholder,
  value,
  required,
  type,
  _ref,
  onChange,
  onClick}) {
return (
  <div key={_key+"lb"} className={className+" labelbox"} >
      <p key={_key+"p"} className='lb-title'>{title}</p>
      <input key={_key+"input"} required={required} ref={_ref} value={value} type={type} className='lb-input' defaultValue={placeholder} onChange={onChange} onClick={onClick}/>
  </div>
)
}

export function LabelTextInput({
  key: _key, 
  className,
  title,
  placeholder,
  defaultValue,
  onChange,
  onClick}) {
return (
  <div _key={_key+"lb"} className={className+" labelbox"} >
      <p _key={_key+"p"} className='lb-title'>{title}</p>
      <textarea _key={_key+"input"} className='input lb-text-input' on={(e)=>e.target.style.height = calcHeight(e.target.value) + "rem"} placeholder={placeholder} defaultValue={defaultValue} onChange={(e)=>[onChange(e.target.value), e.target.style.height = calcHeight(e.target.value) + "rem"]} onClick={onClick}/>
  
  </div>
)
}
