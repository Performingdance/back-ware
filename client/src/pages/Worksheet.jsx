import React, { useMemo, useState } from 'react'
import Header from '../components/Header'
import '../styles/Worksheet.css'
import { DateLine } from '../components/Calendar'
import handleWorksheetRequest from '../hooks/handleWorksheetRequest'
import WorksheetRecipes, { WorksheetBase } from '../components/Worksheets'
import Loading from '../components/Loading'

function Worksheet() {
  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today);
  const [openTab, setOpenTab] = useState("recipe");
  const [res, error, loading] = handleWorksheetRequest(date) ;


  return (<>
    <Header title="Backzettel"/>
    <div className='dateline-wrapper'>
    <DateLine onDateChange={(date) => setDate(date)}/>
    </div>

  <div className='r-content'>
    <div className='w-header'>
        <a href='#' id='recipe' onClick={()=> setOpenTab("recipe")} className='r-header-title'>Rezepte</a> 
        <a href='#' id='base' onClick={()=> setOpenTab("base")} className='r-header-title'>Grundteige</a> 
    </div>
    {loading ? <Loading /> : openTab == "recipe" && <WorksheetRecipes data={res} date={date} />}
    {loading ? <Loading /> : openTab == "base" && <WorksheetBase data={res} date={date}  />}
  </div>
    {/* 
  Rezepte:
      Käsekuchen
        -Hefeteig
        -...Zutaten
        Formen:
        2x 60x40 Blech
      Notiz
      
      Rosinenbrötchen
        -Hefeteig
        Formen:
        6x Brötchen, rund
      Notiz

      Olivenbaguette
        -Baguette
        -...Zutaten
        Formen:
        Baguette, 250g
        Baguette, 500g
      Notiz

  Grundteige:
    Hefeteig (gesamt)
     - ...Zutaten

     Rezepte:
     Käsekuchen
     Rosinenbrötchen

    Baguette (gesamt)
    - ...Zutaten

    Rezepte:
    Olivenbaguette
    */}
    
    </>
  )
}

export default Worksheet