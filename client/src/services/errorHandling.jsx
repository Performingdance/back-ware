export default function errorHandling(error){
    //console.log(localStorage.getItem("token"))
   
    if(error.status == 401){
        localStorage.removeItem("token")
    }

}
