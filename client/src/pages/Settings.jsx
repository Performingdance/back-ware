import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import handleSettingsRequest from '../hooks/settings/handleSettingsRequest'
import Loading from '../components/Loading'
import LabelBox, { LabelInput } from '../components/LabelBox'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import config from '../config.json'
import '../styles/Settings.css'


function Settings() {
  const [edit,setEdit] = useState(false)
  const [update,setUpdate] = useState(0)
  const [settings, settingsError, settingsLoading] = handleSettingsRequest(update)
  const [subRes, setSubRes] = useState([]);
  const [subError, setSubError] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const settingNames = config.SETTINGS_NAMES_DE;
  let editList = useRef([])


  const handleSubmit = () =>{
    setSubLoading(true)
            axios({
                axiosInstance: axios,
                method: "PUT",
                url:"s/settings/update",
                headers: {
                    "authorization": authHeader()
                }, 
                data:{
                  editList: editList.current
                }
            }).then((response)=>{
              //console.log(response)
              setUpdate(update+1)
              setSubRes(response)

            }).catch((err) => {
                errorHandling(err)
                console.log(err);
                return

            })
            setSubLoading(false)

  };




  const handleValueChange = (ID, val, type) =>  {
    if(type=="number"){
      val = val.toString().replace(",",".")
    }
    editList.current = [...editList.current, {ID:ID, setting:val}]
  }



  const settingsEditList = settings.map((obj, key)=>{
    let tempListItem
    if(key == 1){
      tempListItem = [<h3 key={key+"title"}>Preisrechner</h3>, <LabelInput key={key+"input"} className='c-list-item' title={settingNames[key]+":"} type='text' onChange={(e)=> [handleValueChange(obj.ID, e.target.value, "text")]} placeholder={obj.setting}></LabelInput>]

    }
    if(key == 3){
      tempListItem = [<h3 key={key+"title"}>Kontaktdaten</h3>,<LabelInput key={key+"input"} className='c-list-item' title={settingNames[key]+":"} type='text' onChange={(e)=> [handleValueChange(obj.ID, e.target.value, "text")]} placeholder={obj.setting}></LabelInput>]

    }
    else{
     tempListItem = <LabelInput key={key+"input"} className='c-list-item' title={settingNames[key]+":"} type='text' onChange={(e)=> [handleValueChange(obj.ID, e.target.value, "text")]} placeholder={obj.setting}></LabelInput>

    }
    return(
      
          tempListItem        
    )

  })
  const settingsList = settings.map((obj, key)=>{
    let tempListItem
    if(key == 1){
      tempListItem = [<h3 key={key+"title"}>Preisrechner</h3>, 
      <LabelBox key={key+"input"} className='c-list-item' title={settingNames[key]+":"} type='text' onChange={(e)=> [handleValueChange(obj.ID, e.target.value, "text")]} text={obj.setting}></LabelBox>]

    }
    if(key == 3){
      tempListItem = [<h3 key={key+"title"}>Kontaktdaten</h3>,
      <LabelBox key={key+"input"} className='c-list-item' title={settingNames[key]+":"} type='text' onChange={(e)=> [handleValueChange(obj.ID, e.target.value, "text")]} text={obj.setting}></LabelBox>]

    }
    else{
     tempListItem = <LabelBox key={key+"input"} className='c-list-item' title={settingNames[key]+":"} type='text' onChange={(e)=> [handleValueChange(obj.ID, e.target.value, "text")]} text={obj.setting}></LabelBox>

    }
    return(  
          tempListItem        
    )
  })
  


  return (
    <div className='content'>
    <Header title="Einstellungen"/>
    <div className='content-wrapper'>
      <div className='page-content-wide'>
      {!edit?
      <div className='edit-setting-address'>
        {(settings[0]) && settingsEditList}
      </div>: 
      <div className='setting-address'>
      {(settings[0]) && settingsList}
      </div>}
      {subRes.length ? <h3 className='successMsg'>{"Erfolgreich gespeichert"}</h3>:""}
      {subError.length ? <h3 className='errorMsg'>{subError.message}</h3>:""}
    {<button onClick={(e)=>handleSubmit(e)} className='edit-btn button'  type='button'>Speichern</button>}
    </div>
    </div>
    
    {settingsLoading && <Loading/>}
    </div>
  )
}

export default Settings