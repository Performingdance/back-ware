import axios from '../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../services/auth-header';

export default function handleOpenOrderRequest(clientID) {
   // console.log(clientID)

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


        useEffect(()=>handleRequest(),[clientID])
        
    
        function handleRequest () {
            
                    //console.log(clientID)
            setLoading(true)
            axios({
                axiosInstance: axios,
                method: "POST",
                url:"s/orders/all/client/noInvoice",
                headers: {
                    "authorization": authHeader()
                },
                data: {
                    "clientID": clientID
                }
            }).then((response)=>{
                if(!response.data.length){
                    const newRes = [{
                        ID: -1, 
                        name: "Neue Bestellung" 
                   }]
                   setRes(newRes)
    
                }else{
                    const addRes = 
                        [...response.data, {ID: -1, 
                            name: "Neue Bestellung"}]
                
                    setRes(addRes)
                }
                //console.log(res);
            }).catch((err) => {
                setError(err)
                //console.log(err);
            })
    
            setLoading(false)
        }
            
        return [res, error, loading];


   
  }