import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleSettingsRequest(update) {

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "GET",
            url:"s/settings/all",
            headers: {
                "authorization": authHeader()
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
    useEffect(()=>handleRequest(),[update])

    return [res, error, loading];
    
  }