import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleRecipeFormRequest(recipeID) {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);




    useEffect(()=>handleRequest(),[recipeID])
    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/recipes/forms",
            headers: {
                "authorization": authHeader()
            },
            data: {
                "recipeID": recipeID
            }
        }).then((response)=>{
            if(response.data.length > 0){
                response.data.forEach((obj) => {
                    if(obj.formweight >= 0){
                        obj.formweight = obj.formweight.replace(".", ",")
                    }
                   if(obj.worktime >= 0){
                        obj.worktime = obj.worktime.replace(".", ",")
                   }
                   if(obj.workamount >= 0){
                        obj.workamount = obj.workamount.replace(".", ",")
                   }
                   if(obj.vkp_netto >= 0){
                    obj.vkp_netto = obj.vkp_netto.replace(".", ",")
                   }
                    return obj
                })
                }
                setRes(response.data)
            //console.log(res);
        }).catch((err) => {
            setError(err)
            //console.log(err);
        })

        setLoading(false)
        
    }
    return [res, error, loading];
    
  }