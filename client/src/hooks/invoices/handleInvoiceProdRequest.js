import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleInvoiceProdRequest() {
   // console.log(clientID)

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
   
        
    
    function handleRequest(invoiceID) {
        if(invoiceID != -1){

            
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/invoices/ID/prod",
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
            errorHandling(err)
            setError(err)
            //console.log(err);
        })

        setLoading(false)
    }
        
    }
    return [res, error, loading, handleRequest];


   
  }