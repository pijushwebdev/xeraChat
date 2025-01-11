/* eslint-disable react/prop-types */
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth"


export default function PrivateRoute({children}) {

    const user = useAuth();


 return  user ? children : <Navigate to={'/'}/>
}
