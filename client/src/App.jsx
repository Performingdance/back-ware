import React, { Component, useState } from 'react';
import './index.css';


import Account from './pages/Account';
import Archives from './pages/Archives';
import Calculator from './pages/Calculator';
import Clients from './pages/Clients';
import Daylist from './pages/Daylist';
import EditClient from './pages/EditClient';
import EditIng from './pages/EditIng';
import EditInvoice from './pages/EditInvoice';
import EditOrder from './pages/EditOrder';
import EditRecipe from './pages/EditRecipe';
import Forms from './pages/Forms';
import Home from './pages/Home';
import Ingredients from './pages/Ingredients';
import Invoices from './pages/Invoices';
import Orders from './pages/Orders';
import Products from './pages/Products';
import Recipes from './pages/Recipes';
import Settings from './pages/Settings';
import TimeSheets from './pages/TimeSheets';
import Worksheet from './pages/Worksheet';

import Missing from './pages/Missing';

import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './services/auth/PrivateRoute';
import AuthProvider from './services/auth/AuthProvider'
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';





function App() {

  return (
    <AuthProvider>
 <Routes>
  <Route path="/" element={<Layout/>} >
        {/* public Routes */}
        <Route path='/home' element={<Home />} />
        <Route path='/' element={<Home />} />
        <Route path='/missing' element={<Missing />} />

        {/* protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path='/account' element={<Account />} />
          <Route path='/archives' element={<Archives />} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/clients/:id' element={<EditClient/>} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/ingredients' element={<Ingredients />} />
          <Route path='/ingredients/:id' element={<EditIng/>} />
          <Route path='/invoices' element={<Invoices />} />
          <Route path='/invoices/:id' element={<EditInvoice/>} />          <Route path='/forms' element={<Forms />} />
          <Route path='/daylist' element={<Daylist />} />
          <Route path='/worksheet' element={<Worksheet />} />
          <Route path='/calculator' element={<Calculator />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/:id' element={<EditOrder/>} />
          <Route path='/products' element={<Products />} />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/recipes/:id' element={<EditRecipe/>} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/timeSheets' element={<TimeSheets />} />
          


        </Route>
       

        {/* catch all */}
        <Route path='*' element={<Missing />} />
      </Route>
   </Routes>
    </AuthProvider>
  
  
  )

}




export default App
