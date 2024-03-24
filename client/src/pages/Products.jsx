import React, {useEffect, useMemo, useState} from 'react';
import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import FloatIcon from '../components/FloatIcon';
import Searchbar_filter from '../components/Searchbar';
import handleProductRequest from '../hooks/handleProductRequest';
import Loading from '../components/Loading';





export default function Recipes() {

const [res, error, loading] =  handleProductRequest();
//console.log(res)
const [filteredData,setFilteredData] = useState(res);
useEffect(()=>setFilteredData(res),[res])

const productCards = filteredData.map((product,key) => {
  return (
  <ProductCard   
  key={key}
  href={`/recipes/edit:${product.recipeID}`} 
  recipeID={product.recipeID} 
  recipeName={product.recipeName}
  productName={product.product_name}
  productID={product.ID}
  formID={product.formID}
  formName={product.formName}
  img={product.img}
  /> 
  )
  
  })
  return (
<>
  <Header title="Produkte"/>
  <Searchbar_filter data={res} searchkey={"product_name"} searchkey2={"recipe_name"} filteredData={(searchData) => {setFilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>
  <div className='page-content'>
    {filteredData.length && !error && !loading? productCards: 
    <h1 className=''>Keine Produkte verfügbar</h1>}
    {error && <h3> {error.message} </h3>}
    {loading && <Loading/>}
  </div>
  <FloatIcon/>
</>
  )
}
