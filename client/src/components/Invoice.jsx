import React, {useEffect, useMemo, useRef, useState} from 'react'

import SVGIcon from '../components/SVG';
import trash from '../assets/icons/trash.svg'
import { DateLine } from './Calendar';

let editProds = []

export default function InvoiceNetto ({
    data,
    edit,
    invoiceID,
    productRef,
    toggleDelPrompt,
    taxData,
    handleValueChange

}) {
  

    let total_netto = 0
    editProds = data
    taxData.forEach(tax=>{
        total_netto = total_netto +  parseFloat(tax.total)
    })


    const items = data.map((product, key)=> {
        
    return(
        <div key={key+"li"} className='invoice-tb-row'>      
            <p key={key+"pos"} className='invoice-p'>{key+1}</p>
            <p key={key+"product"} className='invoice-p ta-s'>{product.product_name}</p>
            <p key={key+"amount"} className='invoice-p' >{product.amount+"x"}</p>
            <p key={key+"price_piece"} className='invoice-p' >{(product.price_piece? (product.price_piece.replace(".",",") ): "0,00") + "€"}</p>
            <p key={key+"price_total"} className='invoice-p'> {(product.price_total? (product.price_total.replace(".",",") ): "0,00") + "€"}</p>
        </div>        
        )
    })
    const editItems = data.map((product, key)=> {


        return(
          <div key={key+"div"} className=''>
          <div key={key+"li"} className='invoice-tb-row'>      
          <p key={key+"pos"} className='invoice-p'>{key+1}</p>
          <div><input key={key+"product_name"} className='invoice-name-input'defaultValue={product.product_name} onChange={(e)=>handleValueChange("product_name",e.target.value,product.ID)}></input></div>
          <div><input key={key+"amount"} className='invoice-amount-input'defaultValue={product.amount.toString().replace(".",",")} onChange={(e)=>handleValueChange("amount",e.target.value.toString().replace(",","."),product.ID)}></input>x</div>
          <div><input key={key+"price_piece"} className='invoice-price-input'defaultValue={(product.price_piece? product.price_piece.replace(".",",") : "0,00")} onChange={(e)=>handleValueChange("price_piece",e.target.value.replace(",","."),product.ID)}></input>€</div>
          <div><input key={key+"price_total"} className='invoice-price-input'defaultValue={(product.price_total? product.price_total.replace(".",",") : "0,00")} onChange={(e)=>handleValueChange("price_total",e.target.value.replace(",","."),product.ID)}></input>€</div>         
          </div>   
          <button key={key+"del"} className='edit-btn' onClick={()=>[toggleDelPrompt(true), productRef(product)]}><SVGIcon src={trash} class="svg-icon-sm"/> </button>
      </div>

        )
    })      

    return(
        data.length? 
        <div className='invoice-tb-tbody'>   
              <div className='invoice-tb-row'>
                <p className='invoice-tb-th'>Pos</p>
                <p className='invoice-tb-th ta-s'>Artikel</p>
                <p className='invoice-tb-th'>Anzahl</p>
                <p className='invoice-tb-th'>Einzelpreis</p>
                <p className='invoice-tb-th'>Summe Netto</p>
              </div>
              {(data && !edit) && items}
              {(data && edit) && editItems}
              <div>
              <div className='invoice-tb-row br-t-d'>
                <p className='invoice-p'></p>
                <p className='invoice-p ta-s'>Rechnungssumme netto</p>
                <p className='invoice-p'></p>
                <p className='invoice-p'></p>
                <p className='invoice-p'>{total_netto.toFixed(2).toString().replace('.',',')+"€"}</p>
              </div>
    </div>
        </div>
        : 
        <h4>Noch keine Produkte in der Bestellung</h4>)
}


export function InvoiceBrutto ({
    data,
    edit,
    invoiceID,
    productRef,
    toggleDelPrompt,
    taxData,
    handleValueChange


}) {

    let total_brutto = 0
    let total_netto = 0
    const sumTax =                
      taxData.map((obj, key)=>{
        total_brutto = total_brutto+parseFloat(obj.total)
        total_netto = total_netto+parseFloat(obj.total_netto)

        return(
      <div key={key+"tax"} className='invoice-tb-row'>
        <p className='invoice-p'></p>
        <p className='invoice-p ta-s'>{"inkl. MwSt: "+obj.tax+"%"}</p>
        <p className='invoice-p'></p>
        <p className='invoice-p'></p>
        <p className='invoice-p'></p>
        <p className='invoice-p'>{obj.total_tax.replace('.',',')+"€"}</p>
      </div>)
      })
    const items = data.map((product, key)=> {
    return(
        <div key={key+"li"} className='invoice-tb-row'>      
            <p key={key+"pos"} className='invoice-p'>{key+1}</p>
            <p key={key+"product"} className='invoice-p ta-s'>{product.product_name}</p>
            <p key={key+"delivery_date"} className='invoice-p ta-s'>{product.delivery_date}</p>
            <p key={key+"amount"} className='invoice-p' >{product.amount+"x"}</p>
            <p key={key+"price_piece"} className='invoice-p' >{(product.price_piece? (product.price_piece.replace(".",",") ): "0,00") + "€"}</p>
            <p key={key+"price_total"} className='invoice-p'> {(product.price_total? (product.price_total.replace(".",",") ): "0,00") + "€ ("+ product.tax + "%)"}</p>
        </div>        
        )
    })
    const editItems = data.map((product, key)=> {
        return(
        <div key={key+"div"} className=''>
            <div key={key+"li"} className='invoice-tb-row-edit'>      
            <p key={key+"pos"} className='invoice-p'>{key+1}</p>
            <div><input key={key+"product_name"} className='invoice-name-input'defaultValue={product.product_name} onChange={(e)=>handleValueChange("product_name",e.target.value,product.ID)}></input></div>
            <DateLine 
                defaultDay={(product.delivery_date != "00.00.00") && product.delivery_date && (product.delivery_date.replace(/(..).(..).(..)/, "20$3-$2-$1"))} 
                onDateChange={(val)=>handleValueChange("delivery_date",val,product.ID)}
                size="sm" 
                classDiv=""/>
            <div><input key={key+"amount"} className='invoice-amount-input'defaultValue={product.amount.toString().replace(".",",")} onChange={(e)=>handleValueChange("amount",e.target.value.toString().replace(",","."),product.ID)}></input>x</div>
            <div><input key={key+"price_piece"} className='invoice-price-input'defaultValue={(product.price_piece? product.price_piece.toString().replace(".",",") : "0,00")} onChange={(e)=>handleValueChange("price_piece",e.target.value.replace(",","."),product.ID)}></input>€</div>
            <div><input key={key+"price_total"} className='invoice-price-input'defaultValue={(product.price_total? product.price_total.toString().replace(".",",") : "0,00")} onChange={(e)=>handleValueChange("price_total",e.target.value.replace(",","."),product.ID)}></input>€</div>
            <div><input key={key+"price_tax"} className='invoice-price-input'defaultValue={(product.tax? product.tax.toString().replace(".",",") : "0")} onChange={(e)=>handleValueChange("tax",e.target.value.toString().replace(",","."),product.ID)}></input>%</div>
            </div>   
            <button key={key+"del"} className='edit-btn' onClick={()=>[toggleDelPrompt(true), productRef(product)]}><SVGIcon src={trash} class="svg-icon-sm"/> </button>
        </div>

        )
    })      

    return(
        data.length? 
        <div>
        <div className='invoice-tb-tbody'>   
        {edit?
              <div className='invoice-tb-row-edit'>
                <p className='invoice-tb-th'>Pos</p>
                <p className='invoice-tb-th'>Artikel</p>
                <p className='invoice-tb-th'>Lieferdatum</p>
                <p className='invoice-tb-th'>Anzahl</p>
                <p className='invoice-tb-th'>Einzelpreis</p>
                <p className='invoice-tb-th'>Summe Brutto</p>
                <p className='invoice-tb-th'>MwSt</p>
              </div>:
              <div className='invoice-tb-row'>
                <p className='invoice-tb-th'>Pos</p>
                <p className='invoice-tb-th'>Artikel</p>
                <p className='invoice-tb-th'>Lieferdatum</p>
                <p className='invoice-tb-th'>Anzahl</p>
                <p className='invoice-tb-th'>Einzelpreis</p>
                <p className='invoice-tb-th'>Summe Brutto (inkl. MwSt)</p>
              </div>}
              {(data && !edit) && items}
              {(data && edit) && editItems}

              <div className=''>
              <div className='invoice-tb-row br-t-d'>
                <p className='invoice-p'></p>
                <p className='invoice-p ta-s'>Rechnungssumme netto</p>
                <p className='invoice-p'></p>
                <p className='invoice-p'></p>
                <p className='invoice-p'></p>
                <p className='invoice-p'>{total_netto.toFixed(2).toString().replace('.',',')+"€"}</p>
              </div>
                           {
                taxData && sumTax
               }
              <div className='invoice-tb-row '>
                <p className='invoice-p'></p>
                <p className='invoice-p ta-s'>Rechnungssumme brutto</p>
                <p className='invoice-p'></p>
                <p className='invoice-p'></p>
                <p className='invoice-p'></p>
                <p className='invoice-p'>{total_brutto.toFixed(2).toString().replace('.',',')+"€"}</p>
              </div>

              </div>
        </div>
        </div>
        : 
        <h4>Noch keine Produkte in der Bestellung</h4>)
}