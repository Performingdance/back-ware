import React, { useEffect, useMemo, useRef, useState } from 'react'
import Header from '../components/Header'
import pencil_square from '../assets/icons/pencil-square.svg'
import x_circle from '../assets/icons/x-circle.svg'
import check from '../assets/icons/check-all.svg'
import trash from '../assets/icons/trash.svg'
import RecipeIng, { RecipeForm, RecipeIns } from '../components/Recipe';
import SVGIcon from '../components/SVG';
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';



function handleRecipeRequestByID(){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //api Ins req
  function handleRequest (ID) {
      setLoading(true)
      axios({
          axiosInstance: axios,
          method: "POST",
          url:"s/recipes/id",
          headers: {
              "authorization": authHeader()
          },
          data : {
              "ID": ID,
          }
      }).then((response)=>{
          setRes(response.data[0])
          //console.log(res);
      }).catch((err) => {
          setError(err)
          //console.log(err);
      })

      setLoading(false)
      
  }


  return [res, error, loading, handleRequest];
}



function Recipe() {
const [openTab, setOpenTab] = useState("forms")
  const [edit, setEdit] = useState(false);
  const ID = window.location.pathname.split(":")[1].split("#")[0]

  const [nameRes, setNameRes] = useState([])
  const [nameError, setNameError] = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [delRes, setDelRes] = useState([])
  const [delError, setDelError] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  function handleNameChange(value, recipeID){
    
    setNameLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/recipes/update",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "ID": recipeID,
                "name": value
            }
        }).then((response)=>{
            setNameRes(response.data)
            //console.log(res);
        }).catch((err) => {
            setNameError(err)
            //console.log(err);
        })
  
        setNameLoading(false)
        
  
  }
  function handleRecipeDelete(){
    
    setDelLoading(true)
    axios({
        axiosInstance: axios,
        method: "DELETE",
        url:"s/recipes/delete",
        headers: {
            "authorization": authHeader()
        },
        data : {
            "ID": ID,
        }
    }).then((response)=>{
        setDelRes(response.data)
        console.log(response.data);
        window.location.href = "/recipes";
    }).catch((err) => {
        setDelError(err)
        //console.log(err);
    })

    setDelLoading(false)
        
  
  }

  const [recipe, error, loading, handleRequest] = handleRecipeRequestByID()
  useEffect(()=>handleRequest(ID),[nameRes, ID]);

  let nameRef = useRef("")
  nameRef.current = recipe.name


  return (
    <>
    { 
    edit == false ? 
    [<Header key="header" title={nameRef.current}/>,
    <div key={"header_div"} className='header-edit-btns'>
      <button key={"edit"} className='header-edit-btn' onClick={()=>setEdit(true)}><SVGIcon src={pencil_square} class="svg-icon-md"/> </button> 
    </div>]:
    [<Header key="header_edit" />,
    <div key={"btns"} className='header-edit-btns'>
    <button key={"check"} className='header-edit-btn' onClick={()=>[setEdit(false), handleNameChange(nameRef.current, ID)]}><SVGIcon src={check} class="svg-icon-md"/> </button>
    <button key={"del"} className='header-edit-btn' onClick={()=>[setEdit(false), handleRecipeDelete(ID)]}><SVGIcon src={trash} class="svg-icon-md"/> </button>
    <button key={"abort"} className='header-edit-btn' onClick={()=>setEdit(false)}><SVGIcon src={x_circle} class="svg-icon-md"/> </button>
    </div>,
    <input key={"input"} className='header-edit-input' onChange={(e)=> {nameRef.current =(e.target.value)}} onKeyDown={(event)=>{if(event.key=="Enter"){[setEdit(false), handleNameChange(nameRef.current, recipe.ID)]}}} defaultValue={nameRef.current}></input>]}
    <div className='r-content'>
        <div className='r-header'>
            <a href='#' id='forms' onClick={()=>setOpenTab("forms")} className={openTab=="forms"? ' r-header-title button-hover': 'r-header-title' }>Formen</a> 
            <a href='#' id='ing' onClick={()=>setOpenTab("ing")} className={openTab=="ing"? ' r-header-title button-hover': 'r-header-title' }>Zutaten</a> 
            <a href='#' id='ins' onClick={()=>setOpenTab("ins")} className={openTab=="ins"? ' r-header-title button-hover': 'r-header-title' }>Anweisung</a>
        </div>

        {openTab == "ing" && <RecipeIng ID={ID} />}
        {openTab == "forms" && <RecipeForm ID={ID} recipeName={nameRef.current}/>}
        {openTab == "ins" && <RecipeIns ID={ID} />}
    </div>

    </>
  )
}

export default Recipe