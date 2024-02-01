import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleDaylistFormRequest(date) {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(()=>handleRequest(),[])
    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/daylist/all/form",
            headers: {
                "authorization": authHeader()
            },
            data : {
                "date" : date
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