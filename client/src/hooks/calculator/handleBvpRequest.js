import axios from '../../apis/backWare';
import authHeader from '../../services/auth-header';
import { useState } from 'react';

export default function handleBvpRequest(){
    const [res, setRes] = useState([])
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    function handleRequest(productID){
      if((productID == -1)){
        return 
      }
    
    
    setLoading(true);
    axios({
      axiosInstance: axios,
      method: "post",
      url:"s/calc/bvp",
      headers: {
        "authorization": authHeader()
      },
      data:{
          "productID": productID,
      },
    }).then(function (response){
      //console.log(response.data);
      setRes(response.data)
      setLoading(false);
  
  
    }).catch(function (error) {
      console.log(error.message);
      setError(error.message)
      setLoading(false);
    })
  }
  
  return [res, error, loading, handleRequest]
  
  }