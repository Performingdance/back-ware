import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';

export default function handlePriceListSugRequest() {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleRequest (productID) {
        // console.log(res)
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/calc/prod/prices",
            headers: {
                "authorization": authHeader()
            }, 
            data:{
                "productID": productID,
            }
        }).then((response)=>{
            setRes(response.data)
            //console.log(res);
        }).catch((err) => {
            setError(err)
            //console.log(err);
        })

        setLoading(false)
        
    }
    return [res, error, loading, handleRequest];
    
  }