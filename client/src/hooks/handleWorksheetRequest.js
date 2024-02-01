import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';


export default function handleWorksheetRequest (date){
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    useEffect(()=>handleRequest(),[date])
    function handleRequest () {
        setLoading(true)
        axios({
            axiosInstance: axios,
            method: "POST",
            url:"s/worksheet/all/date",
            headers: {
                "authorization": authHeader()
            },
            data:{
                "production_date": date
            },
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