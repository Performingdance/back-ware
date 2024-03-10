import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleInvoiceProdRequest(invoiceID, update) {
   // console.log(clientID)

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    
        useEffect(()=>handleRequest(),[invoiceID, update])
    
        
    
    function handleRequest() {
        if(invoiceID != -1){

            
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/invoice/ID/prod",
            headers: {
                "authorization": authHeader()
            },
            data: {
                "invoiceID": invoiceID
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
        
    }
    return [res, error, loading];


   
  }