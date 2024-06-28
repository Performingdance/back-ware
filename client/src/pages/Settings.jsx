import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import handleSettingsRequest from '../hooks/settings/handleSettingsRequest'
import Loading from '../components/Loading'
import { LabelInput } from '../components/LabelBox'


function Settings() {
  const [edit,setEdit] = useState(false)
  const [update,setUpdate] = useState(0)
  const [settings, settingsError, settingsLoading] = handleSettingsRequest(update)

  let editList = []

  useEffect(() => {
    settings.forEach((obj)=>{
    let temp_obj = {...obj, edit : false}
    editList.current = [...editList.current, temp_obj] 
    
  }) }, [settings, edit])
  const handleValueChange = (ID, val, type) =>  {
    if(type=="number"){
      val = val.toString().replace(",",".")
    }
    editList = [...editList,{ID:ID, setting:val}]
  }
console.log(settings)

 const editSettingsList =
    <ul className='c-list'>
      <div>
      <p>Preisrechner</p>
      <LabelInput className='c-list-item' title="Betriebskosten(€):" type='text' onChange={(e)=> [handleValueChange(1, e.target.value, "number")]} defaultValue={editList.setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="MK Preisniveau(%):" type='text' onChange={(e)=> [handleValueChange(2, e.target.value, "number")]} defaultValue={editList[1].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="RG(%):" type='text' onChange={(e)=> [handleValueChange(3, e.target.value, "number")]} defaultValue={editList[2].setting || "-"}></LabelInput>            
      </div>
      
      <div>
      <p>Firma:</p>
      <LabelInput className='c-list-item' title="Firma:" type='text' onChange={(e)=> [handleValueChange(5, e.target.value)]} defaultValue={editList[3].setting ||"-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Straße:" type='text' onChange={(e)=> [handleValueChange(6, e.target.value)]} defaultValue={editList[4].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Nr.:" type='text' onChange={(e)=> [handleValueChange(7, e.target.value)]} defaultValue={editList[5].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="PLZ:" type='text' onChange={(e)=> [handleValueChange(8, e.target.value)]} defaultValue={editList[6].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Stadt:" type='text' onChange={(e)=> [handleValueChange(9, e.target.value)]} defaultValue={editList[7].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Land:" type='text' onChange={(e)=> [handleValueChange(10, e.target.value)]} defaultValue={editList[8].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Telefon:" type='text' onChange={(e)=> [handleValueChange(11, e.target.value)]} defaultValue={editList[9].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Email:" type='text' onChange={(e)=> [handleValueChange(12, e.target.value)]} defaultValue={editList[10].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Steuernummer:" type='text' onChange={(e)=> [handleValueChange(13, e.target.value)]} defaultValue={editList[11].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Bank:" type='text' onChange={(e)=> [handleValueChange(14, e.target.value)]} defaultValue={editList[12].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="IBAN:" type='text' onChange={(e)=> [handleValueChange(15, e.target.value)]} defaultValue={editList[13].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="BIC:" type='text' onChange={(e)=> [handleValueChange(16, e.target.value)]} defaultValue={editList[14].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Ust-IdNr.:" type='text' onChange={(e)=> [handleValueChange(17, e.target.value)]} defaultValue={editList[15].setting || "-"}></LabelInput>            
      </div>
      </ul>
  


  const settingsList =
    <ul className='c-list'>
      <div>
      <p>Preisrechner</p>
      <LabelInput className='c-list-item' title="Betriebskosten(€):" type='text' onChange={(e)=> [handleValueChange(1, e.target.value, "number")]} defaultValue={editList.setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="MK Preisniveau(%):" type='text' onChange={(e)=> [handleValueChange(2, e.target.value, "number")]} defaultValue={editList[1].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="RG(%):" type='text' onChange={(e)=> [handleValueChange(3, e.target.value, "number")]} defaultValue={editList[2].setting || "-"}></LabelInput>            
      </div>
      
      <div>
      <p>Firma:</p>
      <LabelInput className='c-list-item' title="Firma:" type='text' onChange={(e)=> [handleValueChange(5, e.target.value)]} defaultValue={editList[3].setting ||"-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Straße:" type='text' onChange={(e)=> [handleValueChange(6, e.target.value)]} defaultValue={editList[4].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Nr.:" type='text' onChange={(e)=> [handleValueChange(7, e.target.value)]} defaultValue={editList[5].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="PLZ:" type='text' onChange={(e)=> [handleValueChange(8, e.target.value)]} defaultValue={editList[6].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Stadt:" type='text' onChange={(e)=> [handleValueChange(9, e.target.value)]} defaultValue={editList[7].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Land:" type='text' onChange={(e)=> [handleValueChange(10, e.target.value)]} defaultValue={editList[8].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Telefon:" type='text' onChange={(e)=> [handleValueChange(11, e.target.value)]} defaultValue={editList[9].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Email:" type='text' onChange={(e)=> [handleValueChange(12, e.target.value)]} defaultValue={editList[10].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Steuernummer:" type='text' onChange={(e)=> [handleValueChange(13, e.target.value)]} defaultValue={editList[11].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Bank:" type='text' onChange={(e)=> [handleValueChange(14, e.target.value)]} defaultValue={editList[12].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="IBAN:" type='text' onChange={(e)=> [handleValueChange(15, e.target.value)]} defaultValue={editList[13].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="BIC:" type='text' onChange={(e)=> [handleValueChange(16, e.target.value)]} defaultValue={editList[14].setting || "-"}></LabelInput>            
      <LabelInput className='c-list-item' title="Ust-IdNr.:" type='text' onChange={(e)=> [handleValueChange(17, e.target.value)]} defaultValue={editList[15].setting || "-"}></LabelInput>            
      </div>
      </ul>
  

  return (
    <div className='content'>
    <Header title="Einstellungen"/>
    <div className='content-wrapper'>
    {edit?
    <div className='setting-address'>
      {settings[0] && settingsList}
    </div>:
    <div className='edit-setting-address'>
      {settings[0] && editSettingsList}
    </div>}
    {<button onClick={(e)=>handleSubmit(e)} className='edit-btn button'  type='button'>Speichern</button>}
    
    </div>
    {settingsLoading && <Loading/>}
    </div>
  )
}

export default Settings