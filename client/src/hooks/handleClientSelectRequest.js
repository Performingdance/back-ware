import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleClientSelectRequest(update){

    const [res, setRes] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

useEffect(()=> handleRequest,[update])
    
    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "GET",
            url:"s/clients/select",
            headers: {
                "authorization": authHeader()
            }
        }).then((response)=>{
            setRes(response.data)
            //console.log(response.data);
        }).catch((err) => {
            setError(err)
            //console.log(err);
        })

        setLoading(false)
        
    }

   

    return [res, error, loading,handleRequest];
    
}