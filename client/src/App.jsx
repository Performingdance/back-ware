import React, { Component, useState } from 'react';
import './index.css';

import Orders from './pages/Orders';
import Recipes from './pages/Recipes';
import Invoices from './pages/Invoices';
import Clients from './pages/Clients';
import Ingredients from './pages/Ingredients';
import Forms from './pages/Forms';
import Daylist from './pages/Daylist';
import Archives from './pages/Archives';
import Home from './pages/Home';
import Settings from './pages/Settings';
import EditIng from './pages/EditIng';
import EditRecipe from './pages/EditRecipe';
import EditClient from './pages/EditClient';
import Worksheet from './pages/Worksheet';
import Calculator from './pages/Calculator';
import EditOrder from './pages/EditOrder';
import EditInvoice from './pages/EditInvoice';
import Account from './pages/Account';
import Products from './pages/Products';
import Missing from './pages/Missing';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './services/auth/PrivateRoute';
import AuthProvider from './services/auth/AuthProvider'
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';





function App() {
  
  let CurrentPage = Home;

  if(window.location.pathname.includes( `/ingredients/edit:` )){
    CurrentPage = EditIng
  }
  if(window.location.pathname.includes( `/recipes/edit:` )){
    CurrentPage = EditRecipe
  }  
  if(window.location.pathname.includes( `/clients/edit:` )){
    CurrentPage = EditClient
  }
  if(window.location.pathname.includes( `/orders/edit:` )){
    CurrentPage = EditOrder
  }
  if(window.location.pathname.includes( `/invoices/edit:` )){
    CurrentPage = EditInvoice
  }
  

  const [open, setOpen] = useState(false);

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
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/products' element={<Products />} />
          <Route path='/forms' element={<Forms />} />
          <Route path='/archives' element={<Archives />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/account' element={<Account />} />
          <Route path='/daylist' element={<Daylist />} />
          <Route path='/worksheet' element={<Worksheet />} />
          <Route path='/calculator' element={<Calculator />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/orders/:id' element={<EditOrder/>} />
          <Route path='/invoices' element={<Invoices />} />
          <Route path='/invoices/:id' element={<EditInvoice/>} />
          <Route path='/ingredients' element={<Ingredients />} />
          <Route path='/ingredients/:id' element={<EditIng/>} />
          <Route path='/recipes' element={<Recipes />} />
          <Route path='/recipes/:id' element={<EditRecipe/>} />
          <Route path='/clients' element={<Clients />} />
          <Route path='/clients/:id' element={<EditClient/>} />


        </Route>
       

        {/* catch all */}
        <Route path='*' element={<Missing />} />
      </Route>
   </Routes>
    </AuthProvider>
  
  
  )

}




export default App
