import React, {useEffect, useMemo, useState} from 'react'
import Header from '../components/Header'
import Searchbar_filter from '../components/Searchbar'
import IngredientCard from '../components/IngredientCard'
import FloatIcon from '../components/FloatIcon'
import handleIngExtRequest from '../hooks/handleIngExtRequest'
import Loading from '../components/Loading'
//Temp


function Ingredients() {
  const [res, err, loading] = handleIngExtRequest()
  const [filteredData,setFilteredData] = useState(res)
  //console.log(res)
  useEffect(()=>setFilteredData(res),[res])

  const ingredientCards = filteredData.map((ingredient, key) =>{ 
  return (
  <IngredientCard key={key} data={ingredient} />
  )
  })

  return (
    <>
    <Header title="Zutaten"/>
    <Searchbar_filter data={res} searchkey={"name"} filteredData={(searchData) => {setFilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>

    <div key={"pageC"} className='page-content'>

    {filteredData.length && !err && !loading? ingredientCards: 
    <h1 className=''>Keine Zutaten verfügbar</h1>}
    {err && <h3> {err.message} </h3>}
    {loading && <Loading/>}


    </div>
    <FloatIcon/>
    </>
  )
}

export default Ingredients