import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import logoutToken from '../../services/logout';

export default function handleClientExtRequest(){


        const [res, setRes] = useState([]);
        const [error, setError] = useState("");
        const [loading, setLoading] = useState(false);
    
    
        
        function handleRequest (clientID) {
            setLoading(true)
            axios({
                axiosInstance: axios,
                method: "POST",
                url:"s/clients/byID",
                headers: {
                    "authorization": authHeader()
                },
                data: {
                    "clientID": clientID
                }
            }).then((response)=>{
                setRes(response.data)
                //console.log(res);
            }).catch((err) => {
                if(err.status == 401){
                    logoutToken();
                    window.location.href = "/home"
                }else{
                    setError(err)
                }
                
                //console.log(err);
            })
    
            setLoading(false)
            
        }
    
        
    
        
    
        return [res, error, loading, handleRequest];
        
    }
