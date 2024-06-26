import axios from '../../apis/backWare';
import authHeader from '../../services/auth-header';
import { useState } from 'react';
import errorHandling from '../../services/errorHandling';


export default function handleServingRequest(){
  const [res, setRes] = useState([])
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleRequest(recipeID,productID){
  if((productID == -1)||(recipeID == -1)){
    return 
  }
  setLoading(true);
  axios({
    axiosInstance: axios,
    method: "post",
    url:"s/calc/nutri/product",
    headers: {
      "authorization": authHeader()
    },
    data:{
        "recipeID": recipeID,
        "productID": productID
    },
  }).then(function (response){
    //console.log(response.data);
    setRes(response.data)
    setLoading(false);


  }).catch(function (error) {
    errorHandling(error)
    console.log(error.message);
    setError(error.message)
    setLoading(false);
  })
}

  return [res, error, loading, handleRequest]
}