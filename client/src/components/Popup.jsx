import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/Popup.css';
import Calendar, {CalendarSingle, DateLine } from './Calendar'
import { SelectComponent} from './Searchbar';
import handleRecipesRequest from '../hooks/handleRecipesRequest';
import handleRecipeFormRequest from '../hooks/handleRecipeFormRequest';
import handleClientSelectRequest from '../hooks/handleClientSelectRequest';
import handleInvoicenoRequest from '../hooks/handleInvoicenoRequest';
import { LabelInput, LabelTextInput } from './LabelBox';
import Loading from './Loading';
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import handleOpenOrderRequest from '../hooks/handleOpenOrderRequest';
import handleFormRequest from '../hooks/handleFormRequest';
import handleMargesRequest from '../hooks/handleMargesRequest';


export default function NewRecipePopup({
  title,
  onClickOK,
  onClickAbort
}) {
  const today = new Date().toISOString().split("T",[1])
  const [open,setOpen] = useState(false)
  const [name, setName] = useState(" ")
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  



  const handleOK = (e) => {
    e = e || window.Event;
    e.preventDefault();
      if (name == " "){
        alert("Bezeichnung eingeben");
        return
      }else{
        //API enter new name, recieve entered Id
        setAddLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/recipes/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "name" : name,
            }
        }).then((response)=>{
          if(response.data.insertId >0){
            window.location.pathname = `/recipes/edit:${response.data.insertId}`
          }else(
            setAddError(response.data)
          )
        }).catch((err) => {
            setAddError(err.message)
            console.log(err);
        })

        setAddLoading(false)
        
      }
  }

  return (
  <>
    {      
    <div className='popup-card '>
        <div className='popup-card-content jc-c'>
        <h3 className='popup-title'>{title}</h3>
        <input className='input ta-c' onChange={(e)=>setName(e.target.value)} type='text' placeholder={"Bezeichnung"}></input>
        
        {addError&&<h5 className='errorMsg'>
          [{addError.msg}]
        </h5>}

        <div className='popup-card-btns'>
            <button className='btn popup-card-btn' onClick={(e) => [handleOK(e), onClickOK]} >Weiter</button>
            <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
        </div>
        </div>
    </div>}
    </>
  )
}
export function NewIngPopup({
  title,
  onClickOK,
  onClickAbort
}) {
  const today = new Date().toISOString().split("T",[1])
  const [open,setOpen] = useState(false)
  const [name, setName] = useState(" ")
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  



  const handleOK = (e) => {
    e = e || window.Event;
    e.preventDefault();
      if (name == " "){
        alert("Bezeichnung eingeben");
        return
      }else{
        //API enter new name, recieve entered Id
        setAddLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/ing/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "name" : name,
            }
        }).then((response)=>{
            //setAddRes(response.data.insertId)
            window.location.pathname = `/ingredients/edit:${response.data.insertId}`
            //console.log(response);
        }).catch((err) => {
            setAddError(err.message)
            console.log(err);
        })

        setAddLoading(false)
        
      }
  }

  return (
  <>
    {      
    <div className='popup-card '>
        <div className='popup-card-content jc-c'>
        <h3 className='popup-title'>{title}</h3>
        <input className='input ta-c' onChange={(e)=>setName(e.target.value)} type='text' placeholder={"Bezeichnung"}></input>
        
        {addError&&<h5 className='errorMsg'>
          [{addError.msg}]
        </h5>}

        <div className='popup-card-btns'>
            <button className='btn popup-card-btn' onClick={(e) => [handleOK(e), onClickOK]} >Weiter</button>
            <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
        </div>
        </div>
    </div>}
    </>
  )
}

export function NewClientPopup({
  title,
  onClickOK,
  onClickAbort
}) {
  const today = new Date().toISOString().split("T",[1])
  const [open,setOpen] = useState(false)
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  
  const firstNameInput = useRef(null)
  const lastNameInput = useRef(null)
  const companyInput = useRef(null)



  const handleOK = (e) => {
    e = e || window.Event;
    e.preventDefault();
    let firstName = firstNameInput.current.value
    let lastName = lastNameInput.current.value
    let company = companyInput.current.value
  
      if (firstName == " " ){
        setAddError("Vorname eingeben");
        return
      }if (lastName == " "){
        setAddError("Nachname eingeben");
        return
      }else{
        //API enter new name, recieve entered Id
        setAddLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/clients/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "company" : company,
                "first_name" : firstName,
                "last_name" : lastName,
            }
        }).then((response)=>{
          if(response.data.insertId > 0){
            setOpen(false)
            window.location.pathname = `/clients/edit:${response.data.insertId}`
          }else(
            setAddError(response.data)
          )
        }).catch((err) => {
            setAddError(err.message)
            console.log(err);
        })

        setAddLoading(false)
        
      }
  }

  return (
  <>
    {      
    <div className='popup-card '>
        <div className='popup-card-content jc-c'>
        <h3 className='popup-title'>{title}</h3>
        <input className='input ta-c'ref={firstNameInput} type='text' placeholder={"Vorname"}></input>
        <input className='input ta-c' ref={lastNameInput} type='text' placeholder={"Nachname"}></input>
        <input className='input ta-c' ref={companyInput} type='text' placeholder={"Company"}></input>
        
        {addError&&<h5 className='errorMsg'>
          {addError.msg}
        </h5>}

        <div className='popup-card-btns'>
            <button className='btn popup-card-btn' onClick={(e) => [handleOK(e), onClickOK]} >Weiter</button>
            <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
        </div>
        </div>
    </div>}
    </>
  )
}

export function NewOrderPopup({
  title,
  onClickOK,
  onClickAbort,
  defaultClientID,
  defaultClientName
}) {

  const [open,setOpen] = useState(false)
  const [name, setName] = useState(defaultClientName || " ")
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false); 

  const [selectedOption, setSelectedOption] = useState(defaultClientID || -1)
  const [clients, error, loading] = handleClientSelectRequest();

  let editRef = useRef("")
  //console.log(clients)




  const handleOK = (e) => {
    e = e || window.Event;
    e.preventDefault();
    const clientID = selectedOption
  
      if (selectedOption == -1 ){
        setAddError("Kunde auswählen");
        return
      }else{
        //API enter new name, recieve entered Id
        setAddLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/orders/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "clientID" : clientID
            }
        }).then((response)=>{
          if(response.data.insertId > 0){
            setOpen(false)
            window.location.pathname = `/orders/edit:${response.data.insertId}`
          }else(
            setAddError(response.data)
          )
        }).catch((err) => {
            setAddError(err.message)
            console.log(err);
        })

        setAddLoading(false)
        
      }
  }

  return (
  <>
    {      
    <div className='popup-card '>
        <div className='popup-card-content jc-c'>
        <h3 className='popup-title'>{title}</h3>
        <div className="popup-title jc-c">
            <SelectComponent 
                id ="new"
                onSelect={(val)=>[editRef.current=val, setName(val)]}
                editref={editRef.current}
                options={clients}
                onChange={(item) =>{setSelectedOption(item)}}
                selectedID={selectedOption}
                placeholder='Kunde wählen'
                open={open}
                setOpen={(bol)=>setOpen(bol)}
                className='i-select' 
                type='text' 
                defaultValue={defaultClientName} />
          </div>
        {addError&&<h5 className='errorMsg'>
          {addError.msg}
        </h5>}

        <div className='popup-card-btns'>
            <button className='btn popup-card-btn' onClick={(e) => [handleOK(e), onClickOK]} >Weiter</button>
            <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
        </div>
        </div>
    </div>}
    </>
  )
}

export function NewFormPopup({
  title,
  onClickOK,
  onClickAbort
}) {
   const [open,setOpen] = useState(false)
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  
  const nameInput = useRef(null)
  const bruchRef = useRef(null)




  const handleOK = (e) => {
    console.log(bruchRef)
    e = e || window.Event;
    e.preventDefault();
    const name = nameInput.current.value
    let bruch 
    if(bruchRef.current.value == "on"){
      bruch = 1;
    }else{
      bruch = 0;
    }
    
      if (name == "" ){
        setAddError({message:"Bezeichnung eingeben"});
        return
      }else{
        //API enter new name, recieve entered Id
        setAddLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/form/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "name" : name,
                "bruch" : bruch
            }
        }).then((response)=>{
          if(response.data.insertId > 0){
            setOpen(false)
            //window.location.pathname = `/forms`
          }
          if(response.data != "success"){
            setAddError({message:response.data})
            setAddRes({})

          }else(
            setAddRes({message:response.data}),
            setAddError({})
          )
        }).catch((err) => {
            setAddError(err)
            console.log(err);
        })

        setAddLoading(false)
        
      }
  }

  return (
  <>
    {      
    <div className='popup-card '>
        <div className='popup-card-content jc-c'>
        <h3 className='popup-title'>{title}</h3>
        <input className='input ta-c'ref={nameInput} type='text' placeholder={"Bezeichnung"}></input>
        {addRes.message != "success" && <div key={"div 1"} className='ta-c' >
        <h4>Bruch</h4>
        <input className='input ta-c' ref={bruchRef} type='checkbox' label={"Bruch"}></input>
        
        </div>}
        {addError.message && !addRes.message && <h5 className='errorMsg'>
          {addError.message}
        
        </h5>}
        {addRes.message && !addError.message && <h5 className='successMsg'>
        {addRes.message}
          </h5>}

        <div key={"div 2"} className='popup-card-btns'>
            {addRes.message == "success" ?
            <button className='btn popup-card-btn 'onClick={onClickAbort} >OK</button> :
            [<button className='btn popup-card-btn' onClick={(e) => [handleOK(e), onClickOK]} >Weiter</button>,
            <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>]}
        </div>
        </div>
    </div>}
    </>
  )
}

export function NewInvoicePopup({
  title,
  forwardEdit,
  defaultClientID,
  defaultClientName,
  invoiceID,
  onClickOK,
  onClickAbort
}) {
  const today = new Date().toISOString().split("T",[1])
  const [open,setOpen] = useState(false)
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false); 
  const [date,setDate] = useState(today); 
  const [selectedClientID, setSelectedClientID] = useState(defaultClientID || -1)
  const [clients, error, loading] = handleClientSelectRequest();
  let editRef = useRef("")
  //console.log(clients)




  const handleOK = (e) => {
    e = e || window.Event;
    e.preventDefault();
  
      if (selectedClientID == -1 ){
        setAddError("Kunde auswählen");
        return
      }else{
        //API enter new name, recieve entered Id
        setAddLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/invoices/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "clientID" : selectedClientID,
                "invoice_date": date,
            }
        }).then((response)=>{
          
            setOpen(false)
            if(forwardEdit == false){
              invoiceID(response.data.insertId)
              return
            }else{
              window.location.pathname = `/invoices/edit:${response.data.insertId}`
            }
            
         
        }).catch((err) => {
            setAddError(err.message)
            console.log(err);
        })

        setAddLoading(false)
        
      }
  }

  return (
  <>
    {      
    <div className='popup-card '>
        <div className='popup-card-content jc-c'>
        <h3 className='popup-title'>{title}</h3>
        <div className="popup-title jc-c">
            <h5 >Kunde:</h5>
            <SelectComponent 
                id ="new"
                onSelect={(val)=>{editRef.current=val}}
                editref={editRef.current}
                options={clients}
                onChange={(item) =>{setSelectedClientID(item)}}
                selectedID={selectedClientID}
                placeholder='Kunde wählen'
                defaultValue={defaultClientName}
                open={open}
                setOpen={(bol)=>setOpen(bol)}
                className='i-select' 
                type='text'  />
            <h5 >Rechnungsdatum:</h5>
            <DateLine onDateChange={(val)=> setDate(val)} />
          </div>
        {addError&&<h5 className='errorMsg'>
          {addError.msg}
        </h5>}

        <div className='popup-card-btns'>
            <button className='btn popup-card-btn' onClick={(e) => [handleOK(e), onClickOK]} >Weiter</button>
            <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
        </div>
        </div>
    </div>}
    </>
  )
}

export function AddInvoicePopup({
  forwardEdit,
  onClickOK,
  onClickAbort,
  defaultOrderID,
  defaultClientID,
  defaultOrderName,
  defaultClientName

}){


  const [selectedInvoiceID, setSelectedInvoiceID] = useState(-1)

  // Add hook  (/unpaid)
  const [invoices, errInvoices, loadingInvoices, handleRequest] = handleInvoicenoRequest();
  useEffect(()=>{handleRequest()},[])

  const [invoiceOpen,setInvoiceOpen] = useState(false)
  const [newInvoicePrompt,setNewInvoicePrompt] = useState(false)
  
  
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  

  const [dates, setDates] = useState([]);
 
  let editRef = useRef(0)


  const handleDateChange = (newDates) => {
    setDates(newDates);
  }
  




  function handleSubmit (e) {

    if(selectedInvoiceID < 0){
      setAddError({message: "Bitte Rechnungsnummer wählen"})
      return
    }
    if(defaultOrderID<0){
      setAddError({message: " Bestellung nicht erkannt"})
      return}
    if(defaultClientID<0){return}
    else{
      
        e = e || window.Event;
        e.preventDefault();
            setAddLoading(true)
            axios({
                axiosInstance: axios,
                method: "POST",
                url:"s/invoices/new/items/order",
                headers: {
                    "authorization": authHeader()
                },
                data : {
                  "clientID" : defaultClientID,
                  "orderID" : defaultOrderID,
                  "invoiceID" : selectedInvoiceID
                }
            }).then((response)=>{
              
                onClickOK(false)
                if(forwardEdit == false){
                  return
                }else{
                  window.location.pathname = `/invoices/edit:${selectedInvoiceID}`
                }
            }).catch((err) => {
                setAddError(err)
                console.log(err);
            })
    
            setAddLoading(false)
            
          }
    
    
    }
   
  
  return (
            
      <div className='popup-card  '>
        <div className='popup-card-content jc-c '>
        <h3 className='ta-c'>Rechnung erstellen</h3>
          {addError ? <h5 className='errorMsg' >{addError.message }</h5>: " "}
          {errInvoices ? <h5 className='errorMsg' >{errInvoices.message}</h5>: " "}
          <div className="popup-title jc-c">

            <p className='lb-title '>Kunde</p>
            <h5>{defaultClientName}</h5>
            
            <p className='lb-title ' key={"order_title"}>Bestellungsnummer</p>
            <h5>{defaultOrderName}</h5>
                  
                  <p className='lb-title '>Rechnungsnummer</p>
                  <SelectComponent 
                  id ="invoices"
                  editref={editRef.current}
                  options={invoices}
                  onSelect={(val)=>{[editRef.current=val, setSelectedInvoiceID(-1)]}}
                  onChange={(val) =>{setSelectedInvoiceID(val)}}
                  selectedID={selectedInvoiceID}
                  placeholder='Rechungsnummer wählen...'
                  open={invoiceOpen}
                  setOpen={(val)=>{setInvoiceOpen(val)}}
                  className='i-select popup-input' 
                  defaultValue={""}
                  />
                  {(selectedInvoiceID == 0) &&
                  <NewInvoicePopup
                  title={"neue Rechung"}
                  forwardEdit={false}
                  defaultClientID={defaultClientID}
                  defaultClientName={defaultClientName}
                  invoiceID={(val)=>{setSelectedInvoiceID(val)}}
                  onClickOK={()=>setNewInvoicePrompt(false)}
                  onClickAbort={()=>setNewInvoicePrompt(false)} />}
            <div className='popup-card-btns'>
                <button className='btn popup-card-btn' onClick={(e)=> handleSubmit(e)} >Weiter</button>
                <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
            </div>
          </div>
        </div>
        </div>
      
    
    )

}

export function RecipePopup({
  onClickOK,
  onClickAbort,
  date
}){
  const [selectedRecipeId, setSelectedRecipeId] = useState(-1)
  const [selectedFormId, setSelectedFormId] = useState(-1)
  const [selectedClientId, setSelectedClientId] = useState(-1)
  const [recipeForm, errForm, loadingForm] = handleRecipeFormRequest(selectedRecipeId);
  const [clients, errClient, loadingClient, handleRequest] = handleClientSelectRequest();  
  useEffect(()=>handleRequest(),[])
  const [orders, errOrders, loadingOrders] = handleOpenOrderRequest(selectedClientId);

  const [open,setOpen] = useState(false)
  const [recipeOpen, setRecipeOpen] = useState(false);
  const [formOpen,setFormOpen] = useState(false)
  const [clientOpen,setClientOpen] = useState(false)
  const [orderOpen,setOrderOpen] = useState(false)
  const [recipes, errRecipe, loadingRecipe] = handleRecipesRequest();
   console.log(selectedClientId)
  
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  

 
  let selectedOrderRef = useRef(-1)
  let amountInputRef = useRef(0)
  let noteInputRef = useRef("")
  let editRef = useRef(0)




  


function handleSubmit (e) {
    e = e || window.Event;
    e.preventDefault();
        setAddLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/daylist/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
              "recipeID" : selectedRecipeId,
              "formID" : selectedFormId,
              "clientID" : selectedClientId,
              "amount" : amountInputRef.current,
              "date" : date,
              "orderID" : selectedOrderRef.current,
              "note" : noteInputRef.current
            }
        }).then((response)=>{
          
            setOpen(false)
            onClickOK(false)
        }).catch((err) => {
            setAddError(err.message)
            console.log(err);
        })

        setAddLoading(false)
        
      }
  


  return (
    <>
      {      
      <div className='popup-card  '>
        <div className='popup-card-content jc-c '>
          <div className="popup-title jc-c">
            {errForm ? <h5 className='errorMsg' >{errForm.message }</h5>: " "}
            {errClient ? <h5 className='errorMsg' >{errClient.message }</h5>: " "}
            {errOrders ? <h5 className='errorMsg' >{errOrders.message}</h5>: " "}
            {errRecipe ? <h5 className='errorMsg' >{errRecipe.message}</h5>: " "}
            <p className='lb-title'>Rezept</p>
            <SelectComponent
              id ="recipe"
              onSelect={(val)=>{[editRef.current=val, setSelectedFormId(-1), setSelectedRecipeId(-1)]}}
              editref={editRef.current}
              options={recipes}
              onChange={(item) =>{setSelectedRecipeId(item)}}
              selectedID={selectedRecipeId}
              placeholder='Rezept wählen'
              open={recipeOpen}
              setOpen={(bol)=>setRecipeOpen(bol)}
              className='i-select' 
              type='text' 
              />

            {(selectedRecipeId != -1) && (selectedRecipeId != "") &&
            [<p className='lb-title ' key={"form_title"}>Form</p>,
            <SelectComponent
            key={"form_select"}
            id ="forms"
            onSelect={(val)=>{editRef.current=val}}
            editref={editRef.current}
            options={recipeForm}
            onChange={(item) =>{setSelectedFormId(item)}}
            selectedID={selectedFormId}
            placeholder='Form wählen'
            open={formOpen}
            setOpen={(bol)=>setFormOpen(bol)}
            className='i-select' 
            type='text' 
            />] }
            <p></p>
            <LabelInput className='popup-input' type='number' title="Menge" defaultvalue={0} onChange={(e)=>{amountInputRef.current = e.target.value}}/>
            <LabelTextInput className='popup-input' title="Notiz" placeholder={"..." } onChange={(val)=>{noteInputRef.current = val}}/>
            <p className='lb-title '>Kunde</p>
            <SelectComponent 
                  id ="clients"
                  editref={editRef.current}
                  options={clients}
                  onSelect={(val)=>{[editRef.current=val, setSelectedClientId(-1), selectedOrderRef.current =-1]}}
                  onChange={(item) =>{setSelectedClientId(item)}}
                  selectedID={selectedClientId}
                  placeholder=' Kunde wählen...'
                  open={clientOpen}
                  setOpen={(val)=>{setClientOpen(val)}}
                  className='i-select popup-input' 
                  
                  />
            {(selectedClientId != -1) && (selectedClientId != "") &&
            [<p className='lb-title ' key={"order_title"}>Bestellung</p>,

            <SelectComponent 
                  key={"order_select"}
                  id ="order"
                  editref={editRef.current}
                  options={orders}
                  onSelect={(val)=>{[editRef.current=val]}}
                  onChange={(item) =>{selectedOrderRef.current = item}}
                  selectedID={selectedOrderRef.current}
                  placeholder=' Bestellung wählen...'
                  open={orderOpen}
                  setOpen={(val)=>{setOrderOpen(val)}}
                  className='i-select popup-input' 
                  
                  />]}
            <div className='popup-card-btns'>
                <button className='btn popup-card-btn' onClick={(e)=>[ handleSubmit(e)]} >Weiter</button>
                <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
            </div>
          </div>
        </div>
      </div>}
      </>
    )

}
export function RecipeOrderPopup({
  onClickOK,
  onClickAbort,
  defaultRecipeID,
  defaultFormID,
  defaultOrderID,
  defaultClientID,
  defaultRecipeName,
  defaultFormName,
  defaultOrderName,
  defaultClientName

}){

  const [clients, errClient, loadingClient, handleRequest] = handleClientSelectRequest();  
  useEffect(()=>handleRequest(),[])
  const [recipes, errRecipe, loadingRecipe] = handleRecipesRequest();
  const [selectedRecipeId, setSelectedRecipeId] = useState(defaultRecipeID || -1)
  const [selectedFormId, setSelectedFormId] = useState(defaultFormID || -1)
  const [selectedClientId, setSelectedClientId] = useState(defaultClientID || -1)
  const [selectedOrderId, setSelectedOrderId] = useState(defaultOrderID || -1)
  const [recipeForm, errForm, loadingForm] = handleRecipeFormRequest(selectedRecipeId);
  const [orders, errOrders, loadingOrders] = handleOpenOrderRequest(selectedClientId);

  const [recipeOpen, setRecipeOpen] = useState(false);
  const [formOpen,setFormOpen] = useState(false)
  const [clientOpen,setClientOpen] = useState(true)
  const [orderOpen,setOrderOpen] = useState(false)

  
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  

  const [dates, setDates] = useState([]);
 

  let amountInputRef = useRef(0)
  let noteInputRef = useRef("")
  let editRef = useRef(0)


  const handleDateChange = (newDates) => {
    setDates(newDates);
  }
  




  function handleSubmit (e) {
    if(selectedFormId <= 0){
      setAddError({message: "Bitte Form wählen"})
      return
    }
    if(selectedClientId <= 0){
      setAddError({message: "Bitte Kunde wählen"})
      return
    }
    if(dates.length <= 0){
      setAddError({message:"Bitte mind. 1 Tag wählen"})
      return
    }else{
      dates.forEach(handleData)
      function handleData(day, i){
        const isoDay = day.replace(/(..).(..).(....)/, "$3-$2-$1");
        e = e || window.Event;
        e.preventDefault();
            setAddLoading(true)
            axios({
                axiosInstance: axios,
                method: "PUT",
                url:"s/daylist/new",
                headers: {
                    "authorization": authHeader()
                },
                data : {
                  "productID" : recipeForm[selectedFormId].productID || "NULL",
                  "recipeID" : selectedRecipeId,
                  "formID" : selectedFormId,
                  "clientID" : selectedClientId,
                  "amount" : amountInputRef.current,
                  "date" : isoDay,
                  "orderID" : selectedOrderId,
                  "note" : noteInputRef.current
                }
            }).then((response)=>{
              
                onClickOK(false)
            }).catch((err) => {
                setAddError(err)
                console.log(err);
            })
    
            setAddLoading(false)
            
          }
    }
    
    }
   
  
  return (
            
      <div className='popup-card  '>
        <div className='popup-card-content jc-c '>
        <h3 className='ta-c'>Rezept hinzufügen</h3>
          {errForm ? <h5 className='errorMsg' >{errForm.message }</h5>: " "}
          {addError ? <h5 className='errorMsg' >{addError.message }</h5>: " "}
          {errClient ? <h5 className='errorMsg' >{errClient.message }</h5>: " "}
          {errOrders ? <h5 className='errorMsg' >{errOrders.message}</h5>: " "}
          {errRecipe ? <h5 className='errorMsg' >{errRecipe.message}</h5>: " "}
          {clients.length ?
          <div className="popup-title jc-c">


            <p className='lb-title'>Rezept</p>
            <SelectComponent
              id ="recipe"
              onSelect={(val)=>{[editRef.current=val, setSelectedFormId(-1), setSelectedRecipeId(-1)]}}
              editref={editRef.current}
              options={recipes}
              onChange={(item) =>{setSelectedRecipeId(item)}}
              selectedID={selectedRecipeId}
              placeholder={"Rezept wählen..."}
              open={recipeOpen}
              setOpen={(bol)=>setRecipeOpen(bol)}
              className='i-select' 
              type='text' 
              defaultValue={defaultRecipeName}
              />

            {(selectedRecipeId != -1) && (selectedRecipeId != "") && 
            [<p className='lb-title ' key={"form_title"}>Form</p>,
            <SelectComponent
            key={"form_select"}
            id ="forms"
            onSelect={(val)=>{editRef.current=val}}
            editref={editRef.current}
            options={recipeForm}
            onChange={(val) =>{setSelectedFormId(val)}}
            selectedID={selectedFormId}
            placeholder='Form wählen...'
            open={formOpen}
            setOpen={(bol)=>setFormOpen(bol)}
            className='i-select' 
            type='text' 
            defaultValue={defaultFormName}
            />] }
            <p></p>
            <LabelInput className='popup-input' type='number' title="Menge" defaultvalue={0} onChange={(e)=>{amountInputRef.current = e.target.value}}/>
            <LabelTextInput className='popup-input' title="Notiz" defaultValue={"..." } onChange={(val)=>{noteInputRef.current = val}}/>
            <p className='lb-title '>Kunde</p>
            <SelectComponent 
                  id ="clients"
                  editref={editRef.current}
                  options={clients}
                  onSelect={(val)=>{[editRef.current=val, setSelectedOrderId(-1),setSelectedClientId(-1)]}}
                  onChange={(val) =>{setSelectedClientId(val)}}
                  selectedID={selectedClientId}
                  placeholder=' Kunde wählen...'
                  open={clientOpen}
                  setOpen={(val)=>{setClientOpen(val)}}
                  className='i-select popup-input' 
                  defaultValue={defaultClientName}
                  />
            {((selectedClientId != -1) && (selectedClientId != "")) && 
            [<p className='lb-title ' key={"order_title"}>Bestellung</p>,

            <SelectComponent 
                  key={"order_select"}
                  id ="order"
                  editref={editRef.current}
                  options={orders}
                  onSelect={(val)=>{[editRef.current=val]}}
                  onChange={(val) =>{setSelectedOrderId(val)}}
                  selectedID={selectedOrderId}
                  placeholder=' Bestellung wählen...'
                  open={orderOpen}
                  setOpen={(val)=>{setOrderOpen(val)}}
                  className='i-select popup-input' 
                  defaultValue={defaultOrderName}
                  />]}
                  <div className='rc-calendar'>
                    < Calendar onDateChange={handleDateChange}/>
                  </div>
            <div className='popup-card-btns'>
                <button className='btn popup-card-btn' onClick={(e)=>[ handleSubmit(e)]} >Weiter</button>
                <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
            </div>
          </div>:""}
        </div>
        </div>
      
    
    )

}
export function RecipeFormPopup({
  onClickOK,
  onClickAbort,
  defaultRecipeID,
  defaultRecipeName
}){
  const [selectedFormID, setSelectedFormID] = useState(-1)
  const [all_forms, errForms, loadForms] = handleFormRequest() ;
  const [marges, errMarges, loadMarges, handleRequest] = handleMargesRequest();
  useEffect(()=>handleRequest(),[])

  const [open,setOpen] = useState(false)
  const [formOpen,setFormOpen] = useState(false)
  const [newFormOpen,setNewFormOpen] = useState(false)
  
  const [addRes, setAddRes] = useState([])
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);  

  let editRef = useRef();
  let product_nameRef = useRef();
  let formweightRef = useRef();
  let worktimeRef = useRef();
  let workamountRef = useRef();
  let vkp_nettoRef = useRef();
  let editPrice_listRef = useRef();

  useEffect(()=>{editPrice_listRef.current = marges.map(v => ({...v, price: "0,00"}))},[marges])



function handlePriceListValueChange(margeID, value){
  for(let i = 0; i < editPrice_listRef.current.length; i++){
    if(editPrice_listRef.current[i].ID == margeID){
      editPrice_listRef.current[i].price = value
    }
  }
  //console.log(editPrice_listRef.current)

}
  


function handleSubmit (e) {
    e = e || window.Event;
    e.preventDefault();
    const price_list = editPrice_listRef.current.map(obj => (
      {margeID : obj.ID, price : obj.price.replace(",", ".")
      }
      )) 
    if(formweightRef.current >0){
      formweightRef.current = formweightRef.current.replace(",", ".")
    }
    if(worktimeRef.current >0){
      worktimeRef.current = worktimeRef.current.replace(",", ".")
    }
    if(workamountRef.current >0){
      workamountRef.current = workamountRef.current.replace(",", ".")
    }
    if(vkp_nettoRef.current >0){
      vkp_nettoRef.current = vkp_nettoRef.current.replace(",", ".")
    }

    //console.log(price_list, editPrice_listRef.current)
    if(selectedFormID != -1){
      function handleRequest () {
          setAddLoading(true)
          axios({
              axiosInstance: axios,
              method: "PUT",
              url:"s/recipes/form/new",
              headers: {
                  "authorization": authHeader()
              },
              data : {
                  "recipeID": defaultRecipeID,
                  "formID" : selectedFormID,
                  "product_name" : product_nameRef.current,
                  "formweight": formweightRef.current,
                  "img": "default_recipe_img.jpg",
                  "worktime": worktimeRef.current,
                  "workamount": workamountRef.current,
                  "vkp_netto": vkp_nettoRef.current,
                  "price_list": price_list
              }
          }).then((response)=>{
              setAddRes(response.data)
              //console.log(res);
              onClickOK(false)
          }).catch((err) => {
              setAddError(err)
              //console.log(err);
          })
          setAddLoading(false)
          
      }
         handleRequest();
  

      return
  }else{
    setAddError({message: "Bitte Form wählen"})
      return
  }
  
}
  const priceListInput = marges.map((marge, key)=>{
    return(
      <LabelInput key={key} className='popup-input' type='number' title={"Preis - " +marge.name} defaultvalue={0} onChange={(e)=>{handlePriceListValueChange(marge.ID, e.target.value)}}/>
    )
  })


  return (
    <>
            
      <div className='popup-card  '>
        <div className='popup-card-content jc-c '>
          <div className="popup-title jc-c">
          {errForms ? <h5 className='errorMsg' >{errForms.message }</h5>: " "}
          {addError ? <h5 className='errorMsg' >{addError.message }</h5>: " "}
            <p className='lb-title'>Rezept</p>
            <h5 className='ta-c'>{defaultRecipeName}</h5>
            <p className='lb-title ' key={"form_title"}>Form</p>
            <SelectComponent
            key={"form_select"}
            id ="forms"
            onSelect={(val)=>{editRef.current=val}}
            editref={editRef.current}
            options={all_forms}
            onChange={(item) =>{setSelectedFormID(item)}}
            selectedID={selectedFormID}
            placeholder='Form wählen'
            open={formOpen}
            setOpen={(bol)=>setFormOpen(bol)}
            className='i-select' 
            type='text' 
            />
            <LabelInput className='popup-input' type='text' title="Produktbezeichnung" defaultvalue={""} onChange={(e)=>{product_nameRef.current = e.target.value}}/>
            <LabelInput className='popup-input' type='number' title="Form-Gewicht (kg)" defaultvalue={0} onChange={(e)=>{formweightRef.current = e.target.value}}/>
            <LabelInput className='popup-input' type='number' title="Arbeitszeit(h)" defaultvalue={0} onChange={(e)=>{worktimeRef.current = e.target.value}}/>
            <LabelInput className='popup-input' type='number' title="Stück/Arbeitszeit" defaultvalue={0} onChange={(e)=>{workamountRef.current = e.target.value}}/>
            <LabelInput className='popup-input' type='number' title="VKP-Netto" defaultvalue={0} onChange={(e)=>{vkp_nettoRef.current = e.target.value}}/>
            {priceListInput}
            <div className='popup-card-btns'>
                <button className='btn popup-card-btn' onClick={(e)=>[ handleSubmit(e)]} >Weiter</button>
                <button className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
            </div>
          </div>
        </div>
      </div>
      </>
    )

}

export function LoginPopup({
  onClickOK,
  onClickAbort
}){
  const userRef = useRef("");
  const pwdRef = useRef("");
  const errRef = useRef("");
  const [loading, setLoading] = useState(false);

  const [loginStatus, setLoginStatus] = useState("");
  const [errMsg, setErrMsg] = useState("");


function handleLogin(){
//console.log(userRef.current, pwdRef.current)
  setLoading(true);
  axios({
    axiosInstance: axios,
    method: "post",
    url:"auth/login",
    data:{
        "username": userRef.current,
        "password": pwdRef.current
    },
  }).then(function (response){
    //console.log(response.data);
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("isLoggedIn", true);
    localStorage.setItem("role", response.data.user.role);
    localStorage.setItem("username", response.data.user.username);
    localStorage.setItem("userID", response.data.user.id);

    setLoginStatus(true)
    setLoading(false);


  }).catch(function (error) {
    console.log(error.message);
    setErrMsg(error.message)
    setLoading(false);
  })
}

  return (
    <>
      {        
      <div key="pc" className='popup-card  '>
        <div key="pc-content" className='popup-card-content jc-c '>
          {loginStatus ?
            <div key={"loggedIn_div"} className="popup-title jc-c"> 
              <h2 key="h2">Erfolgreich angemeldet</h2>
              <p key="btn_p">
                <button key="btn_ok" className='btn popup-card-btn' onClick={onClickOK}>Ok</button>
              </p>
            </div> :
            <div key="login_div" className="popup-title jc-c">
            <p ref={errRef} className={errMsg ? "errmsg" : "d-none"} aria-live='assertive'>{errMsg}</p>
            <h3 key="title" >Anmelden</h3>

            {(!loading) ? 
            <div>
            <LabelInput _key="userInput" _ref={userRef} className='popup-input' type='text' title="Benutzer" onChange={(e)=>{userRef.current = e.target.value}}/>
            <LabelInput _key="pwInput" className='popup-input' required={true} type='password' title="Passwort"  onChange={(e)=>{pwdRef.current = e.target.value}}/>
            </div> :
            <Loading  _key="loading"/>}

          <div key={"pc_btn"} className='popup-card-btns'>
              <button key="pc_btn_ok" className='btn popup-card-btn' onClick={()=> handleLogin()} >Anmelden</button>
              <button key="pc_btn_abort" className='btn popup-card-btn 'onClick={onClickAbort} >Abbrechen</button>
          </div>
          </div>}
        </div>
      </div>}
      </>
    )

}

export function PromptPopup({
  onClickOK,
  btnOk,
  onClickAbort,
  btnAbort,
  title,
  message
}){



  return (
    <>
      {        
      <div key="pc" className='popup-card  '>
        <div key="pc-content" className='popup-card-content jc-c '>

            <div key="login_div" className="popup-title jc-c">
            <h3 key="title" >{title? title : ""}</h3>
            <p>{message? message : ""}</p>

            <div key={"pc_btn"} className='popup-card-btns'>
                <button key="btn pc_btn_ok" className='popup-card-btn' onClick={onClickOK} >{btnOk}</button>
                <button key="btn pc_btn_abort" className='popup-card-btn 'onClick={onClickAbort} >{btnAbort}</button>
            </div>
          </div>
        </div>
      </div>}
      </>
    )

}
export function AlertPopup({
  onClickOK,
  btnOk,
  title,
  message
}){



  return (
    <>
      {        
      <div key="pc" className='popup-card  '>
        <div key="pc-content" className='popup-card-content jc-c '>

            <div key="login_div" className="popup-title jc-c">
            <h3 key="title" >{title? title : ""}</h3>
            <p>{message? message : ""}</p>

            <div key={"pc_btn"} className='popup-card-btns'>
                <button key="pc_btn_ok" className='btn popup-card-btn' onClick={onClickOK} >{btnOk || "OK"}</button>
            </div>
          </div>
        </div>
      </div>}
      </>
    )

}