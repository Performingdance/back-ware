import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleIngIDRequest(ingID) {

    // handle api request 
    const [res, setRes] = useState([{
        ID:0,
        name:"Fehler",
        allergen:null,
        source:null,
        amount:"1.00",
        price:null,
        priceKG:null,
        date:null,
        kj:null,
        kcal:null,
        protein:null,
        carbs:null,
        sugar:null,
        fat:null,
        sat_fat:null,
        fibres:null,
        salt:null,
        recipeID:0}])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleRequest () {
        //console.log(res)
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/ing/ID",
            headers: {
                "authorization": authHeader()
            }, 
            data:{
                "ingID" : ingID
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
    useEffect(()=>handleRequest(),[ingID]);
    return [res, error, loading, handleRequest];
    
  }