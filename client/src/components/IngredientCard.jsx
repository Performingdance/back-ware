import React, {useEffect, useMemo, useState} from 'react';
import '../styles/IngredientCard.css';
import SVGIcon from './SVG';
import pencil_square from '../assets/icons/pencil-square.svg'
import plus from "../assets/icons/plus.svg"

export default function IngredientCard({
  data
}) {
    const [priceOpen, setPriceOpen] = useState(false);
    const [nutriOpen, setNutriOpen] = useState(false);
  return (
    
    <div key={data.ID + "i-c"} className='ingredient-card'>
    <div key={data.ID + "ic"}  className='ic-card'>
        
        <div key={data.ID + "ic-title"} className='ic-title' >
          <h3 key={data.ID + "ic-name"} className='ic-name'>{data.name}</h3>
        </div>
        <div key={data.ID + "ic-btns"} className='rc-btns' >
          <a key={data.ID + "ic-plus"} type="button" className='button rc-btn' onClick={()=>[ setPriceOpen(!priceOpen), setNutriOpen(false)]}>
            <SVGIcon key={data.ID + "price-icon"} class="rc-btn-svg" src={plus}/>Preis
          </a>
          <a key={data.ID + "ic-btn"} type="button" className='button rc-btn ' onClick={()=>[ setNutriOpen(!nutriOpen), setPriceOpen(false)]}>
            <SVGIcon key={data.ID + "nutri-icon"} class="rc-btn-svg" src={plus}/>Nährwerte
          </a>
          <a key={data.ID + "ic-pen"} href={`/ingredients/${data.ID}`} type="button" className='button rc-btn'>
            <SVGIcon key={data.ID + "pen-icon"} class="rc-btn-svg" src={pencil_square}/>
          </a>
        </div>
    </div>
    {priceOpen &&
    <div key={data.ID + "ic-price"} className='ic-price'>
        <tr key={data.ID + "price-ul"}  className='ic-list'>
            <td key={data.ID + "price-li_1"} className='ic-list-item'>Preis: </td>
            <td key={data.ID + "price-li_2"} className='ic-list-item'>Preis/KG: </td>
            <td key={data.ID + "price-li_3"} className='ic-list-item'>Packungsmenge: </td>
            <td key={data.ID + "price-li_4"} className='ic-list-item'>Lieferant: </td>
        </tr>
        <tr key={data.ID + "price-ul_2"} className='ic-list'>
            <td key={data.ID + "price-li_5"} className='ic-list-item'>{data.price != " " ? data.price +"€" : "-"}</td>
            <td key={data.ID + "price-li_6"} className='ic-list-item'>{data.priceKG != " " ? data.priceKG +"€": "-"}</td>
            <td key={data.ID + "price-li_7"} className='ic-list-item'>{data.amount != " " ? data.amount : "-"}</td>
            <td key={data.ID + "price-li_8"} className='ic-list-item'>{data.source != (" " && 0) ? data.source : "-"}</td>
        </tr>

    </div>}
    {nutriOpen &&
    <div key={data.ID + "ic-nutri"} className='ic-nutri'>
        <tr key={data.ID + "nutri-ul"} className='ic-list'>
            <td key={data.ID + "nutri-li_1"} className='ic-list-item'>Allergen: </td>
            <td key={data.ID + "nutri-li_2"} className='ic-list-item'>kJ: </td>
            <td key={data.ID + "nutri-li_3"} className='ic-list-item'>kcal: </td>
            <td key={data.ID + "nutri-li_4"} className='ic-list-item'>Protein: </td>
            <td key={data.ID + "nutri-li_5"} className='ic-list-item'>Kohlenhydrate: </td>
            <td key={data.ID + "nutri-li_6"} className='ic-list-item'>dav. Zucker: </td>
        </tr>
        <tr key={data.ID + "nutri-ul_2"} className='ic-list'>
            <td key={data.ID + "nutri-li_7"} className='ic-list-item'>{data.allergen != "" ? data.allergen : "-"}</td>
            <td key={data.ID + "nutri-li_8"} className='ic-list-item'>{data.kj != " " ? data.kj : "-"}</td>
            <td key={data.ID + "nutri-li_9"} className='ic-list-item'>{data.kcal != " " ? data.kcal : "-"}</td>
            <td key={data.ID + "nutri-li_10"} className='ic-list-item'>{data.protein != " " ? data.protein +"g" : "-"}</td>
            <td key={data.ID + "nutri-li_11"} className='ic-list-item'>{data.carbs != " " ? data.carbs +"g": "-"}</td>
            <td key={data.ID + "nutri-li_12"} className='ic-list-item'>{data.sugar != " " ? data.sugar +"g": "-"}</td>
        </tr>
        <tr key={data.ID + "nutri-ul_3"} className='ic-list'>
            <td key={data.ID + "nutri-li_13"} className='ic-list-item'>Fett: </td>
            <td key={data.ID + "nutri-li_14"} className='ic-list-item'>ges. Fettsäuren: </td>
            <td key={data.ID + "nutri-li_15"} className='ic-list-item'>Ballaststoffe: </td>
            <td key={data.ID + "nutri-li_16"} className='ic-list-item'>Salz: </td>
        </tr>
        <tr key={data.ID + "nutri-ul_4"} className='ic-list'>
            <td key={data.ID + "nutri-li_17"} className='ic-list-item'>{data.fat != " " ? data.fat +"g" : "-"}</td>
            <td key={data.ID + "nutri-li_18"} className='ic-list-item'>{data.sat_fat != " " ? data.sat_fat +"g" : "-"}</td>
            <td key={data.ID + "nutri-li_19"} className='ic-list-item'>{data.fibres != " " ? data.fibres +"g" : "-"}</td>
            <td key={data.ID + "nutri-li_20"} className='ic-list-item'>{data.salt != " " ? data.salt +"g" : "-"}</td>
        </tr>

    </div>}
    </div>

  )
}
