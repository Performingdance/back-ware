import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import {DateLine} from '../components/Calendar'
import '../styles/Daylist.css'
import LabelBox, { LabelInput, LabelTextInput } from '../components/LabelBox'
import SVGIcon from '../components/SVG'
import trash from '../assets/icons/trash.svg'
import pencil_square from '../assets/icons/pencil-square.svg'
import add from '../assets/icons/plus.svg'
import check_all from '../assets/icons/check-all.svg'
import check from '../assets/icons/check.svg'
import x_circle from '../assets/icons/x-circle.svg'
import { ProductOrderPopup, PromptPopup } from '../components/Popup'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import Loading from '../components/Loading'

function handleDaylistDayRequest(date, deleteID, update){
  //api {{baseURL}}s/daylist/all/day

  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>handleRequest(),[date, deleteID, update])
  function handleRequest () {
      setLoading(true)
      axios({
          axiosInstance: axios,
          method: "POST",
          url:"s/daylist/all/day",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "date" : date
          }
      }).then((response)=>{
          setRes(response.data)
          //console.log(res);
      }).catch((err) => {
          setError(err)
          //console.log(err);
      })

      setLoading(false)
      
  }

let daylistItems = []
for(var i = 0; i< res.length; i++){
   daylistItems =  [...daylistItems, {...res[i], edit : false}]


}
//console.log(_response)
return [daylistItems, error, loading];
}


function Daylist() {
  const today = new Date().toISOString().slice(0, 10)
  // console.log(today)
  const [date,setDate] = useState(today)
  const [edit,setEdit] = useState(false)
  const [editID,setEditID] = useState(0)
  const [editItem, setEditItem] = useState({})
  const [togglePopup, setTogglePopup] = useState(false)
  const [toggleTrash, setToggleTrash] = useState(false)
  const [deleteID, setDeleteID] = useState(-1)
  const [delName, setDelName] = useState("")
  const [updateDaylist,setUpdateDaylist] = useState(0)


  const [delRes, setDelRes] = useState([])
  const [delError, setDelError] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  const [updRes, setUpdRes] = useState([])
  const [updError, setUpdError] = useState("");
  const [updLoading, setUpdLoading] = useState(false);
  const [daylistItems, error, loading] = handleDaylistDayRequest(date, deleteID, updateDaylist);


  function handleEdit (item){
    if (item.ID == editID){
      setEdit(!edit)
    }else{
      setEdit(!edit)
      setEditID(item.ID);
    }
    setEditItem(item)
    //console.log(item, editItem)
   // const  [response, error, loading] = handleRecipesRequest();
    
  }



  function handleEditSubmit(e){
    setUpdLoading(true)
   
    
    // console.log(update)

      axios({
          axiosInstance: axios,
          method: "PUT",
          url:"s/daylist/update",
          headers: {
              "authorization": authHeader()
          },
          data : {
            "ID": editItem.ID,
            "recipeID": editItem.recipeID,
            "formID": editItem.formID,
            "amount": editItem.amount,
            "ist": editItem.ist,
            "rest": editItem.rest,
            "orderID": editItem.orderID,
            "note": editItem.note,
            "date": date

          }
      }).then((response)=>{
          setEdit(false)
          setEditID(-1)
          setUpdRes(response.data)
          setUpdateDaylist(updateDaylist+1)

          //console.log(response.data);
      }).catch((err) => {
          setUpdError(err)
          console.log(err);
      })
  setUpdLoading(false)
}
    
  
  function handleItemDelete(ID){
    
    setDelLoading(true)
    axios({
        axiosInstance: axios,
        method: "DELETE",
        url:"s/daylist/delete",
        headers: {
            "authorization": authHeader()
        },
        data : {
            "ID": ID,
        }
    }).then((response)=>{
        setDelRes(response.data)
        setDeleteID(ID)
        setEdit(false)
        setUpdateDaylist(updateDaylist+1)
        //console.log(response.data);
    }).catch((err) => {
        setDelError(err)
        //console.log(err);
    })
    setDelName(-1)
    setDelLoading(false)
    setToggleTrash(false)
        
  
  }
  //console.log(daylistItems)
  const daylist = 
    daylistItems.map((item,key)=>{
      
        if(!edit || (item.ID != editID)){
          return(
        <div key={key+"div"}>
        <div key={key+"btns"} className=' daylist-btns'>
          <button  className='daylist-btn' onClick={()=> handleEdit(item)}>
              <SVGIcon  src={pencil_square} class="svg-icon-md" />
          </button>
        </div>
        <div key={key+"item"} className='daylist-items'>
        <LabelBox _key={key+"lb1"} title="Rezept" text={item.recipeName || "-"}/>
        <LabelBox _key={key+"lb2"} title="Form" text={item.formName || "-"}/>
        <LabelBox _key={key+"lb3"} title="Menge" text={item.amount ? item.amount.split(".")[0] : "-"}/>
        <LabelBox _key={key+"lb4"} title="Kunde/Bestellung" text={item.clientName || "-"}/> 
        <LabelBox _key={key+"lb5"} title="Ist" text={item.ist || "-"}/>
        <LabelBox _key={key+"lb6"} title="Rest" text={item.rest || "-"}/>
        <LabelBox _key={key+"lb7"} title="Notiz" text={item.note || "-"}/>

        </div>
      </div>
      
      )
    }
    if(edit && (item.ID == editID)){
      return(
        <div key={key+"divEdit"}>
        {toggleTrash && <PromptPopup 
          title={delName + " aus Liste entfernen?"}
          btnOk="OK" 
          btnAbort="Abbrechen"
          onClickAbort={()=>setToggleTrash(false)} 
          onClickOK={()=>handleItemDelete(deleteID)}
          message= {delError? delError : " "}
        />}
        <div key={key+"btns"} className=' daylist-btns'>
          <button key={key+"trash"} className='daylist-btn' onClick={()=>{ setDeleteID(item.ID), setDelName(item.recipeName), setToggleTrash(!toggleTrash)}}>
            <SVGIcon key={key+"trash-icon"}  src={trash} class="svg-icon-md" />
          </button>
          <button key={"btn_x"} className='daylist-btn' onClick={()=> handleEdit(item)}>
            <SVGIcon  key={"icon_x"} src={x_circle} class="svg-icon-md" />
          </button>
          <button key={"btn_check"} className='daylist-btn' onClick={(e)=> handleEditSubmit(e) }>
          <SVGIcon key={"icon_check_all"} src={check_all} class="svg-icon-md" />
          </button>
        </div>
        <div key={key+"item"} className='daylist-items'>
          <LabelBox className='daylist-input' _key={key+"lb1"} title="Rezept" text={item.recipeName || "-"}/>
          <LabelBox className='daylist-input' _key={key+"lb2"} title="Form" text={item.formName || "-"}/>
          <LabelInput className='daylist-input' _key={key+"lb3"} title="Menge" placeholder={item.amount? item.amount.split(".")[0] : "-" } onChange={(e)=>{setEditItem(prev =>({...editItem, amount: e.target.value}))}}/>
          <LabelBox className='daylist-input' _key={key+"lb4"} title="Kunde/Bestellung" text={item.clientName || "-"}/> 
          <LabelInput className='daylist-input' _key={key+"lb5"} title="Ist" placeholder={item.ist } onChange={(e)=>{setEditItem(prev =>({...editItem, ist: e.target.value}))}}/>
          <LabelInput className='daylist-input' _key={key+"lb6"} title="Rest" placeholder={item.rest } onChange={(e)=>{setEditItem(prev =>({...editItem, rest: e.target.value}))}}/>
          <LabelTextInput className='daylist-input' _key={key+"lb7"} title="Notiz" placeholder={item.note } onChange={(value)=>{setEditItem(prev =>({...editItem, note: value}))}}/>
        </div>
        </div>
        )
    }
    else{
      return
    }

      
    })


  return (<>
  <Header title="Tagesliste"/>
  <div className='dateline-wrapper'>
    <DateLine onDateChange={(date) => setDate(date)}/>
  </div>
  <div className='daylist-wrapper'>
  
    
   {daylist.length? daylist : 
   <h3 className='ta-c'>Heute ist noch nichts geplant</h3>}
    
      <button key={"add"} className='daylist-btn' onClick={()=> setTogglePopup(!togglePopup)}>
        <SVGIcon  key={"add"} src={add} class="svg-icon-lg" />
      </button>
   

   {updLoading && <Loading />}

      {togglePopup && <ProductOrderPopup onClickAbort={()=>setTogglePopup(false)} onClickOK={(val)=>{setTogglePopup(val)}} defaultDate={date}/>}
    
  </div>
  </>
    
  )
}

export default Daylist