import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import ClientCard from '../components/ClientCard'
import Searchbar_filter from '../components/Searchbar'
import handleClientRequest from '../hooks/clients/handleClientRequest'
import FloatIcon from '../components/FloatIcon.jsx'
// temp 



function Clients() {
  const [clients, error, loading, handleRequest] = handleClientRequest();
  useEffect(()=>handleRequest(),[])
  const [filteredData,setfilteredData] = useState([])
  useEffect(()=> setfilteredData(clients), [clients])
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


  const clientCards = filteredData.map((client) =>{

    //console.log(editID)
  
  return (
    <ClientCard onClickOrder={() => [ setEditBtn(1), handleToggleEditID(client.ID)]} onClickMore={() => [ setEditBtn(2),handleToggleEditID(client.ID)]} editID={editID} editBtn={editBtn} key={client.ID} client={client} />
  )
  });

  return (
    <div className='page-content'>
    <Header title="Kunden"/>
    <Searchbar_filter data={clients} searchkey={"fullName"} searchkey2={"company"} filteredData={(searchData) => {setfilteredData(searchData)}} class="searchbar-header" btn_class="searchbar-btn" input_class="searchbar-input"/>
    {clientCards}
    <FloatIcon/>
    </div>

  )
}

export default Clients