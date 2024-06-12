import React, { useRef, useMemo, useState, useEffect } from 'react'
import '../styles/Recipe.css'
import SVGIcon from './SVG'
import pencil_square from '../assets/icons/pencil-square.svg'
import x_circle from '../assets/icons/x-circle.svg'
import check from '../assets/icons/check-all.svg'
import plus from '../assets/icons/plus.svg'
import camera from '../assets/icons/camera.svg'
import trash from '../assets/icons/trash.svg'
import { SelectComponent} from './Searchbar'
import calcHeight from '../hooks/utility/handleResize'
import handleFormRequest from '../hooks/recipes/handleFormRequest'
import handleRecipeFormRequest from '../hooks/recipes/handleRecipeFormExtRequest'
import handleRecipeIngRequest from '../hooks/recipes/handleRecipeIngRequest'
import handleIngAllRequest from '../hooks/ingredients/handleIngAllRequest'
import axios from '../apis/backWare';
import authHeader from '../services/auth-header';
import handlePriceListRequest from '../hooks/products/handlePriceListRequest'
import { RecipeFormPopup } from './Popup'
import { FileUploadPopUp } from './PhotoUpload'
import config from '../config.json'
import errorHandling from '../services/errorHandling'

const BASE_URL_IMG_API = config.BASE_URL_IMG_API

// recipes/ins/id
function handleInsRequest(recipeID, edit, addRes, delRes){
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    //api Ins req
    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/recipes/ins/id",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "recipeID": recipeID,
            }
        }).then((response)=>{
            setRes(response.data)
            //console.log(res);
        }).catch((err) => {
            errorHandling(err)
            setError(err)
            //console.log(err);
        })

        setLoading(false)
        
    }
        useEffect(()=>handleRequest(),[recipeID, edit,addRes, delRes]);


    return [res, error, loading];
}
// recipes/ing/id



export function RecipeForm({
    ID,
    recipeName
}) {

    const [edit, setEdit] = useState(false);
    let editImg
    const [toggleNewForm, setToggleNewForm] = useState(false);
    const [editForm, setEditForm] = useState({});
    const [editPriceList, setEditPriceList] = useState([]);
    const [selectedOption, setSelectedOption] = useState(-1);
    const [togglePrices, setTogglePrices] = useState(-1)
    const [toggleUploadPrompt, setToggleUploadPrompt]= useState(false)

    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [all_forms, errForms, loadingForms] = handleFormRequest() ;
    const [formsUpdate, setFormsUpdate] = useState(-1)
    const [forms, errForm, loadingForm] = handleRecipeFormRequest(ID, formsUpdate);
    const [priceList, priceError, priceLoad, handlePriceRequest] = handlePriceListRequest()


    useEffect(()=>setEditPriceList(priceList), [togglePrices])




    function handleFormValueChange(obj, val) {
        let temp_form = editForm
        temp_form = {...temp_form, [obj]: val}

        //console.log(temp_form)
        setEditForm(temp_form)
        return 
    }
    function handlePriceValueChange(margeID, val) {
        let temp_priceList = editPriceList
        for(let i = 0; i < temp_priceList.length; i++){
            if(temp_priceList[i].margeID == margeID){
              temp_priceList[i].price = val
            }
        }

        //console.log(temp_form)
        setEditPriceList(temp_priceList)
        return 
    }
    function handleFormValueReset(){
        setEditForm( 
            {
                "ID":"",
                "recipeID":  ID,
                "formID": "",
                "product_name": "",
                "formweight": "",
                "worktime": "",
                "workamount": "",
                "vkp_netto": "",
                "tax": ""

            })
        

    }
    function handleFormEditSubmit(productID){
        if(!productID || (productID == -1)){
            return
        }
        // api update recipeForm
        let temp_priceList = editPriceList
        for(let i = 0; i < temp_priceList.length; i++){
              temp_priceList[i].price = temp_priceList[i].price.replace(",",".")
            
        }
        function handleRequest () {
            setLoading(true)
            axios({
                axiosInstance: axios,
                method: "PUT",
                url:"s/recipes/form/update",
                headers: {
                    "authorization": authHeader(),
                },
                data : {
                    "productID": productID,
                    "formweight": editForm.formweight.replace(",", "."),
                    "worktime": editForm.worktime.replace(",", "."),
                    "workamount": editForm.workamount.replace(",", "."),
                    "vkp_netto": editForm.vkp_netto.replace(",", "."),
                    "tax": editForm.tax.replace(",", "."),
                    "product_name": editForm.product_name,
                    "price_list": temp_priceList
                }
            }).then((response)=>{
                setRes(response.data)
                setFormsUpdate(formsUpdate+1)
                //console.log(res);
            }).catch((err) => {
                errorHandling(err)
                setError(err)
                //console.log(err);
            })

            handleFormValueReset();
            setLoading(false)
            
        }
           handleRequest();
    

        return [res, error, loading];
    }    

    function handleFormDelete(productID){
        //api delete Form
            setLoading(true)
            axios({
                axiosInstance: axios,
                method: "DELETE",
                url:"s/recipes/form/delete",
                headers: {
                    "authorization": authHeader()
                },
                data : {
                    "ID": productID,
                }
            }).then((response)=>{
                setRes(response.data)
                handleFormValueReset();
                setLoading(false)
                setFormsUpdate(formsUpdate+1)
                //console.log(res);
            }).catch((err) => {
                errorHandling(err)
                setError(err)
                //console.log(err);
            })

           

        return [res, error, loading];
    }    
    

    const formCards = forms.map((form, key)=>{
        let price_titles
        let price_values
        let editPriceListInputs = []
        if(priceList.length > 0){
            price_titles = priceList.map((obj, key) =>
               {return(
                   <p key={"title_price" + key}>{obj.name}</p>
               )
            })
               
            price_values = priceList.map((obj, key) =>
               {return(
                   <p key={"price" + key}>{(obj.price.replace(".", ",") || "0,00") + "€" }</p>
               )
            })
            editPriceListInputs = priceList.map((marge, key)=>{
                return(
                    <input key={"price_edit_"+key} className='r-form-input' onChange={(e)=>handlePriceValueChange( marge.margeID, e.target.value)} defaultValue={marge.price.replace(".", ",") || "0,00"}></input>
                )
            })
        }
        
        
        let image 
        if (!form.img || (form.img == "NULL")){
        image = `../imgs/default_product_img.jpg`
        }else{
        image = `${BASE_URL_IMG_API}public/product_imgs/prev_${form.img}`
        }return(
            <>
            <div className='r-form-card' key={key+"main_div"} style={{backgroundImage: `url(${image})` }} >
                
                    <div className='r-form-card-title' key={key + "title_div"}>
                        {edit == form.ID ?
                        <SVGIcon class="button r-form-btn" src={x_circle} onClick={()=>[setEdit(false), handleFormValueReset(), setEditPriceList([])]}/>
                        :
                        <SVGIcon class="button r-form-btn" src={pencil_square} onClick={()=>{setEditForm(form); if(edit==form.ID){setEdit(false)}else{handlePriceRequest(form.ID),setEdit(form.ID)}}}/>}
                        {(edit == form.ID) ?
                        
                        [
                        <input key={key+ "product_name_edit"} className='r-form-input r-form-title-input' onChange={(e)=>handleFormValueChange( "product_name", e.target.value)} defaultValue={form.product_name || "-"}></input>,
                        <SVGIcon key={key+"check"} class="button r-form-btn" src={check} onClick={()=>[setEdit(false), handleFormEditSubmit(form.ID)]}/>,
                        <SVGIcon key={key+"camera"} class="button r-form-btn" src={camera} onClick={()=>[setToggleUploadPrompt(true), editImg = form.img]}/>,
                        <SVGIcon key={key+"trash"} class="button r-form-btn" src={trash} onClick={()=>{handleFormDelete(form.ID); if(edit==form.ID){setEdit(false)}else{setEdit(form.ID)}}}/>] :
                        <h4 key={key+"productname"}>{form.product_name + " (" + form.name + ")"}</h4>}
                    </div>
                <div className='r-form-table' key={key + "table_div"}>
                    <div className='r-form-title' key={key + "title_div"}>
                        <p key={key + "title_1"}>Einwaage (kg)</p>
                        <p key={key + "title_2"}>Arbeitszeit(h)</p>
                        <p key={key + "title_3"}>Stück / Arbeitszeit </p>
                        <p key={key + "title_4"}>VKP-Netto</p>
                        <p key={key + "title_5"}>MwSt</p>
                        <SVGIcon key={key+"plus_btn"} class="button r-form-btn" src={plus} onClick={()=>{if(togglePrices==form.ID){setTogglePrices(-1)}else{handlePriceRequest(form.ID),setTogglePrices(form.ID)}}}/> 
                    </div>
                    {edit == form.ID ? 
                    <div className='r-form-amount-input' key={key + "amount_edit_div"}> 
                        <input key={key+ "amount_edit_1"} className='r-form-input' onChange={(e)=>handleFormValueChange( "formweight", e.target.value)} defaultValue={form.formweight || "0,000"}></input>
                        <input key={key+ "amount_edit_2"} className='r-form-input' onChange={(e)=>handleFormValueChange( "worktime", e.target.value)} defaultValue={form.worktime || "0"}></input>
                        <input key={key+ "amount_edit_3"} className='r-form-input' onChange={(e)=>handleFormValueChange( "workamount", e.target.value)} defaultValue={form.workamount || "0"}></input>
                        <input key={key+ "amount_edit_4"} className='r-form-input' onChange={(e)=>handleFormValueChange( "vkp_netto", e.target.value)} defaultValue={form.vkp_netto || "0,00"}></input>
                        <input key={key+ "amount_edit_5"} className='r-form-input' onChange={(e)=>handleFormValueChange( "tax", e.target.value)} defaultValue={form.tax || "0"}></input>

                    </div>
                        :
                    <div className='r-form-amount' key={key + "amount_div"}>
                        <p key={key+"amount_1"}>{form.formweight || "0,000"}kg</p>
                        <p key={key+"amount_2"}>{form.worktime || "0"}h</p>
                        <p key={key+"amount_3"}>{form.workamount || "0"}</p>
                        <p key={key+"amount_4"}>{form.vkp_netto || "0,00"}€</p>
                        <p key={key+"amount_5"}>{form.tax || "0"}%</p>
                    </div>
                    }
                </div>
            </div>
            {((togglePrices == form.ID)&& (priceList.length > 0)) && 
            <div className='r-form-card' key={key+"prices_div"}>
                <h5 className='ta-c'>{form.product_name + " (" + form.name + ")"}</h5>
                <h4 className='ta-c'>Preise</h4>
                <div className='r-form-table' key={key + "table_div"}>
                    <div className='r-form-title' key={key + "title_div"}>
                        {price_titles}
                    </div>
                    {edit == form.ID ? 
                    <div className='r-form-amount-input' key={key + "amount_edit_div"}> 
                        {editPriceListInputs}
                    </div>
                        :
                    <div className='r-form-amount' key={key + "amount_div"}>
                        {price_values}
                    </div>
                    }
                </div>
                
            </div>}
            {((togglePrices == form.ID)&& (priceList.length <= 0)) &&
            <div className='r-form-card' key={key+"prices_div"}>
                <h4 className='ta-c'>Preise</h4>
                    {priceError? 
                    <p>{priceError.message}</p>
                    :<h5>Noch keine Preise eingetragen</h5>
                    }
            </div>}
            
            </>
        )});
  return (
    <div className='r-form-card-wrapper'>
    {formCards}
    {!formCards.length && <h3>Noch keine Formen zugewiesen</h3>}
    <button className='r-ins-add-btn r-ins-card jc-c' key={"add-btn"} onClick={()=>setToggleNewForm(!toggleNewForm)} ><SVGIcon src={plus} class="svg-icon-lg"/></button>
    {toggleNewForm && 
    <RecipeFormPopup defaultRecipeID={ID} defaultRecipeName={recipeName} onClickAbort={()=>setToggleNewForm(false)} onClickOK={(val)=>{setToggleNewForm(val), setFormsUpdate(formsUpdate+1)}} />
    }
    {toggleUploadPrompt && <FileUploadPopUp title={"Neues Produktfoto hochladen"}  onClickOK={()=>{setFormsUpdate(formsUpdate+1),setToggleUploadPrompt(false)}} productID={edit} productImg={editImg}/>}
    </div>
  )
}


export default function RecipeIng({
    ID: recipeID
}) {
    const [edit, setEdit] = useState(false);
    let editRef = useRef("")
    const [open, setOpen] = useState(false);
    const [selectedIngId, setSelectedIngId] = useState("")
    const [amount, setAmount] = useState(0);
    const [title, setTitle] = useState("Teig");
    let amountRef = useRef()

    const [titleRes, setTitleRes] = useState([])
    const [titleError, setTitleError] = useState("");
    const [titleLoading, setTitleLoading] = useState(false);
    const [ingRes, setIngRes] = useState([])
    const [ingError, setIngError] = useState("");
    const [ingLoading, setIngLoading] = useState(false);
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);
    const [amountRes, setAmountRes] = useState([])
    const [amountError, setAmountError] = useState("");
    const [amountLoading, setAmountLoading] = useState(false);

    const [ingsData, ingErr, ingsLoading, requestAllIng] = handleIngAllRequest(recipeID);
    useMemo(()=>requestAllIng(),[])
    const [ingsRes, err, loading] = handleRecipeIngRequest(recipeID, ingRes, delRes, edit);
    //console.log(ingsRes)

    const [ingredients, setIngredients] = useState([])
    useEffect(()=>setIngredients(ingsRes),[ingsRes])

    // {
    //     "ID": 51,
    //     "recipeID": 1,
    //     "ingredientID": 71,
    //     "amount": 0.500,
    //     "amount_pc": "0.331",
    //     "base": 0,
    //     "titleID": 1,
    //     "sortID": null,
    //     "name": "Wasser",
    //     "title": "Vorteig",
    //     "title_sortID": 1
    // }
    function handleTitleChange (title_ID, val,title_sortID ){
        setTitleLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/titles/update",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "ID": title_ID,
                "title": val,
                "title_sortID": title_sortID
            }
        }).then((response)=>{
    
        }).catch((err) => {
            setTitleError(err)
            //console.log(err);
        })
        setTitleLoading(false)
    }
    function handleIngTitleDelete(title_ID){

        // api delete all ing with titleId from recipe
        setDelLoading(true)
        axios({
            axiosInstance: axios,
            method: "DELETE",
            url:"s/recipes/ing/title/delete",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "titleID": title_ID,
                "recipeID": recipeID,
            }
        }).then((response)=>{
            setDelRes(response.data)
            //console.log(res);
        }).catch((err) => {
            setDelError(err)
            //console.log(err);
        })

        setDelLoading(false)
    }
    function handleAmountChange(ID, val){
        setAmountLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/recipes/ing/update",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "ID": ID,
                "recipeID": recipeID,
                "amount": val,
            }
        }).then((response)=>{
    
        }).catch((err) => {
            setAmountError(err)
            //console.log(err);
        })
        setAmountLoading(false)

    }


    function handleIngAdd (titleID, title_sortID){
        console.log(titleID, title_sortID)
        
        let maxID = 0
        if(title_sortID == -1){
            for(var i= 0; i<ingredients.length; i++){
               if(maxID < ingredients[i].title_sortID) 
               {maxID = ingredients[i].title_sortID}
            }
            
        // api add new title
        setTitleLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/titles/new",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "recipeID": recipeID,
                "title_sortID" : maxID +1,
                "title": title
            }
        }).then((response)=>{
            if(!response.data.insertId){
                return(console.log("no ID"))
            }else{
                //setTitleRes(response.data.insertId)
            //console.log(response.data.insertId);
            setIngLoading(true)
            axios({
                axiosInstance: axios,
                method: "PUT",
                url:"s/recipes/ing/new",
                headers: {
                    "authorization": authHeader()
                },
                data : {
                    "recipeID": recipeID,
                    "ingredientID": selectedIngId,
                    "amount": amount,
                    "titleID": response.data.insertId,
                    "sortID": null,
                    "title_sortID": title_sortID
                }
            }).then((response)=>{
                setIngRes(response.data)
                //console.log(ingRes);
            }).catch((err) => {
                setIngError(err)
                //console.log(err);
            })
            setIngLoading(false)

            }
            
    
        }).catch((err) => {
            setTitleError(err)
            //console.log(err);
        })
        setTitleLoading(false)
        }else{
            setIngLoading(true)
            axios({
                axiosInstance: axios,
                method: "PUT",
                url:"s/recipes/ing/new",
                headers: {
                    "authorization": authHeader()
                },
                data : {
                    "recipeID": recipeID,
                    "ingredientID": selectedIngId,
                    "amount": amount,
                    "titleID": titleID,
                    "sortID": null,
                    "title_sortID": title_sortID
                }
            }).then((response)=>{
                setIngRes(response.data)
                //console.log(ingRes);
            }).catch((err) => {
                setIngError(err)
                //console.log(err);
            })
            setIngLoading(false)
        }



        // wait for response
        // change amount_pc for all ing
       // handleAmountPc()
       setTitle("")
       setAmount(0)

            document.getElementById(titleID+"_input").value = 0;
            document.getElementById(titleID+"_sInput").value = "";
            document.getElementById(titleID+"_sReset").click();
        
        
        //console.log(amountRef.current, selectedOption)

    }
    function handleIngSubmit (ingID){


    }
    function handleIngDelete (ingID){
        // api delete Ing from recipe
        setDelLoading(true)
        axios({
            axiosInstance: axios,
            method: "DELETE",
            url:"s/recipes/ing/delete",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "ID": ingID
            }
        }).then((response)=>{
            setDelRes(response.data)
            //console.log(res);
        }).catch((err) => {
            setDelError(err)
            //console.log(err);
        })

        setDelLoading(false)
    

    }

    //console.log(editRef)
    let ingList = []
    let _title_sortID = 0
    if (!edit){
        for(var i=0;i<ingredients.length; i++){
            const title_sortID = ingredients[i].title_sortID
            let ing = ingredients;
                ingList = [...ingList,
                <div key={i+"card"} className=' r-ing-card'>
                {((title_sortID != _title_sortID))&& 
                <div key={i+"title"} className=' r-ing-title'>
                    <h2 key={i+"header"}>{ing[i].title}</h2>
                </div>}
                <div key={i+"content"} className='r-ing-content'>
                    <div key={i+"amount"} className='r-ing-amount'>
                        <p key={i+"pamount"}>{ing[i].amount}</p>
                        <p>kg</p>
                    </div>
                    <div key={i+"name"} className='r-ing-name'>
                        <h3 key={i+"hname"}>{ing[i].name}</h3>
                    </div>
                </div>
                </div>        
              ] 
              _title_sortID = ingredients[i].title_sortID
            }    
    }else{
        
        
        for(var i=0;i<ingredients.length; i++){
            const ID = ingredients[i].ID
            let titleID = ingredients[i].titleID 
            let title_sortID = ingredients[i].title_sortID
                ingList = [...ingList,
                <div key={i+"card"} className=' r-ing-card'>
                
                {(i == 0 || (title_sortID != _title_sortID) )&& 
                <div key={i+"title"} className=' r-ing-title'>
                    <input key={i+"title_input"} className='r-ing-input r-ing-input-title' defaultValue={ingredients[i].title} onChange={(e)=>handleTitleChange(titleID, e.target.value,title_sortID )}></input>
                    <div key={i+"title"} className='r-ing-btns'>
                        <button key={i+"title_btn"} className='r-ins-edit-btn js-f-e' onClick={()=>[handleIngTitleDelete(titleID)]}><SVGIcon src={trash} class="svg-icon-md" /></button>
                    </div>
                </div>}
                { (i == 0 || (title_sortID != _title_sortID) )&& 
                <div key="select-component" className='r-ing-content ' >
                <div key={"amount"} className='r-ing-amount r-ing-amount-input'>
                    <input id={titleID+"_input"} key={"amount-input"} type='number' ref={amountRef} onChange={(e)=>setAmount(e.target.value)} defaultValue='0' className='r-ing-input '/>
                    <p key={"amount-kg"}>kg</p>
                </div>

                <SelectComponent 
                key ="selectComponent"
                id ={titleID}
                onSelect={(val)=>{editRef.current = val}}
                editref={editRef.current}
                options={ingsData}
                onChange={(item) =>{setSelectedIngId(item)}}
                selectedID={selectedIngId}
                placeholder='Zutat wählen'
                open={open}
                setOpen={(val)=>{setOpen(val)}}
                className='i-select' 
                type='text' 
                /> 
                <div key="select-div-submit">
                <button key="select-btn-submit" onClick={()=>handleIngAdd(titleID, title_sortID)}  >
                    <SVGIcon key="select-btn-submit-icon" className="i-icon" src={plus} class="svg-icon-lg"/></button>
                </div>
                </div>}
    
                <div key={i+"content"} className='r-ing-content'>
                    <div key={i+"amount"} className='r-ing-amount r-ing-amount-input'>
                        <input type='number' key={i+"amount_input"} defaultValue={ingredients[i].amount} className='r-ing-input' onChange={(e)=>handleAmountChange(ID, e.target.value)}></input>
                        <p>kg</p>
                    </div>
                    <div key={i+"name"} className='r-ing-name'>
                        <h3 key={i+"name"}>{ingredients[i].name}</h3>
                    </div>
                    <div key={i+"btns"} className='r-ing-btns'>
                        <button key={i+"del"} className='r-ins-edit-btn js-f-e' onClick={()=>[handleIngDelete(ID)]}><SVGIcon src={trash} class="svg-icon-md" /></button>
                    </div>
                </div>

                

                </div>        
              ] 
            _title_sortID = ingredients[i].title_sortID
        } 

    }
        
        //console.log(editRef.current)

  return (
    <div className='r-ing-wrapper'>
    {ingList}
    {edit? <div>

    <div key={"title"} className=' r-ing-title'>
        <input  id='-1_sInput'  key={"title_input"} onChange={(e) =>setTitle(e.target.value)} className='r-ing-input r-ing-input-title' defaultValue="nächster Abschnitt"></input>
      </div>
    <div key="select-component" className='r-ing-content ' >
    <div key={"amount"} className='r-ing-amount r-ing-amount-input'>
        <input key={"amount-input"} type='number' ref={amountRef} id={"-1_input"} onChange={(e)=>setAmount(e.target.value)} defaultValue='0' className='r-ing-input '/>
        <p>kg</p>
    </div>

    <SelectComponent
    id ="-1"
    onSelect={(val)=>{editRef.current=val}}
    editref={editRef.current}
    options={ingsData}
    onChange={(item) =>{setSelectedIngId(item)}}
    selectedID={selectedIngId}
    placeholder='Zutat wählen'
    open={open}
    setOpen={(bol)=>setOpen(bol)}
    className='i-select' 
    type='text' 
    /> 
    <div key="select-btn-submit">
    <button onClick={()=>[handleIngAdd(-1, -1)]}  ><SVGIcon className="i-icon" src={plus} class="svg-icon-lg"/></button>
    </div>
    </div>
    <button className='r-ing-edit-btn r-ins-card jc-c' key={"check-btn"} onClick={()=>[setEdit(false), setOpen(false)]}><SVGIcon src={check} class="svg-icon-md"/></button>
    <button className='r-ing-edit-btn r-ins-card jc-c' key={"cancel-btn"} onClick={()=>[setEdit(false), handleIngSubmit(), setOpen(false)]}><SVGIcon src={x_circle} class="svg-icon-md" /></button>
    </div>:
    <button className='r-ing-edit-btn r-ins-card jc-c' key={"edit-btn"} onClick={()=>setEdit(true)}><SVGIcon src={pencil_square} class="svg-icon-md"/></button>}       
    </div>
  )
}



export function RecipeIns({ID}) {

    const [edit, setEdit] = useState(false);
    const [buttonID, setButtonID] = useState(0);
    const [addRes, setAddRes] = useState([])
    const [addError, setAddError] = useState("");
    const [addLoading, setAddLoading] = useState(false);    
    const [upRes, setUpRes] = useState([])
    const [upError, setUpError] = useState("");
    const [upLoading, setUpLoading] = useState(false);
    const [delRes, setDelRes] = useState([])
    const [delError, setDelError] = useState("");
    const [delLoading, setDelLoading] = useState(false);
    const [instructions, error, loading] = handleInsRequest(ID, edit, addRes, delRes);
    const [inst, setInst] = useState({});

    


    function handleInsAdd(){

        let newInsTitleID = instructions.insTitleID
        for(let i=0; i<instructions.length; i++){
            if (instructions[i].insTitleID > newInsTitleID){
                newInsTitleID = instructions[i].insTitleID + 1
            }

        }
        //API add new Inst
        
            setAddLoading(true)
            axios({
                axiosInstance: axios,
                method: "PUT",
                url:"s/recipes/ins/new",
                headers: {
                    "authorization": authHeader()
                },
                data : {
                    "recipeID" : ID,
                    "insTitleID" : newInsTitleID,
                    "insTitle" : "Neuer Abschnitt",
                    "instruction" : "..."
                }
            }).then((response)=>{
                setAddRes(response.data)
                //console.log(res);
            }).catch((err) => {
                setAddError(err)
                console.log(err);
            })

            setAddLoading(false)
                   


    }
    function handleInsValueChange(obj, val){
        const _inst = {...inst, [obj] : val}

        setInst(_inst)
        //console.log(inst)

    }
    function handleInsSubmit(insID){
        // api
        
        setUpLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/recipes/ins/update",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "ID" : insID,
                "insTitleID" : inst.titleID,
                "insTitle" : inst.insTitle,
                "instruction" : inst.instruction
            }
        }).then((response)=>{
            setUpRes(response.data)
            //console.log(res);
        }).catch((err) => {
            setUpError(err)
            console.log(err);
        })

        setUpLoading(false)
               

    }
    function handleInsDelete(insID){
        // api delete ins

        //api Ins req

            setDelLoading(true)
            axios({
                axiosInstance: axios,
                method: "DELETE",
                url:"s/recipes/ins/delete",
                headers: {
                    "authorization": authHeader()
                },
                data : {
                    "ID": insID,
                }
            }).then((response)=>{
                setDelRes(response.data)
                //console.log(res);
            }).catch((err) => {
                setDelError(err)
                //console.log(err);
            })

            setDelLoading(false)
            
        return [delRes, delError, delLoading]
    }
    const insList = instructions.map((ins)=>{
    

        return(
            <div className='r-ins-card' key={ins.ID} id={ins.ID}>
                {(!edit || buttonID != ins.ID) && [
                <div className="r-ins-header" key={ins.ID+"header"} >
                <button key={ins.ID+"edit"} className='r-ins-edit-btn' onClick={(e)=>[setButtonID(ins.ID), setEdit(!edit),setInst(ins)] }><SVGIcon src={pencil_square} class="svg-icon-md" /></button>
                <h1 key={ins.ID+"title"} >{ins.insTitle}</h1>
                </div>,
                <p key={ins.ID+"ins"} className='r-ins-card-instruction'>{ins.instruction}</p>]}
                {/* input for edit */}
                {(edit && buttonID == ins.ID) && [
                <input key={ins.ID+"inp"} className='r-ins-input input' onChange={(e)=>handleInsValueChange("insTitle",e.target.value)} value={inst.insTitle}></input>,
                <textarea key={ins.ID+"text"} value={inst.instruction} onChange={(e) => [
                    handleInsValueChange("instruction",e.target.value),
                    e.target.style.height = calcHeight(e.target.value) + "rem"]} className='r-ins-text-input input' ></textarea>]}

                <div key={ins.ID+"btns"} className='r-ins-btns'>
                {(edit && buttonID == ins.ID) && [<button key={ins.ID+"cancel"} className='r-ins-edit-btn' onClick={()=>setEdit(!edit)}><SVGIcon src={x_circle} class="svg-icon-md"/></button>,
                <button key={ins.ID+"ok"} className='r-ins-edit-btn' onClick={()=>[setEdit(false), handleInsSubmit(ins.ID)]}><SVGIcon src={check} class="svg-icon-md" /></button>,
                <button key={ins.ID+"del"} className='r-ins-edit-btn js-f-e' onClick={()=>[setEdit(false), handleInsDelete(ins.ID)]}><SVGIcon src={trash} class="svg-icon-md" /></button>]}
                </div>
            </div>
        )
    })


    return (
        <div className='r-ins-wrapper'>
                  {insList}
                  <button className='r-ins-add-btn r-ins-card jc-c' key={"add-btn"} onClick={()=>handleInsAdd()} ><SVGIcon src={plus} class="svg-icon-lg"/></button>
        </div>

    )
  }
