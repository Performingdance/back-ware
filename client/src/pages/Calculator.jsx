import Header from '../components/Header'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import Bvp, { Nutri } from '../components/Calculator'
import {SelectComponent} from '../components/Searchbar'
import handleRecipesRequest from '../hooks/handleRecipesRequest'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import handleRecipeProductsRequest from '../hooks/handleRecipeProductsRequest'
import handleProductRequest from '../hooks/handleProductRequest'

function handleBvpRequest(productID){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(()=>handleRequest(), [productID])

  if(productID == -1){
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
        "productID": productID,
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
function handleServingRequest(recipeID,productID){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(()=>handleRequest(), [productID])

  if((productID == -1)||(recipeID == -1)){
    return [res, error, loading]
  }
  function handleRequest(){
  setLoading(true);
  axios({
    axiosInstance: axios,
    method: "post",
    url:"s/calc/nutri/product",
    headers: {
      "authorization": authHeader()
    },
    data:{
        "recipeID": recipeID,
        "productID": productID
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
    const [productOpen, setProductOpen] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(-1)
    const [selectedProductId, setSelectedProductId] = useState(-1)
    const [products, productsError,productsLoading] = handleProductRequest();
    const [bvpData, bvpError, bvpLoading] = handleBvpRequest(selectedProductId);
    const [ingData, ingError, ingLoading] = handleIngRequest(selectedRecipeId);
    const [nutriData, nutriError, nutriLoading] = handleNutriRequest(selectedRecipeId);
    const [servingData, servingError, servingLoading] = handleServingRequest(selectedRecipeId, selectedProductId);

    

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
    id ="products"
    onSelect={(val)=>{editRef.current=val}}
    editref={editRef.current}
    options={products}
    onChange={(item) =>[setSelectedProductId(item), setSelectedRecipeId(item != ""? products.forEach((product)=>{if(product.ID == item){return product.recipeID}}):-1)]}
    selectedID={selectedProductId}
    placeholder='Produkt wählen'
    open={productOpen}
    setOpen={(bol)=>setProductOpen(bol)}
    className='i-select' 
    type='text' 
    /> 
    </div>
    {selectedProductId == -1 ? "":
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