import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleRecipeFormRequest(recipeID, editForm, newForm) {
    //console.log(recipeID)

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(()=>handleRequest(),[recipeID, editForm, newForm])
    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/recipes/form/id",
            headers: {
                "authorization": authHeader()
            },
            data:{
                "recipeID": recipeID
            }
        }).then((response)=>{
            if(response.data.length > 0){
            response.data.forEach((obj) => {
                obj.formweight = obj.formweight.replace(".", ","),
                obj.worktime = obj.worktime.replace(".", ","),
                obj.workamount = obj.workamount.replace(".", ","),
                obj.vkp_netto = obj.vkp_netto.replace(".", ",")
                return obj
            })
        }
            setRes(response.data)
        }).catch((err) => {
            setError(err)
            //console.log(err);
        })

        setLoading(false)
        
    }
    return [res, error, loading];
    
  }