import React, {useEffect, useMemo, useState} from 'react';
import '../styles/IngredientCard.css';
import SVGIcon from './SVG';
import pencil_square from '../assets/icons/pencil-square.svg'
import plus from "../assets/icons/plus.svg"
import handleInvoiceProdRequest from '../hooks/invoices/handleInvoiceProdRequest';



export default function invoiceCards ({
    invoice,
    onClickMore,
    onClickOrder,
    editID,
    editBtn
    }){
      const [products,prodError,prodLoading, handleProdRequest] = handleInvoiceProdRequest()

      useEffect(()=>{if(editID==invoice.ID && editBtn==1){
        handleProdRequest (invoice.ID)
      }},[editID])

      const productList = 
      products.map((product, key)=> {
          return(
            <li key={key+"li"} className='order-li'>
              <p key={key+"amount"} className='order-p'>{product.amount + "x"}</p>
              <p key={key+"product"} className='order-p'>{product.product_name}</p>              
            </li>
        
          )
      })
      
    return (
        <div className='client-card'>
        <div className='c-card'>
            <div className='c-title' >
              <h3>{invoice.name}</h3>
              <p>{invoice.company}</p>
              <p>#{invoice.invoice_number +(invoice.invoice_part != "0"? "-"+invoice.invoice_part : "")+ " (" + invoice.invoice_date + ")" }</p>
            </div>
            <div className='rc-btns' > 
              <a type="button" className='button rc-btn' onClick={onClickOrder}>
                <SVGIcon class="rc-btn-svg" src={plus}/> Produkte
              </a>
              <a type="button" className='button rc-btn ' onClick={onClickMore}>
                <SVGIcon class="rc-btn-svg" src={plus}/> Mehr
              </a>
              <a href={`/invoices/${invoice.ID}`} type="button" className='button rc-btn'>
                <SVGIcon class="rc-btn-svg" src={pencil_square}/>
              </a>
            </div>
    
        </div>
        {editID==invoice.ID && editBtn==1 && 
        <div className='c-card cc-order'>
           <ul className='product-list'>
           {prodError? prodError.message : 
           (products.length? productList :
           <p>noch keine Produkte</p>)
            }
           </ul>
        </div>}
        {editID==invoice.ID && editBtn==2 && 
        <div className=' c-card cc-more '>
          <div className='cc-more'>
            <div className='cc-address'>
              <ul className='cc-list'>
                <li>Nettosumme: {invoice.total_sum_netto != "0" && " "? invoice.total_sum_netto : "-"}</li>
                <li>Bruttosumme: {invoice.total_sum_brutto != "0" && " "? invoice.total_sum_brutto : "-"}</li>
                
              </ul>
            </div>
            <div className='cc-invoice'>
              <ul className='cc-list'>
                <li>Marge: {invoice.marge != "0" && " "? invoice.marge : "-"}</li>
                <li>bezahlt: {invoice.is_paid != null? "Ja" : "Nein"}</li>
              </ul>
            </div>
    
          </div>
        </div>}
    
        </div>
      )

}