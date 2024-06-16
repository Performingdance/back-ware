import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleInvoiceIsPaid() {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleRequest (invoiceID, is_paid) {
        // console.log(res)
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "PUT",
            url:"s/invoices/update/is_paid",
            headers: {
                "authorization": authHeader()
            },
            data:{
                "invoiceID":invoiceID,
                "is_paid":is_paid
            }
        }).then((response)=>{
            setRes(response.data + is_paid)
            //console.log(res);
        }).catch((err) => {
            errorHandling(err)
            setError(err)
            //console.log(err);
        })

        setLoading(false)
        
    }
    return [res, error, loading, handleRequest];
    
  }