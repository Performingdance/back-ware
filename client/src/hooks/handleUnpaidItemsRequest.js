import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleUnpaidItemsRequest() {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleRequest (clientID) {
        // console.log(res)
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "GET",
            url:"s/orders/client/items/noInvoice",
            headers: {
                "authorization": authHeader()
            },
            data: {
                "clientID" : clientID
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