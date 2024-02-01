import React from 'react'
import axios from '../../apis/backWare'
function Login() {
function handleLogin(){

    axios({
        axiosInstance: axios,
        method: "post",
        url:"http://localhost:3000/api/user/login",
        data:{
            "username": "Matt",
            "password": "123456"
        },
    }).then(function (response){
        console.log(response.data);
        localStorage.setItem("token", response.data.token)
    }).catch(function (error) {
        console.log(error);
    })
    
}

  return (
    <div>
    <p></p>
    <button onClick={()=>handleLogin()}>Login</button>
        
    </div>
  )
}

export default Login