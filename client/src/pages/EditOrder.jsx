import React, {useEffect, useMemo, useRef, useState} from 'react'
import Header from '../components/Header'
import '../styles/IngredientCard.css'
import handleOrderIngRequest from '../hooks/handleOrderIngRequest'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import file_plus from '../assets/icons/file-plus.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import bar_graph from '../assets/icons/bar-graph.svg'
import x_circle from '../assets/icons/x-circle.svg'
import check from '../assets/icons/check-all.svg'
import trash from '../assets/icons/trash.svg'
import plus from '../assets/icons/plus.svg'
import SVGIcon from '../components/SVG';
import NewRecipePopup, { AddInvoicePopup, PromptPopup, RecipeOrderPopup } from '../components/Popup';
import handleOrderIDRequest from '../hooks/handleOrderIDRequest';
import { DateLine } from '../components/Calendar';
import { LabelTextInput } from '../components/LabelBox';


function EditOrder  () {

    let orderID = window.location.pathname.split(":")[1]
    const [togglePrompt, setTogglePrompt] = useState(false)
    const [toggleDelPrompt, setToggleDelPrompt] = useState(false)
    const [toggleOrderPrompt, setToggleOrderPrompt] = useState(false)
    const [invoicePrompt, setInvoicePrompt] = useState(false)

    const [updateOrder, setUpdateOrder] = useState(0)
    const [edit, setEdit] = useState(false);
    let productRef = useRef()
  

    const [res, err, loading] = handleOrderIngRequest(orderID, updateOrder);
    const [orderRes, orderErr, orderLoading] = handleOrderIDRequest(orderID, updateOrder);
    

  
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);

    const[subRes, setSubRes] = useState([])
    const [subError, setSubError] = useState("");
    const [subLoading, setSubLoading] = useState(false);
    
    //
    let order_date = orderRes.order_date
    let delivery_date = orderRes.delivery_date
    let notes = orderRes.notes

    
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
              "orderID": orderID,
              "clientID": orderRes.clientID,
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
      setUpdateOrder(updateOrder+1)

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
              "orderID": orderID,
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
              <div key={key+"edit_production"} className='order-p'>{"Backtag: " }
              <DateLine 
              defaultDay={product.production_date.replace(/(..).(..).(..)/, "20$3-$2-$1")} 
              onDateChange={(val)=>{res[key].production_date = val}}
              size={"sm"} /> 
              </div>
              <div key={key+"edit_delivery"} className='order-p'>{"Lieferdatum: " }
              <DateLine 
              defaultDay={product.delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1")} 
              onDateChange={(val)=>{res[key].delivery_date = val}}
              size={"sm"} /> 
              </div>
            </div>
            <button key={key+"del"} className='edit-btn' onClick={()=>[setEdit(false), setToggleDelPrompt(true), productRef.current = product]}><SVGIcon src={trash} class="svg-icon-sm"/> </button>
          </div>

        )
      })

  return (
    <div className='page-content'>
    
      <Header key="header" title={orderID? "#"+ orderID +" "+ (orderRes.client? orderRes.client : " ") :"# - "}/>
      {togglePrompt && <PromptPopup 
          title={orderRes.ID? `Bestellung #${orderRes.ID } löschen?` : "Bestellung löschen?"} 
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
          onClickOK={()=>[handleOrderItemDel(), setToggleDelPrompt(false), setUpdateOrder(updateOrder+1)]}
          message= {delError? delError.message : " "}
          /> 
      }
      {toggleOrderPrompt && <RecipeOrderPopup 
        defaultClientID={orderRes.clientID}
        defaultOrderID={orderRes.ID}
        defaultClientName={orderRes.client}
        defaultOrderName={"#"+orderRes.ID+ " ("+ orderRes.order_date + ")"}
        onClickAbort={()=>setToggleOrderPrompt(false)}
        onClickOK={()=>{setToggleOrderPrompt(false), setUpdateOrder(updateOrder+1) }}
        /> 
      }
      {invoicePrompt && 
      <AddInvoicePopup
        defaultClientID={orderRes.clientID} 
        defaultClientName={orderRes.client}
        defaultOrderID={orderID}
        defaultOrderName={orderID? "#"+ orderID +" "+ (orderRes.client? orderRes.client : " ") :"# - "}
        onClickAbort={()=>setInvoicePrompt(false)}
        onClickOK={()=>setInvoicePrompt(false)} />}

      <div className='order-wrapper'>
        <div className='order-div'>
          <p>Kunde: {orderRes? orderRes.client : "-"} </p>
          {!edit? <p>Bestelldatum: {orderRes.order_date? orderRes.order_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Bestelldatum:</p> 
            <DateLine 
              defaultDay={orderRes.order_date.replace(/(..).(..).(..)/, "20$3-$2-$1")} 
              onDateChange={(val)=>{order_date = val}} /> 
          </div>}
          {!edit? <p>Lieferdatum: {orderRes.delivery_date? orderRes.delivery_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Lieferdatum:</p> 
            <DateLine 
              defaultDay={(orderRes.delivery_date != "00.00.00") && orderRes.delivery_date && (orderRes.delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1"))} 
              onDateChange={(val)=>{delivery_date = val}} />
          </div>}
          {!edit? <div>
            <p>Notizen: </p><pre className=''>{orderRes? orderRes.notes : "-"}</pre>
            </div>:
          <div className='d-il ai-c'>
            <p>Notizen:</p>
            <LabelTextInput defaultValue={notes} onChange={(val)=> notes = val} />
          </div>}
          {(orderRes.invoiceID == null)? 
            <div className='d-il ai-c'>
              <p>Rechnung erstellen </p>
              <button key={"file_plus"} className='edit-btn' onClick={(e)=>{setInvoicePrompt(true), setUpdateOrder(updateOrder+1)}}><SVGIcon src={file_plus} class="svg-icon-md"/> </button>
            </div>: 
            <div className='d-il ai-c'>
              <p>Rechnung: </p>
              <a key={"bar_graph"} className='edit-btn' href={'/invoices/edit:'+orderRes.invoiceID}><SVGIcon src={bar_graph} class="svg-icon-md"/> </a>
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

export default EditOrder