import React, { useState } from 'react'
import Header from '../components/Header'



function Missing() {

  
  return (
    <div className='content'>
    <Header title="Seite nicht gefunden"/>
    
    <div>
      <h1 className='ta-c'>Die angeforderte Seite existiert nicht</h1>
    </div>
    </div>
  )
}

export default Missing