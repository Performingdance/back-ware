import React, {useEffect, useMemo, useRef, useState} from 'react'
import Header from '../components/Header'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import pencil_square from '../assets/icons/pencil-square.svg'
import x_circle from '../assets/icons/x-circle.svg'
import check_all from '../assets/icons/check-all.svg'
import check from '../assets/icons/check.svg'
import bar_graph from '../assets/icons/bar-graph.svg'
import filetype_pdf from '../assets/icons/filetype-pdf.svg'
import square from '../assets/icons/square.svg'
import euro from '../assets/icons/currency-euro.svg'
import trash from '../assets/icons/trash.svg'
import plus from '../assets/icons/plus.svg'
import SVGIcon from '../components/SVG';
import InvoiceNetto, { InvoiceBrutto } from '../components/Invoice'
import '../styles/EditInvoice.css';
import { DateLine } from '../components/Calendar';
import { SelectComponent } from '../components/Searchbar';
import { AddInvoiceClientPopup, AddInvoiceOrderPopup, AddInvoiceProdPopup, AlertPopup, PromptPopup } from '../components/Popup';

import handleInvoiceProdRequest from '../hooks/invoices/handleInvoiceProdRequest'
import handleInvoiceIDRequest from '../hooks/invoices/handleInvoiceIDRequest';
import handleClientSelectRequest from '../hooks/clients/handleClientSelectRequest';
import handleMargesRequest from '../hooks/marges/handleMargesRequest';
import handleInvoiceMargeUpdateRequest from '../hooks/invoices/handleInvoiceMargesUpdateRequest';
import handleInvoiceTaxRequest from '../hooks/invoices/handleInvoiceTaxRequest';
import errorHandling from '../services/errorHandling';
import { LabelTextInput } from '../components/LabelBox';
import handleInvoiceIsPaid from '../hooks/invoices/handleInvoiceIsPaid';
import handleClientExtRequest from '../hooks/clients/handleClientExtRequest';
import handleCompanyRequest from '../hooks/settings/handleCompanyRequest';
import Loading from '../components/Loading';
import handlePdfCreate from '../hooks/utility/handlePdfCreate';


function EditInvoice  () {

    let invoiceID = window.location.pathname.split("/")[2]
    const [togglePrompt, setTogglePrompt] = useState(false);
    const [createPdf, setCreatePdf] = useState(false);
    const [toggleDeliveryAlert, setToggleDeliveryAlert] = useState(false);
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
    const [invoiceRes, invoiceErr, invoiceLoading] = handleInvoiceIDRequest(invoiceID, updateInvoice);
    const [clientEx, clientExError, clientExLoading, handleCERequest] = handleClientExtRequest();
    const [company, companyError, companyLoading] = handleCompanyRequest();
    
    useEffect(()=>{handleCERequest(invoiceRes.clientID)},[invoiceRes])
  
    const [delRes, setDelRes] = useState([]);
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);
    const [subRes, setSubRes] = useState([]);
    const [subError, setSubError] = useState("");
    const [subLoading, setSubLoading] = useState(false);
    const [pdfLoading, handlePdfCreateRequest] = handlePdfCreate();
  


    const [margeData, margeError, margeLoading, handleMRequest] = handleMargesRequest();
    const [margeUpdate, margeUError, margeULoading, handleMURequest] = handleInvoiceMargeUpdateRequest();
    const [clientData, clientError,clientLoading, handleCRequest] = handleClientSelectRequest();
    const [taxData, taxError, taxLoading, handleTRequest] = handleInvoiceTaxRequest();
    const [isPaidData, isPaidError, isPaidLoading, handleIsPaidUpdate] = handleInvoiceIsPaid();

      useEffect(()=>handleTRequest(invoiceID), [edit]);
      useEffect(()=>setToggleBrutto(invoiceRes.tax),[invoiceRes])
      useEffect(()=>{ setUpdateInvoice(updateInvoice+1)},[isPaidData])


    function handleSelectRequests(){
        handleMRequest()
        handleCRequest()    
    }

    let invoice_dateRef = useRef()
    let invoice_numberRef = useRef()
    let margeIDRef = useRef()
    let clientIDRef = useRef()
    let notesRef = useRef()
    let invoice_delivery_date = invoiceRes.delivery_date
    let delivery_date_end = invoiceRes.delivery_date_end
    let delivery_date_end_newRef = useRef(invoiceRes.delivery_date_end)
    let editProd = useRef([]) 

    useEffect(() => {
      products.forEach((obj)=>{
      let temp_obj = {...obj, edit : false}
      editProd.current = [...editProd.current, temp_obj] 
      
    }) }, [products,edit])

    function handleIsPaid(isPaid){
      handleIsPaidUpdate(invoiceID, isPaid)
    }
    
    const handleValueChange = (obj, val, ID) =>{
      editProd.current.forEach((product,key)=>{
        if(product.ID == ID){
          if((obj == "order_date") || (obj == "delivery_date")){
            if((val == "00.00.00"|| !val)){
              editProd.current[key][obj] = today[0]
            }
            editProd.current[key][obj] = val
          }else{
            editProd.current[key][obj]= val
          }
          editProd.current[key].edit = true
          
        }
      })
      //console.log(editRes)

    }
    
    function handleSubmit(e){
      e.preventDefault()
      const today = new Date().toISOString().split("T",[1])
      if((invoice_dateRef.current == "00.00.00"|| !invoice_dateRef.current)){
        invoice_dateRef.current = today[0]
      }
      if(invoice_dateRef.current.indexOf(".") != -1){
        invoice_dateRef.current = invoice_dateRef.current.replace(/(..).(..).(..)/, "20$3-$2-$1")
      } 

      if(delivery_date_end != delivery_date_end_newRef.current){
        if((delivery_date_end_newRef.current == "00.00.00"|| !delivery_date_end_newRef.current)){
          delivery_date_end_newRef.current = today[0]
        }
        if(delivery_date_end_newRef.current.indexOf(".") != -1){
          delivery_date_end_newRef.current = delivery_date_end_newRef.current.replace(/(..).(..).(..)/, "20$3-$2-$1")
        }
      }
      let changedItems = []
      editProd.current.forEach((obj)=>{
        if(obj.edit == true){
          if(obj.order_date.includes(".")){
            obj.order_date = obj.order_date.replace(/(..).(..).(..)/, "20$3-$2-$1")
          }
          if(obj.delivery_date.includes(".")){
            obj.delivery_date = obj.delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1")
          }           
          changedItems = [...changedItems, obj]
        }
      })


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
        
              "invoiceID": invoiceID,
              "clientID": clientIDRef.current || invoiceRes.clientID,
              "invoice_date": invoice_dateRef.current || invoiceRes.invoice_date,
              "invoice_number": invoice_numberRef.current || invoiceRes.invoice_number,
              "margeID": margeIDRef.current || invoiceRes.margeID,
              "notes": notesRef.current || invoiceRes.notes
          }
      }).then((response)=>{         
          if(margeIDRef.current != invoiceRes.margeID){
            handleMURequest(invoiceID,margeIDRef.current)
          }

          axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/invoices/update/items/all",
            headers: {
                "authorization": authHeader()
            },
            data : {
              changedItems
            }
        }).then((response)=>{
          if(delivery_date_end != delivery_date_end_newRef.current){
            axios({
                axiosInstance: axios,
                method: "PUT",
                url:"s/invoices/update/deliverydate",
                headers: {
                    "authorization": authHeader()
                },
                data : {
              
                    "invoiceID": invoiceID,
                    "delivery_date_end": delivery_date_end_newRef.current || invoiceRes.delivery_date_end,
                    "invoice_part": invoiceRes.invoice_part || 0
                }
            }).then((response)=>{      
                setUpdateInvoice(updateInvoice+1)   
                setSubRes(response.data)

  
            }).catch((err) => {
                errorHandling(err)
                setSubError(err)
                //console.log(err);
            }) 
            }else{
              setUpdateInvoice(updateInvoice+1)
            }
  
        }).catch((err) => {
            setSubError(err)
            //console.log(err);
        }) 

      }).catch((err) => {
          errorHandling(err)
          setSubError(err)
          //console.log(err);
      }) 
      setSubLoading(false)



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
    
      <Header key="header" title={invoiceRes? "#"+ invoiceRes.invoice_number +" "+ (invoiceRes.client? invoiceRes.client : " ") :"# - "}/>
      {togglePrompt && <PromptPopup 
          title={invoiceRes.invoice_number? `Bestellung #${invoiceRes.invoice_number } löschen?` : "Bestellung löschen?"} 
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
        defaultClientID={invoiceRes.clientID}
        defaultInvoiceName={invoiceRes.invoice_number}
        defaultClientName={invoiceRes.client} />}

      {addItemPrompt && <AddInvoiceProdPopup
        forwardEdit={false}
        onClickOK={()=>{setUpdateInvoice(updateInvoice+1),setAddItemPrompt(false)}}
        onClickAbort={()=>{setAddItemPrompt(false)}}
        defaultInvoiceID={invoiceID}
        defaultClientID={invoiceRes.clientID}
        defaultInvoiceName={invoiceRes.invoice_number}
        defaultClientName={invoiceRes.client} />}
      
      {addClientItemPrompt && <AddInvoiceClientPopup
        forwardEdit={false}
        onClickOK={()=>{setUpdateInvoice(updateInvoice+1),setAddClientItemPrompt(false)}}
        onClickAbort={()=>{setAddClientItemPrompt(false)}}
        defaultInvoiceID={invoiceID}
        defaultClientID={invoiceRes.clientID}
        defaultInvoiceName={invoiceRes.invoice_number}
        defaultClientName={invoiceRes.client} />}


      <div className='invoice-wrapper'>
        <div className='invoice-info-div ta-c'>
        {((prodErr || invoiceErr) && <p className='errorMsg'>{prodErr.message || invoiceErr.message}</p>)}
          {!edit ?<p>Kunde: {invoiceRes? invoiceRes.client : "-"} </p>:
                    <div className=' ai-c'> 
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
                      defaultValue={invoiceRes? invoiceRes.client:""}
                      placeholder={"Kunde wählen...."}
                      open={clientSelectOpen}
                      setOpen={(val)=>{setClientSelectOpen(val)}}
                      className='i-select d-il' 
                      
                      />}
                  </div>}
          {!edit ?<p>Marge: {invoiceRes? invoiceRes.marge_name : "-"} </p>:
                    <div className='  ai-c'> 
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
                      defaultValue={invoiceRes? invoiceRes.marge_name: ""}
                      placeholder={"Marge wählen...."}
                      open={margeSelectOpen}
                      setOpen={(val)=>{setMargeSelectOpen(val)}}
                      className='i-select d-il' 
                      
                      />}
                  </div>}
          {!edit ?<p>Rechnungs-Nr.: {invoiceRes? "#" + invoiceRes.invoice_number+ (invoiceRes.invoice_part != "0"? "-"+invoiceRes.invoice_part : "") : "# -"} </p>:
                    <div className=' ai-c'> 
                    <p>Rechnungs-Nr.:</p> 
                    <input className='invoice-input d-il' type='number' defaultValue={invoiceRes? invoiceRes.invoice_number: 0}  onChange={(e)=>{invoice_numberRef.current = e.target.valueAsNumber}}></input>
                  </div>}
          {!edit? <p>Rechnungsdatum: {invoiceRes? invoiceRes.invoice_date : "-"}</p>:         
          <div className=' ai-c'> 
            <p>Rechnungsdatum:</p> 
            <DateLine 
              defaultDay={invoiceRes? invoiceRes.invoice_date.replace(/(..).(..).(..)/, "20$3-$2-$1"): ""} 
              onDateChange={(val)=>{invoice_dateRef.current = val}} /> 
          </div>}
          {(invoice_delivery_date != delivery_date_end) ?
            <p>Lieferzeitraum:</p>:
            <p>Lieferdatum: </p>}

          {edit? 
                  
          <div className='ai-c jc-c'> 
            
            <div className=''> 
              <p className=''>{invoice_delivery_date}</p>
              <p className=' '>bis</p>
              <DateLine 
                defaultDay={(delivery_date_end != "00.00.00") && delivery_date_end && (delivery_date_end.replace(/(..).(..).(..)/, "20$3-$2-$1"))} 
                onDateChange={(val)=>{delivery_date_end_newRef.current = val}}
                size="sm" 
                classDiv=""/>
            </div>
          </div>:
          <p>{(invoice_delivery_date == delivery_date_end)? 
            invoice_delivery_date: invoice_delivery_date +" - "+delivery_date_end}
          </p>}

          {!edit? <div>
            <p>Notizen: </p><pre className=''>{invoiceRes? invoiceRes.notes : "-"}</pre>
            </div>:
          <div className='ai-c'>
            <p>Notizen:</p>
            <LabelTextInput defaultValue={invoiceRes? invoiceRes.notes : "-"} onChange={(val)=> notesRef.current = val} />
          </div>}
          
          { !edit? 
          <div key={"header_div"} className='edit-btns'>
            {!invoiceRes.is_paid && 
            <button key={"edit"} className='edit-btn' onClick={()=>{setEdit(true), handleSelectRequests()}}>
              <SVGIcon src={pencil_square} class="svg-icon-md"/> 
            </button>} 
            <button key={"pdf"} className='edit-btn' onClick={()=>{clientEx[0] && products && handlePdfCreateRequest(
                   products,
                   taxData,
                   invoiceRes,
                   clientEx[0],
                   company[0]
            )}}><SVGIcon src={filetype_pdf} class="svg-icon-md"/> </button> 
            {invoiceRes.is_paid?
            <button key={"is_paid"} className='edit-btn' onClick={()=>{handleIsPaid(!invoiceRes.is_paid)}}>
              <SVGIcon src={check} class="svg-icon-md"/> 
              <SVGIcon src={euro} class="svg-icon-md"/>  
            </button> 
            :
            <button key={"is_not_paid"} className='edit-btn' onClick={()=>{handleIsPaid(!invoiceRes.is_paid)}}>
              <SVGIcon src={square} class="svg-icon-md"/> 
              <SVGIcon src={euro} class="svg-icon-md"/> 
            </button> 
            }
          </div>:
          <div key={"btns"} className='edit-btns'>
            <button key={"check"} className='edit-btn' onClick={(e)=>{setEdit(false), 
              (Date(delivery_date_end) != Date(delivery_date_end_newRef.current))? setToggleDeliveryAlert(true) : handleSubmit(e)} }><SVGIcon src={check_all} class="svg-icon-md"/> </button>
            <button key={"del"} className='edit-btn' onClick={()=>[setEdit(false), setTogglePrompt(true)]}><SVGIcon src={trash} class="svg-icon-md"/> </button>
            <button key={"abort"} className='edit-btn' onClick={()=>setEdit(false)}><SVGIcon src={x_circle} class="svg-icon-md"/> </button>
          </div>}
        </div>
        <div className='invoice-div'>
        {toggleBrutto? 
        < InvoiceBrutto data={products} taxData={taxData} invoiceID={invoiceID} edit={edit} productRef={(prod)=>{productRef.current = prod}} handleValueChange={(obj,val,ID)=>{handleValueChange(obj,val,ID)}} toggleDelPrompt={(val)=>setToggleDelPrompt(val)}/>:
        < InvoiceNetto data={products} taxData={taxData} invoiceID={invoiceID} edit={edit} productRef={(prod)=>{productRef.current = prod}} handleValueChange={(obj,val,ID)=>{handleValueChange(obj,val,ID)}} toggleDelPrompt={(val)=>setToggleDelPrompt(val)}/>}
        {toggleDeliveryAlert &&
        <PromptPopup
          title="Lieferzeitraum anpassen"
          message="Durch das ändern des Lieferzeitraumes wird eine zweite Rechnung mit den übrigen Produkten erstellt. Fortfahren?"
          onClickOK={(e)=>{handleSubmit(e),setToggleDeliveryAlert(false)}}
          btnOk={"OK"}
          btnAbort={"Abbrechen"}
          onClickAbort={()=>setToggleDeliveryAlert(false)}
        />
        } 
        {(pdfLoading || subLoading || invoiceLoading || taxLoading) && <Loading/>}   
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