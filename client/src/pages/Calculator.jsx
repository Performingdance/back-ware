import Header from '../components/Header'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import Bvp, { Nutri } from '../components/Calculator'
import {SelectComponent} from '../components/Searchbar'
import handleRecipesRequest from '../hooks/handleRecipesRequest'
import handleRecipeFormRequest from '../hooks/handleRecipeFormRequest'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';

function handleBvpRequest(recipeID, formID){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(()=>handleRequest(), [formID])

  if(formID == -1){
    return [res, error, loading]
  }
  function handleRequest(){
  setLoading(true);
  axios({
    axiosInstance: axios,
    method: "post",
    url:"s/calc/bvp",
    headers: {
      "authorization": authHeader()
    },
    data:{
        "recipeID": recipeID,
        "formID": formID
    },
  }).then(function (response){
    //console.log(response.data);
    setRes(response.data)
    setLoading(false);


  }).catch(function (error) {
    console.log(error.message);
    setError(error.message)
    setLoading(false);
  })
}

  return [res, error, loading]
}
function handleNutriRequest(recipeID){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(()=>handleRequest(), [recipeID])

  if(recipeID == -1){
    return [res, error, loading]
  }
  function handleRequest(){
  setLoading(true);
  axios({
    axiosInstance: axios,
    method: "post",
    url:"s/calc/nutri",
    headers: {
      "authorization": authHeader()
    },
    data:{
        "recipeID": recipeID
    },
  }).then(function (response){
    //console.log(response.data);
    setRes(response.data)
    setLoading(false);


  }).catch(function (error) {
    console.log(error.message);
    setError(error.message)
    setLoading(false);
  })
}

  return [res, error, loading]
}
function handleServingRequest(recipeID, formID){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(()=>handleRequest(), [formID])

  if(formID == -1){
    return [res, error, loading]
  }
  function handleRequest(){
  setLoading(true);
  axios({
    axiosInstance: axios,
    method: "post",
    url:"s/calc/nutri/form",
    headers: {
      "authorization": authHeader()
    },
    data:{
        "recipeID": recipeID,
        "formID": formID
    },
  }).then(function (response){
    //console.log(response.data);
    setRes(response.data)
    setLoading(false);


  }).catch(function (error) {
    console.log(error.message);
    setError(error.message)
    setLoading(false);
  })
}

  return [res, error, loading]
}
function handleIngRequest(recipeID){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(()=>handleRequest(), [recipeID])

  if(recipeID == -1){
    return [res, error, loading]
  }
  function handleRequest(){
  setLoading(true);
  axios({
    axiosInstance: axios,
    method: "post",
    url:"s/calc/ing",
    headers: {
      "authorization": authHeader()
    },
    data:{
        "recipeID": recipeID
    },
  }).then(function (response){
    //console.log(response.data);

    setRes(response.data)
    setLoading(false);


  }).catch(function (error) {
    console.log(error.message);
    setError(error.message)
    setLoading(false);
  })
}

  return [res, error, loading]
}
function Calculator({

}) {
    const [openTab, setOpenTab] = useState("bvp")
    let editRef = useRef("")
    const [recipeOpen, setRecipeOpen] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(-1)
    const [selectedFormId, setSelectedFormId] = useState(-1)
    const [recipes, rError, rLoading] = handleRecipesRequest();
    const [forms, formsError,formsLoading] = handleRecipeFormRequest (selectedRecipeId);
    const [bvpData, bvpError, bvpLoading] = handleBvpRequest(selectedRecipeId, selectedFormId);
    const [ingData, ingError, ingLoading] = handleIngRequest(selectedRecipeId);
    const [nutriData, nutriError, nutriLoading] = handleNutriRequest(selectedRecipeId);
    const [servingData, servingError, servingLoading] = handleServingRequest(selectedRecipeId, selectedFormId);

    let ingredients = ingData.map((ing, key)=>{
      if(ingData.length == key){
        ing.name = ing.name.slice(0,ing.name.length -2)
      }
      if(ing.base == 0){
        return(<p key={"ing_p"+key} className='ing_p'>{ing.name}</p>)
      }
      else{
        return (<p key={"ing_p"+key} className='ing_b'>{ing.name}</p>)
      }
      
    })

   


  return (
    <div className='content'>
    <Header title="Preisrechner"/>

    <div className='calc-header'>
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
    
    {(selectedRecipeId != -1) && (selectedRecipeId != "") && <SelectComponent
    id ="forms"
    onSelect={(val)=>{editRef.current=val}}
    editref={editRef.current}
    options={forms}
    onChange={(item) =>{setSelectedFormId(item)}}
    selectedID={selectedFormId}
    placeholder='Form wählen'
    open={formOpen}
    setOpen={(bol)=>setFormOpen(bol)}
    className='i-select' 
    type='text' 
    /> }
    </div>
    {selectedRecipeId == -1 ? "":
    <div className='calc-header'>
        <a id='bvp' onClick={()=>setOpenTab("bvp")} className={openTab=="bvp"? 'r-header-title button-hover' : 'r-header-title'}>Kosten</a> 
        <a id='nutri' onClick={()=>setOpenTab("nutri")} className={openTab=="nutri"? 'r-header-title button-hover' : 'r-header-title'}>Nährwerte</a>
    </div>}

    <div className='calc-content'>
      {((openTab == "bvp") && bvpData.length) ? <Bvp data={bvpData[0]} />:"" }
      {(openTab == "nutri" && servingData.length && nutriData.length)? <Nutri nutriData={nutriData[0]} servingData={servingData[0]} ingData={ingredients} />:"" }
    </div>
</div>

  )
}

export default Calculator