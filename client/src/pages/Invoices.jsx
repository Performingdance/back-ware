import React, { useMemo } from 'react'
import Header from '../components/Header'
import handleInvoiceRequest from '../hooks/handleInvoiceRequest'
import InvoiceCards from '../components/InvoiceCards'
import Loading from '../components/Loading'
import Searchbar_filter from '../components/Searchbar'

function Invoices() {

  const [invoices, error, loading, handleRequest] = handleInvoiceRequest()
  useMemo(()=>handleRequest(),[])

  const [filteredData,setFilteredData] = useState(invoices)
  //console.log(res)
  useEffect(()=>setFilteredData(invoices),[invoices])

  const invoiceCards = filteredData.map((invoice, key) =>{ 
  return (
  <InvoiceCards key={key} invoice={invoice} />
  )
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