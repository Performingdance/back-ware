export default function logoutToken (){
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", false)
    return true
}