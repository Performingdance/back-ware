import Header from '../components/Header'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import Bvp, { Nutri } from '../components/Calculator'
import {SelectComponent} from '../components/Searchbar'
import handleRecipesRequest from '../hooks/handleRecipesRequest'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import handleProductRequest from '../hooks/handleProductRequest'
import handleBvpRequest from '../hooks/calculator/handleBvpRequest'
import handleNutriRequest from '../hooks/calculator/handleNutriRequest'
import handleProdIngRequest from '../hooks/calculator/handleProdIngRequest'
import handleServingRequest from '../hooks/calculator/handleServingRequest'
  

  



function Calculator({

}) {
    const [openTab, setOpenTab] = useState("bvp")
    const[idUpdate, setIdUpdate] = useState(-1)
    let editRef = useRef("")
    const [productOpen, setProductOpen] = useState(false);
    const [selectedRecipeId, setSelectedRecipeId] = useState(-1)
    const [selectedProductId, setSelectedProductId] = useState(-1)
    const [products, productsError,productsLoading] = handleProductRequest();
    const [bvpData, bvpError, bvpLoading, bvpRequest] = handleBvpRequest();
    const [ingData, ingError, ingLoading, ingRequest] = handleProdIngRequest();
    const [nutriData, nutriError, nutriLoading, nutriRequest] = handleNutriRequest();
    const [servingData, servingError, servingLoading, servingRequest] = handleServingRequest();
   
    //console.log(selectedProductId, selectedRecipeId)

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
function handleProductChange(productID){
  let _recipeID
  if((productID > -1)&&(productID != "")){
    products.forEach((product)=>{
      if(product.ID == productID){
        _recipeID = product.recipeID}
    })
    bvpRequest(productID)
    ingRequest(_recipeID)
    nutriRequest(_recipeID)
    servingRequest(_recipeID, productID)
    setSelectedRecipeId(_recipeID)
    setSelectedProductId(productID)
  }else{
    return
  }


}
   


  return (
    <div className='content'>
    <Header title="Preisrechner"/>

    <div className='calc-header'>

    <SelectComponent
    id ="products"
    onSelect={(val)=>{editRef.current=val}}
    editref={editRef.current}
    options={products}
    onChange={(item) =>handleProductChange(item)}
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