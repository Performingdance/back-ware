import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import '../styles/Forms.css'
import check from '../assets/icons/check.svg'
import trash from '../assets/icons/trash.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import x_circle from '../assets/icons/x-circle.svg'
import handleFormRequest from '../hooks/handleFormRequest'
import Searchbar_filter from '../components/Searchbar'
import Loading from '../components/Loading'
import SVGIcon from '../components/SVG'
import plus from '../assets/icons/plus.svg'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import { NewFormPopup } from '../components/Popup'
import { LabelInput } from '../components/LabelBox'


function Forms() {
  const [edit, setEdit] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [bruch, setBruch] = useState(false);
  const [editID, setEditID] = useState(0);
  const [res, error, loading] = handleFormRequest();
  const [filteredData,setFilteredData] = useState([]);
  useEffect(()=>setFilteredData(res),[res])

  const [delRes, setDelRes] = useState([])
  const [delError, setDelError] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  let editNameRef = useRef()
  let editIDRef = useRef()
  let editBruchRef = useRef()


  function handleFormDelete(ID){
    setDelLoading(true)
    axios({
        axiosInstance: axios,
        method: "DELETE",
        url:"s/form/delete",
        headers: {
            "authorization": authHeader()
        },
        data : {
            "ID": ID,
        }
    }).then((response)=>{
        setDelRes(response.data)
        console.log(response.data);
        window.location.href = "/forms";
    }).catch((err) => {
        setDelError(err)
        //console.log(err);
    })

    setDelLoading(false)

  }

  function handleSubmit(){
    setDelLoading(true)
    axios({
        axiosInstance: axios,
        method: "UPDATE",
        url:"s/form/update",
        headers: {
            "authorization": authHeader()
        },
        data : {
            "ID": editIDRef.current,
            "name": editNameRef.current,
            "bruch": editBruchRef.current,
        }
    }).then((response)=>{
        setDelRes(response.data)
        console.log(response.data);
        window.location.href = "/forms";
    }).catch((err) => {
        setDelError(err)
        //console.log(err);
    })

    setDelLoading(false)

  }


  const formCards = filteredData.map((form)=>{
    return (
      <div key={form.ID + "card"} className='client-card'>
      <div key={form.ID + "c-card"} className='c-card'>
          <div key={form.ID + "title"} className='c-title' >
            {(edit && editID == form.ID) ? 
            <div key={form.ID + "edit_div"}>
              <input className='form-input' defaultValue={form.name} onChange={(e)=> editNameRef.current=(e.target.value)} /> 
              <LabelInput
              type="checkbox"
              title="Bruch"
              _key ={form.ID} 
              className="ac-c"
              value={editBruchRef.current}
              onChange={(e)=>{editBruchRef.current = e.target.value}} />
            </div>:
            <h2>{form.name}</h2>
            }
          </div>
          <div key={form.ID + "btns"} className='rc-btns' > 
            {(edit && editID == form.ID)?[<button key={form.ID + "del"} className='rc-btn' onClick={()=>handleFormDelete(form.ID)}>
              <SVGIcon class="svg-icon-md" src={trash}/>
            </button>,
            <button key={form.ID + "cancel"} className='rc-btn ' onClick={()=> setEdit(false)}>
              <SVGIcon class="svg-icon-md" src={x_circle}/>
            </button>,
            <button key={form.ID + "check"} className='rc-btn ' onClick={()=> [handleSubmit(),setEdit(false)]}>
              <SVGIcon class="svg-icon-md" src={check}/>
            </button>] :
            <button key={form.ID + "edit"} className='rc-btn' onClick={()=>[setEditID(form.ID), setEdit(true), editNameRef.current= form.name, editIDRef.current = form.ID,editBruchRef.current = form.bruch]}>
              <SVGIcon class="svg-icon-md" src={pencil_square}/>
            </button>}
          </div>
  
      </div> 
      </div>
    )
  })

  return (
    
    <div key={"content"} className='page-content'>
    <Header title="Formen"/>
    <Searchbar_filter data={res} searchkey={"name"} filteredData={(searchData) => {setFilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>
    {filteredData.length && !error && !loading? formCards: 
    <h1 className=''>Keine Formen verfügbar</h1>}
    {error && <h3> {error.message} </h3>}
    {loading && <Loading/>}
    <button className='r-ins-add-btn r-ins-card jc-c' key={"add-btn"} onClick={()=>setAddOpen(!addOpen)} ><SVGIcon src={plus} class="svg-icon-lg"/></button>
    {addOpen && <NewFormPopup key={"popup"} title={"Neue Form"} onClickOK={()=>{setAddOpen(false)}} onClickAbort={()=>setAddOpen(false)}/>}
    
    </div>

  )
}

export default Forms