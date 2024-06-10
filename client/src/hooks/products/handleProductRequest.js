import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';

export default function handleProductRequest() {
   // console.log(clientID)

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(()=>handleRequest(),[])
        
    
    function handleRequest() {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "GET",
            url:"s/products/all",
            headers: {
                "authorization": authHeader()
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
        
    return [res, error, loading];


   
  }