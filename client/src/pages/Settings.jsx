import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import handleSettingsRequest from '../hooks/settings/handleSettingsRequest'
import Loading from '../components/Loading'
import { LabelInput } from '../components/LabelBox'
import config from '../config.json'


function Settings() {
  const [edit,setEdit] = useState(false)
  const [update,setUpdate] = useState(0)
  const [settings, settingsError, settingsLoading] = handleSettingsRequest(update)
  const [subRes, setSubRes] = useState([]);
  const [subError, setSubError] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  const settingNames = config.SETTINGS_NAMES_DE;
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
              setSubRes(response)

            }).catch((err) => {
                errorHandling(err)
                console.log(err);
                return

            })
            setSubLoading(false)

  };

  let editList = useRef([])

  useEffect(() => {
    editList.current = []
    settings.forEach((obj)=>{
    let temp_obj = {...obj, edit : false}
    editList.current = [...editList.current, temp_obj] 
    
  }) }, [settings])

  const handleValueChange = (ID, val, type) =>  {
    if(type=="number"){
      val = val.toString().replace(",",".")
    }
    editList.current = [...editList.current, {ID:ID, setting:val}]
  }



  const settingsList = editList.current.map((obj, key)=>{
    
    return(
      <LabelInput key={key+"input"} className='c-list-item' title={settingNames[key]+":"} type='text' onChange={(e)=> [handleValueChange(obj.ID, e.target.value, "text")]} defaultValue={obj.setting || "-"}></LabelInput>            
    )
  })
  


  return (
    <div className='content'>
    <Header title="Einstellungen"/>
    <div className='content-wrapper'>
    {edit?
    <div className='edit-setting-address'>
      {(editList.current.length) &&
          <ul className='c-list'>
          <div>
          <p>Preisrechner</p>
          <LabelInput className='c-list-item' title="Betriebskosten(€):" type='text' onChange={(e)=> [handleValueChange(1, e.target.value, "number")]} defaultValue={editList.current[0].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="MK Preisniveau(%):" type='text' onChange={(e)=> [handleValueChange(2, e.target.value, "number")]} defaultValue={editList.current[1].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="RG(%):" type='text' onChange={(e)=> [handleValueChange(3, e.target.value, "number")]} defaultValue={editList.current[2].setting || "-"}></LabelInput>            
          </div>
          
          <div>
          <p>Firma:</p>
          <LabelInput className='c-list-item' title="Firma:" type='text' onChange={(e)=> [handleValueChange(5, e.target.value)]} defaultValue={editList.current[3].setting ||"-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Straße:" type='text' onChange={(e)=> [handleValueChange(6, e.target.value)]} defaultValue={editList.current[4].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Nr.:" type='text' onChange={(e)=> [handleValueChange(7, e.target.value)]} defaultValue={editList.current[5].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="PLZ:" type='text' onChange={(e)=> [handleValueChange(8, e.target.value)]} defaultValue={editList.current[6].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Stadt:" type='text' onChange={(e)=> [handleValueChange(9, e.target.value)]} defaultValue={editList.current[7].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Land:" type='text' onChange={(e)=> [handleValueChange(10, e.target.value)]} defaultValue={editList.current[8].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Telefon:" type='text' onChange={(e)=> [handleValueChange(11, e.target.value)]} defaultValue={editList.current[9].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Email:" type='text' onChange={(e)=> [handleValueChange(12, e.target.value)]} defaultValue={editList.current[10].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Steuernummer:" type='text' onChange={(e)=> [handleValueChange(13, e.target.value)]} defaultValue={editList.current[11].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Bank:" type='text' onChange={(e)=> [handleValueChange(14, e.target.value)]} defaultValue={editList.current[12].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="IBAN:" type='text' onChange={(e)=> [handleValueChange(15, e.target.value)]} defaultValue={editList.current[13].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="BIC:" type='text' onChange={(e)=> [handleValueChange(16, e.target.value)]} defaultValue={editList.current[14].setting || "-"}></LabelInput>            
          <LabelInput className='c-list-item' title="Ust-IdNr.:" type='text' onChange={(e)=> [handleValueChange(17, e.target.value)]} defaultValue={editList.current[15].setting || "-"}></LabelInput>            
          </div>
          </ul>}
    </div>: 
    settingsList}
    
    {<button onClick={(e)=>handleSubmit(e)} className='edit-btn button'  type='button'>Speichern</button>}
    
    </div>
    {settingsLoading && <Loading/>}
    </div>
  )
}

export default Settings