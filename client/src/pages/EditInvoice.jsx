import React, {useEffect, useMemo, useRef, useState} from 'react'
import Header from '../components/Header'
import '../styles/IngredientCard.css'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import pencil_square from '../assets/icons/pencil-square.svg'
import x_circle from '../assets/icons/x-circle.svg'
import check from '../assets/icons/check-all.svg'
import trash from '../assets/icons/trash.svg'
import plus from '../assets/icons/plus.svg'
import SVGIcon from '../components/SVG';

import handleInvoiceProdRequest from '../hooks/handleInvoiceProdRequest'
import NewRecipePopup, { PromptPopup, RecipeOrderPopup } from '../components/Popup';
import handleInvoiceIDRequest from '../hooks/handleInvoiceIDRequest';
import { DateLine } from '../components/Calendar';
import { LabelTextInput } from '../components/LabelBox';


function EditInvoice  () {

    let invoiceID = window.location.pathname.split(":")[1]
    const [togglePrompt, setTogglePrompt] = useState(false)
    const [toggleDelPrompt, setToggleDelPrompt] = useState(false)
    const [toggleOrderPrompt, setToggleOrderPrompt] = useState(false)
    const [updateInvoice, setUpdateInvoice] = useState(false)
    const [edit, setEdit] = useState(false);
    let productRef = useRef()
  

    const [res, err, loading] = handleInvoiceProdRequest(invoiceID, updateInvoice);
    const [InvoiceRes, orderErr, orderLoading] = handleInvoiceIDRequest(invoiceID, updateInvoice);
    console.log(InvoiceRes)
    

  
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);

    const[subRes, setSubRes] = useState([])
    const [subError, setSubError] = useState("");
    const [subLoading, setSubLoading] = useState(false);
    
    //

    let invoice_date = InvoiceRes.invoice_date
    let invoice_number = InvoiceRes.invoice_number
    let margeID = InvoiceRes.margeID


    // ID: 1
    // client: "Hotel (Maria Haag)"
    // clientID: 4
    // delivery_date: "02.02.23"
    // formID: 15
    // formName: "Baguette, 300g"
    // invoiceID: 4
    // orderID: 4
    // order_date: "05.02.23"
    // price_piece: null
    // price_total: null
    // recipeName: "Weizenvorteig 1050"
    
    const handleSubmit = (e) =>{
      e.preventDefault()
      const today = new Date().toISOString().split("T",[1])
      if((invoice_date == "00.00.00"|| !invoice_date)){
        invoice_date = today[0]
      }
      if(invoice_date.indexOf(".") != -1){
        invoice_date = invoice_date.replace(/(..).(..).(..)/, "20$3-$2-$1")
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
              "clientID": InvoiceRes.clientID,
              "invoice_date": invoice_date,
              "invoice_number": invoice_number,
              "margeID": margeID
          }
      }).then((response)=>{
          setSubRes(response.data)
          //console.log(response.data);

      }).catch((err) => {
          setSubError(err)
          //console.log(err);
      }) 
      setSubLoading(false)
      setUpdateInvoice(!updateInvoice)

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
          window.location.href = "/orders";
          setDelRes(response.data)
          
          //console.log(response.data);
      }).catch((err) => {
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
          }
      }).then((response)=>{
          setDelRes(response.data)
          //console.log(response.data);

      }).catch((err) => {
          setDelError(err)
          //console.log(err);
      }) 
      setDelLoading(false)
          
    
    }

    const items = res.map((product, key)=> {
      return(
        <div key={key+"li"} className='order-grid'>
          <p key={key+"amount"} className='order-p' >{product.amount+"x"}</p>
          <p key={key+"recipe"} className='order-p'>{product.recipe_name}</p>
          <p key={key+"form"} className='order-p'>{product.form_name}</p>
          <p key={key+"p"} ></p>
          <p key={key+"production"} className='order-p'>{"Backtag: " + (product.production_date|| "-")}</p>
          <p key={key+"delivery"} className='order-p'>{"Lieferdatum: " + (product.delivery_date || delivery_date || "-")}</p>
        </div>        
        )
      })
      const editItems = res.map((product, key)=> {
        return(
          <div key={key+"div"} className='edit-order-div'>
            <div key={key+"li"} className='edit-order-grid'>
              <p key={key+"amount"} className='order-p' >{product.amount+"x"}</p>
              <p key={key+"recipe"} className='order-p'>{product.recipe_name}</p>
              <p key={key+"form"} className='order-p'>{product.form_name}</p>
              <p key={key+"p"} ></p>
              <p key={key+"production"} className='order-p'>{"Backtag: " + (product.production_date|| "-")}</p>
              <p key={key+"delivery"} className='order-p'>{"Lieferdatum: " + (product.delivery_date || delivery_date || "-")}</p>
            </div>
            <button key={key+"del"} className='edit-btn' onClick={()=>[setEdit(false), setToggleDelPrompt(true), productRef.current = product]}><SVGIcon src={trash} class="svg-icon-sm"/> </button>
          </div>

        )
      })

  return (
    <div className='page-content'>
    
      <Header key="header" title={InvoiceRes.invoice_number? "#"+ InvoiceRes.invoice_number +" "+ (InvoiceRes.client? InvoiceRes.client : " ") :"# - "}/>
      {togglePrompt && <PromptPopup 
          title={InvoiceRes.ID? `Bestellung #${InvoiceRes.ID } löschen?` : "Bestellung löschen?"} 
          btnOk="OK" 
          btnAbort="Abbrechen"
          onClickAbort={()=>setTogglePrompt(false)} 
          onClickOK={()=>handleInvoiceDelete()}
          message= {delError? delError.message : " "}
          /> 
      }
      {toggleDelPrompt && <PromptPopup 
          title={productRef? ` ${productRef.current.recipe_name} aus Rechnung entfernen?` : "Produkt aus Bestellung entfernen?"} 
          btnOk="OK" 
          btnAbort="Abbrechen"
          onClickAbort={()=>setToggleDelPrompt(false)} 
          onClickOK={()=>[handleInvoiceItemDel(), setToggleDelPrompt(false), setUpdateInvoice(!updateInvoice)]}
          message= {delError? delError.message : " "}
          /> 
      }

      <div className='order-wrapper'>
        <div className='order-div'>
          <p>Kunde: {InvoiceRes? InvoiceRes.client : "-"} </p>
          {!edit? <p>Rechnungsdatum: {InvoiceRes.invoice_date? InvoiceRes.invoice_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Rechnungsdatum:</p> 
            <DateLine 
              defaultDay={InvoiceRes.invoice_date.replace(/(..).(..).(..)/, "20$3-$2-$1")} 
              onDateChange={(val)=>{order_date = val}} /> 
          </div>}
          {/* {!edit? <p>Lieferzeitraum: {res.delivery_date? res.delivery_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Lieferdatum:</p> 
            <DateLine 
              defaultDay={(InvoiceRes.delivery_date != "00.00.00") && InvoiceRes.delivery_date && (InvoiceRes.delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1"))} 
              onDateChange={(val)=>{delivery_date = val}} />
          </div>} */}
          
          {((err || orderErr) && <p>{err.message || orderErr.message}</p>)}
          { !edit? 
          <div key={"header_div"} className='edit-btns'>
            <button key={"edit"} className='edit-btn' onClick={()=>setEdit(true)}><SVGIcon src={pencil_square} class="svg-icon-md"/> </button> 
          </div>:
          <div key={"btns"} className='edit-btns'>
            <button key={"check"} className='edit-btn' onClick={(e)=>[setEdit(false), handleSubmit(e)]}><SVGIcon src={check} class="svg-icon-md"/> </button>
            <button key={"del"} className='edit-btn' onClick={()=>[setEdit(false), setTogglePrompt(true)]}><SVGIcon src={trash} class="svg-icon-md"/> </button>
            <button key={"abort"} className='edit-btn' onClick={()=>setEdit(false)}><SVGIcon src={x_circle} class="svg-icon-md"/> </button>
          </div>}
        </div>

        {res.length? " ": <h4>Noch keine Produkte in der Bestellung</h4>}
        {(res && !edit) && items}
        {(res && edit) && editItems}

        
      </div>
      <button className='r-ins-add-btn r-ins-card jc-c' key={"add-btn"} onClick={()=>{setToggleOrderPrompt(true)}} ><SVGIcon src={plus} class="svg-icon-lg"/></button>


   
    </div>
  )
}

export default EditInvoice