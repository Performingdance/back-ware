import React, {useEffect, useMemo, useRef, useState} from 'react'
import Header from '../components/Header'
import '../styles/IngredientCard.css'
import handleIngIDRequest from '../hooks/ingredients/handleIngIDRequest'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import pencil_square from '../assets/icons/pencil-square.svg'
import x_circle from '../assets/icons/x-circle.svg'
import check from '../assets/icons/check-all.svg'
import trash from '../assets/icons/trash.svg'
import SVGIcon from '../components/SVG';
import { PromptPopup } from '../components/Popup';


function EditIng  () {

    const ingID = window.location.pathname.split("/")[2]
    const [togglePrompt, setTogglePrompt] = useState(false)

    const [res, err, loading] = handleIngIDRequest(ingID);
    const [ingExt, setIngExt] = useState(res)

    useEffect(()=>setIngExt(res),[res])
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);


    const ingredient =  ingExt.map((ing)=>{
      return(
        
        
        <div key={ing.ID} className='ingredient-card jc-c'>
          <ul key={ing.ID + "ul"} className='c-list'>
              <li key={ing.ID + "li_1"} className='c-list-item'>Bezeichnung: </li>
              <input key={ing.ID + "in_1"} className='c-list-item' type='text' onChange={(e)=> [handleValueChange("name", e.target.value)]} defaultValue={ing.name || "-"}></input>
              <li key={ing.ID + "li_2"} className='c-list-item'>Lieferant: </li>
              <input key={ing.ID + "in_2"} className='c-list-item' type='text' onChange={(e)=> handleValueChange("source", e.target.value)} defaultValue={ing.source|| "-"}></input>
              <li key={ing.ID + "li_3"} className='c-list-item'>Allergen: </li>
              <input key={ing.ID + "in_3"} className='c-list-item' type='text' onChange={(e)=> handleValueChange("allergen", e.target.value)} defaultValue={ing.allergen|| "-"}></input>
              <li key={ing.ID + "li_4"} className='c-list-item'>Preis: </li>
              <input key={ing.ID + "in_4"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("price", e.target.value)} placeholder={ing.price+"€" || "- €"}></input>
              <li key={ing.ID + "li_5"} className='c-list-item'>Preis/KG: </li>
              <input key={ing.ID + "in_5"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("priceKG", e.target.value)} placeholder={ing.priceKG+"€"|| "- €"}></input>
              <li key={ing.ID + "li_6"} className='c-list-item'>Packungsgröße (KG): </li>
              <input key={ing.ID + "in_6"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("amount", e.target.value)} placeholder={ing.amount+"kg" || "-kg"}></input>
              <li key={ing.ID + "li_7"} className='c-list-item'>kJ: </li>
              <input key={ing.ID + "in_7"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("kj", e.target.value)} placeholder={ing.kj || "-"}></input>
              <li key={ing.ID + "li_8"} className='c-list-item'>kcal: </li>
              <input key={ing.ID + "in_8"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("kcal", e.target.value)} placeholder={ing.kcal|| "-" }></input>
              <li key={ing.ID + "li_9"} className='c-list-item'>Protein: </li>
              <input key={ing.ID + "in_9"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("protein", e.target.value)} placeholder={ing.protein +"g"|| "-"}></input>
              <li key={ing.ID + "li_10"} className='c-list-item'>Kohlenhydrate: </li>
              <input key={ing.ID + "in_10"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("carbs", e.target.value)} placeholder={ing.carbs+"g" || "-"}></input>
              <li key={ing.ID + "li_11"} className='c-list-item'>dav. Zucker: </li>
              <input key={ing.ID + "in_11"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("sugar", e.target.value)} placeholder={ing.sugar+"g" || "-"}></input>
              <li key={ing.ID + "li_12"} className='c-list-item'>Fett: </li>
              <input key={ing.ID + "in_12"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("fat", e.target.value)} placeholder={ing.fat+"g" || "-"}></input>
              <li key={ing.ID + "li_13"}className='c-list-item'>ges. Fettsäuren: </li>
              <input key={ing.ID + "in_13"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("sat_fat", e.target.value)} placeholder={ing.sat_fat+"g" || "-"}></input>
              <li key={ing.ID + "li_14"} className='c-list-item'>Ballaststoffe: </li>
              <input key={ing.ID + "in_14"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("fibres", e.target.value)} placeholder={ing.fibres+"g" || "-"}></input>
              <li key={ing.ID + "li_15"} className='c-list-item'>Salz: </li>
              <input key={ing.ID + "in_15"} className='c-list-item' type='number' onChange={(e)=> handleValueChange("salt", e.target.value)} placeholder={ing.salt+"g" || "-"}></input>
              
              <button onClick={(e)=>handleSubmit(e)} className='edit-btn button'  type='button'>Speichern</button>
              <button onClick={(e)=>setTogglePrompt(true)} className='edit-btn button'  type='button'>Löschen</button>

            </ul>
        </div>
  
    
    )})


    
    //
    const handleValueChange = (obj, val) =>  {
      let data = ingExt
      if(obj == "price"){
        const _priceKG = val/data.amount
        data.priceKG = _priceKG;
        data = ({...data, price : val, priceKG : _priceKG});

      }
      if(obj == "amount"){
        const _priceKG = data.price/val
        data.priceKG = _priceKG;
        data = ({...data, amount : val, priceKG : _priceKG});
      }else{
        data = ({...data, obj : val});
      }
      setIngExt([data]);
      //console.log(data)
      return
    }
    const handleSubmit = (e) =>{
      e.preventDefault()
      // update ing by id
              //console.log(res)
              axios({
                  axiosInstance: axios,
                  method: "PUT",
                  url:"s/ing/update",
                  headers: {
                      "authorization": authHeader()
                  }, 
                  data:{
                     name : ingExt.name,
                     allergen : ingExt.allergen,
                     source : ingExt.source,
                     amount : ingExt.amount,
                     price : ingExt.price,
                     priceKG : ingExt.priceKG,
                     kj : ingExt.kj,
                     kcal : ingExt.kcal,
                     protein : ingExt.protein,
                     carbs : ingExt.carbs,
                     sugar : ingExt.sugar,
                     fat : ingExt.fat,
                     sat_fat : ingExt.sat_fat,
                     fibres : ingExt.fibres,
                     salt : ingExt.salt,
                     ID : ingExt.ID
                  }
              }).then((response)=>{
                //console.log(response)
                window.location.href = "/ingredients"

              }).catch((err) => {
                  console.log(err);
                  return

              })

    };
    
    function handleIngDelete(ID){
    
      setDelLoading(true)
      axios({
          axiosInstance: axios,
          method: "DELETE",
          url:"s/ing/delete",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "ID": ID,
          }
      }).then((response)=>{
          setDelRes(response.data)
          console.log(response.data);
          window.location.href = "/ingredients";
      }).catch((err) => {
          setDelError(err)
          //console.log(err);
      })
  
      setDelLoading(false)
          
    
    }
    //console.log(ingExt[0].name)
  return (
    <div className='edit-card'>
    
    <Header key="header" title={ingExt[0].name? ingExt[0].name :"-"}/>
    {togglePrompt ? <PromptPopup 
        title={ingExt[0].name? ingExt[0].name + " löschen?" :"Zutat löschen?"} 
        btnOk="OK" 
        btnAbort="Abbrechen"
        onClickAbort={()=>setTogglePrompt(false)} 
        onClickOK={()=>handleIngDelete()}
        message= {delError? delError : " "}
        /> 
    : " "}
    {ingredient}
   
    </div>
  )
}

export default EditIng