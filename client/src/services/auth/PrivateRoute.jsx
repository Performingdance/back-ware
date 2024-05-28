import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { LoginPopup } from "../../components/Popup";

const PrivateRoute = () => {
  const [toggleLoginPrompt, setToggleLoginPrompt] = useState(false)

  const user = useAuth();
      if (!user.token) return <LoginPopup onClickAbort={()=>{setToggleLoginPrompt(false), document.location.href = "/home"}} onClickOK={()=>{setToggleLoginPrompt(false)}}/> ;
  return <Outlet />;
};

export default PrivateRoute;
