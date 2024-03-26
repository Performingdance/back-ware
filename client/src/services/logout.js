export default function logoutToken (){
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", false)
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("userID");
    return true
}