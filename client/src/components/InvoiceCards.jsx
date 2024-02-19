// [
//     {
//         "ID": 2,
//         "clientID": 3,
//         "invoice_number": 101,
//         "invoice_date": "2023-03-18T00:00:00.000Z",
//         "total_sum_netto": null,
//         "total_sum_brutto": null,
//         "is_paid": null,
//         "margeID": 1
//     },
//     {
//         "ID": 3,
//         "clientID": 4,
//         "invoice_number": 102,
//         "invoice_date": "2023-03-18T00:00:00.000Z",
//         "total_sum_netto": null,
//         "total_sum_brutto": null,
//         "is_paid": null,
//         "margeID": 1
//     },
//     {
//         "ID": 4,
//         "clientID": 2,
//         "invoice_number": 103,
//         "invoice_date": "2023-03-18T00:00:00.000Z",
//         "total_sum_netto": null,
//         "total_sum_brutto": null,
//         "is_paid": null,
//         "margeID": 2
//     }
// ]

import React, {useEffect, useMemo, useState} from 'react';
import '../styles/IngredientCard.css';
import '../styles/InvoiceCard.css';
import SVGIcon from './SVG';
import pencil_square from '../assets/icons/pencil-square.svg'
import plus from "../assets/icons/plus.svg"



export default function invoiceCards ({
    data: invoice,
    onClickMore,
    onClickOrder
    }){
    return (
        <div className='client-card'>
        <div className='c-card'>
            <div className='c-title' >
              <h3>{invoice.name}</h3>
              <p>{invoice.company}</p>
              <p>#{invoice.invoice_number}</p>
              <p>#{invoice.invoice_date}</p>
            </div>
            <div className='rc-btns' > 
              <a type="button" className='button rc-btn' onClick={onClickOrder}>
                <SVGIcon class="rc-btn-svg" src={plus}/> Bestellung
              </a>
              <a type="button" className='button rc-btn ' onClick={onClickMore}>
                <SVGIcon class="rc-btn-svg" src={plus}/> Mehr
              </a>
              <a href={`/clients/edit:${client.ID}`} type="button" className='button rc-btn'>
                <SVGIcon class="rc-btn-svg" src={pencil_square}/>
              </a>
            </div>
    
        </div>
        {editID==invoice.ID && editBtn==1 && 
        <div className='c-card cc-order'>
           <ul className='product-list'>
           {orders.length && orderList}
           </ul>
        </div>}
        {editID==client.ID && editBtn==2 && 
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
                <li>Marge: {client.marge != "0" && " "? client.marge : "-"}</li>
              </ul>
            </div>
    
          </div>
        </div>}
    
        </div>
      )

}