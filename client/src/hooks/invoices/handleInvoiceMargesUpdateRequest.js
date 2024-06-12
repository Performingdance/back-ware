import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleInvoiceMargeUpdateRequest() {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleRequest (invoiceID, margeID) {
        // console.log(res)
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/invoices/ID/margeChange",
            headers: {
                "authorization": authHeader()
            },
            data:{
                "invoiceID":invoiceID,
                "margeID":margeID
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
    return [res, error, loading, handleRequest];
    
  }