import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleRecipeIngRequest(recipeID, ingRes, delRes, edit) {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(()=>handleRequest(),[recipeID, ingRes, delRes,edit])
    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/recipes/ing/id",
            headers: {
                "authorization": authHeader()
            },
            data:{
                "recipeID": recipeID
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
    return [res, error, loading];
    
  }