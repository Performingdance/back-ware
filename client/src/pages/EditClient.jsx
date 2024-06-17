import React, {useEffect, useMemo, useRef, useState} from 'react'
import Header from '../components/Header'
import '../styles/Client.css'
import { Select, SelectComponent } from '../components/Searchbar';
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import { PromptPopup } from '../components/Popup';
import errorHandling from '../services/errorHandling';
import handleMargesRequest from '../hooks/marges/handleMargesRequest';
import handleClientExtRequest from '../hooks/clients/handleClientExtRequest';





function EditClient() {
    const [selectOpen, setSelectOpen] = useState(false)
    const [togglePrompt, setTogglePrompt] = useState(false)
    const clientID = window.location.pathname.split("/")[2]
    
    let selectedMargeRef = useRef();
    let editRef = useRef();
    const [client, clError, clLoading, handleClRequest] = handleClientExtRequest(clientID)
    const [clientExt, setClientExt] = useState(client [0]);
    const [upRes, setUpRes] = useState([]);
    const [upError, setUpError] = useState("");
    const [upLoading, setUpLoading] = useState(false);
    const [margeData, margeError,margeLoading, handleMRequest] = handleMargesRequest();
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);
    useEffect(()=>{ handleClRequest(clientID), handleMRequest()}, [clientID,upRes]) ;
    useEffect(()=>{ setClientExt(client[0])}, [client]) ;

    //


      // console.log(clientExt.first_name)
    const handleValueChange = (obj, val) =>  {
      let data = client;
     
      data = ({...data, [obj] : val});
      
      setClientExt(data);    
      // console.log(data)
      return
    }
    const handleMargeChange = () => {
      let data = client;
      const margeID = selectedMargeRef.current || 0;
 

     
      data = ({...data, "margeID": margeID});
      //console.log(data) 

      setClientExt(data);
      setSelectOpen(false)  

      
    }
    const handleSubmit = () =>{
      // update ing by id API

      setUpLoading(true)
          axios({
              axiosInstance: axios,
              method: "PUT",
              url:"s/clients/update",
              headers: {
                  "authorization": authHeader()
              },
              data: {
                "ID" : clientID,
                "first_name" : clientExt.first_name,
                "last_name" : clientExt.last_name,
                "company" : clientExt.company,
                "street_number" : clientExt.street_number,
                "zip_code" : clientExt.zip_code,
                "city" : clientExt.city,
                "country" : clientExt.country,
                "phone" : clientExt.phone,
                "mobile" : clientExt.mobile,
                "margeID" : clientExt.margeID
              }
          }).then((response)=>{
              setUpRes(response)
              //console.log(res);
          }).catch((err) => {
              errorHandling(err)
              setUpError(err)
              //console.log(err);
          })
  
          setUpLoading(false)
         

       
    };

    function handleDelete(){
    
        setDelLoading(true)
        axios({
            axiosInstance: axios,
            method: "DELETE",
            url:"s/clients/delete",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "ID": clientID,
            }
        }).then((response)=>{
            setDelRes(response.data)
            console.log(response.data);
            window.location.href = "/clients";
            setTogglePrompt(false)
        }).catch((err) => {
            errorHandling(err)
            setDelError(err)
            //console.log(err);
        })
    
        setDelLoading(false)
            
      
      }
    
  return (
    clientExt &&
    <div className='edit-card'>
    <Header title={(clientExt.first_name || clientExt.last_name || clientExt.company)? (clientExt.first_name? clientExt.first_name + " ": " " ) + (clientExt.last_name? clientExt.last_name + " " : " ") + (clientExt.company? clientExt.company : " ") : "Neuer Kunde"} search="false"/>
    {togglePrompt ? <PromptPopup 
        title={(clientExt.first_name || clientExt.last_name || clientExt.company)? (clientExt.first_name? clientExt.first_name + " ": " " ) + (clientExt.last_name? clientExt.last_name + " " : " ") + (clientExt.company? clientExt.company : " ") + " löschen?" : "Kunde löschen?"} 
        btnOk="OK" 
        btnAbort="Abbrechen"
        onClickAbort={()=>setTogglePrompt(false)} 
        onClickOK={()=>handleDelete()}
        message= {delError? delError : " "}
        /> 
    : " "}
    <div className='client-card jc-c'>
        <ul className='c-list'>
            <li className='c-list-item'>Vorname: </li>
            <input className='input c-list-item' type='text' onChange={(e)=> [handleValueChange("first_name", e.target.value)]} defaultValue={clientExt.first_name}></input>
            <li className='c-list-item'>Nachname: </li>
            <input className='input c-list-item' type='text' onChange={(e)=> handleValueChange("last_name", e.target.value)} defaultValue={clientExt.last_name}></input>
            <li className='c-list-item'>Firma: </li>
            <input className='input c-list-item' type='text' onChange={(e)=> handleValueChange("company", e.target.value)} defaultValue={clientExt.company}></input>
            <li className='c-list-item'>Straße, Nr.: </li>
            <input className='input c-list-item' type='text' onChange={(e)=> handleValueChange("street_number", e.target.value)} defaultValue={clientExt.street_number}></input>
            <li className='c-list-item'>PLZ: </li>
            <input className='input c-list-item' type='number' onChange={(e)=> handleValueChange("zip_code", e.target.value)} defaultValue={clientExt.zip_code}></input>
            <li className='c-list-item'>Stadt: </li>
            <input className='input c-list-item' type='text' onChange={(e)=> handleValueChange("city", e.target.value)} defaultValue={clientExt.city}></input>
            <li className='c-list-item'>Land: </li>
            <input className='input c-list-item' type='text' onChange={(e)=> handleValueChange("country", e.target.value)} defaultValue={clientExt.country}></input>
            <li className='c-list-item'>Festnetz: </li>
            <input className='input c-list-item' type='number' onChange={(e)=> handleValueChange("phone", e.target.value)} defaultValue={clientExt.phone}></input>
            <li className='c-list-item'>Handy: </li>
            <input className='input c-list-item' type='number' onChange={(e)=> handleValueChange("mobile", e.target.value)} defaultValue={clientExt.mobile}></input>
            {margeData && [
            <li key={"marge_title"} className='c-list-item'>Preis-Gruppe: </li>,
            <SelectComponent 
                key={"marge_select"}
                id ="marge"
                editref={editRef.current}
                options={margeData}
                onSelect={(val)=>{editRef.current=val}}
                onChange={(item) =>{selectedMargeRef.current = item, handleMargeChange()}}
                selectedID={selectedMargeRef.current}
                defaultValue={clientExt.marge}
                placeholder={"Marge wählen..."}
                open={selectOpen}
                setOpen={(val)=>{setSelectOpen(val)}}
                className='i-select c-list-item' 
                 
                />]}
            <button className='edit-btn button' onClick={handleSubmit} type='button'>Speichern</button>
            <button className='edit-btn button' onClick={()=>setTogglePrompt(true)} type='button'>Löschen</button>
          </ul>
      </div>
    </div>
  )
}

export default EditClient