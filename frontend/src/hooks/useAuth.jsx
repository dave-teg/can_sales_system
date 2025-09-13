import React from "react";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";

const useAuth = () => {
  const token = useSelector(selectCurrentToken);
  let isAdmin = false;

  if (token) {
    const decoded = jwtDecode(token);
    const { username, role, fullname } = decoded.UserInfo;

    if(role == 'admin') isAdmin = true

    return { username, fullname, role, isAdmin };
  } else {
    return { username: "", fullname: "", role: "", isAdmin };
  } 
};

export default useAuth;
