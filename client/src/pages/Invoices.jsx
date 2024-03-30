import React, { useEffect, useMemo, useState } from 'react'
import Header from '../components/Header'
import handleInvoiceRequest from '../hooks/handleInvoiceRequest'
import InvoiceCards from '../components/InvoiceCards'
import Loading from '../components/Loading'
import FloatIcon from '../components/FloatIcon'
import Searchbar_filter from '../components/Searchbar'

function Invoices() {

  const [invoices, err, loading, handleRequest] = handleInvoiceRequest()
  useEffect(()=>handleRequest(),[])

  const [filteredData,setFilteredData] = useState(invoices)
  useEffect(()=>setFilteredData(invoices),[invoices])

  const [editID, setEditID] = useState(0)
  const [editBtn, setEditBtn] = useState(0)
  const [_editBtn, set_EditBtn] = useState(0)

  function handleToggleEditID (ID) {


    if((editID==ID && editBtn == _editBtn)){
      setEditID(false)
      set_EditBtn(editBtn) 
    }else(
      setEditID(ID),
      set_EditBtn(editBtn) 
    )

    //console.log (_editBtn)
  } 

  const invoiceCards = filteredData.map((invoice, key) =>{ 
  if(!filteredData.length){
    return
  }
  else{
    return (
      <InvoiceCards key={key} invoice={invoice} onClickOrder={() => [ setEditBtn(1), handleToggleEditID(invoice.ID)]} onClickMore={() => [ setEditBtn(2),handleToggleEditID(invoice.ID)]} editID={editID} editBtn={editBtn} />
      )
  } 

  })

  return (

    <>
    <Header title="Rechnungen"/>
    <Searchbar_filter data={invoices} searchkey={"fullName"} searchkey2={"company"} filteredData={(searchData) => {setFilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>

    <div key={"pageC"} className='page-content'>

    {filteredData.length && !err && !loading? invoiceCards: 
    <h1 className=''>Keine Rechnungen verfügbar</h1>}
    {err && <h3> {err.message} </h3>}
    {loading && <Loading/>}

    </div>
    <FloatIcon/>
    </>
    
  )
}

export default Invoices