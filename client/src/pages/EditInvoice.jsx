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

import handleOrderIngRequest from '../hooks/handleOrderIngRequest'
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
  

    const [res, err, loading] = handleOrderIngRequest(invoiceID, updateInvoice);
    const [InvoiceRes, orderErr, orderLoading] = handleInvoiceIDRequest(invoiceID, updateInvoice);
    console.log(InvoiceRes)
    

  
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);

    const[subRes, setSubRes] = useState([])
    const [subError, setSubError] = useState("");
    const [subLoading, setSubLoading] = useState(false);
    
    //
    let order_date = InvoiceRes.order_date
    let delivery_date = InvoiceRes.delivery_date
    let notes = InvoiceRes.notes

    
    const handleSubmit = (e) =>{
      e.preventDefault()
      const today = new Date().toISOString().split("T",[1])
      if((delivery_date == "00.00.00"|| !delivery_date)){
        delivery_date = today[0]
      }
      if(delivery_date.indexOf(".") != -1){
        delivery_date = delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1")
      }
      if(order_date.indexOf(".") != -1){
        order_date = order_date.replace(/(..).(..).(..)/, "20$3-$2-$1")
      }

      console.log (order_date, delivery_date)
      setSubLoading(true)
      axios({
          axiosInstance: axios,
          method: "PUT",
          url:"s/orders/update",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "orderID": invoiceID,
              "clientID": InvoiceRes.clientID,
              "order_date": order_date,
              "delivery_date": delivery_date,
              "notes": notes
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
    
    function handleOrderDelete(){
    
      setDelLoading(true)
      axios({
          axiosInstance: axios,
          method: "DELETE",
          url:"s/orders/delete",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "orderID": invoiceID,
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
    function handleOrderItemDel(){
      let product = productRef.current
      setDelLoading(true)
      axios({
          axiosInstance: axios,
          method: "DELETE",
          url:"s/orders/delete/item",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "ID": product.ID,
              "orderID": product.orderID,
              "recipeID": product.recipeID,
              "formID": product.formID,
              "date": product.production_date.replace(/(..).(..).(..)/, "20$3-$2-$1")
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
    
      <Header key="header" title={invoiceID? "#"+ invoiceID +" "+ (InvoiceRes.client? InvoiceRes.client : " ") :"# - "}/>
      {togglePrompt && <PromptPopup 
          title={InvoiceRes.ID? `Bestellung #${InvoiceRes.ID } löschen?` : "Bestellung löschen?"} 
          btnOk="OK" 
          btnAbort="Abbrechen"
          onClickAbort={()=>setTogglePrompt(false)} 
          onClickOK={()=>handleOrderDelete()}
          message= {delError? delError.message : " "}
          /> 
      }
      {toggleDelPrompt && <PromptPopup 
          title={productRef? ` ${productRef.current.recipe_name} aus Bestellung löschen?` : "Item aus Bestellung löschen?"} 
          btnOk="OK" 
          btnAbort="Abbrechen"
          onClickAbort={()=>setToggleDelPrompt(false)} 
          onClickOK={()=>[handleOrderItemDel(), setToggleDelPrompt(false), setUpdateInvoice(!updateInvoice)]}
          message= {delError? delError.message : " "}
          /> 
      }
      {toggleOrderPrompt && <RecipeOrderPopup 
        defaultClientID={InvoiceRes.clientID}
        defaultOrderID={InvoiceRes.ID}
        defaultClientName={InvoiceRes.client}
        defaultOrderName={"#"+InvoiceRes.ID+ " ("+ InvoiceRes.order_date + ")"}
        onClickAbort={()=>setToggleOrderPrompt(false)}
        onClickOK={()=>{setToggleOrderPrompt(false), setUpdateInvoice(!updateInvoice) }}
        /> 
      }
      <div className='order-wrapper'>
        <div className='order-div'>
          <p>Kunde: {InvoiceRes? InvoiceRes.client : "-"} </p>
          {!edit? <p>Bestelldatum: {InvoiceRes.order_date? InvoiceRes.order_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Bestelldatum:</p> 
            <DateLine 
              defaultDay={InvoiceRes.order_date.replace(/(..).(..).(..)/, "20$3-$2-$1")} 
              onDateChange={(val)=>{order_date = val}} /> 
          </div>}
          {!edit? <p>Lieferdatum: {InvoiceRes.delivery_date? InvoiceRes.delivery_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Lieferdatum:</p> 
            <DateLine 
              defaultDay={(InvoiceRes.delivery_date != "00.00.00") && InvoiceRes.delivery_date && (InvoiceRes.delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1"))} 
              onDateChange={(val)=>{delivery_date = val}} />
          </div>}
          {!edit? <div>
            <p>Notizen: </p><pre className=''>{InvoiceRes? InvoiceRes.notes : "-"}</pre>
            </div>:
          <div className='d-il ai-c'>
            <p>Notizen:</p>
            <LabelTextInput defaultValue={notes} onChange={(val)=> notes = val} />
          </div>} 
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