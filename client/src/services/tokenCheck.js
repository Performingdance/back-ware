export default function tokenCheck(){
    const token = localStorage.getItem("token");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if(token && (isLoggedIn == true)){
        return true
    }else{
        return false
    }
}