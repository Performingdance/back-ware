import axios from '../../apis/backWare';
import { useEffect, useState } from 'react';
import authHeader from '../../services/auth-header';
import errorHandling from '../../services/errorHandling';

export default function handleClientOrderRequest() {
   // console.log(clientID)

    // handle api request 
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


        
        
    
        function handleRequest (clientID) {
            
                    //console.log(clientID)
            setLoading(true)
            axios({
                axiosInstance: axios,
                method: "POST",
                url:"s/orders/all/client",
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
                        name: "Neue Bestellung" ,
                        billed_items: 0,
                        total_items: 0
                   }]
                   setRes(newRes)
    
                }else{
                    const addRes = 
                        [{ID: -1, 
                        name: "Neue Bestellung", 
                        billed_items: 0,
                        total_items: 0}, 
                        ...response.data]
                
                    setRes(addRes)
                }
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