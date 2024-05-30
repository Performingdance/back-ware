import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleInvoiceTaxRequest() {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleRequest (invoiceID) {
        // console.log(res)
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "GET",
            url:"s/invoices/ID/tax",
            headers: {
                "authorization": authHeader()
            },
            data:{
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
    return [res, error, loading, handleRequest];
    
  }