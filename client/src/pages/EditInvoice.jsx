import React, {useEffect, useMemo, useRef, useState} from 'react'
import Header from '../components/Header'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import pencil_square from '../assets/icons/pencil-square.svg'
import x_circle from '../assets/icons/x-circle.svg'
import check from '../assets/icons/check-all.svg'
import trash from '../assets/icons/trash.svg'
import plus from '../assets/icons/plus.svg'
import SVGIcon from '../components/SVG';
import InvoiceNetto, { InvoiceBrutto } from '../components/Invoice'
import '../styles/EditInvoice.css';
import { DateLine } from '../components/Calendar';
import { SelectComponent } from '../components/Searchbar';
import { AddInvoiceClientPopup, AddInvoiceOrderPopup, AddInvoiceProdPopup, PromptPopup } from '../components/Popup';

import handleInvoiceProdRequest from '../hooks/invoices/handleInvoiceProdRequest'
import handleInvoiceIDRequest from '../hooks/invoices/handleInvoiceIDRequest';
import handleClientSelectRequest from '../hooks/clients/handleClientSelectRequest';
import handleMargesRequest from '../hooks/marges/handleMargesRequest';
import handleInvoiceMargeUpdateRequest from '../hooks/invoices/handleInvoiceMargesUpdateRequest';
import handleInvoiceTaxRequest from '../hooks/invoices/handleInvoiceTaxRequest';
import errorHandling from '../services/errorHandling';
import { LabelTextInput } from '../components/LabelBox';


function EditInvoice  () {

    let invoiceID = window.location.pathname.split("/")[2]
    const [togglePrompt, setTogglePrompt] = useState(false);
    const [toggleBrutto, setToggleBrutto] = useState(true);
    const [addItemPrompt, setAddItemPrompt] = useState(false);
    const [addClientItemPrompt, setAddClientItemPrompt] = useState(false);
    const [addOrderPrompt, setAddOrderPrompt] = useState(false);
    const [toggleDelPrompt, setToggleDelPrompt] = useState(false);
    const [margeSelectOpen, setMargeSelectOpen] = useState(false);
    const [clientSelectOpen, setClientSelectOpen] = useState(false);

    const [updateInvoice, setUpdateInvoice] = useState(0);
    const [edit, setEdit] = useState(false);
    let editRef = useRef();
    let productRef = useRef();
  

    const [products, prodErr, prodLoading, handleProdRequest] = handleInvoiceProdRequest();
    useEffect(()=>{handleProdRequest(invoiceID)},[updateInvoice])
    const [InvoiceRes, invoiceErr, invoiceLoading] = handleInvoiceIDRequest(invoiceID, updateInvoice);
    //console.log(res)
    

  
    const [delRes, setDelRes] = useState([]);
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);
    const [subRes, setSubRes] = useState([]);
    const [subError, setSubError] = useState("");
    const [subLoading, setSubLoading] = useState(false);

    const [margeData, margeError, margeLoading, handleMRequest] = handleMargesRequest();
    const [margeUpdate, margeUError, margeULoading, handleMURequest] = handleInvoiceMargeUpdateRequest();
    const [clientData, clientError,clientLoading, handleCRequest] = handleClientSelectRequest();
    const [taxData, taxError, taxLoading, handleTRequest] = handleInvoiceTaxRequest();
      useEffect(()=>handleTRequest(invoiceID), [edit]);
      
      useEffect(()=>setToggleBrutto(InvoiceRes.tax),[InvoiceRes])
    function handleSelectRequests(){
      
        handleMRequest()
        handleCRequest()
      
    }


    let invoice_dateRef = useRef()
    let invoice_numberRef = useRef()
    let margeIDRef = useRef()
    let clientIDRef = useRef()
    let notesRef = useRef()


    
    
    function handleSubmit(e){
      e.preventDefault()
      const today = new Date().toISOString().split("T",[1])
      if((invoice_dateRef.current == "00.00.00"|| !invoice_dateRef.current)){
        invoice_dateRef.current = today[0]
      }
      if(invoice_dateRef.current.indexOf(".") != -1){
        invoice_dateRef.current = invoice_dateRef.current.replace(/(..).(..).(..)/, "20$3-$2-$1")
      }


      //console.log (order_date, delivery_date)
      setSubLoading(true)
      axios({
          axiosInstance: axios,
          method: "PUT",
          url:"s/invoices/update",
          headers: {
              "authorization": authHeader()
          },
          data : {
        
              "ID": invoiceID,
              "clientID": clientIDRef.current || InvoiceRes.clientID,
              "invoice_date": invoice_dateRef.current || InvoiceRes.invoice_date,
              "invoice_number": invoice_numberRef.current || InvoiceRes.invoice_number,
              "margeID": margeIDRef.current || InvoiceRes.margeID,
              "notes": notesRef.current || InvoiceRes.notes
          }
      }).then((response)=>{         
          if(margeIDRef.current != InvoiceRes.margeID){
            handleMURequest(invoiceID,margeIDRef.current)
          }
          setSubRes(response.data)
          //console.log(response.data);

      }).catch((err) => {
          errorHandling(err)
          setSubError(err)
          //console.log(err);
      }) 
      setSubLoading(false)
      setUpdateInvoice(updateInvoice+1)

    };
    
    function handleInvoiceDelete(){
    
      setDelLoading(true)
      axios({
          axiosInstance: axios,
          method: "DELETE",
          url:"s/invoices/delete",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "invoiceID": invoiceID,
          }
      }).then((response)=>{
          window.location.href = "/invoices";
          setDelRes(response.data)
          
          //console.log(response.data);
      }).catch((err) => {
          errorHandling(err)
          setDelError(err)
          //console.log(err);
      })

      setDelLoading(false)
          
    
    }
    function handleInvoiceItemDel(){
      let product = productRef.current
      setDelLoading(true)
      axios({
          axiosInstance: axios,
          method: "DELETE",
          url:"s/invoices/delete/item",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "invoice_itemID": product.ID,
              "invoiceID": product.invoiceID,
              "productID" : product.productID
          }
      }).then((response)=>{
          setDelRes(response.data)
          //console.log(response.data);

      }).catch((err) => {
          errorHandling(err)
          setDelError(err)
          //console.log(err);
      }) 
      setDelLoading(false)
      setUpdateInvoice(updateInvoice+1)
          
    
    }


    

   

  return (
    <div className='page-content-wide'>
    
      <Header key="header" title={InvoiceRes? "#"+ InvoiceRes.invoice_number +" "+ (InvoiceRes.client? InvoiceRes.client : " ") :"# - "}/>
      {togglePrompt && <PromptPopup 
          title={InvoiceRes.invoice_number? `Bestellung #${InvoiceRes.invoice_number } löschen?` : "Bestellung löschen?"} 
          btnOk="OK" 
          btnAbort="Abbrechen"
          onClickAbort={()=>setTogglePrompt(false)} 
          onClickOK={()=>handleInvoiceDelete()}
          message= {delError? delError.message : " "}
          /> 
      }
      {toggleDelPrompt && <PromptPopup 
          title={productRef? ` ${productRef.current.product_name} aus Rechnung entfernen?` : "Produkt aus Bestellung entfernen?"} 
          btnOk="OK" 
          btnAbort="Abbrechen"
          onClickAbort={()=>setToggleDelPrompt(false)} 
          onClickOK={()=>[handleInvoiceItemDel(), setToggleDelPrompt(false), setUpdateInvoice(updateInvoice+1)]}
          message= {delError? delError.message : " "}
          /> 
      }
      {addOrderPrompt && <AddInvoiceOrderPopup
        forwardEdit={false}
        onClickOK={()=>{setUpdateInvoice(updateInvoice+1),setAddOrderPrompt(false)}}
        onClickAbort={()=>{setAddOrderPrompt(false)}}
        defaultInvoiceID={invoiceID}
        defaultClientID={InvoiceRes.clientID}
        defaultInvoiceName={InvoiceRes.invoice_number}
        defaultClientName={InvoiceRes.client} />}

      {addItemPrompt && <AddInvoiceProdPopup
        forwardEdit={false}
        onClickOK={()=>{setUpdateInvoice(updateInvoice+1),setAddItemPrompt(false)}}
        onClickAbort={()=>{setAddItemPrompt(false)}}
        defaultInvoiceID={invoiceID}
        defaultClientID={InvoiceRes.clientID}
        defaultInvoiceName={InvoiceRes.invoice_number}
        defaultClientName={InvoiceRes.client} />}
      
      {addClientItemPrompt && <AddInvoiceClientPopup
        forwardEdit={false}
        onClickOK={()=>{setUpdateInvoice(updateInvoice+1),setAddClientItemPrompt(false)}}
        onClickAbort={()=>{setAddClientItemPrompt(false)}}
        defaultInvoiceID={invoiceID}
        defaultClientID={InvoiceRes.clientID}
        defaultInvoiceName={InvoiceRes.invoice_number}
        defaultClientName={InvoiceRes.client} />}


      <div className='invoice-wrapper'>
        <div className='invoice-div'>
        {((prodErr || invoiceErr) && <p className='errorMsg'>{prodErr.message || invoiceErr.message}</p>)}
          {!edit ?<p>Kunde: {InvoiceRes? InvoiceRes.client : "-"} </p>:
                    <div className='d-il ai-c'> 
                    <p>Kunde:</p> 
                    {clientData && 
                  <SelectComponent 
                      key={"client_select"}
                      id ="client"
                      editref={editRef.current}
                      options={clientData}
                      onSelect={(val)=>{editRef.current=val}}
                      onChange={(item) =>{clientIDRef.current = item}}
                      selectedID={clientIDRef.current}
                      defaultValue={InvoiceRes? InvoiceRes.client:""}
                      placeholder={"Kunde wählen...."}
                      open={clientSelectOpen}
                      setOpen={(val)=>{setClientSelectOpen(val)}}
                      className='i-select c-list-item' 
                      
                      />}
                  </div>}
          {!edit ?<p>Marge: {InvoiceRes? InvoiceRes.marge_name : "-"} </p>:
                    <div className='d-il ai-c'> 
                    <p>Marge:</p> 
                    {margeData && 
                  <SelectComponent 
                      key={"marge_select"}
                      id ="marge"
                      editref={editRef.current}
                      options={margeData}
                      onSelect={(val)=>{editRef.current=val}}
                      onChange={(item) =>{margeIDRef.current = item}}
                      selectedID={margeIDRef.current}
                      defaultValue={InvoiceRes? InvoiceRes.marge_name: ""}
                      placeholder={"Marge wählen...."}
                      open={margeSelectOpen}
                      setOpen={(val)=>{setMargeSelectOpen(val)}}
                      className='i-select c-list-item' 
                      
                      />}
                  </div>}
          {!edit ?<p>Rechnungs-Nr.: {InvoiceRes? "#" + InvoiceRes.invoice_number : "# -"} </p>:
                    <div className='d-il ai-c'> 
                    <p>Rechnungs-Nr.:</p> 
                    <input type='number' defaultValue={InvoiceRes? InvoiceRes.invoice_number: 0}  onChange={(e)=>{invoice_numberRef.current = e.target.valueAsNumber}}></input>
                  </div>}
          {!edit? <p>Rechnungsdatum: {InvoiceRes? InvoiceRes.invoice_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Rechnungsdatum:</p> 
            <DateLine 
              defaultDay={InvoiceRes? InvoiceRes.invoice_date.replace(/(..).(..).(..)/, "20$3-$2-$1"): ""} 
              onDateChange={(val)=>{invoice_dateRef.current = val}} /> 
          </div>}
          {!edit? <div>
            <p>Notizen: </p><pre className=''>{InvoiceRes? InvoiceRes.notes : "-"}</pre>
            </div>:
          <div className='d-il ai-c'>
            <p>Notizen:</p>
            <LabelTextInput defaultValue={InvoiceRes? InvoiceRes.notes : "-"} onChange={(val)=> notesRef.current = val} />
          </div>}
          
          { !edit? 
          <div key={"header_div"} className='edit-btns'>
            <button key={"edit"} className='edit-btn' onClick={()=>{setEdit(true), handleSelectRequests()}}><SVGIcon src={pencil_square} class="svg-icon-md"/> </button> 
          </div>:
          <div key={"btns"} className='edit-btns'>
            <button key={"check"} className='edit-btn' onClick={(e)=>[setEdit(false), handleSubmit(e)]}><SVGIcon src={check} class="svg-icon-md"/> </button>
            <button key={"del"} className='edit-btn' onClick={()=>[setEdit(false), setTogglePrompt(true)]}><SVGIcon src={trash} class="svg-icon-md"/> </button>
            <button key={"abort"} className='edit-btn' onClick={()=>setEdit(false)}><SVGIcon src={x_circle} class="svg-icon-md"/> </button>
          </div>}
        </div>
        <div className='invoice-div'>
        {toggleBrutto? 
        < InvoiceBrutto data={products} taxData={taxData} invoiceID={invoiceID} edit={edit} productRef={(prod)=>{productRef.current = prod}} toggleDelPrompt={(val)=>setToggleDelPrompt(val)}/>:
        < InvoiceNetto data={products} taxData={taxData} invoiceID={invoiceID} edit={edit} productRef={(prod)=>{productRef.current = prod}} toggleDelPrompt={(val)=>setToggleDelPrompt(val)}/>}
                
        <div className='invoice-btns'>
          <button className='invoice-btn' key={"add-btn_1"} onClick={()=>{setAddOrderPrompt(true)}} ><SVGIcon src={plus} class="svg-icon-md"/>Bestellung</button>
          <button className='invoice-btn' key={"add-btn_2"} onClick={()=>{setAddItemPrompt(true)}} ><SVGIcon src={plus} class="svg-icon-md"/>Produkt</button>
          <button className='invoice-btn' key={"add-btn_3"} onClick={()=>{setAddClientItemPrompt(true)}} ><SVGIcon src={plus} class="svg-icon-md"/>Kunde</button>   

        </div>
        </div>
      </div>
    </div>
  )
}

export default EditInvoice