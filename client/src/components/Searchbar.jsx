import React, { useEffect, useRef, useState } from 'react'
import SVGIcon from './SVG'
import search from '../assets/icons/search.svg'
import x_circle from '../assets/icons/x-circle.svg'
import x from '../assets/icons/x.svg'
import check from '../assets/icons/check.svg'
import '../styles/Searchbar.css'
import handleIngAllRequest from '../hooks/handleIngAllRequest'


export default function Searchbar_filter(props) {
  const {filteredData} = props;
  const [open, setOpen] = useState(false)

  function handleFilter(search, data){
    const searchkey = props.searchkey;
    const searchkey2 = props.searchkey2 || "";
    const filteredArray = data.filter((val)=>{
     return (
      (searchkey.length && val[searchkey]) && val[searchkey].toLowerCase().includes(search.toLowerCase())
     || 
     ((searchkey2.length && val[searchkey2]) && val[searchkey2].toLowerCase().includes(search.toLowerCase()))
     )
    })
    filteredData(filteredArray);
    //console.log(filteredArray)

  }
  const searchInputRef = useRef(null)
  useEffect(()=>{searchInputRef.current && searchInputRef.current.focus()}) 



  return (
        <>
        {open? 
        <div className={props.class} onBlur={props.onBlur}>
          <input ref={searchInputRef} className={props.input_class} onChange={(e)=>handleFilter(e.target.value, props.data)}></input>
          <a className={props.btn_class } onClick={()=>{setOpen(!open), filteredData(props.data) }}>
          <SVGIcon src={x_circle} class='svg-icon-lg'/> 

          </a>
        </div>:
        <div className="searchbar-header-default" onBlur={props.onBlur}>
        <a className={props.btn_class } onClick={()=>{setOpen(!open), filteredData(props.data) }}>
         <SVGIcon  src={search} class='svg-icon-lg'/>
        </a>
      </div>
      
      }
      </>
        
    )
}

export function CreatableInput() {
  return (
    < >

    <div className='i-select'>
    <div className='i-input'></div>
    <div className='i-icon' ><SVGIcon icon={check}/> </div>
    </div>
    <div className='i-items'>

    </div>
    </>

  )
}
export function Select(props) {

  const items = props.data;
  //console.log(props.data)

  const itemList = items.map((item, key) => {
    const link = `#:${item.ID}:${item.marge_name}`
    return (<a key={key} href={link} onClick={props.aOnClick}  >{item.marge_name + " (" + item.marge_pc +"%)"}</a>)
  })
  return (
    <div className={props.className} >

    <div className='i-input'>
    <input readOnly type={props.type} onSelect={props.onSelect} onBlur={props.onBlur} defaultValue={props.placeholder} className={props.classInput}/>
    </div>
    {props.edit && <div className='i-items'>
      {itemList}
    </div>}
    </div>

  )
}



export function SelectForm(props) {

  const items = props.data
  //console.log(props.data)

  const itemList = items.map((item, key) => {
    const link = `#:${item.formID}:${item.name}`
    return (<a key={key} href={link} onClick={props.aOnClick}>{item.name}</a>)
  })
  return (
    <div className={props.className} >

    <div className='i-input'>
    <input readOnly type={props.type} onSelect={props.onSelect} onBlur={props.onBlur} defaultValue={props.placeholder} className={props.classInput}/>
    <button onClick={props.bOnClick} ><SVGIcon className="i-icon" src={check} class="svg-icon-lg"/></button>
    </div>
    {props.edit && <div className='i-items'>
      {itemList}
    </div>}
    </div>

  )
}
export function SelectIng(props) {

  const [items, error, loading, handleRequest] = handleIngAllRequest()
  useEffect(()=> handleRequest(),[])

  //console.log(props.data)

  const itemList = items.map((item, key) => {
    const link = `#:${item.ID}:${item.name}`
    return (<a key={key} href={link} onClick={props.aOnClick}>{item.name}</a>)
  })
  return (
    <div className={props.className} >

    <div className='i-input-div'>
    <input readOnly type={props.type} onSelect={props.onSelect} onBlur={props.onBlur} defaultValue={props.placeholder} className={props.classInput}/>
    {props.edit &&<button onClick={props.bOnClick} ><SVGIcon className="i-icon" src={check} class="svg-icon-lg"/></button>
    }</div>
    {props.edit && 
    <div className='i-items'>
      {itemList}
    </div>}
    </div>

  )
}
export const SelectComponent = ({
  id,
  editref,
  options,
  className, 
  placeholder = "",
  onSelect,
  onChange,
  selectedID,
  open,
  setOpen,
  defaultValue,
  returnValue
}) =>{
  const [inputValue, setInputValue] = useState(defaultValue || "");
  const onInputChange = (e) => {
    returnValue && returnValue(e.target.value)
    setInputValue(e.target.value);

  }
  function handleOnSelect () {
    //console.log(id, editref)
    setOpen(true)
    onSelect(id)

  }
  const onItemSelected = (option) => {
    onChange !== undefined && onChange(option.ID)
    onChange !== undefined && setInputValue(option.name)
    returnValue && returnValue(option.name)
    
    setOpen(false);
  }

  const clearDropdown = () => {
    setInputValue("");
    onChange("");

  }
  //console.log(options)
  return (
    <div key="select-wrapper" className={className} >

    <div key="select-input-div" className='i-input-div'>
      <input 
      id={id+"_select"} 
      key="select-input"
      className='i-input'
      type='text'
      value={inputValue}
      placeholder={placeholder}
      onChange={onInputChange}
      onSelect={()=>{onSelect ,handleOnSelect()}}
      />


      
      { selectedID || inputValue? [
      <div  key="select-div-clear" className='i-select-icon-div'>
        <button key="select-btn-clear" id={id+"_sReset"} onClick={()=>{clearDropdown(), setOpen(false)}} >
          <SVGIcon key="select-btn-clear-icon" className="i-icon" src={x} class="svg-icon-md"/>
        </button>
      </div>]: ""}
    </div>
    {open && id == editref && 
    <div key="select-options" className='i-items'>
      {options.filter((opt)=>{
      const searchValue = inputValue.toLocaleLowerCase();
      const v = opt.name.toLocaleLowerCase();
      if(v.includes(searchValue)){
        return opt
      }

    }).map(opt=>{
        return(
        <div key={opt.ID + "opt"} onClick={()=>onItemSelected(opt)} className='i-option'>
            {opt.name}
        </div>) 
      })
      }

    </div>}


    </div>
  )

}