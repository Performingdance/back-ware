import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleOrderIDRequest(orderID, update) {
   // console.log(clientID)

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(()=>handleRequest(),[orderID, update])
        
    
    function handleRequest() {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/orders/ID",
            headers: {
                "authorization": authHeader()
            },
            data: {
                "orderID" : orderID
            }
        }).then((response)=>{
            setRes(response.data[0])
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