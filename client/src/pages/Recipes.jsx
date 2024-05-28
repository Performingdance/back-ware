import React, {useEffect, useMemo, useState} from 'react';
import Header from '../components/Header';
import RecipeCard from '../components/RecipeCard';
import FloatIcon from '../components/FloatIcon';
import Searchbar_filter from '../components/Searchbar';
import handleRecipesRequest from '../hooks/handleRecipesRequest';
import Loading from '../components/Loading';






export default function Recipes() {

const [res, error, loading] =  handleRecipesRequest();
//console.log(res)
const [filteredData,setFilteredData] = useState(res);
useEffect(()=>setFilteredData(res),[res])

const recipeCards = filteredData.map((recipe) => {
  return (
  <RecipeCard href={`/recipes/${recipe.ID}`} key={recipe.ID} recipeID={recipe.ID} title={recipe.name}/> 
  )
  
  })
  return (
<>
  <Header title="Rezepte"/>
  <Searchbar_filter data={res} searchkey={"name"} filteredData={(searchData) => {setFilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>
  <div className='page-content'>
    {filteredData.length && !error && !loading? recipeCards: 
    <h1 className=''>Keine Rezepte verfügbar</h1>}
    {error && <h3> {error.message} </h3>}
    {loading && <Loading/>}
  </div>
  <FloatIcon/>
</>
  )
}
