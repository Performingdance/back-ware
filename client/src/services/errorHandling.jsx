
export default function errorHandling(error){
    if(error.response?.status == 401){
        localStorage.removeItem("token")
        window.location.reload()

    }
}
