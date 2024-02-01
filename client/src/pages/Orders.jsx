import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Searchbar_filter from '../components/Searchbar'
import FloatIcon from '../components/FloatIcon.jsx'
import handleOrderRequest from '../hooks/handleOrderRequest.js'
import { OrderCard } from '../components/OrderCard.jsx'
import handleOrderIngRequest from '../hooks/handleOrderIngRequest.js'
// temp 


  

function Orders() {
  const [orders, error, loading] = handleOrderRequest();
  const [filteredData,setfilteredData] = useState([])
  useEffect(()=> setfilteredData(orders), [orders])
  const [editID, setEditID] = useState(0)
  const [editBtn, setEditBtn] = useState(0)
  const [_editBtn, set_EditBtn] = useState(0)
  const [products, proError, proLoading] = handleOrderIngRequest(editID);


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
    <OrderCard onClickInv={() => [ setEditBtn(1), handleToggleEditID(order.ID)]} onClickMore={() => [ setEditBtn(2),handleToggleEditID(order.ID)]} products={products} editID={editID} editBtn={editBtn} key={order.ID} data={order} />
  )
  });

  return (
    <div className='page-content'>
    <Header title="Bestellungen"/>
    <Searchbar_filter data={orders} searchkey={"order_date"} searchkey2={"client"} filteredData={(searchData) => {setfilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>
    {orderCards}
    <FloatIcon/>
    </div>

  )
}

export default Orders