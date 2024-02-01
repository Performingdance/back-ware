import React, { useState } from 'react'
import Header from '../components/Header'
import Login from '../components/_tests_/Login'

function Home() {
  return (
    <div className='content'>
    <Header title="Übersicht"/>
    <Login />
    </div>
  )
}

export default Home