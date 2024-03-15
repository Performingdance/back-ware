import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleInvoicenoRequest() {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleRequest () {
        // console.log(res)
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "GET",
            url:"s/invoices/invoiceno",
            headers: {
                "authorization": authHeader()
            }, 
        }).then((response)=>{
            if(!response.data.length){
                const newRes = [{
                    ID: 0, 
                    name: "Neue Bestellung" 
               }]
               setRes(newRes)

            }else{
                const addRes = 
                    [...response.data, {ID: 0, 
                        name: "Neue Rechnung"}]
            
                setRes(addRes)
            }
            //console.log(res);
        }).catch((err) => {
            setError(err)
            //console.log(err);
        })

        setLoading(false)
        
    }
    return [res, error, loading, handleRequest];
    
  }