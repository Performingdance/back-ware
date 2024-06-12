import React, { useEffect, useMemo, useState } from 'react'
import '../styles/Calculator.css'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import handlePriceListSugRequest from '../hooks/calculator/handlePriceListRequest';
import errorHandling from '../services/errorHandling';


// // BVP Rechner 
// req = {
//     "recipeID": 4,
//     "formID": 13
// }
// res = [
//     {
//         "ID": 30,
//         "recipeID": 4,
//         "formID": 13,
//         "formweight": "0.360",
//         "img": "default",
//         "worktime": "0.02",
//         "workamount": "1.00",
//         "vkp_netto": "2.10",
//         "priceKG": "0.20",
//         "bk": 1.4,
//         "mk_preisniveau": 1,
//         "rg": "40",
//         "mk": 0.072,
//         "sk": 1.4720000000000002,
//         "mwst": 0.07,
//         "nvp": 2.0608000000000004,
//         "bvp": 2.2050560000000003
//     }
// ]




export default function Bvp({
  data
}) {
  const productID = data.ID
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editPriceList, setEditPriceList] = useState([]);
  const [priceList, priceError, priceLoad, handlePriceRequest] = handlePriceListSugRequest()
  useEffect(()=>handlePriceRequest(productID),[])
  useEffect(()=>setEditPriceList(priceList), []);
  //console.log(data)
  function handlePriceValueChange(margeID, val) {
    let temp_priceList = editPriceList
    for(let i = 0; i < temp_priceList.length; i++){
        if(temp_priceList[i].margeID == margeID){
          temp_priceList[i].price = val
        }
    }

  
    setEditPriceList(temp_priceList)
    return 
  }
  function handleVkpValueChange(val){
    data.vkp_netto = val.replace(",",".")
  }
  // // BVP Rechner 
// req = {
//     "recipeID": 4,
//     "formID": 13
// }
// res = [
//     {
//         "ID": 30,
//         "recipeID": 4,
//         "formID": 13,
//         "formweight": "0.360",
//         "img": "default",
//         "worktime": "0.02",
//         "workamount": "1.00",
//         "vkp_netto": "2.10",
//         "priceKG": "0.20",
//         "bk": 1.4,
//         "mk_preisniveau": 1,
//         "rg": "40",
//         "mk": 0.072,
//         "sk": 1.4720000000000002,
//         "mwst": 0.07,
//         "nvp": 2.0608000000000004,
//         "bvp": 2.2050560000000003
//     }
// ]

function handlePriceSubmit() {
    if(!productID || (productID == -1)){
      return
  }
  let temp_priceList = editPriceList
  for(let i = 0; i < temp_priceList.length; i++){
        temp_priceList[i].price = temp_priceList[i].price.replace(",",".")
      
  }
  const handleRequest = ()=>{
    setLoading(true);
    axios({
      axiosInstance: axios,
      method: "PUT",
      url:"s/recipes/form/update/calc_prices",
      headers: {
        "authorization": authHeader()
      },
      data:{
          "productID": data.ID,
          "vkp_netto": data.vkp_netto,
          "price_list": temp_priceList
      },
    }).then(function (response){
      //console.log(response.data);
      setRes({message:"Erfolgreich gespeichert"})
      setLoading(false);
  
  
    }).catch(function (error) {
      errorHandling(err)
      console.log(error.message);
      setError(error.message)
      setLoading(false);
    })
  }
  handleRequest()
  return [res, error, loading]
}
let editPriceListInputs = []
if(priceList.length > 0){
    editPriceListInputs = priceList.map((obj, key) =>
    {return(
        [<p key={"title_price" + key}>{obj.name}</p>,
        <div key={"priceTip_div" + key} className='d-il'>
        <input key={"price_edit" + key} className='bvp-price' onChange={(e)=>handlePriceValueChange( obj.margeID, e.target.value)} defaultValue={obj.price.replace(".", ",") || "0,00"}></input>
        <p key={"priceTip" + key} className='bvp-price-tip'>{"(" + (obj.priceTip? obj.priceTip: "-") + ")"}</p>
        </div>]
       )
    })
}
  return (
    <div className='bvp-wrapper'>
      <div className='bvp-table'>
          <p>MK</p>
          <p>{data.mk? data.mk.replace(".",",") : "0,00"}€</p>
          <p className='border-b'>BK</p>
          <p className='border-b'>{data.bk ? data.bk.replace(".",",") : "0,00"}€</p>
          <p>SK</p>
          <p>{data.sk ? data.sk.replace(".",",") : "0,00"}€</p>
          <p className='border-b'>RG</p>
          <p className='border-b'>{data.rg ? data.rg.replace(".",",") :"0,00"}%</p>
          <p>NVP</p>
          <p>{data.nvp ? data.nvp.replace(".",",") : "0,00"}€</p>
          <p className='border-b'>MwST</p>
          <p className='border-b'>{data.mwst? data.mwst.replace(".",",") : "0,00"}%</p>
          <p>BVP</p>
          <p>{data.bvp? data.bvp.replace(".",",") : "0,00"}€</p>
          <p className='bvp-price'>gesetzter NVP</p>
          <input className='bvp-price-first' defaultValue={data.vkp_netto ? data.vkp_netto.replace(".",","): "0,00"} onChange={(e)=>handleVkpValueChange(e.target.value)}></input>
          {editPriceListInputs? editPriceListInputs : ""}
          
      </div>
      <button className='submit_btn' onClick={()=>handlePriceSubmit()}>Speichern</button>
          {res.message && <h5 className='successMsg'>{res.message}</h5>}
      
    </div>
  )
}

// // nutritions
// req = {
//     "recipeID": 4
// }
// res = [
//     {
//         "ID": 104,
//         "name": "Käsekuchen",
//         "allergen": "Gluten, Laktose",
//         "source": null,
//         "amount": "1.00",
//         "price": "0.20",
//         "priceKG": "0.20",
//         "date": "2023-02-17T23:00:00.000Z",
//         "kj": "52.74",
//         "kcal": "12.60",
//         "protein": "1.63",
//         "carbs": "0.47",
//         "sugar": "0.46",
//         "fat": "0.66",
//         "sat_fat": "0.34",
//         "fibres": "0.01",
//         "salt": "0.02",
//         "recipeID": 4
//     }
// ]
// // nutritions Pro Stück
// req = {
//     "recipeID": 1,
//     "formID": 14
// }
// res = [
//     {
//         "ID": 105,
//         "name": "Weizenvorteig 1050",
//         "allergen": "Gluten",
//         "source": null,
//         "formweight": "0.410",
//         "formID": 14,
//         "price": "0.54120",
//         "date": "2023-02-17T23:00:00.000Z",
//         "kj": "1.00040",
//         "kcal": "0.23780",
//         "protein": "0.04920",
//         "carbs": "0.00410",
//         "sugar": "0.00000",
//         "fat": "0.00410",
//         "sat_fat": "0.00000",
//         "fibres": "0.02050",
//         "salt": "0.00000"
//     }
// ]
// // Inhaltsstoffe

// req = {
//     "recipeID": 1
// }
// res = "Weizenmehl Type 1050 (44.70%): Wasser (31.30%): Hefe (1.60%)"


export function Nutri({
  servingData = servingData || [],
  nutriData = nutriData || [],
  ingData = ingData || []
}) {
    return (
      <div className='nutri-wrapper'>
        <div className='nutri-table'>
          <h4>Nährwerte</h4> 
          <h4>pro 100g</h4>
          <h4>pro Stück ({servingData.formweight}g)</h4>

          <p>Brennwert</p>
          <p>{nutriData.kj ? (nutriData.kj +" kJ/" + nutriData.kcal + " kcal") : "- kJ/ - kcal"} </p>
          <p>{servingData.kj? (servingData.kj +" kJ/" +servingData.kcal + " kcal") : "- kJ/ -kcal"} </p>
          <p>Protein</p>
          <p>{nutriData.protein ? (nutriData.protein +" g") : "- g"} </p>
          <p>{servingData.protein? (servingData.protein +" g") : "- g"} </p>
          <p>Kohlenhydrate</p>
          <p>{nutriData.carbs ? (nutriData.carbs +" g") : "- g"} </p>
          <p>{servingData.carbs? (servingData.carbs +" g") : "- g"} </p>
          <p>davon Zucker</p>
          <p>{nutriData.sugar ? (nutriData.sugar +" g") : "- g"} </p>
          <p>{servingData.sugar? (servingData.sugar +" g") : "- g"} </p>
          <p>Fett</p>
          <p>{nutriData.fat ? (nutriData.fat +" g") : "- g"} </p>
          <p>{servingData.fat? (servingData.fat +" g") : "- g"} </p>
          <p>gesättigte Fettsäuren</p>
          <p>{nutriData.sat_fat ? (nutriData.sat_fat +" g") : "- g"} </p>
          <p>{servingData.sat_fat? (servingData.sat_fat +" g") : "- g"} </p>
          <p>Ballaststoffe</p>
          <p>{nutriData.fibres ? (nutriData.fibres +" g") : "- g"} </p>
          <p>{servingData.fibres? (servingData.fibres +" g") : "- g"} </p>
          <p>Salz</p>
          <p>{nutriData.salt ? (nutriData.salt +" g") : "- g"} </p>
          <p>{servingData.salt? (servingData.salt +" g") : "- g"} </p>
        </div>
        <div className='nutri-ing'>
          <h4>Zutaten</h4>
          {ingData}
          <h4>Allergene:</h4>
          <p>{nutriData.allergen}</p>
        </div>
      </div>
    )
  }
  
