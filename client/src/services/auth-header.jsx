
export default function authHeader(){
    //console.log(localStorage.getItem("token"))
    const token = localStorage.getItem("token");

    if (token) {
        const auth = 'Bearer ' + token
         return auth 
        // return {"x-auth-token": user.accessToken}
    } else{
        return {} ;
    }


}
