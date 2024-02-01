import React, { useMemo, useRef, useState } from 'react';
import LabelBox from './LabelBox';
import SVGIcon from './SVG';
import caret_right from '../assets/icons/caret-right.svg';
import check from '../assets/icons/check.svg';
import square from '../assets/icons/square.svg';
import check_all from '../assets/icons/check-all.svg';
import '../styles/Worksheet.css';
import handleDaylistFormRequest from '../hooks/handleDaylistFormRequest';
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';






                /* {
            "ID": 5,
            "date": "2023-02-01T23:00:00.000Z",
            "recipeID": 1,
            "recipe_mass": "7.950",
            "ing_mass": "0.056",
            "base_ID": 0,
            "base_ingID": 32,
            "base_recipeID": 1,
            "base": 0,
            "titleID": 1,
            "sortID": null,
            "level": 1,
            "is_checked": null,
            "recipeName": "Weizenvorteig 1050",
            "ingName": "Hefe",
            "title": "Vorteig"
        } */


function IngList ({
    ingBase,
    data, 
    level,
    setLevel,
    recipeID,
    onClick

}) {
    const [checkedRes, setCheckedRes] = useState([])
    const [checkedError, setCheckedError] = useState("");
    const [checkedBaseRes, setCheckedBaseRes] = useState([])
    const [checkedBaseError, setCheckedBaseError] = useState("");


    function handleIsChecked(item, val){
       // console.log(item)

            const handleRequest = ()=>{
    
                axios({
                  axiosInstance: axios,
                  method: "put",
                  url:"s/worksheet/checked",
                  headers: {
                    "authorization": authHeader()
                  },
                  data:{
                     "itemID" : item.ID,
                     "is_checked": val
                  },
                }).then(function (response){
                  //console.log(response.data);
                  setCheckedRes(response.data)
        
              
              
                }).catch(function (error) {
                  console.log(error.message);
                  setCheckedError(error.message)
        
                })
              }
              handleRequest()
                return [checkedRes, checkedError]

        //API worksheet/checked

    
           
    }

        function handleIsCheckedSection(recipeID, titleID, val, date){
    
        //API worksheet/checked/base
        // un-/check all base ing WHERE recipeID  = item.recipeID && base_recipeID = item.ID

    
        const handleRequest = ()=>{
    
            axios({
              axiosInstance: axios,
              method: "put",
              url:"s/worksheet/checked/section",
              headers: {
                "authorization": authHeader()
              },
              data:{
                 "titleID" : titleID,
                 "recipeID" : recipeID,
                 "date": date,
                 "is_checked": val
              },
            }).then(function (response){
              //console.log(response.data);
              setCheckedBaseRes(response.data)
              data.forEach(item => { 
                if(item.recipeID == recipeID && item.titleID == titleID){
                   item.is_checked= val  
                }
                
                
              });
          
          
            }).catch(function (error) {
              console.log(error.message);
              setCheckedBaseError(error.message)
    
            })
          }
          handleRequest()
            return [checkedBaseRes, checkedBaseError]
        
    }


    console.log(data)
    let _titleID = 1
    const [ingBase_2,setIngBase_2] = useState(ingBase)
    const ingList = 
        data.map((item, key)=>{
            if(item.recipeID == recipeID){
                const sectionTitle = ( (item.titleID != _titleID)) &&
                <div key={key+"section_title_wrapper"} className='w-ing-title'>
                <LabelBox key={key+"title"} className="w-section-title" key_={key} title="Abschnitt" text={item.title}  />
                <p></p>
                <p></p>
                <button onClick={()=>{handleIsCheckedSection(recipeID, item.titleID, !item.is_checked, item.date)}}>
                                {item.is_checked ? <SVGIcon src={check_all} class="svg-icon-sm" />:
                                <SVGIcon src={square} class="svg-icon-sm" />}
                </button>
                </div>
                _titleID=item.titleID

                return(
                    <div key={key+"ingList-wrapper"}>
                        {sectionTitle}
                    {item.level == 1 &&
                    <div key={key+"ingList"} className='w-ing-title'>
                        {item.base == 1 ?
                            <button className='w-ext-btn button' onClick={()=>{
                                if(ingBase_2 != item.ID){ onClick(2, item.ID), setIngBase_2(item.ID)
                                }else{
                                    onClick(1, ingBase), setIngBase_2(ingBase)
                                }}} >
                                <SVGIcon src={caret_right} class="svg-icon-sm" /> 
                            </button> :
                        <p></p>
                        }
                        <LabelBox key={key+"ingName"} key_={key} title="Zutat" text={item.ingName}/>
                        <LabelBox key={key+"ingAmount"} key_={key} title="Menge" text={(item.ing_mass || 0) + " kg"}/>
                        <div className='w-check-box'>
                            <button onClick={()=>{handleIsChecked(item, !item.is_checked), item.is_checked= !item.is_checked}}>
                                {item.is_checked ? <SVGIcon src={check} class="svg-icon-sm" />:
                                <SVGIcon src={square} class="svg-icon-sm" />}
                            </button>
                        </div>
                    </div> }
                    { (level >= 2 && item.ID == ingBase_2) &&
                    <BaseIng
                    data={data} 
                    recipeID={recipeID} 
                    level = {level}
                    setLevel = {()=>setLevel}
                    ingBase_2={item.ID}
                    onClick={onClick}/> 
                    }
                    </div>)}})

    



    

function BaseIng({
    data,
    level,
    setLevel,
    recipeID,
    onClick,
    ingBase_2
}){
    const [ingBase_3,setIngBase_3] = useState(ingBase_2)
    //console.log( "level " + level +"(2)")
    return(

    data.map((item, key)=>{

        if(recipeID == item.recipeID && level >= 2){
            return(
                <div key={key+"sub-div"}>            
                {item.level == 2 &&
                <div key={key+"ingList"} className='w-ing-title-sub'> 
                    {item.base == 1 ? 
                            <button className='w-ext-btn button' onClick={()=>{
                                if(ingBase_3 != item.ID){ onClick(3, item.ID), setIngBase_3(item.ID)
                                }else{
                                    onClick(2, ingBase_2), setIngBase_3(ingBase_2)
                                }}} >
                                <SVGIcon src={caret_right} class="svg-icon-sm" /> 
                            </button> :
                        <p></p>
                    }
                    <LabelBox key={key+"ingName"} key_={key} title="Zutat" text={item.ingName}/>
                    <LabelBox key={key+"ingAmount"} key_={key} title="Menge" text={(item.ing_mass || 0) + " kg"}/>
                    <div key={key+"ingCheckDiv"} className='w-check-box'>
                        <button key={key+"ingCheck"} onClick={()=>{handleIsChecked(item, !item.is_checked), item.is_checked= !item.is_checked}}>
                                {item.is_checked ? <SVGIcon src={check} class="svg-icon-sm" />:
                                <SVGIcon src={square} class="svg-icon-sm" />}
                        </button>
                    </div>
                </div> }
                { (level >= 3 && item.ID == ingBase_3) &&
                <BaseIng_2
                data={data} 
                recipeID={recipeID} 
                level = {level}
                setLevel = {setLevel}
                ingBase_3={item.ID}
                onClick={onClick}/> 
                }
                
            </div>)
        
       
    }else{
        return
    }
})
    )
}
function BaseIng_2({
    data,
    level,
    recipeID,
    onClick,
    ingBase_3
}){
    const [ingBase_4,setIngBase_4] = useState(ingBase_3)
    //console.log( "level " + level +"(3)")


    return(
    data.map((item, key)=>{
        if(recipeID == item.recipeID && level >= 3){
            return(
                <div key={key+"sub-div"}>            
                {item.level == 3 &&
                <div key={key+"ingList"} className='w-ing-title-sub_2'> 
                    {item.base == 1 ? 
                            <button className='w-ext-btn button' onClick={()=>{
                                if(ingBase_4 != item.ID){ onClick(4, item.ID), setIngBase_4(item.ID)
                                }else{
                                    onClick(3, ingBase_3), setIngBase_4(ingBase_3)
                                }}} >
                                <SVGIcon src={caret_right} class="svg-icon-sm" /> 
                            </button> :
                        <p></p>
                    }
                    <LabelBox key={key+"ingName"} key_={key} title="Zutat" text={item.ingName}/>
                    <LabelBox key={key+"ingAmount"} key_={key} title="Menge" text={(item.ing_mass || 0) + " kg"}/>
                    <div className='w-check-box'>
                        <button onClick={()=>{handleIsChecked(item, !item.is_checked), item.is_checked= !item.is_checked}}>
                            {item.is_checked ? <SVGIcon src={check} class="svg-icon-sm" />:
                            <SVGIcon src={square} class="svg-icon-sm" />}
                        </button>
                    </div>
                </div> }
                { (level >= 4 && item.ID == ingBase_4) &&
                <BaseIng_3
                data={data} 
                recipeID={recipeID} 
                level = {level}
                setLevel = {setLevel}
                ingBase_4={item.ID}
                onClick={onClick}/> 
                }
                
            </div>)
        
       
    }else{
        return
    }
})
    )
}
function BaseIng_3({
    data,
    level,
    recipeID,
    ingBase_4,
    onClick
}){
    const [ingBase_5,setIngBase_5] = useState(ingBase_4)

    return(
    data.map((item, key)=>{
        if(recipeID == item.recipeID && 4 >= level){
            return(
                <div key={key+"sub-div"}>            
                {item.level == 4 &&
                <div key={key+"ingList"} className='w-ing-title-sub_3'> 
                    {item.base == 1 ? 
                            <button className='w-ext-btn button' onClick={()=>{
                                if(ingBase_4 != item.ID){ onClick(5, item.ID), setIngBase_5(item.ID)
                                }else{
                                    onClick(4, ingBase_4), setIngBase_5(ingBase_4)
                                }}} >
                                    <SVGIcon src={caret_right} class="svg-icon-sm" /> 
                            </button> :
                        <p></p>
                    }
                    <LabelBox key={key+"ingName"} key_={key} title="Zutat" text={item.ingName}/>
                    <LabelBox key={key+"ingAmount"} key_={key} title="Menge" text={(item.ing_mass || 0) + " kg"}/>
                    <div className='w-check-box'>
                        <button onClick={()=>{handleIsChecked(item, !item.is_checked), item.is_checked= !item.is_checked}}>
                            {item.is_checked ? <SVGIcon src={check} class="svg-icon-sm" />:
                            <SVGIcon src={square} class="svg-icon-sm" />}
                        </button>
                    </div>
                </div> }
                
            </div>)
        
       
    }else{
        return
    }
})
    )
}

return(
    ingList
    )
}
function FormList({
    data,
    recipeID
}){
    
    let forms = data.map((form, key)=>{
        if(form.recipeID == recipeID){
            return(
                <div key={key+"form-div"} className='w-formList-div'>
                    <p key={key+"form-name"} className='lb-text'>{form.name}</p>
                    <p key={key+"form-amount"} className='lb-text'>{parseInt(form.amount) + "x"}</p>
                    {form.bruch && <LabelBox key={key+"lb-bruch"} key_={key+"lb-bruch"} title={"Bruch"} text={form.bruch} />}
                </div>
                
            )
        }
    })
    return(
        <>
            <p key={"form-title"} className='lb-title'>Form</p>
            {forms}
        </>
    )
        


}
    
export default function WorksheetRecipes({
    data,
    date

}) {
    let _recipeID = 0
    let levelRef = useRef(1)
    const [ingBase,setIngBase] = useState(0)
    const [daylistForms,errorForms, loadingForms] = handleDaylistFormRequest(date);
    const [checkedRecipeRes, setCheckedRecipeRes] = useState([])
    const [checkedRecipeError, setCheckedRecipeError] = useState("");
    
    function handleIsCheckedRecipe(recipeID, val){
        //API worksheet/checked/recipe
        // un-/check all base ing WHERE recipeID 
        const handleRequest = ()=>{
    
            axios({
              axiosInstance: axios,
              method: "put",
              url:"s/worksheet/checked/recipe",
              headers: {
                "authorization": authHeader()
              },
              data:{
                 "recipeID" : recipeID,
                 "date": date,
                 "is_checked": val
              },
            }).then(function (response){
              //console.log(response.data);
              setCheckedRecipeRes(response.data)
              data.forEach(item => { 
                if(item.recipeID == recipeID){
                    item.is_checked= val 
                }
                
                
              });
          
            }).catch(function (error) {
              console.log(error.message);
              setCheckedRecipeError(error.message)
    
            })
          }
          handleRequest()
            return [checkedRecipeRes, checkedRecipeError]

        
    }

    const recipeList = 

    data.map((item, key)=>{
        if(item.recipeID != _recipeID){
            _recipeID = item.recipeID
            return(
                <div key={key+"recipeList"} className='w-recipe-wrapper'>
                    <div className='w-recipe-title-div'>
                        <LabelBox key={key+"recipeName"} key_={key} title="Rezept" text={item.recipeName}/>
                        <p></p>
                        <LabelBox key={key+"ingAmount"} key_={key} title="Gesamt" text={(item.recipe_mass || 0) + " kg"}/>
                        <button onClick={()=>{handleIsCheckedRecipe(item.recipeID, !item.is_checked), item.is_checked= !item.is_checked}}>
                            {item.is_checked ? <SVGIcon src={check_all} class="svg-icon-sm" />:
                            <SVGIcon src={square} class="svg-icon-sm" />}
                        </button>
                    </div>
                    <FormList key={key+"FormName"} data={daylistForms} recipeID={item.recipeID}/>
                    {item.note ? <LabelBox key={key+"lb-note"} key_={key+"lb-note"} title={"Notiz"} text={item.note} /> :                
                    <LabelBox key={key+"lb-note"} key_={key+"lb-note"} title={"Notiz"} text={"-"} />}                

                    <IngList
                        key={key+"ingList"}
                        ingBase={0}
                        data={data} 
                        level={levelRef.current}
                        recipeID={item.recipeID} 
                        onClick={(level, baseID)=>{levelRef.current = level, setIngBase(baseID)}}
                    /> 
                    
                </div>   
                )            
        }else{
            return
        }
        
    })
    
    
  return (
    <div key="wrapper" className='worksheet-wrapper jc-c'>
        {recipeList.length ? 
        recipeList :
        <h1 className=''>Heute ist noch nichts geplant</h1>
        }
    </div>
  )
}


export function WorksheetBase({
    data,
    date
}) {
    let _recipeID = 0
    let levelRef = useRef(1)
    const [ingBase,setIngBase] = useState(0)
    const [daylistForms,errorForms, loadingForms] = handleDaylistFormRequest(date);

    const recipeList = <div>WorksheetBase</div>
    
    
  return (
    <div key="wrapper" className='worksheet-wrapper'>
        {recipeList}
    </div>
  )
}
