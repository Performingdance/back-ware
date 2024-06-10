import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Searchbar_filter from '../components/Searchbar'
import FloatIcon from '../components/FloatIcon.jsx'
import handleOrderRequest from '../hooks/orders/handleOrderRequest.js'
import { OrderCard } from '../components/OrderCard.jsx'
import handleOrderProdRequest from '../hooks/orders/handleOrderProdRequest.js'
import { AddInvoicePopup } from '../components/Popup.jsx'
// temp 


  

function Orders() {
  const [orders, error, loading] = handleOrderRequest();
  const [filteredData,setfilteredData] = useState([])
  useEffect(()=> setfilteredData(orders), [orders])
  const [editID, setEditID] = useState(0)
  const [editBtn, setEditBtn] = useState(0)
  const [_editBtn, set_EditBtn] = useState(0)
  const [products, proError, proLoading] = handleOrderProdRequest(editID);
  const [editOrder, setEditOrder] = useState({})
  let editInvoiceId = -1
  const [newInvoicePrompt, setNewInvoicePrompt] = useState(false)
  

  function handleToggleEditID (ID) {


    if((editID==ID && editBtn == _editBtn)){
      setEditID(-1)
      set_EditBtn(editBtn) 
    }else(
      setEditID(ID),
      set_EditBtn(editBtn) 
    )

    //console.log (_editBtn)
  } 


  const orderCards = filteredData.map((order) =>{

    //console.log(editID)
  
  return (
    <OrderCard onClickInv={() => [setEditOrder(order), setNewInvoicePrompt(true)]} onClickMore={() => [ setEditBtn(2),handleToggleEditID(order.ID)]} products={products} editID={editID} editBtn={editBtn} key={order.ID} data={order} />
  )
  });

  return (
    <div className='page-content'>
    <Header title="Bestellungen"/>
    <Searchbar_filter data={orders} searchkey={"order_date"} searchkey2={"client"} filteredData={(searchData) => {setfilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>
    {orderCards}
    {newInvoicePrompt &&
                  <AddInvoicePopup
                  title={"neue Rechung"}
                  forwardEdit={true}
                  defaultClientID={editOrder.clientID || -1}
                  defaultClientName={editOrder.client}
                  defaultOrderID={editOrder.ID}
                  defaultOrderName={editOrder.ID? "#"+ editOrder.ID +" "+ (editOrder.client? editOrder.client : " ") :"# - "}          
                  onClickOK={()=>{setNewInvoicePrompt(false)}}
                  onClickAbort={()=>setNewInvoicePrompt(false)} />}
    <FloatIcon/>
    </div>

  )
}

export default Orders