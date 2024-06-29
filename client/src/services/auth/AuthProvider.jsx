import axios from '../../apis/backWare';
import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const navigate = useNavigate();
  const loginAction = async (username, password) => {
    
  axios({
    axiosInstance: axios,
    method: "POST",
    url:"auth/login",
    data:{
        "username": username,
        "password": password
    },
  }).then(function (res){
    //console.log(res.data.user);
    if (res.data) {
      
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      return;
    }
  }).catch(function (error) {
    console.log(error);
  })
};
  const logOut = () => {
    setUser({});
    setToken("");
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
