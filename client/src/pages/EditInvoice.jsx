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
import '../styles/EditInvoice.css';

import handleInvoiceProdRequest from '../hooks/handleInvoiceProdRequest'
import NewRecipePopup, { AddInvoiceClientPopup, AddInvoiceOrderPopup, AddInvoiceProdPopup, PromptPopup, RecipeOrderPopup } from '../components/Popup';
import handleInvoiceIDRequest from '../hooks/handleInvoiceIDRequest';
import { DateLine } from '../components/Calendar';
import { LabelTextInput } from '../components/LabelBox';
import { SelectComponent } from '../components/Searchbar';


function EditInvoice  () {

    let invoiceID = window.location.pathname.split(":")[1];
    const [togglePrompt, setTogglePrompt] = useState(false);
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
  

    const [res, err, loading, handleProdRequest] = handleInvoiceProdRequest();
    useEffect(()=>{handleProdRequest(invoiceID)},[updateInvoice])
    const [InvoiceRes, invoiceErr, invoiceLoading] = handleInvoiceIDRequest(invoiceID, updateInvoice);
    //console.log(res)
    

  
    const [delRes, setDelRes] = useState([]);
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);

    const [subRes, setSubRes] = useState([]);
    const [subError, setSubError] = useState("");
    const [subLoading, setSubLoading] = useState(false);

    const [margeData, setMargeData] = useState({});
    const [margeError, setMargeError] = useState("");
    const [margeLoading, setMargeLoading] = useState(false);

    const [clientData, setClientData] = useState({});
    const [clientError, setClientError] = useState("");
    const [clientLoading, setClientLoading] = useState(false);



    let invoice_dateRef = useRef()
    let invoice_numberRef = useRef()
    let margeIDRef = useRef()
    let clientIDRef = useRef()

    useEffect(()=>{handleMargeRequest()}, [edit]) ;

    useEffect(()=> handleClientRequest,[edit])
    
    function handleClientRequest () {
      setClientLoading(true)
        axios({
            axiosInstance: axios,
            method: "GET",
            url:"s/clients/select",
            headers: {
                "authorization": authHeader()
            }
        }).then((response)=>{
            setClientData(response.data)
            //console.log(response.data);
        }).catch((err) => {
            setClientError(err)
            //console.log(err);
        })

        setClientLoading(false)
        
    }

    const handleMargeRequest = () => {
      setMargeLoading(true)
      axios({
          axiosInstance: axios,
          method: "GET",
          url:"s/marges/all/name",
          headers: {
              "authorization": authHeader()
          },
      }).then((response)=>{
          setMargeData(response.data)
          //console.log(response.data);
      }).catch((err) => {
          setMargeError(err)
          //console.log(err);
      })

      setMargeLoading(false)
      }
    
    const handleSubmit = (e) =>{
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
              "margeID": margeIDRef.current || InvoiceRes.margeID
          }
      }).then((response)=>{
          setSubRes(response.data)
          //console.log(response.data);

      }).catch((err) => {
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
          setDelError(err)
          //console.log(err);
      }) 
      setDelLoading(false)
      setUpdateInvoice(updateInvoice+1)
          
    
    }

    const items = res.map((product, key)=> {
      return(
        <div key={key+"li"} className='invoice-tb-row'>      
            <p key={key+"pos"} className='invoice-p'>{key+1}</p>
            <p key={key+"product"} className='invoice-p ta-s'>{product.product_name}</p>
            <p key={key+"amount"} className='invoice-p' >{product.amount+"x"}</p>
            <p key={key+"price_piece"} className='invoice-p' >{(product.price_piece? (product.price_piece.replace(".",",") ): "0,00") + "€"}</p>
            <p key={key+"price_total"} className='invoice-p'> {(product.price_total? (product.price_total.replace(".",",") ): "0,00") + "€"}</p>
        </div>        
        )
      })
      const editItems = res.map((product, key)=> {
        return(
          <div key={key+"div"} className=''>
            <div key={key+"li"} className='invoice-tb-row'>      
              <p key={key+"pos"} className='invoice-p'>{key+1}</p>
              <p key={key+"product"} className='invoice-p ta-c'>{product.product_name}</p>
              <p key={key+"amount"} className='invoice-p' >{product.amount+"x"}</p>
              <p key={key+"price_piece"} className='invoice-p' >{(product.price_piece? product.price_piece.replace(".",",") : "0,00") + "€"}</p>
              <p key={key+"price_total"} className='invoice-p' >{(product.price_total? product.price_total.replace(".",",") : "0,00") + "€"}</p>
             </div>   
            <button key={key+"del"} className='edit-btn' onClick={()=>[setToggleDelPrompt(true), productRef.current = product]}><SVGIcon src={trash} class="svg-icon-sm"/> </button>
          </div>

        )
      })      

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
        {((err || invoiceErr) && <p className='errorMsg'>{err.message || invoiceErr.message}</p>)}
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
          {/* {!edit? <p>Lieferzeitraum: {res.delivery_date? res.delivery_date : "-"}</p>:         
          <div className='d-il ai-c'> 
            <p>Lieferdatum:</p> 
            <DateLine 
              defaultDay={(InvoiceRes.delivery_date != "00.00.00") && InvoiceRes.delivery_date && (InvoiceRes.delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1"))} 
              onDateChange={(val)=>{delivery_date = val}} />
          </div>} */}
          
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
        <div className='invoice-div'>
        {res.length? 
        <div className='invoice-tb-tbody'>   
              <div className='invoice-tb-row'>
                <p className='invoice-tb-th'>Pos</p>
                <p className='invoice-tb-th ta-s'>Artikel</p>
                <p className='invoice-tb-th'>Anzahl</p>
                <p className='invoice-tb-th'>Einzelpreis</p>
                <p className='invoice-tb-th'>Summe Netto</p>
              </div>
              {(res && !edit) && items}
              {(res && edit) && editItems}
        </div>
        : 
        <h4>Noch keine Produkte in der Bestellung</h4>}
                
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